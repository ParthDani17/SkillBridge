import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        bio: {
            type: String,
            default: ""
        },

        availability: {
            type: String,
            default: ""
        },

        portfolioLink: {
            type: String,
            default: ""
        },

        resume: {
            type: String,
            default: ""
        },

        certificate: {
            type: String,
            default: ""
        },

        averageRating: {
            type: Number,
            default: 0
        },

        totalReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

profileSchema.index({ averageRating: -1, totalReviews: -1 });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;