import { Cart } from "../models/Cart.models.js";
import { Product } from "../models/Product.models.js";
import { createOrder } from "./order.service.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * addToCart: Adds or updates quantity in the merchant-scoped cart.
 */
const addToCart = async (customerId, merchantId, customerModel, productId, quantity = 1) => {
    // 1. Validate Product
    const product = await Product.findOne({ _id: productId, merchantId });
    if (!product) throw new ApiError(404, "Product not found in this store");
    if (product.stock < quantity) throw new ApiError(400, `Insufficient stock for ${product.name}`);

    // 2. Fetch or Create Cart
    let cart = await Cart.findOne({ customerId, merchantId });
    if (!cart) {
        cart = new Cart({ customerId, merchantId, customerModel, items: [] });
    }

    // 3. Add or Update Item
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

    if (existingItemIndex > -1) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal = cart.items[existingItemIndex].quantity * product.sellingPrice;
    } else {
        // Add new item
        cart.items.push({
            productId: product._id,
            name: product.name,
            quantity,
            price: product.sellingPrice,
            subtotal: quantity * product.sellingPrice
        });
    }

    // 4. Recalculate totals
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.totalItems = cart.items.length;

    return await cart.save();
};

/**
 * updateCartItem: Direct update of item quantity.
 */
const updateCartItem = async (customerId, merchantId, productId, quantity) => {
    const cart = await Cart.findOne({ customerId, merchantId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
    if (itemIndex === -1) throw new ApiError(404, "Item not in cart");

    if (quantity <= 0) {
        // Remove item if quantity is zero or less
        cart.items.splice(itemIndex, 1);
    } else {
        const product = await Product.findById(productId);
        if (product.stock < quantity) throw new ApiError(400, `Insufficient stock for ${product.name}`);
        
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = quantity * cart.items[itemIndex].price;
    }

    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.totalItems = cart.items.length;

    return await cart.save();
};

/**
 * clearCart: Empties the shopper's cart.
 */
const clearCart = async (customerId, merchantId) => {
    return await Cart.findOneAndDelete({ customerId, merchantId });
};

/**
 * checkoutCart: Converts the cart into a formal Order and clears it.
 */
const checkoutCart = async (customerId, merchantId, checkoutData) => {
    const cart = await Cart.findOne({ customerId, merchantId }).lean();
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // Logic: Map cart to order service format
    const orderData = {
        ...checkoutData,
        merchantId,
        customerId,
        customerModel: cart.customerModel,
        items: cart.items.map(i => ({
            product: i.productId,
            productName: i.name,
            quantity: i.quantity
        }))
    };

    // Trigger Order logic (which also triggers Transaction + Stock)
    const order = await createOrder(orderData);

    // Wipe the cart after successful checkout
    await Cart.findOneAndDelete({ customerId, merchantId });

    return order;
};

export {
    addToCart,
    updateCartItem,
    clearCart,
    checkoutCart
};
