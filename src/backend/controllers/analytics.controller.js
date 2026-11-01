import User from "../models/User.js";
import Skill from "../models/Skill.js";
import LearningRequest from "../models/LearningRequest.js";
import Session from "../models/Session.js";
import Review from "../models/Review.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCache, setCache } from "../config/redis.js";

const getUserStatistics = asyncHandler(async (req, res) => {
    const startTime = Date.now();

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can view analytics"
        );
    }

    const cacheKey = "analytics:user-statistics";
    const cachedStats = await getCache(cacheKey);
    if (cachedStats) {
        const response = new ApiResponse(
            200,
            cachedStats,
            "User statistics fetched successfully (from Redis cache)"
        );
        response.cached = true;
        response.executionTimeMs = Date.now() - startTime;
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);
        return res.status(200).json(response);
    }

    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
        role: "Student"
    });

    const totalMentors = await User.countDocuments({
        role: "Mentor"
    });

    const totalAdministrators = await User.countDocuments({
        role: "Administrator"
    });

    const verifiedUsers = await User.countDocuments({
        isVerified: true
    });

    const unverifiedUsers = await User.countDocuments({
        isVerified: false
    });

    const activeUsers = await User.countDocuments({
        accountStatus: "active"
    });

    const suspendedUsers = await User.countDocuments({
        accountStatus: "suspended"
    });


    // Users created during last 30 days
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(
        thirtyDaysAgo.getDate() - 30
    );

    const newUsersLast30Days = await User.countDocuments({
        createdAt: {
            $gte: thirtyDaysAgo
        }
    });

    const payload = {
        totalUsers,
        totalStudents,
        totalMentors,
        totalAdministrators,
        verifiedUsers,
        unverifiedUsers,
        activeUsers,
        suspendedUsers,
        newUsersLast30Days
    };

    // Cache analytics for 300s (5 minutes)
    await setCache(cacheKey, payload, 300);

    const response = new ApiResponse(
        200,
        payload,
        "User statistics fetched successfully"
    );
    response.cached = false;
    response.executionTimeMs = Date.now() - startTime;
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);

    return res.status(200).json(response);
});

const getPopularSkills = asyncHandler(async (req, res) => {
    const startTime = Date.now();

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can view analytics"
        );
    }

    const cacheKey = "analytics:popular-skills";
    const cachedSkills = await getCache(cacheKey);
    if (cachedSkills) {
        const response = new ApiResponse(
            200,
            cachedSkills,
            "Popular skills fetched successfully (from Redis cache)"
        );
        response.cached = true;
        response.executionTimeMs = Date.now() - startTime;
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);
        return res.status(200).json(response);
    }

    const popularSkills =
        await LearningRequest.aggregate([

            {
                $group: {
                    _id: "$skillId",
                    requestCount: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    requestCount: -1
                }
            },

            {
                $limit: 10
            },

            {
                $lookup: {
                    from: "skills",
                    localField: "_id",
                    foreignField: "_id",
                    as: "skill"
                }
            },

            {
                $unwind: {
                    path: "$skill",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    _id: 0,
                    skillId: "$_id",
                    skillName: "$skill.skillName",
                    category: "$skill.category",
                    requestCount: 1
                }
            }

        ]);

    // Cache for 300s (5 minutes)
    await setCache(cacheKey, popularSkills, 300);

    const response = new ApiResponse(
        200,
        popularSkills,
        "Popular skills fetched successfully"
    );
    response.cached = false;
    response.executionTimeMs = Date.now() - startTime;
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);

    return res.status(200).json(response);
});

const getPlatformActivity = asyncHandler(async (req, res) => {
    const startTime = Date.now();

    if (req.user.role !== "Administrator") {
        throw new ApiError(
            403,
            "Only administrators can view analytics"
        );
    }

    const cacheKey = "analytics:platform-activity";
    const cachedActivity = await getCache(cacheKey);
    if (cachedActivity) {
        const response = new ApiResponse(
            200,
            cachedActivity,
            "Platform activity fetched successfully (from Redis cache)"
        );
        response.cached = true;
        response.executionTimeMs = Date.now() - startTime;
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);
        return res.status(200).json(response);
    }

    const totalLearningRequests =
        await LearningRequest.countDocuments();

    const pendingRequests =
        await LearningRequest.countDocuments({
            status: "pending"
        });

    const acceptedRequests =
        await LearningRequest.countDocuments({
            status: "accepted"
        });

    const rejectedRequests =
        await LearningRequest.countDocuments({
            status: "rejected"
        });

    const cancelledRequests =
        await LearningRequest.countDocuments({
            status: "cancelled"
        });


    const totalSessions =
        await Session.countDocuments();

    const completedSessions =
        await Session.countDocuments({
            status: "completed"
        });

    const cancelledSessions =
        await Session.countDocuments({
            status: "cancelled"
        });

    const scheduledSessions =
        await Session.countDocuments({
            status: "scheduled"
        });


    const totalReviews =
        await Review.countDocuments();


    const averageRatingResult =
        await Review.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    }
                }
            }
        ]);


    const averageRating =
        averageRatingResult.length > 0
            ? Number(
                averageRatingResult[0]
                    .averageRating
                    .toFixed(2)
            )
            : 0;

    const payload = {
        learningRequests: {
            total: totalLearningRequests,
            pending: pendingRequests,
            accepted: acceptedRequests,
            rejected: rejectedRequests,
            cancelled: cancelledRequests
        },

        sessions: {
            total: totalSessions,
            scheduled: scheduledSessions,
            completed: completedSessions,
            cancelled: cancelledSessions
        },

        reviews: {
            total: totalReviews,
            averageRating
        }
    };

    // Cache for 300s (5 minutes)
    await setCache(cacheKey, payload, 300);

    const response = new ApiResponse(
        200,
        payload,
        "Platform activity fetched successfully"
    );
    response.cached = false;
    response.executionTimeMs = Date.now() - startTime;
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time", `${response.executionTimeMs}ms`);

    return res.status(200).json(response);
});


export {
    getUserStatistics,
    getPopularSkills,
    getPlatformActivity
};