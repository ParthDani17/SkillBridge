import { Router } from "express";
import { addSkill,updateSkill,deleteSkill } from "../controllers/skill.controller.js";
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

router.route("/:id").delete(
    verifyJWT,
    deleteSkill
);

export default router;