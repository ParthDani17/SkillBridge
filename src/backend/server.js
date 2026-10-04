import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim().replace(/\/$/, ""))
    : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes("*") || allowedOrigins.includes(cleanOrigin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS origin ${origin} not allowed by SkillBridge server`));
    },
    credentials: true
}));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkillBridge API is running and healthy",
        timestamp: new Date().toISOString()
    });
});


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
app.use("/api/v1/learning-requests",learningRequestRoutes);

import sessionRouter from "./routes/session.routes.js";
app.use("/api/v1/sessions", sessionRouter);

import reviewRouter from "./routes/review.routes.js";
app.use("/api/v1/reviews", reviewRouter);

import notificationRouter from "./routes/notification.routes.js";
app.use("/api/v1/notifications",notificationRouter);

import mentorRouter from "./routes/mentor.routes.js";
app.use("/api/v1/mentors", mentorRouter);

import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRouter);

import reportRouter from "./routes/report.routes.js";
app.use("/api/v1/reports",reportRouter);

import analyticsRouter from "./routes/analytics.routes.js";
app.use("/api/v1/analytics",analyticsRouter);

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        statusCode,
        data: null,
        message: err.message || "Internal Server Error",
        success: false
    });
});