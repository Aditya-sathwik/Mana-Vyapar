import { Worker } from "bullmq";
import { connectionConfig } from "./base.queue.js";
import { 
    sendOrderNotification, 
    sendPaymentNotification, 
    sendLowStockAlert, 
    sendHighValueCustomerAlert 
} from "../services/notification.service.js";

/**
 * notificationWorker: The heavy lifter! 
 * Processes all background notifications one by one.
 */
const notificationWorker = new Worker('notifications', async job => {
    const { type, payload } = job.data;
    
    console.log(`👷 [Worker: Notifications]: Processing "${type}" for job ${job.id}`);
    
    switch (type) {
        case 'DISPATCH_PUSH':
            // Logic to send FCM/WebPush/Email would go here
            console.log(`🚀 [Push Dispatcher]: Sending notification ${payload.notificationId} to device...`);
            break;
        default:
            console.log(`⚠️ Unknown notification type: ${type}`);
    }
}, { connection: connectionConfig });

notificationWorker.on('completed', job => {
    console.log(`✅ [Worker: Notifications]: Job ${job.id} finished successfully.`);
});

notificationWorker.on('failed', (job, err) => {
    console.log(`❌ [Worker: Notifications]: Job ${job.id} failed. Error: ${err.message}`);
});

export default notificationWorker;
