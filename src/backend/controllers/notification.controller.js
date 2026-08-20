import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getMyNotifications = asyncHandler(async (req, res) => {

    const notifications = await Notification.find({
        userId: req.user._id
    }).sort({
        createdAt: -1
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "Notifications fetched successfully"
        )
    );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {

    const notification = await Notification.findById(
        req.params.id
    );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    // Make sure this notification belongs to the logged-in user
    if (
        notification.userId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to update this notification"
        );
    }

    notification.status = "read";

    await notification.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification marked as read"
        )
    );
});

const deleteNotification = asyncHandler(async (req, res) => {

    const notification = await Notification.findById(
        req.params.id
    );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    // Only the owner can delete the notification
    if (
        notification.userId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to delete this notification"
        );
    }

    await Notification.findByIdAndDelete(
        req.params.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Notification deleted successfully"
        )
    );
});

export {
    getMyNotifications,
    markNotificationAsRead,
    deleteNotification
};