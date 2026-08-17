import {Router} from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controller.js"; 
import {upload} from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {name: "profilePicture", maxCount: 1}
    ]),
    registerUser);

router.route("/login").post(loginUser);

router.route("/test-auth").get(
    verifyJWT,
    (req, res) => {
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: req.user
                },
                "Authentication successful"
            )
        );
    }
);

router.route("/logout").post(
    verifyJWT,
    logoutUser
);

router.route("/refresh-token").post(refreshAccessToken);

export default router;