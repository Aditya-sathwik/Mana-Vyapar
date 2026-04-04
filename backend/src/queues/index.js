import { createNamedQueue } from "./base.queue.js";

// Initialize Queues
export const notificationQueue = createNamedQueue('notifications');
export const insightQueue = createNamedQueue('insights');

// Export Workers to ensure they are registered/started when the app boots
import "./notification.worker.js";
import "./insight.worker.js";
import "./cron.worker.js";

export { cronQueue, setupCronJobs } from "./cron.worker.js";

/**
 * addNotificationJob: Clean wrapper to add jobs without exposing 
 * BullMQ specifics to controllers.
 */
export const addNotificationJob = (type, payload) => {
    return notificationQueue.add(type, { type, payload });
};

/**
 * addInsightJob: Clean wrapper for analytics tasks.
 */
export const addInsightJob = (merchantId) => {
    return insightQueue.add(`refresh:${merchantId}`, { merchantId });
};
