import { Router } from "express";
import { getProfile,updateProfile, deleteAccount } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.route("/").get(
    verifyJWT,
    getProfile
);

router.route("/").put(
    verifyJWT,

    upload.fields([
        {
            name: "resume",
            maxCount: 1
        },
        {
            name: "certificate",
            maxCount: 1
        }
    ]),

    updateProfile
);

router.route("/").delete(
    verifyJWT,
    deleteAccount
);

export default router;