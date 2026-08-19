import Review from "../models/Review.js";
import Session from "../models/Session.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReview = asyncHandler(async (req, res) => {

    const {
        sessionId,
        rating,
        comment
    } = req.body;

    if (!sessionId || rating === undefined) {
        throw new ApiError(
            400,
            "Session ID and rating are required"
        );
    }

    // Rating must be between 1 and 5
    if (rating < 1 || rating > 5) {
            throw new ApiError(
                400,
                "Rating must be between 1 and 5"
            );
    }
    if(rating % (0.5) !== 0){
        throw new ApiError(
            400,
            "Rating must be in increments of 0.5"
        );
    }

    // Only students can create reviews
    if (req.user.role !== "Student") {
        throw new ApiError(
            403,
            "Only students can create reviews"
        );
    }

    // Find the session
    const session = await Session.findById(sessionId);

    if (!session) {
        throw new ApiError(
            404,
            "Session not found"
        );
    }

    // Make sure this session belongs to the logged-in student
    if (
        session.studentId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to review this session"
        );
    }

    // Session must be completed
    if (session.status !== "completed") {
        throw new ApiError(
            400,
            "You can only review a completed session"
        );
    }

    // Check if the student has already reviewed this session
    const existingReview = await Review.findOne({
        sessionId,
        studentId: req.user._id
    });

    if (existingReview) {
        throw new ApiError(
            409,
            "You have already reviewed this session"
        );
    }

    // Create the review
    const review = await Review.create({
        studentId: req.user._id,
        mentorId: session.mentorId,
        sessionId,
        rating,
        comment
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review created successfully"
        )
    );
});

export { createReview };