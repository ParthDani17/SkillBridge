import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import LearningRequest from "../models/LearningRequest.js";
import Session from "../models/Session.js";
import Review from "../models/Review.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const verifyUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.isVerified = true;

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User verification completed successfully"
        )
    );
});


const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find()
        .select("-password -refreshToken")
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    );
});


const suspendUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (user.role === "Administrator") {
        throw new ApiError(
            400,
            "Administrator account cannot be suspended"
        );
    }

    user.accountStatus = "suspended";

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User account suspended successfully"
        )
    );
});


const activateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.accountStatus = "active";

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User account activated successfully"
        )
    );
});


const removeUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role === "Administrator") {
        throw new ApiError(400, "Administrator account cannot be removed");
    }

    const userId = user._id;

    // Find the user's profile
    const profile = await Profile.findOne({ userId });

    // Delete all skills belonging to the user's profile
    if (profile) {
        await Skill.deleteMany({
            profileId: profile._id
        });

        // Delete the profile
        await Profile.findByIdAndDelete(profile._id);
    }

    // Delete learning requests where the user is either student or mentor
    await LearningRequest.deleteMany({
        $or: [
            { studentId: userId },
            { mentorId: userId }
        ]
    });

    // Delete sessions where the user is either student or mentor
    await Session.deleteMany({
        $or: [
            { studentId: userId },
            { mentorId: userId }
        ]
    });

    // Delete reviews where the user is either student or mentor
    await Review.deleteMany({
        $or: [
            { studentId: userId },
            { mentorId: userId }
        ]
    });

    // Delete notifications belonging to the user
    await Notification.deleteMany({
        userId
    });

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User account and related data removed successfully"
        )
    );
});


export {
    verifyUser,
    getAllUsers,
    suspendUser,
    activateUser,
    removeUser
};