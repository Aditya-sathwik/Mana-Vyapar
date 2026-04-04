import { createNamedQueue } from "./base.queue.js";
import { Coupon } from "../models/Coupon.models.js";
import { Worker } from "bullmq";
import { connectionConfig } from "./base.queue.js";

/**
 * cronQueue: Handles time-based repeatable tasks.
 */
export const cronQueue = createNamedQueue('cron');

const cronWorker = new Worker('cron', async job => {
    const { action } = job.data;
    
    console.log(`⏰ [Worker: Cron]: Running scheduled task: ${action}`);
    
    if (action === 'CLEANUP_EXPIRED_COUPONS') {
        const result = await Coupon.updateMany(
            { expiryDate: { $lt: new Date() }, isActive: true },
            { $set: { isActive: false } }
        );
        console.log(`🧹 [Worker: Cron]: Deactivated ${result.modifiedCount} expired coupons.`);
    }
}, { connection: connectionConfig });

/**
 * setupCronJobs: Initializes repeatable jobs on startup.
 */
export const setupCronJobs = async () => {
    // 💡 Run coupon cleanup every hour
    await cronQueue.add('cleanup-coupons', 
        { action: 'CLEANUP_EXPIRED_COUPONS' }, 
        {
            repeat: {
                pattern: '0 * * * *', // Every hour (Cron syntax)
            },
            jobId: 'coupon-cleanup' // Unique ID prevents duplicates
        }
    );
    console.log("✅ [Cron]: Repeatable jobs scheduled.");
};

export default cronWorker;
