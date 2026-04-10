import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as CartService from "../services/cart.service.js";

/**
 * addToCart: Shopper adds a product to their merchant-scoped cart.
 */
const addItem = asyncHandler(async (req, res) => {
    const shopperId = req.user._id;
    const { merchantId, productId, quantity } = req.body;
    const customerModel = req.user.role === "Customer" ? "User" : "Customer"; 

    if (!merchantId || !productId) {
        throw new Error("merchantId and productId are required to add to a cart");
    }

    const cart = await CartService.addToCart(shopperId, merchantId, customerModel, productId, quantity);

    return res.status(200).json(
        new ApiResponse(200, cart, "Product added to cart successfully")
    );
});

/**
 * updateQuantity: Shopper updates quantity of an item in the cart.
 */
const updateQuantity = asyncHandler(async (req, res) => {
    const shopperId = req.user._id;
    const { merchantId, productId, quantity } = req.body;

    const cart = await CartService.updateCartItem(shopperId, merchantId, productId, quantity);

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart quantity updated")
    );
});

/**
 * checkout: Converts the cart into a formal Order and clears it.
 */
const checkout = asyncHandler(async (req, res) => {
    const shopperId = req.user._id;
    const { merchantId, ...checkoutData } = req.body;

    if (!merchantId) {
        throw new Error("merchantId is required to checkout a cart");
    }

    const order = await CartService.checkoutCart(shopperId, merchantId, checkoutData);

    return res.status(201).json(
        new ApiResponse(201, order, "Checkout successful! Order created.")
    );
});

export {
    addItem,
    updateQuantity,
    checkout
};
