import mongoose from "mongoose";

const learningRequestSchema = new mongoose.Schema(
    {
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

        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },

        message: {
            type: String,
            default: "",
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const LearningRequest = mongoose.model("LearningRequest",learningRequestSchema);

export default LearningRequest;