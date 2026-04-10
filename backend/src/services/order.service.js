import { Order } from "../models/Order.models.js";
import { Product } from "../models/Product.models.js";
import { User } from "../models/User.models.js";
import { Customer } from "../models/Customer.models.js";
import { createSale, processRefund, validateCoupon } from "./transaction.service.js";
import { ApiError } from "../utils/ApiError.js";
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
        if (!merchant) throw new ApiError(404, `Target merchant not found for ID: ${merchantId}`);

        let resolvedCustomerId = customerId;
        let resolvedCustomerModel = customerModel || "Customer";

        // Logic Upgrade: If no customerId provided but we have phone/name (Manual Entry via Merchant)
        if (!resolvedCustomerId && orderData.customerPhoneNumber && (source === "Manual" || !source)) {
            // Check if this merchant already has this customer in their ledger
            let customerRecord = await Customer.findOne({ 
                merchantId, 
                phone: orderData.customerPhoneNumber 
            }).session(session);

            if (!customerRecord) {
                // Auto-create a CRM profile for this new customer
                customerRecord = await Customer.create([{
                    merchantId,
                    name: orderData.customerName || "Walk-in Customer",
                    phone: orderData.customerPhoneNumber,
                    email: orderData.customerEmail,
                    stats: { totalOrders: 0, totalSpent: 0 }
                }], { session });
                customerRecord = customerRecord[0];
            }
            
            resolvedCustomerId = customerRecord._id;
            resolvedCustomerModel = "Customer";
        }

        if (resolvedCustomerId) {
            let customer;
            if (resolvedCustomerModel === "User") {
                customer = await User.findOne({ _id: resolvedCustomerId, role: "Customer" });
            } else {
                // Unification: Both 'Khata' and 'Customer' now refer to the Customer collection
                customer = await Customer.findOne({ _id: resolvedCustomerId, merchantId });
            }
            
            if (!customer) throw new ApiError(404, `Customer profile not found [ID: ${resolvedCustomerId}]`);
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

            const unit = item.unit || dbProduct.unit;
            const price = item.price !== undefined ? item.price : dbProduct.sellingPrice;
            const itemSubtotal = price * item.quantity;
            calculatedSubtotal += itemSubtotal;

            return {
                product: dbProduct._id,
                productName: dbProduct.name,
                quantity: item.quantity,
                unit: unit,
                price: price,
                subtotal: itemSubtotal
            };
        });

        // 3. APPLY COUPON IF EXISTS
        let discountAmount = 0;
        if (orderData.couponCode) {
            try {
                const couponResult = await validateCoupon(
                    merchantId, 
                    orderData.couponCode, 
                    calculatedSubtotal, 
                    resolvedCustomerId
                );
                discountAmount = couponResult.discount;
            } catch (err) {
                // If coupon is invalid, we proceed with 0 discount but log it
                console.warn(`Coupon ${orderData.couponCode} validation failed during creation:`, err.message);
            }
        }

        // 4. Create the Order
        const newOrder = new Order({
            merchantId,
            customerId: resolvedCustomerId,
            customerModel: resolvedCustomerModel,
            customerName: orderData.customerName,
            customerPhoneNumber: orderData.customerPhoneNumber,
            customerEmail: orderData.customerEmail,
            items: processedItems,
            subtotal: calculatedSubtotal,
            discountAmount: discountAmount,
            totalAmount: calculatedSubtotal - discountAmount, 
            deliveryAddress,
            paymentMethod: paymentMethod || "CASH",
            customerNotes,
            couponCode: orderData.couponCode,
            source: source || "Manual",
            status: "PLACED"
        });

        await newOrder.save({ session });

        // 🏁 LOGIC UPGRADE: If source is Manual, we auto-confirm because the merchant 
        // is the one creating it (it's effectively a direct POS sale).
        if (source === "Manual") {
            await session.commitTransaction();
            const orderId = newOrder._id;
            session.endSession();
            
            try {
                const confirmedResult = await confirmOrder(orderId, merchantId);
                return confirmedResult.order;
            } catch (confirmError) {
                // If auto-confirm fails, the order is already saved as PLACED.
                // We log the error but return the order so the user doesn't lose data.
                console.error("❌ Auto-confirmation failed for manual order:", confirmError);
                return newOrder;
            }
        }

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

        await session.commitTransaction();
        session.endSession();

        return newOrder;

    } catch (error) {
        // Safe check for transaction state to avoid "Cannot call abortTransaction after calling commitTransaction"
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error("⚠️ Failed to abort transaction cleanly:", abortError.message);
            }
        }
        if (session) session.endSession();
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
            customerModel: order.customerModel,
            items: order.items.map(i => ({
                productId: i.product,
                quantity: i.quantity,
                price: i.price,
                unit: i.unit
            })),
            payment: {
                method: order.paymentMethod,
                // If payment is KHATA, paidAmount is 0 (it's credit)
                // Otherwise assume full payment for manual creations
                paidAmount: order.paymentMethod === "KHATA" ? 0 : order.totalAmount,
                discount: order.discountAmount || 0,
                shipping: order.shipping || 0,
                tax: order.tax || 0
            },
            couponCode: order.couponCode,
            notes: order.notes || `Auto-generated from Order: ${order.orderNumber}`,
            source: order.source === "Vision AI Scan" ? "VISION_SCAN" : "POS"
        };

        console.log("📝 Generating Transaction from Order:", {
            orderNo: order.orderNumber,
            total: order.totalAmount,
            khata: order.paymentMethod === "KHATA",
            items: transactionData.items
        });

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
    const { status, page = 1, limit = 20, search } = filters;
    const query = { merchantId };
    if (status) query.status = status;
    
    if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.$or = [
            { orderNumber: { $regex: escapedSearch, $options: "i" } },
            { customerName: { $regex: escapedSearch, $options: "i" } }
        ];
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    return {
        orders,
        pagination: {
            total: totalOrders,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(totalOrders / limit)
        }
    };
};

const getCustomerOrders = async (customerId, filters = {}) => {
    const { status, page = 1, limit = 20 } = filters;
    const query = { customerId };
    if (status) query.status = status;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    return {
        orders,
        pagination: {
            total: totalOrders,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(totalOrders / limit)
        }
    };
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
