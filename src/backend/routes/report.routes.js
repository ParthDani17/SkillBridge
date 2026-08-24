import { Router } from "express";

import {
    createReport,
    getAllReports,
    getPendingReports,
    handleReport,
    dismissReport
} from "../controllers/report.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createReport
);

router.route("/").get(
    verifyJWT,
    getAllReports
);

router.route("/pending").get(
    verifyJWT,
    getPendingReports
);

router.route("/:id").patch(
    verifyJWT,
    handleReport
);

router.route("/:id/dismiss").patch(
    verifyJWT,
    dismissReport
);


export default router;