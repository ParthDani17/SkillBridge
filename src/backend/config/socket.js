import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";

let io = null;

export const initSocket = (httpServer, allowedOrigins) => {
    io = new Server(httpServer, {
        cors: {
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);
                const cleanOrigin = origin.replace(/\/$/, "");
                if (allowedOrigins.includes("*") || allowedOrigins.includes(cleanOrigin)) {
                    return callback(null, true);
                }
                return callback(new Error(`CORS origin ${origin} not allowed by Socket.io`));
            },
            credentials: true
        }
    });

    // Authenticate socket connections using JWT
    io.use((socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");

            if (!token) {
                return next(new Error("Authentication error: Access token missing"));
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            if (!decoded?._id) {
                return next(new Error("Authentication error: Invalid token payload"));
            }

            socket.userId = decoded._id.toString();
            return next();
        } catch (error) {
            return next(new Error("Authentication error: " + (error?.message || "Invalid token")));
        }
    });

    io.on("connection", (socket) => {
        const room = `user:${socket.userId}`;
        socket.join(room);

        socket.on("disconnect", () => {
            // Socket disconnected
        });
    });

    return io;
};

export const getIO = () => io;

export const emitNotification = (userId, notification) => {
    if (!io || !userId) return;
    io.to(`user:${userId.toString()}`).emit("notification:new", notification);
};

export const sendNotification = async ({ userId, message }) => {
    const notification = await Notification.create({
        userId,
        message
    });
    emitNotification(userId, notification);
    return notification;
};
