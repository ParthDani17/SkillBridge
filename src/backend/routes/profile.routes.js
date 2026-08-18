import { Router } from "express";
import { getProfile,updateProfile, deleteAccount } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(
    verifyJWT,
    getProfile
);

router.route("/").put(
    verifyJWT,
    updateProfile
);

router.route("/").delete(
    verifyJWT,
    deleteAccount
);

export default router;