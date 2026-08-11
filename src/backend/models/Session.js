import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        learningRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LearningRequest",
            required: true
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        mode: {
            type: String,
            enum: ["online", "offline"],
            required: true
        },

        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled"
        }
    },
    {
        timestamps: true
    }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;