import { Router } from "express";

import {
    getUserStatistics,
    getPopularSkills,
    getPlatformActivity
} from "../controllers/analytics.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// User statistics
router.route("/users").get(
    verifyJWT,
    getUserStatistics
);


// Popular skills
router.route("/skills").get(
    verifyJWT,
    getPopularSkills
);


// Platform activity
router.route("/activity").get(
    verifyJWT,
    getPlatformActivity
);


export default router;