import redisClient from "../config/redis.js";
import { ApiResponse } from "../utlis/apiresponse.js";

/**
 * cacheMiddleware: Intercepts requests and serves from memory if valid.
 */
export const cacheMiddleware = (keyPrefix, ttl = 300) => async (req, res, next) => {
    // 🟠 Key is unique per Merchant
    const cacheKey = `${keyPrefix}:${req.user?._id || "public"}:${req.originalUrl}`;

    if (!redisClient.isCacheEnabled) {
        return next();
    }

    try {
        const cachedData = await redisClient.get(cacheKey);
        
        if (cachedData) {
            console.log(`⚡ [Cache Hit]: ${cacheKey}`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        // 🧠 Monkey-patching res.send to intercept the response before it's sent
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            if (res.statusCode === 200) {
                redisClient.setEx(cacheKey, ttl, JSON.stringify(data));
            }
            return originalJson(data);
        };

        next();
    } catch (error) {
        console.error("❌ Cache Error:", error.message);
        next(); // Fallback to DB if cache fails
    }
};

/**
 * clearCache: Manually wipes cache keys for a merchant when data changes.
 */
export const clearCache = async (keyPrefix, merchantId) => {
    if (!redisClient.isCacheEnabled) return;
    try {
        const keys = await redisClient.keys(`${keyPrefix}:${merchantId}:*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`🧹 [Cache Purged]: ${keyPrefix} for ${merchantId}`);
        }
    } catch (error) {
        console.error("❌ Cache Purge Error:", error.message);
    }
};
