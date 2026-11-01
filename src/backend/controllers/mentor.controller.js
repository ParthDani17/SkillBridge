import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Review from "../models/Review.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCache, setCache } from "../config/redis.js";


const getAllMentors = asyncHandler(async (req, res) => {
    const startTime = Date.now();

    const {
        search,
        skill,
        name,
        department,
        academicYear,
        category,
        proficiencyLevel,
        availability,
        minRating,
        sortBy,
        page = 1,
        limit = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    // Construct deterministic Redis cache key based on query filters & pagination
    const cacheKey = `mentors:${JSON.stringify({
        search: (search || "").trim(),
        skill: (skill || "").trim(),
        name: (name || "").trim(),
        department: (department || "").trim(),
        academicYear: academicYear ? Number(academicYear) : "",
        category: (category || "").trim(),
        proficiencyLevel: (proficiencyLevel || "").trim(),
        availability: (availability || "").trim(),
        minRating: minRating ? Number(minRating) : "",
        sortBy: (sortBy || "").trim(),
        page: pageNum,
        limit: limitNum
    })}`;

    // 1. Try reading from Redis cache first
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
        const response = new ApiResponse(
            200,
            cachedResult,
            "Mentors fetched successfully (from Redis cache)"
        );
        response.cached = true;
        response.executionTimeMs = Date.now() - startTime;
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);
        return res.status(200).json(response);
    }

    const userQuery = {
        role: "Mentor",
        accountStatus: "active"
    };

    if (department) {
        userQuery.department = department;
    }

    if (academicYear) {
        userQuery.academicYear = Number(academicYear);
    }

    if (name) {
        userQuery.name = {
            $regex: name,
            $options: "i"
        };
    }

    const skillFilter = {};
    if (skill) {
        skillFilter.skillName = {
            $regex: skill,
            $options: "i"
        };
    }
    if (category) {
        skillFilter.category = {
            $regex: category,
            $options: "i"
        };
    }
    if (proficiencyLevel) {
        skillFilter.proficiencyLevel = proficiencyLevel;
    }

    if (search && search.trim()) {
        const matchingSkills = await Skill.find({
            skillName: {
                $regex: search.trim(),
                $options: "i"
            }
        });

        const profileIdsFromSkill = matchingSkills.map(
            s => s.profileId
        );

        const profilesFromSkill = await Profile.find({
            _id: { $in: profileIdsFromSkill }
        });

        const userIdsFromSkill = profilesFromSkill.map(
            p => p.userId
        );

        userQuery.$or = [
            {
                name: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                _id: {
                    $in: userIdsFromSkill
                }
            }
        ];
    } else if (Object.keys(skillFilter).length > 0) {
        const matchingSkills = await Skill.find(skillFilter);

        const profileIds = matchingSkills.map(
            s => s.profileId
        );

        const profiles = await Profile.find({
            _id: { $in: profileIds }
        });

        const userIds = profiles.map(
            p => p.userId
        );

        userQuery._id = {
            $in: userIds
        };
    }

    const mentors = await User.find(userQuery)
        .select("-password -refreshToken")
        .lean();

    if (!mentors.length) {
        const payload = {
            mentors: [],
            pagination: {
                totalMentors: 0,
                currentPage: pageNum,
                totalPages: 1,
                limit: limitNum,
                hasNextPage: false,
                hasPrevPage: false
            }
        };

        // Cache empty result briefly (30s) to absorb repeated misses
        await setCache(cacheKey, payload, 30);

        const response = new ApiResponse(
            200,
            payload,
            "Mentors fetched successfully"
        );
        response.cached = false;
        response.executionTimeMs = Date.now() - startTime;
        res.setHeader("X-Cache", "MISS");
        res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);
        return res.status(200).json(response);
    }

    const mentorIds = mentors.map((m) => m._id);

    // 1. Batch fetch all profiles for these mentors in ONE single query
    const profileQuery = { userId: { $in: mentorIds } };
    if (availability) {
        profileQuery.availability = { $regex: availability, $options: "i" };
    }
    if (minRating) {
        profileQuery.averageRating = { $gte: Number(minRating) };
    }

    const profiles = await Profile.find(profileQuery).lean();
    const profileMap = new Map();
    const profileIds = [];

    for (const p of profiles) {
        profileMap.set(p.userId.toString(), p);
        profileIds.push(p._id);
    }

    // 2. Batch fetch all skills for these profiles in ONE single query
    const skills = profileIds.length
        ? await Skill.find({ profileId: { $in: profileIds } }).lean()
        : [];

    const skillsMap = new Map();
    for (const s of skills) {
        const pid = s.profileId.toString();
        if (!skillsMap.has(pid)) skillsMap.set(pid, []);
        skillsMap.get(pid).push(s);
    }

    // 3. Batch count reviews in ONE single aggregation pipeline
    const reviewCounts = await Review.aggregate([
        { $match: { mentorId: { $in: mentorIds } } },
        { $group: { _id: "$mentorId", count: { $sum: 1 } } }
    ]);
    const reviewCountMap = new Map(
        reviewCounts.map((rc) => [rc._id.toString(), rc.count])
    );

    // Assemble final mentor objects in memory with 0 extra queries
    let mentorData = [];
    for (const mentor of mentors) {
        const mentorIdStr = mentor._id.toString();
        const profile = profileMap.get(mentorIdStr);

        // If filtering by availability or rating and profile didn't match, skip
        if ((availability || minRating) && !profile) {
            continue;
        }

        const profileObj = profile ? { ...profile } : {};
        const totalReviews = reviewCountMap.get(mentorIdStr) || 0;
        profileObj.totalReviews = totalReviews;

        const mentorSkills = profile?._id ? (skillsMap.get(profile._id.toString()) || []) : [];

        mentorData.push({
            mentor,
            profile: profileObj,
            skills: mentorSkills,
            totalReviews
        });
    }

    if (sortBy === "rating") {
        mentorData.sort(
            (a, b) => (b.profile?.averageRating || 0) - (a.profile?.averageRating || 0)
        );
    }

    const totalMentors = mentorData.length;
    const totalPages = Math.ceil(totalMentors / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedMentors = mentorData.slice(startIndex, startIndex + limitNum);

    const payload = {
        mentors: paginatedMentors,
        pagination: {
            totalMentors,
            currentPage: pageNum,
            totalPages,
            limit: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    };

    // Store in Redis with 120s TTL
    await setCache(cacheKey, payload, 120);

    const response = new ApiResponse(
        200,
        payload,
        "Mentors fetched successfully"
    );
    response.cached = false;
    response.executionTimeMs = Date.now() - startTime;
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);

    return res.status(200).json(response);
});

const getMentorById = asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const cacheKey = `mentor:${req.params.id}`;

    // 1. Check Redis cache
    const cachedMentor = await getCache(cacheKey);
    if (cachedMentor) {
        const response = new ApiResponse(
            200,
            cachedMentor,
            "Mentor fetched successfully (from Redis cache)"
        );
        response.cached = true;
        response.executionTimeMs = Date.now() - startTime;
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);
        return res.status(200).json(response);
    }

    const mentor = await User.findOne({
        _id: req.params.id,
        role: "Mentor"
    }).select("-password -refreshToken").lean();

    if (!mentor) {
        throw new ApiError(
            404,
            "Mentor not found"
        );
    }

    const profile = await Profile.findOne({
        userId: mentor._id
    }).lean();

    const totalReviews = await Review.countDocuments({
        mentorId: mentor._id
    });

    const profileObj = profile ? { ...profile } : {};
    profileObj.totalReviews = totalReviews;

    const skills = profile
        ? await Skill.find({
            profileId: profile._id
        }).lean()
        : [];

    const payload = {
        mentor,
        profile: profileObj,
        skills,
        totalReviews
    };

    // Cache mentor profile for 300s (5 min)
    await setCache(cacheKey, payload, 300);

    const response = new ApiResponse(
        200,
        payload,
        "Mentor fetched successfully"
    );
    response.cached = false;
    response.executionTimeMs = Date.now() - startTime;
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);

    return res.status(200).json(response);
});


export {
    getAllMentors,
    getMentorById
};