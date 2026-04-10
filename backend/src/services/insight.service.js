import { Transaction } from "../models/Transaction.models.js";
import { Product } from "../models/Product.models.js";
import { User } from "../models/User.models.js";
import { Customer } from "../models/Customer.models.js";
import { Insight } from "../models/Insight.models.js";
import mongoose from "mongoose";

/**
 * refreshMerchantSnapshot: Re-calculates all high-level business stats 
 * and stores them in the persistent Insight collection. 
 * This should be called after a transaction is finalized (Order confirmed).
 */
const refreshMerchantSnapshot = async (merchantId) => {
    const mId = new mongoose.Types.ObjectId(merchantId);
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // 1. 💰 Financial Highlights
    const [financials, todayStats] = await Promise.all([
        Transaction.aggregate([
            { $match: { merchantId: mId, type: "SALE" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$financials.grandTotal" },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: "$financials.grandTotal" }
                }
            }
        ]),
        Transaction.aggregate([
            { $match: { merchantId: mId, type: "SALE", createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, todayRevenue: { $sum: "$financials.grandTotal" } } }
        ])
    ]);

    // 2. 📊 Revenue Trends (Daily, Weekly, Monthly)
    const [dailyTrend, weeklyTrend, monthlyTrend] = await Promise.all([
        Transaction.aggregate([
            { $match: { merchantId: mId, type: "SALE", createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, amount: { $sum: "$financials.grandTotal" } } },
            { $sort: { "_id": 1 } },
            { $project: { date: "$_id", amount: 1, _id: 0 } }
        ]),
        Transaction.aggregate([
            { $match: { merchantId: mId, type: "SALE", createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: { $dateToString: { format: "%G-W%V", date: "$createdAt" } }, amount: { $sum: "$financials.grandTotal" } } },
            { $sort: { "_id": 1 } },
            { $project: { week: "$_id", amount: 1, _id: 0 } }
        ]),
        Transaction.aggregate([
            { $match: { merchantId: mId, type: "SALE" } },
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, amount: { $sum: "$financials.grandTotal" } } },
            { $sort: { "_id": 1 } }, { $limit: 6 },
            { $project: { month: "$_id", amount: 1, _id: 0 } }
        ])
    ]);

    // 3. 🧍 Advanced Customer Analytics (CLV Segments)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    const [loyalCount, highValueCount, atRiskCount, newCount] = await Promise.all([
        Customer.countDocuments({ merchantId: mId, "stats.totalOrders": { $gte: 15 } }),
        Customer.countDocuments({ merchantId: mId, "stats.totalSpent": { $gte: 5000 } }),
        Customer.countDocuments({ merchantId: mId, lastVisitDate: { $lt: sixtyDaysAgo } }),
        Customer.countDocuments({ merchantId: mId, createdAt: { $gte: fifteenDaysAgo } })
    ]);

    // 4. 🔮 Demand Prediction (Stock Velocity Logic)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const velocityData = await Transaction.aggregate([
        { $match: { merchantId: mId, type: "SALE", createdAt: { $gte: thirtyDaysAgo } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", dailyAvg: { $sum: { $divide: ["$items.quantity", 30] } } } }
    ]);

    const activeProducts = await Product.find({ merchantId: mId, isActive: true }).select("name stock");
    const demandPredictions = activeProducts.map(p => {
        const vel = velocityData.find(v => v._id.toString() === p._id.toString())?.dailyAvg || 0;
        const daysLeft = vel > 0 ? Math.floor(p.stock / vel) : 999;
        
        let status = "HEALTHY";
        if (daysLeft < 7) status = "CRITICAL";
        else if (daysLeft < 20) status = "RESTOCK_SOON";

        const projectedDate = new Date(now.getTime() + daysLeft * 24 * 60 * 60 * 1000);

        return {
            productId: p._id,
            name: p.name,
            currentStock: p.stock,
            velocity: vel,
            predictedOutDate: projectedDate,
            projectedRunOutDate: projectedDate,
            status
        };
    }).sort((a,b) => a.predictedOutDate - b.predictedOutDate).slice(0, 5);

    // 5. 🧍 Top Customers
    const topReg = await User.find({ merchantId: mId, role: "Customer" })
        .sort({ "stats.totalSpent": -1 }).limit(5).select("fullname stats phone lastVisitDate");
    const topMan = await Customer.find({ merchantId: mId })
        .sort({ "stats.totalSpent": -1 }).limit(5).select("name stats phone lastVisitDate");

    const topCustomers = [
        ...topReg.map(c => ({ name: c.fullname, phone: c.phone, totalSpent: c.stats.totalSpent, totalOrders: c.stats.totalOrders, lastTransactionDate: c.lastVisitDate })),
        ...topMan.map(c => ({ name: c.name, phone: c.phone, totalSpent: c.stats.totalSpent, totalOrders: c.stats.totalOrders, lastTransactionDate: c.lastVisitDate }))
    ].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

    // 6. 📈 Inventory Logic
    const fastMoving = await Transaction.aggregate([
        { $match: { merchantId: mId, type: "SALE" } },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", name: { $first: "$items.name" }, totalSold: { $sum: "$items.quantity" }, revenue: { $sum: "$items.subtotal" } } },
        { $sort: { totalSold: -1 } }, { $limit: 5 }
    ]);

    const lowStock = await Product.find({ merchantId: mId, $expr: { $lte: ["$stock", "$lowStockThreshold"] }, isActive: true })
        .select("name stock lowStockThreshold").limit(5);

    const snapshotData = {
        financials: {
            totalRevenue: financials[0]?.totalRevenue || 0,
            totalOrders: financials[0]?.totalOrders || 0,
            aov: Math.round(financials[0]?.avgOrderValue || 0),
            todayRevenue: todayStats[0]?.todayRevenue || 0,
        },
        revenueTrend: dailyTrend,
        weeklyRevenueTrend: weeklyTrend,
        monthlyRevenueTrend: monthlyTrend,
        customerSegments: { loyalCount, highValueCount, atRiskCount, newCount },
        demandPredictions,
        topCustomers,
        fastMovingProducts: fastMoving.map(p => ({ productId: p._id, name: p.name, totalSold: p.totalSold, revenue: p.revenue })),
        lowStockItems: lowStock.map(i => ({ name: i.name, stock: i.stock, threshold: i.lowStockThreshold })),
        lastCalculatedAt: new Date()
    };

    return await Insight.findOneAndUpdate(
        { merchantId: mId },
        { $set: snapshotData },
        { upsert: true, new: true }
    );
};

/**
 * getMerchantDashboardInsights: Fast-Path retrieval of merchant performance.
 * Serves pre-computed snapshots from the Insight collection.
 */
const getMerchantDashboardInsights = async (merchantId) => {
    const mId = new mongoose.Types.ObjectId(merchantId);

    // 🚀 Fast-Path: Fetch latest snap from background worker
    const snapshot = await Insight.findOne({ merchantId: mId });
    if (snapshot) {
        return snapshot;
    }

    // 🐢 Fallback: Real-time calculation (Only if snapshot missing)
    return await refreshMerchantSnapshot(merchantId);
};

export {
    getMerchantDashboardInsights,
    refreshMerchantSnapshot
};
