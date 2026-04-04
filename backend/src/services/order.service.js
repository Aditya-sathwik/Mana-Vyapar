import { Order } from "../models/Order.models.js";
import { Product } from "../models/Product.models.js";
import { User } from "../models/User.models.js";
import { Customer } from "../models/Customer.models.js";
import { createSale, processRefund } from "./transaction.service.js";
import { ApiError } from "../utlis/apierror.js";
import { sendOrderNotification } from "./notification.service.js";
import { addInsightJob } from "../queues/index.js";
import { createAuditLog } from "./audit.service.js";
import mongoose from "mongoose";

/**
 * createOrder: Orchestrates the business logic for a new order.
 * Links to Transaction engine if payment is already paid/confirmed.
 */
const createOrder = async (orderData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { 
            merchantId, 
            customerId, 
            customerModel, 
            items, 
            paymentMethod, 
            deliveryAddress, 
            customerNotes,
            source 
        } = orderData;

        if (!items || items.length === 0) {
            throw new ApiError(400, "Order must have at least one item");
        }

        // 1. Validate Merchant & Customer
        const merchant = await User.findOne({ _id: merchantId, role: "Merchant" });
        if (!merchant) throw new ApiError(404, "Target merchant not found");

        if (customerId) {
            const customer = customerModel === "User" 
                ? await User.findOne({ _id: customerId, role: "Customer" })
                : await Customer.findById(customerId);
            
            if (!customer) throw new ApiError(404, "Customer profile not found");
        }

        // 2. Fetch and Validate Products
        const productIds = items.map(item => item.productId || item.product);
        const productsFromDb = await Product.find({
            _id: { $in: productIds },
            merchantId
        }).session(session);

        if (productsFromDb.length !== productIds.length) {
            throw new ApiError(400, "Some products are invalid or do not belong to this store");
        }

        let calculatedSubtotal = 0;
        const processedItems = items.map(item => {
            const dbProduct = productsFromDb.find(p => p._id.toString() === (item.productId || item.product).toString());
            
            if (dbProduct.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${dbProduct.name}. Requested: ${item.quantity}, Available: ${dbProduct.stock}`);
            }

            const itemSubtotal = dbProduct.sellingPrice * item.quantity;
            calculatedSubtotal += itemSubtotal;

            return {
                product: dbProduct._id,
                productName: dbProduct.name,
                quantity: item.quantity,
                unit: dbProduct.unit,
                price: dbProduct.sellingPrice,
                subtotal: itemSubtotal
            };
        });

        // 3. Create the Order
        const newOrder = new Order({
            merchantId,
            customerId,
            customerModel: customerModel || "User",
            customerName: orderData.customerName,
            customerPhoneNumber: orderData.customerPhoneNumber,
            customerEmail: orderData.customerEmail,
            items: processedItems,
            subtotal: calculatedSubtotal,
            totalAmount: calculatedSubtotal, // Simplified: Add tax/shipping as needed
            deliveryAddress,
            paymentMethod: paymentMethod || "CASH",
            customerNotes,
            source: source || "Manual",
            status: "PLACED"
        });

        await newOrder.save({ session });

        // 🔔 Send Notification (Non-await)
        sendOrderNotification(newOrder, "PLACED");

        // 📜 Audit Log (Non-await)
        createAuditLog({
            userId: merchantId,
            merchantId,
            action: "ORDER_CREATED",
            resourceId: newOrder._id,
            resourceType: "Order",
            metadata: { total: newOrder.totalAmount, numItems: newOrder.items.length }
        });

        // 🏁 Logic Check: If payment is CASH/UPI we could simulate immediate success 
        // For now, we keep it as PLACED -> MERCHANT CONFIRMS -> TRANSACTION CREATED

        await session.commitTransaction();
        session.endSession();

        return newOrder;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

/**
 * confirmOrder: The bridge between Business Logic and Financial Logic.
 * When an order is confirmed, we record it in the Transaction Engine.
 */
const confirmOrder = async (orderId, merchantId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne({ _id: orderId, merchantId }).session(session);
        if (!order) throw new ApiError(404, "Order not found");

        if (order.status !== "PLACED") {
            throw new ApiError(400, `Cannot confirm order in ${order.status} status`);
        }

        // 🔌 PLUG: Call Transaction Engine
        const transactionData = {
            customerId: order.customerId,
            items: order.items.map(i => ({
                productId: i.product,
                quantity: i.quantity
            })),
            payment: {
                method: order.paymentMethod,
                paidAmount: order.totalAmount, // Assuming full payment on confirmation 
            },
            notes: `Auto-generated from Order: ${order.orderNumber}`,
            source: order.source === "Vision AI Scan" ? "VISION_SCAN" : "POS"
        };

        // Note: transaction.service.js handles its own session, 
        // so we call it and get the record.
        const transaction = await createSale(merchantId, transactionData);

        // Update Order
        order.status = "CONFIRMED";
        order.paymentStatus = "PAID";
        order.transactionId = transaction._id;
        
        await order.save({ session });

        // 🔔 Send Notification (Non-await)
        sendOrderNotification(order, "CONFIRMED");

        // 📜 Audit Log (Non-await)
        createAuditLog({
            userId: merchantId,
            merchantId,
            action: "ORDER_CONFIRMED",
            resourceId: order._id,
            resourceType: "Order",
            metadata: { transactionId: transaction._id }
        });

        await session.commitTransaction();
        session.endSession();

        // 📊 Live Insight Refresh (Non-await)
        addInsightJob(merchantId);

        return { order, transaction };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const getMerchantOrders = async (merchantId, filters = {}) => {
    const { status, page = 1, limit = 20 } = filters;
    const query = { merchantId };
    if (status) query.status = status;

    return await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
};

const getCustomerOrders = async (customerId, filters = {}) => {
    const { status, page = 1, limit = 20 } = filters;
    const query = { customerId };
    if (status) query.status = status;

    return await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
};

const updateOrderStatus = async (orderId, merchantId, status, note) => {
    const order = await Order.findOne({ _id: orderId, merchantId });
    if (!order) throw new ApiError(404, "Order not found");

    return await order.updateStatus(status, note);
};

/**
 * cancelOrder: Cancels the order and reverses any linked transactions if necessary.
 */
const cancelOrder = async (orderId, merchantId, reason) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne({ _id: orderId, merchantId }).session(session);
        if (!order) throw new ApiError(404, "Order not found");

        if (["DELIVERED", "CANCELLED"].includes(order.status)) {
            throw new ApiError(400, `Cannot cancel order in ${order.status} status`);
        }

        // If the order was already confirmed, we need to VOID the transaction 
        // to restore inventory and customer stats.
        if (order.status === "CONFIRMED" && order.transactionId) {
            const { voidTransaction } = await import("./transaction.service.js"); 
            await voidTransaction(merchantId, order.transactionId);
        }

        // Mark as cancelled
        order.status = "CANCELLED";
        order.statusHistory.push({
            status: "CANCELLED",
            timestamp: new Date(),
            note: reason || "Cancelled by user/merchant"
        });

        await order.save({ session });

        // 📜 Audit Log (Non-await)
        createAuditLog({
            userId: merchantId,
            merchantId,
            action: "ORDER_CANCELLED",
            resourceId: order._id,
            resourceType: "Order",
            metadata: { reason }
        });

        await session.commitTransaction();
        session.endSession();

        // 📊 Live Insight Refresh (Non-await)
        addInsightJob(merchantId);

        return order;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};



/** ... other methods ... **/

/**
 * requestReturn: Customer or Merchant flags an order for return.
 */
const requestReturn = async (orderId, customerId, reason) => {
    const order = await Order.findOne({ _id: orderId, customerId });
    if (!order) throw new ApiError(404, "Order not found");

    if (order.status !== "DELIVERED") {
        throw new ApiError(400, "Only delivered items can be returned");
    }

    order.returnReason = reason;
    return await order.updateStatus("RETURN_REQUESTED", `Return requested by customer. Reason: ${reason}`);
};

/**
 * approveReturn: Merchant accepts return and triggers Refund logic.
 */
const approveReturn = async (orderId, merchantId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne({ _id: orderId, merchantId }).session(session);
        if (!order) throw new ApiError(404, "Order not found");

        if (order.status !== "RETURN_REQUESTED") {
            throw new ApiError(400, "Can only approve orders in RETURN_REQUESTED status");
        }

        // 💸 PLUG: Trigger Refund in Transaction Engine
        const refundItems = order.items.map(i => ({
            productId: i.product,
            name: i.productName,
            quantity: i.quantity,
            price: i.price,
            subtotal: i.subtotal
        }));

        await processRefund(merchantId, order._id, refundItems, order.totalAmount);

        // Update Order status
        order.status = "RETURNED";
        order.statusHistory.push({
            status: "RETURNED",
            timestamp: new Date(),
            note: "Return approved and refund processed."
        });

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        // 📊 Live Insight Refresh
        addInsightJob(merchantId);

        return order;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export {
    createOrder,
    confirmOrder,
    getMerchantOrders,
    getCustomerOrders,
    updateOrderStatus,
    cancelOrder,
    requestReturn,
    approveReturn
};
