import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { getMerchantDashboard } from "../controllers/insight.controller.js";

const router = Router();

// Routes protected for Merchants only
router.use(verifyJWT);
router.use(restrictTo("Merchant"));

/**
 * @route GET /v1/insights/merchant
 * @description Detailed business health dashboard for the merchant.
 */
router.get("/merchant", getMerchantDashboard);

export default router;
