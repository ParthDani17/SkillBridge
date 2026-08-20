import LearningRequest from "../models/LearningRequest.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createLearningRequest = asyncHandler(async (req, res) => {

    const {
        mentorId,
        skillId,
        message
    } = req.body;

    // Only students can create learning requests
    if (req.user.role !== "Student") {
        throw new ApiError(
            403,
            "Only students can create learning requests"
        );
    }

    // Check required fields
    if (!mentorId || !skillId) {
        throw new ApiError(
            400,
            "Mentor ID and Skill ID are required"
        );
    }

    // Find mentor
    const mentor = await User.findById(mentorId);

    if (!mentor) {
        throw new ApiError(
            404,
            "Mentor not found"
        );
    }

    // Make sure the selected user is actually a mentor
    if (mentor.role !== "Mentor") {
        throw new ApiError(
            400,
            "Selected user is not a mentor"
        );
    }

    // Find mentor's profile
    const mentorProfile = await Profile.findOne({
        userId: mentorId
    });

    if (!mentorProfile) {
        throw new ApiError(
            404,
            "Mentor profile not found"
        );
    }

    // Find the skill
    const skill = await Skill.findById(skillId);

    if (!skill) {
        throw new ApiError(
            404,
            "Skill not found"
        );
    }

    // Make sure the skill belongs to the selected mentor
    if (
        skill.profileId.toString() !==
        mentorProfile._id.toString()
    ) {
        throw new ApiError(
            400,
            "This skill does not belong to the selected mentor"
        );
    }

    // Create learning request
    const learningRequest = await LearningRequest.create({
        studentId: req.user._id,
        mentorId,
        skillId,
        message
    });

    await Notification.create({
        userId: mentorId,
        message: "You have received a new learning request"
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            learningRequest,
            "Learning request created successfully"
        )
    );
});

const getMyLearningRequests = asyncHandler(async (req, res) => {

    const learningRequests = await LearningRequest.find({
        studentId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            learningRequests,
            "Learning requests fetched successfully"
        )
    );
});

const getReceivedLearningRequests = asyncHandler(async (req, res) => {

    const learningRequests = await LearningRequest.find({
        mentorId: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            learningRequests,
            "Received learning requests fetched successfully"
        )
    );
});

const acceptLearningRequest = asyncHandler(async (req, res) => {

    // Only mentors can accept learning requests
    if (req.user.role !== "Mentor") {
        throw new ApiError(
            403,
            "Only mentors can accept learning requests"
        );
    }

    const learningRequest = await LearningRequest.findById(
        req.params.id
    );

    if (!learningRequest) {
        throw new ApiError(
            404,
            "Learning request not found"
        );
    }

    // Make sure this request was sent to the logged-in mentor
    if (
        learningRequest.mentorId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to accept this learning request"
        );
    }

    // Only pending requests can be accepted
    if (learningRequest.status !== "pending") {
        throw new ApiError(
            400,
            "Only pending learning requests can be accepted"
        );
    }

    learningRequest.status = "accepted";

    await learningRequest.save();

    await Notification.create({
        userId: learningRequest.studentId,
        message: "Your learning request has been accepted"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            learningRequest,
            "Learning request accepted successfully"
        )
    );
});

const rejectLearningRequest = asyncHandler(async (req, res) => {

    // Only mentors can reject learning requests
    if (req.user.role !== "Mentor") {
        throw new ApiError(
            403,
            "Only mentors can reject learning requests"
        );
    }

    const learningRequest = await LearningRequest.findById(
        req.params.id
    );

    if (!learningRequest) {
        throw new ApiError(
            404,
            "Learning request not found"
        );
    }

    // Make sure this request belongs to the logged-in mentor
    if (
        learningRequest.mentorId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to reject this learning request"
        );
    }

    // Only pending requests can be rejected
    if (learningRequest.status !== "pending") {
        throw new ApiError(
            400,
            "Only pending learning requests can be rejected"
        );
    }

    learningRequest.status = "rejected";

    await learningRequest.save();

    await Notification.create({
        userId: learningRequest.studentId,
        message: "Your learning request has been rejected"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            learningRequest,
            "Learning request rejected successfully"
        )
    );
});

const cancelLearningRequest = asyncHandler(async (req, res) => {

    // Only students can cancel learning requests
    if (req.user.role !== "Student") {
        throw new ApiError(
            403,
            "Only students can cancel learning requests"
        );
    }

    const learningRequest = await LearningRequest.findById(
        req.params.id
    );

    if (!learningRequest) {
        throw new ApiError(
            404,
            "Learning request not found"
        );
    }

    // Make sure this request was created by the logged-in student
    if (
        learningRequest.studentId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to cancel this learning request"
        );
    }

    // Only pending requests can be cancelled
    if (learningRequest.status !== "pending") {
        throw new ApiError(
            400,
            "Only pending learning requests can be cancelled"
        );
    }

    learningRequest.status = "cancelled";

    await learningRequest.save();

    await Notification.create({
        userId: learningRequest.mentorId,
        message: "A student has cancelled the learning request"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            learningRequest,
            "Learning request cancelled successfully"
        )
    );
});

export { createLearningRequest, getMyLearningRequests, getReceivedLearningRequests, acceptLearningRequest, rejectLearningRequest ,cancelLearningRequest};