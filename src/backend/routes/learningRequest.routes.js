import { Router } from "express";
import { createLearningRequest,getMyLearningRequests,getReceivedLearningRequests,acceptLearningRequest,rejectLearningRequest,cancelLearningRequest } from "../controllers/learningRequest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createLearningRequest
);

router.route("/my").get(
    verifyJWT,
    getMyLearningRequests
);

router.route("/received").get(
    verifyJWT,
    getReceivedLearningRequests
);

router.route("/:id/accept").patch(
    verifyJWT,
    acceptLearningRequest
);

router.route("/:id/reject").patch(
    verifyJWT,
    rejectLearningRequest
);

router.route("/:id/cancel").patch(
    verifyJWT,
    cancelLearningRequest
);

export default router;