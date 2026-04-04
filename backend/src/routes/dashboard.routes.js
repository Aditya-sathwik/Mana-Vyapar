import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";
import {
    getDashboardSummary,
    getSalesValue,
    getOrdersCount,
    getTodaySales,
    getTopProducts,
    getTopCustomers
} from "../controllers/dashboard.controller.js";

const router = Router();

// 🔑 Restricted to Merchants
router.use(verifyJWT);
router.use(restrictTo("Merchant"));

/**
 * @route GET /v1/dashboard/summary
 * @description All-in-one summary of business metrics. Best for the main screen.
 */
router.get("/summary", cacheMiddleware("dashboard"), getDashboardSummary);

/**
 * @route GET /v1/dashboard/sales
 * @description Get total life-time sales value.
 */
router.get("/sales", cacheMiddleware("dashboard"), getSalesValue);

/**
 * @route GET /v1/dashboard/orders
 * @description Get total number of successful orders.
 */
router.get("/orders", cacheMiddleware("dashboard"), getOrdersCount);

/**
 * @route GET /v1/dashboard/today
 * @description Get today's total revenue.
 */
router.get("/today", cacheMiddleware("dashboard"), getTodaySales);

/**
 * @route GET /v1/dashboard/top-products
 * @description Get top 5 items by units sold.
 */
router.get("/top-products", cacheMiddleware("dashboard"), getTopProducts);

/**
 * @route GET /v1/dashboard/top-customers
 * @description Get top 5 customers by spending amount.
 */
router.get("/top-customers", cacheMiddleware("dashboard"), getTopCustomers);

export default router;
