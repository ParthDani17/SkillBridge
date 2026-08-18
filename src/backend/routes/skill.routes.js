import { Router } from "express";
import { addSkill,updateSkill } from "../controllers/skill.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    addSkill
);

router.route("/:id").put(
    verifyJWT,
    updateSkill
);

export default router;