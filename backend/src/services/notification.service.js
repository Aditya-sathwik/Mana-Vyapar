import { Product } from "../models/Product.models.js";
import { User } from "../models/User.models.js";
import { addNotificationJob } from "../queues/index.js";

/**
 * notification.service.js: Pluggable notification dispatcher.
 * Now offloads all heavy tasks to BullMQ workers! 🚀
 */

const sendOrderNotification = async (order, type = "PLACED") => {
    // 💡 Add to background queue
    addNotificationJob('ORDER_CONFIRMATION', { order, status: type });
};

const sendPaymentNotification = async (transaction, status = "SUCCESS") => {
    addNotificationJob('PAYMENT_RECEIVED', { transaction, status });
};

const sendLowStockAlert = async (product) => {
    addNotificationJob('LOW_STOCK', { product });
};

const sendHighValueCustomerAlert = async (customer, merchantId) => {
    addNotificationJob('HIGH_VALUE_CUSTOMER', { customer, merchantId });
};

export {
    sendOrderNotification,
    sendPaymentNotification,
    sendLowStockAlert,
    sendHighValueCustomerAlert
};

