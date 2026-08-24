import User from "../models/User.js";

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
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (user.role === "Administrator") {
        throw new ApiError(
            400,
            "Administrator account cannot be removed"
        );
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User account removed successfully"
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