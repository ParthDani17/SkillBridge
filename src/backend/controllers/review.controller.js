import Review from "../models/Review.js";
import Session from "../models/Session.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Profile from "../models/Profile.js";

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

    // Check whether mentor has a profile
    const mentorProfile = await Profile.findOne({
        userId: session.mentorId
    });

    if (!mentorProfile) {
        throw new ApiError(
            404,
            "Mentor profile not found"
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

    // Get all reviews of this mentor
    const mentorReviews = await Review.find({
        mentorId: session.mentorId
    });

    // Calculate total rating
    let totalRating = 0;

    for (const review of mentorReviews) {
        totalRating += review.rating;
    }

    // Calculate average
    const averageRating =
        totalRating / mentorReviews.length;

    // Update mentor's profile
    mentorProfile.averageRating = averageRating;

    await mentorProfile.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review created successfully"
        )
    );
});

const getMentorReviews = asyncHandler(async (req, res) => {

    const { mentorId } = req.params;

    const reviews = await Review.find({
        mentorId
    })
        .populate(
            "studentId",
            "name email profilePicture"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            reviews,
            "Mentor reviews fetched successfully"
        )
    );
});

const getMyReviews = asyncHandler(async (req, res) => {

    const reviews = await Review.find({
        studentId: req.user._id
    })
        .populate(
            "mentorId",
            "name email profilePicture"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            reviews,
            "Your reviews fetched successfully"
        )
    );
});

const deleteReview = asyncHandler(async (req, res) => {

    const review = await Review.findById(req.params.id);

    if (!review) {
        throw new ApiError(
            404,
            "Review not found"
        );
    }

    // Only the student who created the review can delete it
    if (
        review.studentId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to delete this review"
        );
    }

    // Store mentor ID before deleting the review
    const mentorId = review.mentorId;

    // Delete the review
    await Review.findByIdAndDelete(req.params.id);

    // Find all remaining reviews of this mentor
    const mentorReviews = await Review.find({
        mentorId
    });

    let averageRating = 0;

    if (mentorReviews.length > 0) {

        let totalRating = 0;

        for (const review of mentorReviews) {
            totalRating += review.rating;
        }

        averageRating =
            totalRating / mentorReviews.length;
    }

    // Update mentor profile
    const mentorProfile = await Profile.findOne({
        userId: mentorId
    });

    if (mentorProfile) {
        mentorProfile.averageRating = averageRating;
        await mentorProfile.save();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Review deleted successfully"
        )
    );
});
export { createReview, getMentorReviews, getMyReviews, deleteReview };