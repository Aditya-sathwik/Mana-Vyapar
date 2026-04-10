import { Transaction } from "../models/Transaction.models.js";
import { Order } from "../models/Order.models.js";
import { Product } from "../models/Product.models.js";
import { User } from "../models/User.models.js";
import { Customer } from "../models/Customer.models.js";
import mongoose from "mongoose";

/**
 * DashboardService: Specialized logic for fetching merchant business metrics.
 * Now Unified with the Customer-centric Data Model.
 */

// 💰 Total Sales (Lifetime)
const getTotalSalesValue = async (merchantId) => {
    const stats = await Transaction.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId), type: "SALE" } },
        { $group: { _id: null, total: { $sum: "$financials.grandTotal" } } }
    ]);
    return stats[0]?.total || 0;
};

// 📈 Total Orders (Lifetime)
const getTotalOrdersCount = async (merchantId) => {
    return await Order.countDocuments({ merchantId, status: { $ne: "CANCELLED" } });
};

// 💸 Daily Revenue (Today only)
const getTodayRevenue = async (merchantId) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const stats = await Transaction.aggregate([
        { 
            $match: { 
                merchantId: new mongoose.Types.ObjectId(merchantId), 
                type: "SALE",
                createdAt: { $gte: startOfToday } 
            } 
        },
        { $group: { _id: null, total: { $sum: "$financials.grandTotal" } } }
    ]);
    return stats[0]?.total || 0;
};

// 🧍 Top Customers (By spending)
const getTopCustomers = async (merchantId, limit = 5) => {
    const mId = new mongoose.Types.ObjectId(merchantId);
    
    const shoppers = await Transaction.aggregate([
        { $match: { mId, type: "SALE" } },
        {
            $group: {
                _id: "$customerId",
                customerModel: { $first: "$customerModel" },
                totalSpent: { $sum: "$financials.grandTotal" },
                ordersCount: { $sum: 1 }
            }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: limit }
    ]);

    // Populate customer names (Manual + Registered)
    const populated = await Promise.all(shoppers.map(async (shop) => {
        let name = "Unknown Customer";
        if (shop.customerModel === "User") {
            const user = await User.findById(shop._id).select("fullname");
            name = user?.fullname || name;
        } else {
            const customer = await Customer.findById(shop._id).select("name");
            name = customer?.name || name;
        }
        return { ...shop, name };
    }));

    return populated;
};

// 🧱 Top Products (By unit sales)
const getTopProducts = async (merchantId, limit = 5) => {
    return await Transaction.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId), type: "SALE" } },
        { $unwind: "$items" },
        { 
            $group: { 
                _id: "$items.productId", 
                name: { $first: "$items.name" }, 
                unitsSold: { $sum: "$items.quantity" },
                revenue: { $sum: "$items.subtotal" }
            } 
        },
        { $sort: { unitsSold: -1 } },
        { $limit: limit }
    ]);
};

// 📓 Unified Ledger Summary (Total outstanding balance from Customers)
const getKhataSummary = async (merchantId) => {
    const stats = await Customer.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
        { 
            $group: { 
                _id: null, 
                totalBalance: { $sum: "$balance" },
                customerCount: { $sum: 1 } 
            } 
        }
    ]);
    return {
        totalOutstanding: stats[0]?.totalBalance || 0,
        activeAccounts: stats[0]?.customerCount || 0
    };
};

// 📦 Low Stock Count
const getLowStockCount = async (merchantId) => {
    return await Product.countDocuments({
        merchantId,
        $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    });
};

export {
    getTotalSalesValue,
    getTotalOrdersCount,
    getTodayRevenue,
    getTopCustomers,
    getTopProducts,
    getKhataSummary,
    getLowStockCount
};
