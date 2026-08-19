import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        password,
        department,
        academicYear,
        role
    } = req.body;

    if (
        !name ||
        !email ||
        !password ||
        !department ||
        !academicYear
    ) {
        throw new ApiError(400, "All required fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // const profilePictureLocalPath = req.files?.profilePicture[0]?.path;
    let profilePictureLocalPath;
    if(req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0){
        profilePictureLocalPath = req.files.profilePicture[0].path;
    }

    const profilePictureCloudinaryResponse = await uploadOnCloudinary(profilePictureLocalPath);

    const user = await User.create({
        name,
        email,
        password,
        department,
        academicYear,
        role,
        profilePicture: profilePictureCloudinaryResponse?.secure_url || ""
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { // remove this field from the document
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }

        const newAccessToken = user.generateAccessToken();

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    accessToken: newAccessToken
                },
                "Access token refreshed successfully"
            )
        );

    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid refresh token"
        );
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser };