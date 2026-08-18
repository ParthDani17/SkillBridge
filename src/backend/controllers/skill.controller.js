import Skill from "../models/Skill.js";
import Profile from "../models/Profile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addSkill = asyncHandler(async (req, res) => {

    const {
        skillName,
        category,
        proficiencyLevel
    } = req.body;

    if (!skillName || !category || !proficiencyLevel) {
        throw new ApiError(
            400,
            "Skill name, category and proficiency level are required"
        );
    }

    const profile = await Profile.findOne({
        userId: req.user._id
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Profile not found. Please create your profile first"
        );
    }

    const skill = await Skill.create({
        profileId: profile._id,
        skillName,
        category,
        proficiencyLevel
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            skill,
            "Skill added successfully"
        )
    );
});

const updateSkill = asyncHandler(async (req, res) => {

    const { skillName, category, proficiencyLevel } = req.body;

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    const profile = await Profile.findOne({
        userId: req.user._id
    });

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    // Make sure this skill belongs to the logged-in user's profile
    if (skill.profileId.toString() !== profile._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to update this skill"
        );
    }

    skill.skillName = skillName ?? skill.skillName;
    skill.category = category ?? skill.category;
    skill.proficiencyLevel =
        proficiencyLevel ?? skill.proficiencyLevel;

    await skill.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            skill,
            "Skill updated successfully"
        )
    );
});

const deleteSkill = asyncHandler(async (req, res) => {

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    const profile = await Profile.findOne({
        userId: req.user._id
    });

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    // Check ownership
    if (skill.profileId.toString() !== profile._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this skill"
        );
    }

    await Skill.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Skill deleted successfully"
        )
    );
});

export { addSkill, updateSkill, deleteSkill };