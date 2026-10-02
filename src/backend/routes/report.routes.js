import { Router } from "express";

import {
    createReport,
    getAllReports,
    getPendingReports,
    handleReport,
    dismissReport
} from "../controllers/report.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createReport
);

router.route("/").get(
    verifyJWT,
    verifyAdmin,
    getAllReports
);

router.route("/pending").get(
    verifyJWT,
    verifyAdmin,
    getPendingReports
);

router.route("/:id").patch(
    verifyJWT,
    verifyAdmin,
    handleReport
);

router.route("/:id/dismiss").patch(
    verifyJWT,
    verifyAdmin,
    dismissReport
);


export default router;