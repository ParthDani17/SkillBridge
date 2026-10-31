import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true
        },

        skillName: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        proficiencyLevel: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

skillSchema.index({ profileId: 1, skillName: 1 });
skillSchema.index({ category: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;