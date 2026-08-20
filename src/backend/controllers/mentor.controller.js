import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getAllMentors = asyncHandler(async (req, res) => {

    const { skill } = req.query;

    // Find matching skills if skill filter is provided
    let profileIds = [];

    if (skill) {

        const skills = await Skill.find({
            skillName: {
                $regex: skill,
                $options: "i"
            }
        });

        profileIds = skills.map(
            skill => skill.profileId
        );
    }

    // Find mentors
    const userQuery = {
        role: "Mentor"
    };

    if (skill) {

        const profiles = await Profile.find({
            _id: { $in: profileIds }
        });

        const userIds = profiles.map(
            profile => profile.userId
        );

        userQuery._id = {
            $in: userIds
        };
    }

    const mentors = await User.find(userQuery)
        .select("-password -refreshToken");

    const mentorData = [];

    for (const mentor of mentors) {

        const profile = await Profile.findOne({
            userId: mentor._id
        });

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