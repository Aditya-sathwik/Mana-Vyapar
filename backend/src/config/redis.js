import { createClient } from "redis";

/**
 * redisClient: High-performance memory cache for Mana-Vyapar.
 */
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    // Only log once to prevent spamming
    if (redisClient.isCacheEnabled) {
        console.log('⚡ Redis Client Error', err.message);
        redisClient.isCacheEnabled = false;
    }
});

redisClient.isCacheEnabled = false;

// Auto-connect
const connectRedis = async () => {
    try {
        await redisClient.connect();
        redisClient.isCacheEnabled = true;
        console.log("✅ Redis Connected Successfully (Caching Enabled)");
    } catch (error) {
        console.log("⚠️ Redis not found at 127.0.0.1:6379. Running without Cache.");
        redisClient.isCacheEnabled = false;
    }
};

connectRedis();

export default redisClient;
