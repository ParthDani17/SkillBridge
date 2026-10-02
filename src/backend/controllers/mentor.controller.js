import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getAllMentors = asyncHandler(async (req, res) => {

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
        sortBy
    } = req.query;

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
        .select("-password -refreshToken");

    let mentorData = [];

    for (const mentor of mentors) {
        const profileQuery = {
            userId: mentor._id
        };

        if (availability) {
            profileQuery.availability = {
                $regex: availability,
                $options: "i"
            };
        }

        if (minRating) {
            profileQuery.averageRating = {
                $gte: Number(minRating)
            };
        }

        const profile = await Profile.findOne(profileQuery);

        if ((availability || minRating) && !profile) {
            continue;
        }

        const skills = profile
            ? await Skill.find({
                profileId: profile._id
            })
            : [];

        mentorData.push({
            mentor,
            profile,
            skills
        });
    }

    if (sortBy === "rating") {
        mentorData.sort(
            (a, b) => (b.profile?.averageRating || 0) - (a.profile?.averageRating || 0)
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            mentorData,
            "Mentors fetched successfully"
        )
    );
});

const getMentorById = asyncHandler(async (req, res) => {

    const mentor = await User.findOne({
        _id: req.params.id,
        role: "Mentor"
    }).select("-password -refreshToken");

    if (!mentor) {
        throw new ApiError(
            404,
            "Mentor not found"
        );
    }

    const profile = await Profile.findOne({
        userId: mentor._id
    });

    const skills = profile
        ? await Skill.find({
            profileId: profile._id
        })
        : [];

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                mentor,
                profile,
                skills
            },
            "Mentor fetched successfully"
        )
    );
});


export {
    getAllMentors,
    getMentorById
};