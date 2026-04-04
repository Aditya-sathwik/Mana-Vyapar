import { asyncHandler } from "../utlis/asynchandler.js";
import { ApiResponse } from "../utlis/apiresponse.js";
import { ApiError } from "../utlis/apierror.js";
import * as CouponService from "../services/coupon.service.js";

/**
 * @controller createCpn
 * @description Method for merchants to create custom coupons for their store.
 */
const createCpn = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    if (!merchantId) throw new ApiError(401, "Merchant identity not found");

    const coupon = await CouponService.createCoupon(merchantId, req.body);

    return res
        .status(201)
        .json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

/**
 * @controller listMerchantCpns
 * @description Lists all coupons created by the authenticated merchant.
 */
const listMerchantCpns = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    const coupons = await CouponService.getMerchantCoupons(merchantId);

    return res
        .status(200)
        .json(new ApiResponse(200, coupons, "Coupons fetched successfully"));
});

/**
 * @controller editCoupon
 * @description Updates a coupon's configuration (code, type, value, limits, etc.).
 */
const editCoupon = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    const { couponId } = req.params;

    const updatedCoupon = await CouponService.updateCoupon(merchantId, couponId, req.body);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCoupon, "Coupon updated successfully"));
});

/**
 * @controller removeCpn
 * @description Permanently removes a coupon from the merchant's store.
 */
const removeCpn = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    const { couponId } = req.params;

    const coupon = await CouponService.deleteCoupon(merchantId, couponId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});

export {
    createCpn,
    listMerchantCpns,
    editCoupon,
    removeCpn
};
