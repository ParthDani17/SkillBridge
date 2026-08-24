import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reportedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        reportedContentId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        contentType: {
            type: String,
            enum: ["User", "Skill", "Review"],
            default: null
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
            default: "pending"
        },

        action: {
            type: String,
            enum: [
                "none",
                "warning",
                "suspended",
                "removed"
            ],
            default: "none"
        }
    },
    {
        timestamps: true
    }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;