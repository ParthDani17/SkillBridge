import Profile from "../models/Profile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export { getProfile };