import { Router } from "express";

import {
    verifyUser,
    getAllUsers,
    suspendUser,
    activateUser,
    removeUser
} from "../controllers/admin.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();


router.route("/users").get(
    verifyJWT,
    verifyAdmin,
    getAllUsers
);


router.route("/users/:id/verify").patch(
    verifyJWT,
    verifyAdmin,
    verifyUser
);


router.route("/users/:id/suspend").patch(
    verifyJWT,
    verifyAdmin,
    suspendUser
);


router.route("/users/:id/activate").patch(
    verifyJWT,
    verifyAdmin,
    activateUser
);


router.route("/users/:id").delete(
    verifyJWT,
    verifyAdmin,
    removeUser
);


export default router;