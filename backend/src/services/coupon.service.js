import { Coupon } from "../models/Coupon.models.js";
import { Customer } from "../models/Customer.models.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Creates a new merchant-specific coupon.
 */
const createCoupon = async (merchantId, couponData) => {
    const { code, targetCustomerId } = couponData;

    // 1. Code Collision Check
    const existed = await Coupon.findOne({ merchantId, code: code.toUpperCase() });
    if (existed) {
        throw new ApiError(400, `Coupon code [${code}] already exists for your store`);
    }

    // 2. Customer Ownership Check (if targeted)
    if (targetCustomerId) {
        const customer = await Customer.findOne({ _id: targetCustomerId, merchantId });
        if (!customer) {
            throw new ApiError(404, "Target Customer not found or unauthorized");
        }
    }

    return await Coupon.create({
        ...couponData,
        merchantId,
        code: code.toUpperCase()
    });
};

/**
 * Lists all coupons for a merchant.
 */
const getMerchantCoupons = async (merchantId) => {
    return await Coupon.find({ merchantId }).sort({ createdAt: -1 });
};

/**
 * Updates an existing coupon's metadata or constraints.
 */
const updateCoupon = async (merchantId, couponId, updateData) => {
    const coupon = await Coupon.findOne({ _id: couponId, merchantId });
    if (!coupon) throw new ApiError(404, "Coupon not found");

    // Block updating the merchantId or code if you want it to be immutable
    // but allowing code update if it doesn't collide
    if (updateData.code) {
        const collision = await Coupon.findOne({ 
            merchantId, 
            code: updateData.code.toUpperCase(),
            _id: { $ne: couponId }
        });
        if (collision) throw new ApiError(400, "New coupon code already in use");
        updateData.code = updateData.code.toUpperCase();
    }

    // Apply updates
    Object.assign(coupon, updateData);
    await coupon.save();
    
    return coupon;
};

/**
 * Permanently deletes a coupon.
 */
const deleteCoupon = async (merchantId, couponId) => {
    const coupon = await Coupon.findOneAndDelete({ _id: couponId, merchantId });
    if (!coupon) throw new ApiError(404, "Coupon not found or unauthorized deletion");
    return coupon;
};

export {
    createCoupon,
    getMerchantCoupons,
    updateCoupon,
    deleteCoupon
};
