import Report from "../models/Report.js";
import User from "../models/User.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReport = asyncHandler(async (req, res) => {

    const {
        reportedUserId,
        reportedContentId,
        contentType,
        reason
    } = req.body;

    if (!reason) {
        throw new ApiError(
            400,
            "Report reason is required"
        );
    }

    // Either a user or content must be reported
    if (!reportedUserId && !reportedContentId) {
        throw new ApiError(
            400,
            "Reported user or reported content is required"
        );
    }

    // If reporting a user
    if (reportedUserId) {

        const reportedUser = await User.findById(
            reportedUserId
        );

        if (!reportedUser) {
            throw new ApiError(
                404,
                "Reported user not found"
            );
        }
    }

    const report = await Report.create({
        reporterId: req.user._id,
        reportedUserId: reportedUserId || null,
        reportedContentId: reportedContentId || null,
        contentType: contentType || null,
        reason
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            report,
            "Report submitted successfully"
        )
    );
});

const getAllReports = asyncHandler(async (req, res) => {

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can view reports"
        );
    }

    const reports = await Report.find()
        .populate(
            "reporterId",
            "name email role"
        )
        .populate(
            "reportedUserId",
            "name email role accountStatus isVerified"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            reports,
            "Reports fetched successfully"
        )
    );
});

const getPendingReports = asyncHandler(async (req, res) => {

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can view reports"
        );
    }

    const reports = await Report.find({
        status: "pending"
    })
        .populate(
            "reporterId",
            "name email role"
        )
        .populate(
            "reportedUserId",
            "name email role accountStatus isVerified"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            reports,
            "Pending reports fetched successfully"
        )
    );
});

const handleReport = asyncHandler(async (req, res) => {

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can handle reports"
        );
    }

    const {
        status,
        action
    } = req.body;

    const report = await Report.findById(
        req.params.id
    );

    if (!report) {
        throw new ApiError(
            404,
            "Report not found"
        );
    }

    // Validate status
    if (
        status &&
        !["pending", "reviewed", "resolved", "dismissed"]
            .includes(status)
    ) {
        throw new ApiError(
            400,
            "Invalid report status"
        );
    }

    // Validate action
    if (
        action &&
        !["none", "warning", "suspended", "removed"]
            .includes(action)
    ) {
        throw new ApiError(
            400,
            "Invalid moderation action"
        );
    }

    if (action === "suspended") {

        if (!report.reportedUserId) {
            throw new ApiError(
                400,
                "This report does not contain a reported user"
            );
        }

        await User.findByIdAndUpdate(
            report.reportedUserId,
            {
                accountStatus: "suspended"
            }
        );
    }


    if (action === "removed") {

        if (!report.reportedUserId) {
            throw new ApiError(
                400,
                "This report does not contain a reported user"
            );
        }

        await User.findByIdAndDelete(
            report.reportedUserId
        );
    }


    // Update report
    report.status = status || "resolved";
    report.action = action || "none";

    await report.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            report,
            "Report handled successfully"
        )
    );
});

const dismissReport = asyncHandler(async (req, res) => {

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can dismiss reports"
        );
    }

    const report = await Report.findById(
        req.params.id
    );

    if (!report) {
        throw new ApiError(
            404,
            "Report not found"
        );
    }

    report.status = "dismissed";
    report.action = "none";

    await report.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            report,
            "Report dismissed successfully"
        )
    );
});


export {
    createReport,
    getAllReports,
    getPendingReports,
    handleReport,
    dismissReport
};