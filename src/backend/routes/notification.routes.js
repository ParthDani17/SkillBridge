import { Router } from "express";

import {
    getMyNotifications,
    markNotificationAsRead,
    deleteNotification
} from "../controllers/notification.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/my").get(
    verifyJWT,
    getMyNotifications
);

router.route("/:id/read").patch(
    verifyJWT,
    markNotificationAsRead
);

router.route("/:id").delete(
    verifyJWT,
    deleteNotification
);

export default router;