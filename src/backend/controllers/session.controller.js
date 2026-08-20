import Session from "../models/Session.js";
import LearningRequest from "../models/LearningRequest.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSession = asyncHandler(async (req, res) => {

    const {
        learningRequestId,
        date,
        time,
        mode
    } = req.body;

    // Check required fields
    if (!learningRequestId || !date || !time || !mode) {
        throw new ApiError(
            400,
            "Learning request ID, date, time and mode are required"
        );
    }

    // Only online or offline are allowed
    if (!["online", "offline"].includes(mode)) {
        throw new ApiError(
            400,
            "Mode must be either online or offline"
        );
    }

    // Find the learning request
    const learningRequest = await LearningRequest.findById(
        learningRequestId
    );

    if (!learningRequest) {
        throw new ApiError(
            404,
            "Learning request not found"
        );
    }

    // Session can only be created for an accepted request
    if (learningRequest.status !== "accepted") {
        throw new ApiError(
            400,
            "Session can only be created for an accepted learning request"
        );
    }

    // Only the student who created the request can create the session
    if (
        learningRequest.studentId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to create a session for this learning request"
        );
    }

    // Check whether a session already exists for this request
    const existingSession = await Session.findOne({
        learningRequestId
    });

    if (existingSession) {
        throw new ApiError(
            409,
            "A session already exists for this learning request"
        );
    }

    // Create the session
    const session = await Session.create({
        learningRequestId,
        studentId: learningRequest.studentId,
        mentorId: learningRequest.mentorId,
        date,
        time,
        mode
    });

    await Notification.create({
        userId: learningRequest.mentorId,
        message: "A new learning session has been scheduled"
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            session,
            "Session created successfully"
        )
    );
});

const getMySessions = asyncHandler(async (req, res) => {

    const sessions = await Session.find({
        $or: [
            { studentId: req.user._id },
            { mentorId: req.user._id }
        ]
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            sessions,
            "Sessions fetched successfully"
        )
    );
});

const completeSession = asyncHandler(async (req, res) => {

    const session = await Session.findById(req.params.id);

    if (!session) {
        throw new ApiError(
            404,
            "Session not found"
        );
    }

    // Check whether the logged-in user belongs to this session
    const isStudent =
        session.studentId.toString() === req.user._id.toString();

    const isMentor =
        session.mentorId.toString() === req.user._id.toString();

    if (!isStudent && !isMentor) {
        throw new ApiError(
            403,
            "You are not allowed to complete this session"
        );
    }

    // Only scheduled sessions can be completed
    if (session.status !== "scheduled") {
        throw new ApiError(
            400,
            "Only scheduled sessions can be completed"
        );
    }

    session.status = "completed";

    await session.save();

    if (isStudent) {
    await Notification.create({
        userId: session.mentorId,
        message: "A session has been completed by the student"
    });
    } else {
        await Notification.create({
            userId: session.studentId,
            message: "A session has been completed by the mentor"
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            session,
            "Session completed successfully"
        )
    );
});

const cancelSession = asyncHandler(async (req, res) => {

    const session = await Session.findById(req.params.id);

    if (!session) {
        throw new ApiError(
            404,
            "Session not found"
        );
    }

    // Check whether the logged-in user belongs to this session
    const isStudent =
        session.studentId.toString() === req.user._id.toString();

    const isMentor =
        session.mentorId.toString() === req.user._id.toString();

    if (!isStudent && !isMentor) {
        throw new ApiError(
            403,
            "You are not allowed to cancel this session"
        );
    }

    // Only scheduled sessions can be cancelled
    if (session.status !== "scheduled") {
        throw new ApiError(
            400,
            "Only scheduled sessions can be cancelled"
        );
    }

    session.status = "cancelled";

    await session.save();

    if (isStudent) {
    await Notification.create({
        userId: session.mentorId,
        message: "The student has cancelled the session"
    });
    } else {
        await Notification.create({
            userId: session.studentId,
            message: "The mentor has cancelled the session"
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            session,
            "Session cancelled successfully"
        )
    );
});

export { createSession, getMySessions, completeSession, cancelSession };