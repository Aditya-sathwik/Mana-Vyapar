import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as TransactionService from "../services/transaction.service.js";

/**
 * @controller executeSale
 * @description The primary POST endpoint for recording a new transaction. 
 */
const executeSale = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    if (!merchantId) throw new ApiError(401, "Merchant identity not found in request");

    // Pass everything to the service layer for Atomic execution
    const transaction = await TransactionService.createSale(merchantId, req.body);

    return res
        .status(201)
        .json(new ApiResponse(201, transaction, "Sale recorded successfully and inventory updated"));
});

/**
 * @controller getHistory
 * @description GET endpoint for paginated and filtered historical records.
 */
const getHistory = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    const filters = req.query; // page, limit, type, startDate, endDate

    const history = await TransactionService.getMerchantHistory(merchantId, filters);

    return res
        .status(200)
        .json(new ApiResponse(200, history, "Transaction history fetched successfully"));
});

const getCustomerHistory = asyncHandler(async (req, res) => {
    const customerId = req.user?._id;
    const filters = req.query; // page, limit, type, startDate, endDate, merchantId

    const history = await TransactionService.getCustomerHistory(customerId, filters);

    return res
        .status(200)
        .json(new ApiResponse(200, history, "Customer purchase history fetched successfully"));
});

/**
 * @controller voidSale
 * @description DELETE/POST endpoint to cancel/void a sale and reverse stock.
 */
const voidSale = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    const { transactionId } = req.params;

    const voidedRecord = await TransactionService.voidTransaction(merchantId, transactionId);

    return res
        .status(200)
        .json(new ApiResponse(200, voidedRecord, "Transaction voided and stock reverted successfully"));
});

/**
 * @controller updateMetadata
 * @description PATCH endpoint to update notes/tags after a sale.
 */
const updateMetadata = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    const { transactionId } = req.params;

    const updatedRecord = await TransactionService.updateTransaction(merchantId, transactionId, req.body);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedRecord, "Transaction metadata updated successfully"));
});

/**
 * @controller checkCoupon
 * @description Validates a coupon and returns the discount preview.
 */
const checkCoupon = asyncHandler(async (req, res) => {
    const merchantId = req.user?._id;
    const { code } = req.params;
    const { subtotal, customerId } = req.query;

    if (!code) throw new ApiError(400, "Coupon code is required");
    if (!subtotal) throw new ApiError(400, "Order subtotal is required for validation");

    const result = await TransactionService.validateCoupon(
        merchantId, 
        code, 
        parseFloat(subtotal), 
        customerId
    );

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Coupon validated successfully"));
});

export {
    executeSale,
    getHistory,
    getCustomerHistory,
    voidSale,
    updateMetadata,
    checkCoupon
};
