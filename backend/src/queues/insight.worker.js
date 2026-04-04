import { Worker } from "bullmq";
import { connectionConfig } from "./base.queue.js";
import { refreshMerchantSnapshot } from "../services/insight.service.js";

/**
 * insightWorker: Orchestrates heavy aggregation tasks in the background.
 * This ensures sales aren't blocked by math.
 */
const insightWorker = new Worker('insights', async job => {
    const { merchantId } = job.data;
    
    console.log(`📊 [Worker: Insights]: Refreshing stats for Merchant ${merchantId}`);
    
    try {
        await refreshMerchantSnapshot(merchantId);
        console.log(`✅ [Worker: Insights]: Stats successfully computed for ${merchantId}`);
    } catch (error) {
        console.error(`❌ [Worker: Insights]: Failed for ${merchantId}. Error: ${error.message}`);
        throw error; // Re-throw to trigger BullMQ retry
    }
}, { connection: connectionConfig });

export default insightWorker;
