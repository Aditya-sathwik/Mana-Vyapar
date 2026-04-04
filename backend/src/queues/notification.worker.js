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
        case 'ORDER_CONFIRMATION':
            await sendOrderNotification(payload.order, payload.status);
            break;
        case 'PAYMENT_RECEIVED':
            await sendPaymentNotification(payload.transaction, payload.status);
            break;
        case 'LOW_STOCK':
            await sendLowStockAlert(payload.product);
            break;
        case 'HIGH_VALUE_CUSTOMER':
            await sendHighValueCustomerAlert(payload.customer, payload.merchantId);
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
