import { Router } from "express";
import * as CouponController from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔑 Restricted to Authenticated Merchants
router.use(verifyJWT);

/**
 * @route POST /v1/coupons
 * @description Creates a new custom coupon for the merchant's store.
 */
router.post("/", CouponController.createCpn);

/**
 * @route GET /v1/coupons
 * @description Lists all coupons created by the merchant.
 */
router.get("/", CouponController.listMerchantCpns);

/**
 * @route PATCH /v1/coupons/:couponId
 * @description Updates an existing coupon's configuration/metadata.
 */
router.patch("/:couponId", CouponController.editCoupon);

/**
 * @route DELETE /v1/coupons/:couponId
 * @description Permanently deletes a coupon.
 */
router.delete("/:couponId", CouponController.removeCpn);

export default router;
