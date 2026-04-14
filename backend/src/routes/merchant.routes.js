import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import {
    updateStoreBranding,
    updateStoreSettings,
    getStorePublicProfile
} from "../controllers/merchant.controller.js";

const router = Router();

/**
 * @route GET /v1/merchants/profile/:merchantId
 * @description Public profile for shoppers (No Auth required)
 */
router.get("/profile/:merchantId", getStorePublicProfile);

// 🔑 Secured Routes for the Merchant themselves
router.use(verifyJWT);
router.use(restrictTo("Merchant", "Admin"));

/**
 * @route PATCH /v1/merchants/branding
 * @description Update shop colors and logo
 */
router.patch("/branding", updateStoreBranding);

/**
 * @route PATCH /v1/merchants/settings
 * @description Update shop currency and tax settings
 */
router.patch("/settings", updateStoreSettings);

export default router;
