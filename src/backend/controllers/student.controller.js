import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllStudents = asyncHandler(async (req, res) => {

    const students = await User.find({
        role: "Student"
    }).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            students,
            "Students fetched successfully"
        )
    );
});

const getStudentById = asyncHandler(async (req, res) => {

    const student = await User.findOne({
        _id: req.params.id,
        role: "Student"
    }).select("-password -refreshToken");

    if (!student) {
        throw new ApiError(
            404,
            "Student not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            student,
            "Student fetched successfully"
        )
    );
});

export { getAllStudents, getStudentById };