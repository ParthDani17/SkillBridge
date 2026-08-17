import {Router} from "express";
import {registerUser,loginUser} from "../controllers/user.controller.js"; 
import {upload} from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export default router;