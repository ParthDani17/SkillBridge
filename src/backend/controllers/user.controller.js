import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
        "-password -resfreshToken"
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

export { registerUser };