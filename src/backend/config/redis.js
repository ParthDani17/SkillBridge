import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let redisClient = null;

try {
    redisClient = new Redis(redisUrl, {
        enableOfflineQueue: false, // 1. Don't queue commands if disconnected; fail instantly to DB
        maxRetriesPerRequest: null, // 2. Hand command lifecycle control entirely over to the connection
        connectTimeout: 5000,
        retryStrategy(times) {
            if (times > 5) {
                console.warn("[Redis Notice] Max reconnection attempts reached. Continuing with database queries.");
                return null; // Stop reconnecting after 5 attempts
            }
            return Math.min(times * 200, 2000);
        }
    });

    redisClient.on("connect", () => {
        console.log(`[Redis] Connecting to ${redisUrl}...`);
    });

    redisClient.on("ready", () => {
        console.log("[Redis] Connected and ready.");
    });

    redisClient.on("error", (err) => {
        // Log friendly error without crashing the Node.js process
        console.warn(`[Redis Notice] ${err.message}. Continuing with database queries.`);
    });
} catch (err) {
    console.warn(`[Redis Notice] Failed to initialize Redis (${err.message}). Continuing without cache.`);
}

/**
 * Safely fetch and parse cached JSON from Redis
 * @param {string} key
 * @returns {Promise<any|null>}
 */
export const getCache = async (key) => {
    if (!redisClient || redisClient.status !== "ready") return null;
    try {
        const raw = await redisClient.get(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        console.warn(`[Redis] Read error for key "${key}":`, err.message);
        return null; // Graceful degradation to DB query
    }
};

/**
 * Safely serialize and store data in Redis with a TTL (seconds)
 * @param {string} key
 * @param {any} data
 * @param {number} ttlSeconds Default 120 seconds (2 minutes)
 */
export const setCache = async (key, data, ttlSeconds = 120) => {
    if (!redisClient || redisClient.status !== "ready") return;
    try {
        const serialized = JSON.stringify(data);
        await redisClient.set(key, serialized, "EX", ttlSeconds);
    } catch (err) {
        console.warn(`[Redis] Write error for key "${key}":`, err.message);
    }
};

/**
 * Delete all keys matching a glob pattern (e.g. "mentors:*")
 * @param {string} pattern
 */
export const clearCachePattern = async (pattern) => {
    if (!redisClient || redisClient.status !== "ready") return;
    try {
        const keys = await redisClient.keys(pattern);
        if (keys && keys.length > 0) {
            await redisClient.del(...keys);
            console.log(`[Redis] Invalidated ${keys.length} key(s) matching "${pattern}"`);
        }
    } catch (err) {
        console.warn(`[Redis] Invalidation error for pattern "${pattern}":`, err.message);
    }
};

export default redisClient;
