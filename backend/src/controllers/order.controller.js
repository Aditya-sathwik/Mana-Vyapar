import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as OrderService from "../services/order.service.js";

/**
 * @controller createOrder
 * @description POST /orders/create - Customer or Merchant can create an order.
 */
const createOrder = asyncHandler(async (req, res) => {
    console.log("📥 Incoming Order Request:", req.body);
    const isCustomer = req.user.role === "Customer";
    const isMerchant = req.user.role === "Merchant";
    
    const orderData = {
        ...req.body,
        customerId: isCustomer ? req.user._id : req.body.customerId,
        customerModel: isCustomer ? "User" : (req.body.customerModel || "Customer"),
        merchantId: isMerchant ? req.user._id : req.body.merchantId,
    };

    if (!orderData.merchantId) {
        throw new ApiError(400, "merchantId is required to place an order");
    }

    const order = await OrderService.createOrder(orderData);

    return res.status(201).json(
        new ApiResponse(201, order, "Order placed successfully")
    );
});

/**
 * @controller confirmOrder
 * @description POST /orders/:id/confirm - Merchant confirms order and triggers Transaction Engine.
 */
const confirmOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const merchantId = req.user._id;

    if (req.user.role !== "Merchant") {
        throw new ApiError(403, "Only merchants can confirm orders");
    }

    const result = await OrderService.confirmOrder(orderId, merchantId);

    return res.status(200).json(
        new ApiResponse(200, result, "Order confirmed and payment recorded in Transaction Engine")
    );
});

/**
 * @controller getMerchantOrders
 * @description GET /orders/merchant - Merchant fetches their order history.
 */
const getMerchantOrders = asyncHandler(async (req, res) => {
    const merchantId = req.user._id;
    if (req.user.role !== "Merchant") {
        throw new ApiError(403, "Access denied: Merchants only");
    }

    const orders = await OrderService.getMerchantOrders(merchantId, req.query);

    return res.status(200).json(
        new ApiResponse(200, orders, "Merchant orders fetched successfully")
    );
});

/**
 * @controller getCustomerOrders
 * @description GET /orders/customer - Customer fetches their own order history.
 */
const getCustomerOrders = asyncHandler(async (req, res) => {
    const customerId = req.user._id;
    const orders = await OrderService.getCustomerOrders(customerId, req.query);

    return res.status(200).json(
        new ApiResponse(200, orders, "Customer orders fetched successfully")
    );
});

/**
 * @controller updateStatus
 * @description PATCH /orders/:id/status - Merchant updates the status (SHIPPED, DELIVERED, etc.).
 */
const updateStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, note } = req.body;
    const merchantId = req.user._id;

    const order = await OrderService.updateOrderStatus(orderId, merchantId, status, note);

    return res.status(200).json(
        new ApiResponse(200, order, `Order status updated to ${status}`)
    );
});

/**
 * @controller cancelOrder
 * @description PATCH /orders/:id/cancel - User or Merchant can cancel the order.
 */
const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const merchantId = req.user._id; // Note: In service, it might be a user too.

    const order = await OrderService.cancelOrder(orderId, merchantId, reason);

    return res.status(200).json(
        new ApiResponse(200, order, "Order cancelled successfully")
    );
});

export {
    createOrder,
    confirmOrder,
    getMerchantOrders,
    getCustomerOrders,
    updateStatus,
    cancelOrder
};
