import { Queue, Worker } from "bullmq";
import redisClient from "../config/redis.js";

/**
 * BullMQ requires a standard Redis connection object.
 * We reuse our existing config but ensure it doesn't use the 'isCacheEnabled' logic
 * since BullMQ handles its own connection state.
 */
const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT) || 6379,
};

/**
 * createNamedQueue: Helper to initialize a queue with standard config.
 */
export const createNamedQueue = (name) => {
    return new Queue(name, { 
        connection,
        defaultJobOptions: {
            attempts: 3, // Retry failed jobs (e.g. if WhatsApp API is down)
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true, // Clean up Redis memory
            removeOnFail: 1000, // Keep failed jobs for debugging
        }
    });
};

export const connectionConfig = connection;
