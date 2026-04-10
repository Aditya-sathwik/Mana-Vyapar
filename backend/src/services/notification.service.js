import { Notification } from "../models/Notification.models.js";
import { addNotificationJob } from "../queues/index.js";

/**
 * createNotification: Internal helper to save and optionally queue a notification.
 */
const createNotification = async (userId, type, title, message, metadata = {}) => {
    try {
        if (!userId) {
            console.warn("⚠️ Cannot create notification: userId is missing", { type, title });
            return null;
        }

        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            metadata
        });

        // Optionally add to background queue for Push/Email
        addNotificationJob('DISPATCH_PUSH', { notificationId: notification._id });

        return notification;
    } catch (error) {
        console.error("❌ Notification Support Failed:", error);
        return null; // Return null instead of letting it bubble into background processes
    }
};

const sendOrderNotification = async (order, type = "PLACED") => {
    try {
        const title = type === "PLACED" ? "New Order Received" : `Order Status: ${type}`;
        const message = `Order #${order.orderNumber || order.orderId || order._id} has been ${type.toLowerCase()}.`;
        
        // Ensure we pass the ID correctly
        const userId = order.merchantId?._id || order.merchantId;
        
        return await createNotification(userId, "ORDER", title, message, { orderId: order._id });
    } catch (error) {
        console.error("❌ sendOrderNotification failed:", error);
    }
};

const sendPaymentNotification = async (transaction, status = "SUCCESS") => {
    try {
        const title = status === "SUCCESS" ? "Payment Received" : "Payment Failed";
        const message = `Payment of ₹${transaction.amount} for Order #${transaction.orderId} was ${status.toLowerCase()}.`;
        
        const userId = transaction.merchantId?._id || transaction.merchantId;
        
        return await createNotification(userId, "PAYMENT", title, message, { transactionId: transaction._id });
    } catch (error) {
        console.error("❌ sendPaymentNotification failed:", error);
    }
};

const sendLowStockAlert = async (product) => {
    try {
        const title = "Inventory Alert: Low Stock";
        const message = `Product '${product.name}' is running low (${product.stock} left).`;
        
        const userId = product.merchantId?._id || product.merchantId;
        
        return await createNotification(userId, "STOCK", title, message, { productId: product._id });
    } catch (error) {
        console.error("❌ sendLowStockAlert failed:", error);
    }
};

const sendHighValueCustomerAlert = async (customer, merchantId) => {
    const title = "High Value Customer Spotted";
    const message = `${customer.fullname} just spent a significant amount in your store.`;
    
    return await createNotification(merchantId, "CUSTOMER", title, message, { customerId: customer._id });
};

export {
    sendOrderNotification,
    sendPaymentNotification,
    sendLowStockAlert,
    sendHighValueCustomerAlert,
    createNotification
};

