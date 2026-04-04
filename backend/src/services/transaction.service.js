import { Transaction } from "../models/Transaction.models.js";
import { Product } from "../models/Product.models.js";
import { Customer } from "../models/Customer.models.js";
import { User } from "../models/User.models.js";
import { Coupon } from "../models/Coupon.models.js";
import { ApiError } from "../utlis/apierror.js";
import { sendLowStockAlert } from "./notification.service.js";
import { addInsightJob } from "../queues/index.js";
import { createAuditLog } from "./audit.service.js";
import { clearCache } from "../middlewares/cache.middleware.js";
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

        // 🟢 Validation: Ensure Customer belongs to this Merchant
        let customerType = "Customer"; // Default to manual Customer model
        if (customerId) {
            // Check manual Customer ledger first
            let customer = await Customer.findOne({ _id: customerId, merchantId });
            
            if (!customer) {
                // If not in manual ledger, check registered Users
                customer = await User.findOne({ _id: customerId, merchantId, role: "Customer" });
                if (customer) {
                    customerType = "User";
                }
            }

            if (!customer) {
                throw new ApiError(404, "Customer not found or unauthorized access attempt");
            }
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

            // ⚠️ Trigger Low Stock Alert
            if (product.stock <= product.lowStockThreshold) {
                 sendLowStockAlert(product);
            }
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

            // Centralized Validation Logic (Checks expiry, min amount, overall usage)
            if (!coupon.isValid(calculatedSubtotal)) {
                throw new ApiError(400, "Coupon constraints not met (Min amount or Overall usage limit)");
            }

            // ⛔ Customer-Specific Restrictions
            if (coupon.targetCustomerId && coupon.targetCustomerId.toString() !== customerId?.toString()) {
                throw new ApiError(400, "This coupon is targeted to a specific customer and is not valid for this sale");
            }

            if (customerId) {
                // Count historical usage for this specific customer
                const usageCount = await Transaction.countDocuments({
                    customerId,
                    "financials.couponId": coupon._id,
                    type: { $ne: "VOID" } // Don't count voided transactions
                }).session(session);

                if (usageCount >= coupon.perCustomerLimit) {
                    throw new ApiError(400, `You have already used this coupon ${usageCount} time(s). Limit: ${coupon.perCustomerLimit}`);
                }
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
            customerModel: customerType,
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
            const ModelToUpdate = customerType === "User" ? User : Customer;
            await ModelToUpdate.findByIdAndUpdate(customerId, {
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

        // 📊 Live Insight Refresh (Moved to Background Queue)
        addInsightJob(merchantId);
        clearCache("dashboard", merchantId);

        // 📜 Audit Log (Non-await)
        createAuditLog({
            userId: merchantId,
            merchantId,
            action: "SALE_COMPLETED",
            resourceId: newTransaction._id,
            resourceType: "Transaction",
            metadata: { total: grandTotal, method: newTransaction.payment.method }
        });

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

const getCustomerHistory = async (customerId, filters = {}) => {
    const { page = 1, limit = 20, type = "SALE", startDate, endDate, merchantId } = filters;

    const query = { customerId };
    
    if (type) query.type = type;
    if (merchantId) query.merchantId = merchantId;
    if (startDate && endDate) {
        query.createdAt = { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
        };
    }

    return await Transaction.find(query)
        .populate("merchantId", "businessName fullname phone")
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
            const ModelToUpdate = transaction.customerModel === "User" ? User : Customer;
            await ModelToUpdate.findByIdAndUpdate(transaction.customerId, {
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

        // 📊 Live Insight Refresh (Non-await)
        addInsightJob(merchantId);
        clearCache("dashboard", merchantId);

        // 📜 Audit Log (Non-await)
        createAuditLog({
            userId: merchantId,
            merchantId,
            action: "TRANSACTION_VOIDED",
            resourceId: transaction._id,
            resourceType: "Transaction"
        });

        return transaction;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

/**
 * processRefund: Creates a new REFUND transaction and restores product stock.
 * Linked to an Order ID for full traceability.
 */
const processRefund = async (merchantId, orderId, refundItems, refundAmount = 0) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const mId = new mongoose.Types.ObjectId(merchantId);
        
        // 1. Create a Refund Transaction
        const refundTransaction = new Transaction({
            merchantId: mId,
            orderId,
            type: "REFUND",
            items: refundItems.map(item => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal
            })),
            financials: {
                subtotal: refundAmount,
                totalDiscount: 0,
                totalTax: 0,
                grandTotal: refundAmount,
                roundOff: 0
            },
            payment: {
                method: "OTHER", // Original payment method can be passed too
                status: "PAID",
                paidAmount: refundAmount,
                balanceAmount: 0
            },
            notes: `System Refund for Order: ${orderId}`
        });

        await refundTransaction.save({ session });

        // 2. Restore Inventory
        for (const item of refundItems) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } },
                { session }
            );
        }

        // 3. Optional: Deduct from customer Lifetime stats
        // await deductFromCustomerStats(customerId, refundAmount);

        await session.commitTransaction();
        session.endSession();

        // 📊 Live Insight Refresh (Non-await)
        addInsightJob(merchantId);
        clearCache("dashboard", merchantId);

        // 📜 Audit Log (Non-await)
        createAuditLog({
            userId: merchantId,
            merchantId,
            action: "REFUND_PROCESSED",
            resourceId: refundTransaction._id,
            resourceType: "Transaction",
            metadata: { orderId, amount: refundAmount }
        });

        return refundTransaction;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export {
    createSale,
    getMerchantHistory,
    getCustomerHistory,
    updateTransaction,
    deleteTransaction,
    deleteTransaction as voidTransaction,
    processRefund
};
