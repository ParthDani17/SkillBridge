import rateLimit from "express-rate-limit";

// 1. Strict Limiter for sensitive Auth operations (Login & Register)
// Protects against brute-force password cracking and credential stuffing.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 10, // Max 10 attempts per IP per 15 minutes
    standardHeaders: true, // Return standard RateLimit headers (RateLimit-Limit, RateLimit-Remaining)
    legacyHeaders: false, // Disable X-RateLimit-* legacy headers
    message: {
        statusCode: 429,
        data: null,
        message: "Too many login/registration attempts from this IP. Please try again after 15 minutes.",
        success: false
    }
});

// 2. General Limiter for standard API endpoints
// Protects against scraping, request flooding, and denial-of-service.
export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 150, // Max 150 requests per IP per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        statusCode: 429,
        data: null,
        message: "Too many requests. Please slow down and try again shortly.",
        success: false
    }
});
