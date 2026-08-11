import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["read", "unread"],
            default: "unread"
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;