import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));


app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));
app.use(cookieParser());

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
});
}).catch((error) => {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
})

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import profileRouter from "./routes/profile.routes.js";
app.use("/api/v1/profile", profileRouter);

import skillRouter from "./routes/skill.routes.js";
app.use("/api/v1/skills", skillRouter);

import studentRouter from "./routes/student.routes.js";
app.use("/api/v1/students", studentRouter);

import learningRequestRoutes from "./routes/learningRequest.routes.js";
app.use(
    "/api/v1/learning-requests",
    learningRequestRoutes
);