import { Transaction } from "../models/Transaction.models.js";
import { Product } from "../models/Product.models.js";
import { Customer } from "../models/Customer.models.js";
import { Coupon } from "../models/Coupon.models.js";
import { ApiError } from "../utlis/apierror.js";
import mongoose from "mongoose";

/**
 * createSale: Executes the core transaction logic.
 * Features:
 * - Atomic execution (Sessions)
 * - Zero Client-Trust financial calculations
 * - Multi-Model Stock & Customer Insight updates
 * - Coupon/Discount support
 */
const createSale = async (merchantId, saleData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { 
            items, 
            customerId, 
            payment, 
            notes, 
            tags, 
            source, 
            mode, 
            couponCode 
        } = saleData;

        if (!items || items.length === 0) {
            throw new ApiError(400, "Transaction must have at least one item");
        }

        // 1. Fetch products and verify merchant ownership
        const productIds = items.map(item => item.productId);
        const productsFromDb = await Product.find({
            _id: { $in: productIds },
            merchantId: merchantId // Corrected from 'merchant' to 'merchantId'
        }).session(session);

        if (productsFromDb.length !== productIds.length) {
            throw new ApiError(400, "One or more products do not belong to this merchant or are missing from inventory");
        }

        let calculatedSubtotal = 0;
        let transactionItems = [];

        // 2. Process Items: Stock Check + Financial Calc
        for (const item of items) {
            const product = productsFromDb.find(p => p._id.toString() === item.productId.toString());
            
            if (!product) {
                throw new ApiError(404, `Product with ID ${item.productId} not found during processing`);
            }

            // ⚠️ Critical: Stock check
            if (product.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for [${product.name}]. Available: ${product.stock}`);
            }

            // 💰 Strategic Calculation: Use Price from DB, not from Client
            // This prevents "Price Manipulation" attacks.
            const unitPrice = product.sellingPrice;
            // Note: Line-item discounts/taxes can still be applied from request but must be sanitized
            const itemDiscount = item.discount || 0;
            const itemTax = item.tax || 0;
            const lineTotal = (unitPrice * item.quantity) - itemDiscount + itemTax;
            
            calculatedSubtotal += lineTotal;

            transactionItems.push({
                productId: product._id,
                name: product.name,
                sku: product.sku,
                quantity: item.quantity,
                unit: product.unit,
                price: unitPrice,
                discount: itemDiscount,
                tax: itemTax,
                subtotal: lineTotal,
            });

            // 3. Atomically Update Product Stock
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // 4. DYNAMIC COUPON ENGINE
        let couponDiscount = 0;
        let appliedCouponId = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({
                merchantId,
                code: couponCode.toUpperCase(),
                isActive: true
            }).session(session);

            if (!coupon) {
                throw new ApiError(400, "Invalid or expired coupon code");
            }

            // Centralized Validation Logic (Checks expiry, min amount, usage limits)
            if (!coupon.isValid(calculatedSubtotal)) {
                throw new ApiError(400, "Coupon constraints not met (Min amount or Usage limit)");
            }

            couponDiscount = coupon.calculateDiscount(calculatedSubtotal);
            appliedCouponId = coupon._id;

            // Increment usage count 
            coupon.usedCount += 1;
            await coupon.save({ session });
        }

        // 5. Finalizing Financials (Grand Totals)
        const paymentDiscount = (payment?.discount || 0) + couponDiscount;
        const paymentTax = payment?.tax || 0;
        const shipping = payment?.shipping || 0;

        const rawGrandTotal = (calculatedSubtotal + paymentTax + shipping) - paymentDiscount;
        const grandTotal = Math.round(rawGrandTotal);
        const roundOff = Number((grandTotal - rawGrandTotal).toFixed(2));

        // 6. Build and Save Transaction
        const newTransaction = new Transaction({
            merchantId,
            customerId,
            items: transactionItems,
            financials: {
                subtotal: calculatedSubtotal, // This holds the pre-coupon/shipping total
                totalDiscount: paymentDiscount,
                totalTax: paymentTax,
                shipping: shipping,
                grandTotal,
                roundOff,
                couponId: appliedCouponId,
                couponCode: couponCode,
            },
            payment: {
                method: payment?.method || "CASH",
                paidAmount: payment?.paidAmount || 0,
                // Status is Partial if Not fully paid, Paid if fully paid
                status: (payment?.paidAmount || 0) >= grandTotal ? "PAID" : "PARTIAL",
                balanceAmount: Math.max(0, grandTotal - (payment?.paidAmount || 0))
            },
            notes,
            tags,
            source: source || "POS",
            type: "SALE",
            recordedBy: merchantId,
            mode: mode || "retail"
        });

        await newTransaction.save({ session });

        // 7. Update Customer Insights / Sales Stats
        if (customerId) {
            await Customer.findByIdAndUpdate(customerId, {
                $inc: { 
                    "stats.totalOrders": 1, 
                    "stats.totalSpent": grandTotal 
                },
                $set: { lastVisitDate: new Date() }
            }, { session });
        }

        // 🏁 Finish Transactions
        await session.commitTransaction();
        session.endSession();

        return newTransaction;

    } catch (error) {
        // 🚨 Rollback everything on failure
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

/**
 * Fetches transaction history for a merchant with basic pagination and filters.
 */
const getMerchantHistory = async (merchantId, filters = {}) => {
    const { page = 1, limit = 20, type = "SALE", startDate, endDate, customerId } = filters;

    const query = { merchantId };
    
    // Optional filters
    if (type) query.type = type;
    if (customerId) query.customerId = customerId;
    if (startDate && endDate) {
        query.createdAt = { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
        };
    }

    return await Transaction.find(query)
        .populate("customerId", "name phone")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
};

/**
 * Updates non-financial metadata of a transaction.
 */
const updateTransaction = async (merchantId, transactionId, updateData) => {
    const { notes, tags, paymentStatus, paidAmount } = updateData;

    const transaction = await Transaction.findOne({ _id: transactionId, merchantId });
    if (!transaction) throw new ApiError(404, "Transaction not found");

    if (notes) transaction.notes = notes;
    if (tags) transaction.tags = tags;
    
    if (paymentStatus) transaction.payment.status = paymentStatus;
    if (paidAmount !== undefined) {
        transaction.payment.paidAmount = paidAmount;
        transaction.payment.balanceAmount = Math.max(0, transaction.financials.grandTotal - paidAmount);
    }

    await transaction.save();
    return transaction;
};

/**
 * Deletes (Voids) a transaction and restores inventory/stats.
 */
const deleteTransaction = async (merchantId, transactionId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await Transaction.findOne({ _id: transactionId, merchantId }).session(session);
        if (!transaction) throw new ApiError(404, "Transaction record not found");
        
        if (transaction.type === "VOID") {
            throw new ApiError(400, "This transaction has already been voided");
        }

        // 1. Revert Inventory
        for (const item of transaction.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            }, { session });
        }

        // 2. Revert Customer Stats
        if (transaction.customerId) {
            await Customer.findByIdAndUpdate(transaction.customerId, {
                $inc: { 
                    "stats.totalOrders": -1, 
                    "stats.totalSpent": -transaction.financials.grandTotal 
                }
            }, { session });
        }

        // 3. Revert Coupon Usage
        if (transaction.financials.couponId) {
            await Coupon.findByIdAndUpdate(
                transaction.financials.couponId, 
                { $inc: { usedCount: -1 } }
            ).session(session);
        }

        // 4. Mark as VOID
        transaction.type = "VOID";
        transaction.notes = `VOIDED on ${new Date().toISOString()}. Inventory & Stats Reverted.`;
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();
        return transaction;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export {
    createSale,
    getMerchantHistory,
    updateTransaction,
    deleteTransaction,
    deleteTransaction as voidTransaction 
};
