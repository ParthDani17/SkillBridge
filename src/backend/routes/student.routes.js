import { Router } from "express";
import { getAllStudents,getStudentById } from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(
    verifyJWT,
    getAllStudents
);

router.route("/:id").get(
    verifyJWT,
    getStudentById
);

export default router;