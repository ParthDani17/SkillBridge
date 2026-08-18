import Profile from "../models/Profile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/User.js";

const getProfile = asyncHandler(async (req, res) => {

    const profile = await Profile.findOne({
        userId: req.user._id
    });

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile fetched successfully"
        )
    );
});

const updateProfile = asyncHandler(async (req, res) => {

    const {
        bio,
        availability,
        portfolioLink
    } = req.body;

    let profile = await Profile.findOne({
        userId: req.user._id
    });

    if (!profile) {
        profile = await Profile.create({
            userId: req.user._id,
            bio,
            availability,
            portfolioLink
        });
    } else {
        profile.bio = bio ?? profile.bio;//?? = use the new bio from the request, unless it's null or undefined in that case, keep the existing value
        profile.availability = availability ?? profile.availability;
        profile.portfolioLink = portfolioLink ?? profile.portfolioLink;

        await profile.save();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile updated successfully"
        )
    );
});

const deleteAccount = asyncHandler(async (req, res) => {

    await Profile.findOneAndDelete({
        userId: req.user._id
    });

    await User.findByIdAndDelete(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Account deleted successfully"
        )
    );
});

export { getProfile, updateProfile, deleteAccount };