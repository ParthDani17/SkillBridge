import {Router} from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser} from "../controllers/user.controller.js"; 
import {upload} from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
const router = Router();

router.route("/register").post(
    authLimiter,
    upload.fields([
        {name: "profilePicture", maxCount: 1}
    ]),
    registerUser
);

router.route("/login").post(authLimiter, loginUser);

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

router.route("/me").get(
    verifyJWT,
    getCurrentUser
);

export default router;