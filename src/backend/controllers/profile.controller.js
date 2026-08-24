import Profile from "../models/Profile.js";
import User from "../models/User.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getProfile = asyncHandler(async (req, res) => {

    const profile = await Profile.findOne({
        userId: req.user._id
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Profile not found"
        );
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

    let resumeLocalPath;
    let certificateLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.resume) &&
        req.files.resume.length > 0
    ) {
        resumeLocalPath = req.files.resume[0].path;
    }

    if (
        req.files &&
        Array.isArray(req.files.certificate) &&
        req.files.certificate.length > 0
    ) {
        certificateLocalPath =
            req.files.certificate[0].path;
    }

    let resumeCloudinaryResponse;

    if (resumeLocalPath) {
        resumeCloudinaryResponse =
            await uploadOnCloudinary(
                resumeLocalPath
            );
    }

    let certificateCloudinaryResponse;

    if (certificateLocalPath) {
        certificateCloudinaryResponse =
            await uploadOnCloudinary(
                certificateLocalPath
            );
    }

    if (!profile) {

        profile = await Profile.create({
            userId: req.user._id,

            bio: bio || "",

            availability:
                availability || "",

            portfolioLink:
                portfolioLink || "",

            resume:
                resumeCloudinaryResponse?.secure_url || "",

            certificate:
                certificateCloudinaryResponse?.secure_url || ""
        });

    } else {

        profile.bio =
            bio ?? profile.bio;

        profile.availability =
            availability ?? profile.availability;

        profile.portfolioLink =
            portfolioLink ?? profile.portfolioLink;

        if (
            resumeCloudinaryResponse?.secure_url
        ) {
            profile.resume =
                resumeCloudinaryResponse.secure_url;
        }

        if (
            certificateCloudinaryResponse?.secure_url
        ) {
            profile.certificate =
                certificateCloudinaryResponse.secure_url;
        }

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

    await User.findByIdAndDelete(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Account deleted successfully"
        )
    );
});

export {
    getProfile,
    updateProfile,
    deleteAccount
};