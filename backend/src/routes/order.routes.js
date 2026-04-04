import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import {
    createOrder,
    confirmOrder,
    getMerchantOrders,
    getCustomerOrders,
    updateStatus,
    cancelOrder
} from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { orderSchema } from "../validators/order.validator.js";

const router = Router();

// 🔑 All Order routes require authentication
router.use(verifyJWT);

/**
 * @route POST /v1/orders/create
 * @description Create a new order (Customer or Merchant can do this)
 */
router.post("/create", validate(orderSchema), createOrder);

/**
 * @route GET /v1/orders/merchant
 * @description List all orders for the logged-in merchant
 */
router.get("/merchant", restrictTo("Merchant"), getMerchantOrders);

/**
 * @route GET /v1/orders/customer
 * @description List all orders for the logged-in customer
 */
router.get("/customer", restrictTo("Customer"), getCustomerOrders);

/**
 * @route POST /v1/orders/:orderId/confirm
 * @description Merchant confirms order and triggers Transaction logic
 */
router.post("/:orderId/confirm", restrictTo("Merchant"), confirmOrder);

/**
 * @route PATCH /v1/orders/:orderId/status
 * @description Update order status (SHIPPED, DELIVERED, etc.)
 */
router.patch("/:orderId/status", restrictTo("Merchant"), updateStatus);

/**
 * @route PATCH /v1/orders/:orderId/cancel
 * @description Cancel an order (Both Customer and Merchant can do this)
 */
router.patch("/:orderId/cancel", cancelOrder);

export default router;
