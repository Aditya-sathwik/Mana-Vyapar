import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { getStoreActivityFeed } from "../controllers/audit.controller.js";

const router = Router();

// 🔑 Secured solely for Merchants/Admins
router.use(verifyJWT);

/**
 * @route GET /v1/audit/logs
 * @description Fetch store activity feed (Actions like ORDERS, SALE, PRICE_CHANGE)
 */
router.route("/logs").get(restrictTo("Merchant", "Admin"), getStoreActivityFeed);

export default router;
