import { Router } from "express";
import { getProfile } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(
    verifyJWT,
    getProfile
);

export default router;