import { Router } from "express";

import {
    createReview,getMentorReviews, getMyReviews ,deleteReview
} from "../controllers/review.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createReview
);

router.route("/mentor/:mentorId").get(
    verifyJWT,
    getMentorReviews
);

router.route("/my").get(
    verifyJWT,
    getMyReviews
);

router.route("/:id").delete(
    verifyJWT,
    deleteReview
);

export default router;