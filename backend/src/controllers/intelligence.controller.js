import { asyncHandler } from "../utlis/asynchandler.js";
import { ApiResponse } from "../utlis/apiresponse.js";
import { ApiError } from "../utlis/apierror.js";
import * as IntelligenceService from "../services/intelligence.service.js";

/**
 * @controller getSegmentation
 * @description GET /intelligence/segmentation - RFM-based customer segmentation.
 */
const getSegmentation = asyncHandler(async (req, res) => {
    const data = await IntelligenceService.getCustomerSegmentation(req.user._id);
    return res.status(200).json(
        new ApiResponse(200, data, "Customer segmentation data fetched")
    );
});

/**
 * @controller getChurnRisk
 * @description GET /intelligence/churn-risk - Customers at risk of leaving.
 */
const getChurnRisk = asyncHandler(async (req, res) => {
    const inactiveDays = parseInt(req.query.days) || 30;
    const data = await IntelligenceService.getChurnRiskCustomers(req.user._id, inactiveDays);
    return res.status(200).json(
        new ApiResponse(200, data, "Churn risk customers fetched")
    );
});

/**
 * @controller getRepeatCustomers
 * @description GET /intelligence/repeat-customers - Loyalty detection.
 */
const getRepeatCustomers = asyncHandler(async (req, res) => {
    const data = await IntelligenceService.getRepeatCustomers(req.user._id);
    return res.status(200).json(
        new ApiResponse(200, data, "Repeat customer analysis fetched")
    );
});

/**
 * @controller getCustomerCLV
 * @description GET /intelligence/clv/:customerId - Lifetime value of a single customer.
 */
const getCustomerCLV = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    if (!customerId) throw new ApiError(400, "customerId param is required");

    const data = await IntelligenceService.getCustomerCLV(req.user._id, customerId);
    return res.status(200).json(
        new ApiResponse(200, data, "Customer lifetime value fetched")
    );
});

/**
 * @controller getPurchasePattern
 * @description GET /intelligence/pattern/:customerId - What, when, how a customer buys.
 */
const getPurchasePattern = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    if (!customerId) throw new ApiError(400, "customerId param is required");

    const data = await IntelligenceService.getCustomerPurchasePattern(req.user._id, customerId);
    return res.status(200).json(
        new ApiResponse(200, data, "Purchase pattern analysis fetched")
    );
});

/**
 * @controller getSmartOffers
 * @description GET /intelligence/smart-offers - AI-driven coupon recommendations.
 */
const getSmartOffers = asyncHandler(async (req, res) => {
    const data = await IntelligenceService.getSmartOfferSuggestions(req.user._id);
    return res.status(200).json(
        new ApiResponse(200, data, "Smart offer suggestions generated")
    );
});

export {
    getSegmentation,
    getChurnRisk,
    getRepeatCustomers,
    getCustomerCLV,
    getPurchasePattern,
    getSmartOffers
};
