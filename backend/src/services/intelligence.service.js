import { Transaction } from "../models/Transaction.models.js";
import { Product } from "../models/Product.models.js";
import { User } from "../models/User.models.js";
import { Customer } from "../models/Customer.models.js";
import mongoose from "mongoose";

/**
 * CustomerIntelligenceService: Enterprise-grade CRM analytics for Mana-Vyapar merchants.
 * Provides RFM segmentation, churn prediction, CLV estimation, and personalized offer logic.
 */

// ─────────────────────────────────────────────────────────────────────
// 1. 🧬 RFM SEGMENTATION (Recency, Frequency, Monetary)
// ─────────────────────────────────────────────────────────────────────
/**
 * Calculates RFM scores for ALL customers of a merchant.
 * Each customer gets a score from 1-5 on each dimension.
 * Combined score determines their segment (Champion, Loyal, At Risk, Lost, etc.)
 */
const getCustomerSegmentation = async (merchantId) => {
    const mId = new mongoose.Types.ObjectId(merchantId);

    // Pull raw transaction data grouped by customer
    const customerData = await Transaction.aggregate([
        { $match: { merchantId: mId, type: "SALE" } },
        {
            $group: {
                _id: { customerId: "$customerId", customerModel: "$customerModel" },
                totalSpent: { $sum: "$financials.grandTotal" },
                orderCount: { $sum: 1 },
                lastPurchase: { $max: "$createdAt" },
                firstPurchase: { $min: "$createdAt" },
                avgOrderValue: { $avg: "$financials.grandTotal" }
            }
        }
    ]);

    if (customerData.length === 0) return { segments: {}, customers: [] };

    // Calculate percentile boundaries for scoring
    const now = new Date();
    const spentValues = customerData.map(c => c.totalSpent).sort((a, b) => a - b);
    const freqValues = customerData.map(c => c.orderCount).sort((a, b) => a - b);

    const getPercentileScore = (value, sortedArr) => {
        const idx = sortedArr.findIndex(v => v >= value);
        const percentile = (idx / sortedArr.length) * 100;
        if (percentile >= 80) return 5;
        if (percentile >= 60) return 4;
        if (percentile >= 40) return 3;
        if (percentile >= 20) return 2;
        return 1;
    };

    const scored = await Promise.all(customerData.map(async (c) => {
        const daysSinceLastPurchase = Math.floor((now - new Date(c.lastPurchase)) / (1000 * 60 * 60 * 24));

        // Recency: Lower days = higher score
        let recencyScore;
        if (daysSinceLastPurchase <= 7) recencyScore = 5;
        else if (daysSinceLastPurchase <= 14) recencyScore = 4;
        else if (daysSinceLastPurchase <= 30) recencyScore = 3;
        else if (daysSinceLastPurchase <= 60) recencyScore = 2;
        else recencyScore = 1;

        const frequencyScore = getPercentileScore(c.orderCount, freqValues);
        const monetaryScore = getPercentileScore(c.totalSpent, spentValues);

        // Composite segment assignment
        const avgScore = (recencyScore + frequencyScore + monetaryScore) / 3;
        let segment;
        if (avgScore >= 4.5) segment = "CHAMPION";
        else if (avgScore >= 3.5) segment = "LOYAL";
        else if (recencyScore >= 4 && frequencyScore <= 2) segment = "NEW";
        else if (recencyScore <= 2 && frequencyScore >= 3) segment = "AT_RISK";
        else if (recencyScore <= 1) segment = "LOST";
        else segment = "REGULAR";

        // Populate name
        let name = "Unknown";
        if (c._id.customerModel === "User") {
            const u = await User.findById(c._id.customerId).select("fullname phone");
            name = u?.fullname || name;
        } else {
            const cu = await Customer.findById(c._id.customerId).select("name phone");
            name = cu?.name || name;
        }

        return {
            customerId: c._id.customerId,
            customerModel: c._id.customerModel,
            name,
            rfm: { recency: recencyScore, frequency: frequencyScore, monetary: monetaryScore },
            segment,
            totalSpent: c.totalSpent,
            orderCount: c.orderCount,
            avgOrderValue: Math.round(c.avgOrderValue),
            daysSinceLastPurchase,
            firstPurchase: c.firstPurchase,
            lastPurchase: c.lastPurchase
        };
    }));

    // Group by segment for summary
    const segments = {};
    scored.forEach(c => {
        if (!segments[c.segment]) segments[c.segment] = { count: 0, totalRevenue: 0 };
        segments[c.segment].count++;
        segments[c.segment].totalRevenue += c.totalSpent;
    });

    return { segments, customers: scored };
};

// ─────────────────────────────────────────────────────────────────────
// 2. ⚠️ CHURN RISK DETECTION
// ─────────────────────────────────────────────────────────────────────
/**
 * Identifies customers who haven't purchased in X days.
 * Returns a prioritized list so the merchant can take action.
 */
const getChurnRiskCustomers = async (merchantId, inactiveDays = 30) => {
    const mId = new mongoose.Types.ObjectId(merchantId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

    const atRisk = await Transaction.aggregate([
        { $match: { merchantId: mId, type: "SALE" } },
        {
            $group: {
                _id: { customerId: "$customerId", customerModel: "$customerModel" },
                totalSpent: { $sum: "$financials.grandTotal" },
                orderCount: { $sum: 1 },
                lastPurchase: { $max: "$createdAt" }
            }
        },
        { $match: { lastPurchase: { $lt: cutoffDate }, orderCount: { $gte: 2 } } }, // Only flag repeat buyers
        { $sort: { totalSpent: -1 } },
        { $limit: 20 }
    ]);

    // Populate names
    return await Promise.all(atRisk.map(async (c) => {
        let name = "Unknown";
        let phone = "";
        if (c._id.customerModel === "User") {
            const u = await User.findById(c._id.customerId).select("fullname phone");
            name = u?.fullname || name; phone = u?.phone || "";
        } else {
            const cu = await Customer.findById(c._id.customerId).select("name phone");
            name = cu?.name || name; phone = cu?.phone || "";
        }
        const daysSince = Math.floor((new Date() - new Date(c.lastPurchase)) / (1000 * 60 * 60 * 24));

        return {
            customerId: c._id.customerId,
            name, phone,
            totalSpent: c.totalSpent,
            orderCount: c.orderCount,
            daysSinceLastVisit: daysSince,
            riskLevel: daysSince > 60 ? "HIGH" : daysSince > 30 ? "MEDIUM" : "LOW",
            suggestedAction: daysSince > 60
                ? "Send a ₹50 OFF coupon via WhatsApp"
                : "Send a personalized reminder message"
        };
    }));
};

// ─────────────────────────────────────────────────────────────────────
// 3. 🔁 REPEAT CUSTOMER DETECTION
// ─────────────────────────────────────────────────────────────────────
const getRepeatCustomers = async (merchantId) => {
    const mId = new mongoose.Types.ObjectId(merchantId);

    const repeats = await Transaction.aggregate([
        { $match: { merchantId: mId, type: "SALE" } },
        {
            $group: {
                _id: { customerId: "$customerId", customerModel: "$customerModel" },
                orderCount: { $sum: 1 },
                totalSpent: { $sum: "$financials.grandTotal" },
                lastPurchase: { $max: "$createdAt" }
            }
        },
        { $match: { orderCount: { $gte: 2 } } },
        { $sort: { orderCount: -1 } },
        { $limit: 15 }
    ]);

    const totalCustomers = await Transaction.aggregate([
        { $match: { merchantId: mId, type: "SALE" } },
        { $group: { _id: "$customerId" } },
        { $count: "total" }
    ]);

    const repeatCount = repeats.length;
    const total = totalCustomers[0]?.total || 0;

    return {
        repeatRate: total > 0 ? Math.round((repeatCount / total) * 100) : 0,
        totalUniqueCustomers: total,
        repeatCustomerCount: repeatCount,
        topRepeaters: await Promise.all(repeats.map(async (c) => {
            let name = "Unknown";
            if (c._id.customerModel === "User") {
                const u = await User.findById(c._id.customerId).select("fullname");
                name = u?.fullname || name;
            } else {
                const cu = await Customer.findById(c._id.customerId).select("name");
                name = cu?.name || name;
            }
            return { customerId: c._id.customerId, name, orderCount: c.orderCount, totalSpent: c.totalSpent };
        }))
    };
};

// ─────────────────────────────────────────────────────────────────────
// 4. 💎 CUSTOMER LIFETIME VALUE (CLV)
// ─────────────────────────────────────────────────────────────────────
/**
 * Estimates future revenue from a customer based on their purchase history.
 * Formula: CLV = Average Order Value × Purchase Frequency × Estimated Lifespan (months)
 */
const getCustomerCLV = async (merchantId, customerId) => {
    const mId = new mongoose.Types.ObjectId(merchantId);
    const cId = new mongoose.Types.ObjectId(customerId);

    const stats = await Transaction.aggregate([
        { $match: { merchantId: mId, customerId: cId, type: "SALE" } },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: "$financials.grandTotal" },
                orderCount: { $sum: 1 },
                avgOrderValue: { $avg: "$financials.grandTotal" },
                firstPurchase: { $min: "$createdAt" },
                lastPurchase: { $max: "$createdAt" }
            }
        }
    ]);

    if (!stats[0]) return { clv: 0, message: "No transaction history for this customer" };

    const data = stats[0];
    const monthsActive = Math.max(1, Math.floor((new Date(data.lastPurchase) - new Date(data.firstPurchase)) / (1000 * 60 * 60 * 24 * 30)));
    const purchaseFrequency = data.orderCount / monthsActive; // Orders per month
    const estimatedLifespan = 12; // Assume 12 months forward

    const clv = Math.round(data.avgOrderValue * purchaseFrequency * estimatedLifespan);

    return {
        clv,
        historicalSpend: data.totalSpent,
        avgOrderValue: Math.round(data.avgOrderValue),
        purchaseFrequency: Math.round(purchaseFrequency * 100) / 100,
        monthsActive,
        orderCount: data.orderCount,
        tier: clv > 50000 ? "PLATINUM" : clv > 20000 ? "GOLD" : clv > 5000 ? "SILVER" : "BRONZE"
    };
};

// ─────────────────────────────────────────────────────────────────────
// 5. 📊 PURCHASE PATTERN ANALYSIS
// ─────────────────────────────────────────────────────────────────────
/**
 * Analyzes WHAT a specific customer buys, WHEN they buy, and HOW they pay.
 */
const getCustomerPurchasePattern = async (merchantId, customerId) => {
    const mId = new mongoose.Types.ObjectId(merchantId);
    const cId = new mongoose.Types.ObjectId(customerId);

    // What they buy (Top products)
    const topProducts = await Transaction.aggregate([
        { $match: { merchantId: mId, customerId: cId, type: "SALE" } },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", name: { $first: "$items.name" }, qty: { $sum: "$items.quantity" }, spent: { $sum: "$items.subtotal" } } },
        { $sort: { qty: -1 } },
        { $limit: 5 }
    ]);

    // When they buy (Day of week distribution)
    const dayDistribution = await Transaction.aggregate([
        { $match: { merchantId: mId, customerId: cId, type: "SALE" } },
        { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const dayNames = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // How they pay
    const paymentPreference = await Transaction.aggregate([
        { $match: { merchantId: mId, customerId: cId, type: "SALE" } },
        { $group: { _id: "$payment.method", count: { $sum: 1 }, total: { $sum: "$financials.grandTotal" } } },
        { $sort: { count: -1 } }
    ]);

    return {
        favoriteProducts: topProducts,
        preferredDays: dayDistribution.map(d => ({ day: dayNames[d._id], orders: d.count })),
        paymentMethods: paymentPreference,
        insight: topProducts.length > 0
            ? `This customer loves "${topProducts[0].name}" and prefers ${paymentPreference[0]?._id || "CASH"} payments.`
            : "Not enough data yet."
    };
};

// ─────────────────────────────────────────────────────────────────────
// 6. 🎯 SMART COUPON RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────────────
/**
 * Generates personalized coupon suggestions based on customer behavior.
 */
const getSmartOfferSuggestions = async (merchantId) => {
    const mId = new mongoose.Types.ObjectId(merchantId);
    const suggestions = [];

    // Strategy 1: Win-back churning customers
    const churning = await getChurnRiskCustomers(merchantId, 30);
    if (churning.length > 0) {
        suggestions.push({
            type: "WIN_BACK",
            priority: "HIGH",
            title: "Win Back Churning Customers",
            description: `${churning.length} repeat customers haven't visited in 30+ days`,
            suggestedCoupon: {
                discountType: "PERCENTAGE",
                discountValue: 15,
                minOrderAmount: 200,
                maxUses: churning.length,
                targetCustomers: churning.map(c => c.customerId),
                message: "We miss you! Here's 15% OFF on your next order 💛"
            }
        });
    }

    // Strategy 2: Reward champions
    const segmentation = await getCustomerSegmentation(merchantId);
    const champions = segmentation.customers.filter(c => c.segment === "CHAMPION");
    if (champions.length > 0) {
        suggestions.push({
            type: "LOYALTY_REWARD",
            priority: "MEDIUM",
            title: "Reward Your Top Customers",
            description: `${champions.length} champion customers deserve recognition`,
            suggestedCoupon: {
                discountType: "FIXED",
                discountValue: 100,
                minOrderAmount: 500,
                maxUses: champions.length,
                targetCustomers: champions.map(c => c.customerId),
                message: "Thank you for being our valued customer! Here's ₹100 OFF 🎁"
            }
        });
    }

    // Strategy 3: Convert one-timers to repeaters
    const oneTimers = segmentation.customers.filter(c => c.orderCount === 1 && c.daysSinceLastPurchase <= 30);
    if (oneTimers.length > 0) {
        suggestions.push({
            type: "SECOND_PURCHASE",
            priority: "HIGH",
            title: "Convert First-Timers to Regulars",
            description: `${oneTimers.length} customers bought once recently. Nudge them for a second purchase.`,
            suggestedCoupon: {
                discountType: "PERCENTAGE",
                discountValue: 10,
                minOrderAmount: 150,
                maxUses: oneTimers.length,
                targetCustomers: oneTimers.map(c => c.customerId),
                message: "Loved your first order? Here's 10% OFF on your next one! 🎉"
            }
        });
    }

    return suggestions;
};

export {
    getCustomerSegmentation,
    getChurnRiskCustomers,
    getRepeatCustomers,
    getCustomerCLV,
    getCustomerPurchasePattern,
    getSmartOfferSuggestions
};
