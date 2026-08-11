import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        academicYear: {
            type: Number,
            required: true
        },

        role: {
            type: String,
            enum: ["Student", "Mentor", "Administrator"],
            default: "Student"
        },

        profilePicture: {
            type: String
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;