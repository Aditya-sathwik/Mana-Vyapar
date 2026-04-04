import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import {
    getSegmentation,
    getChurnRisk,
    getRepeatCustomers,
    getCustomerCLV,
    getPurchasePattern,
    getSmartOffers
} from "../controllers/intelligence.controller.js";

const router = Router();

// 🔑 All CRM Intelligence is Merchant-exclusive
router.use(verifyJWT);
router.use(restrictTo("Merchant"));

/**
 * @route GET /v1/intelligence/segmentation
 * @description RFM-based customer segmentation with CHAMPION/LOYAL/AT_RISK/LOST.
 */
router.get("/segmentation", getSegmentation);

/**
 * @route GET /v1/intelligence/churn-risk?days=30
 * @description List customers at risk of churning. Configurable window.
 */
router.get("/churn-risk", getChurnRisk);

/**
 * @route GET /v1/intelligence/repeat-customers
 * @description Repeat vs one-time customer ratio and top repeaters.
 */
router.get("/repeat-customers", getRepeatCustomers);

/**
 * @route GET /v1/intelligence/clv/:customerId
 * @description Customer Lifetime Value for a single customer.
 */
router.get("/clv/:customerId", getCustomerCLV);

/**
 * @route GET /v1/intelligence/pattern/:customerId
 * @description Purchase pattern: favorite products, preferred days, payment methods.
 */
router.get("/pattern/:customerId", getPurchasePattern);

/**
 * @route GET /v1/intelligence/smart-offers
 * @description AI-driven personalized coupon recommendations based on behavior.
 */
router.get("/smart-offers", getSmartOffers);

export default router;
