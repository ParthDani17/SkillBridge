import { Router } from "express";

import {
    createSession,getMySessions,completeSession,cancelSession,rescheduleSession
} from "../controllers/session.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createSession
);

router.route("/my").get(
    verifyJWT,
    getMySessions
);

router.route("/:id/complete").patch(
    verifyJWT,
    completeSession
);

router.route("/:id/cancel").patch(
    verifyJWT,
    cancelSession
);

router.route("/:id/reschedule").patch(
    verifyJWT,
    rescheduleSession
);

export default router;