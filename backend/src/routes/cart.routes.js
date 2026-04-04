import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addItem, updateQuantity, checkout } from "../controllers/cart.controller.js";

const router = Router();

// 🔑 All Cart routes are shopper-focused
router.use(verifyJWT);

/**
 * @route POST /v1/cart/add
 * @description Shopper adds an item to the merchant-scoped cart.
 */
router.post("/add", addItem);

/**
 * @route PATCH /v1/cart/update
 * @description Shopper updates quantity of an item in the cart.
 */
router.patch("/update", updateQuantity);

/**
 * @route POST /v1/cart/checkout
 * @description Shopper finalizes the order from the cart.
 */
router.post("/checkout", checkout);

export default router;
