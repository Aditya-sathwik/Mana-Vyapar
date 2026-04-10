import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Transaction } from "../models/Transaction.models.js";

/**
 * Ensures that the Sale record referenced in req.params belongs to the logged-in Merchant.
 * This prevents cross-merchant record manipulation via ID guessing.
 */
const verifyTransactionOwnership = asyncHandler(async (req, _, next) => {
    const { transactionId } = req.params;
    const merchantId = req.user?._id;

    if (!transactionId) {
        throw new ApiError(400, "Transaction ID is required in URL parameters");
    }

    const transaction = await Transaction.findOne({ _id: transactionId, merchantId });

    if (!transaction) {
        throw new ApiError(404, "Transaction record not found for this merchant");
    }

    // Attach the found transaction to the request so the controller doesn't have to query again
    req.transaction = transaction;
    next();
});

/**
 * Quick sanitization of the sale payload before hitting the Service layer.
 * Verifies items structure and payment basics.
 */
const validateSaleItems = (req, _, next) => {
    const { items, payment } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "Sale must contain a non-empty array of items");
    }

    // Simple integrity check on line items
    for (const item of items) {
        if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
            throw new ApiError(400, `Invalid line item detected: ${JSON.stringify(item)}`);
        }
    }

    if (!payment || !payment.method) {
        throw new ApiError(400, "Payment method is required for executing a sale");
    }

    next();
};

export {
    verifyTransactionOwnership,
    validateSaleItems
};
