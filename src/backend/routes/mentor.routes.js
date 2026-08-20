import { Router } from "express";

import {
    getAllMentors,
    getMentorById
} from "../controllers/mentor.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(
    verifyJWT,
    getAllMentors
);

router.route("/:id").get(
    verifyJWT,
    getMentorById
);

export default router;