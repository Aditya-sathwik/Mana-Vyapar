import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as DashboardService from "../services/dashboard.service.js";
import * as storeService from "../services/store.service.js";

/**
 * Summary API: Returns all key metrics in one go (Best for home screen)
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
    const merchantId = req.user._id;

    // Fetch store details to avoid hardcoded UI labels
    let storeInfo = { 
        name: "Mana Vyapar Store", 
        storeId: "MV-000",
        marketRank: "TOP 5%", // Serve via API
        revenueGrowth: 12.4   // Serve via API
    };
    try {
        const store = await storeService.getStoreByOwnerId(merchantId);
        if (store) {
            storeInfo.name = store.name;
            storeInfo.storeId = store.slug.toUpperCase();
        }
    } catch (error) {
        storeInfo.name = req.user.businessName || "My Store";
    }

    const [totalSales, totalOrders, todayRevenue, topProducts, topCustomers, khataSummary, lowStockCount] = await Promise.all([
        DashboardService.getTotalSalesValue(merchantId),
        DashboardService.getTotalOrdersCount(merchantId),
        DashboardService.getTodayRevenue(merchantId),
        DashboardService.getTopProducts(merchantId),
        DashboardService.getTopCustomers(merchantId),
        DashboardService.getKhataSummary(merchantId),
        DashboardService.getLowStockCount(merchantId)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            storeInfo,
            totalSales,
            totalOrders,
            todayRevenue,
            topProducts,
            topCustomers,
            khataSummary,
            lowStockCount
        }, "Dashboard summary fetched successfully")
    );
});

/**
 * Individual Metric APIs
 */
const getSalesValue = asyncHandler(async (req, res) => {
    const value = await DashboardService.getTotalSalesValue(req.user._id);
    return res.status(200).json(new ApiResponse(200, { value }, "Total sales value fetched"));
});

const getOrdersCount = asyncHandler(async (req, res) => {
    const count = await DashboardService.getTotalOrdersCount(req.user._id);
    return res.status(200).json(new ApiResponse(200, { count }, "Total orders count fetched"));
});

const getTodaySales = asyncHandler(async (req, res) => {
    const value = await DashboardService.getTodayRevenue(req.user._id);
    return res.status(200).json(new ApiResponse(200, { value }, "Today's sales revenue fetched"));
});

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await DashboardService.getTopProducts(req.user._id);
    return res.status(200).json(new ApiResponse(200, products, "Top products list fetched"));
});

const getTopCustomers = asyncHandler(async (req, res) => {
    const customers = await DashboardService.getTopCustomers(req.user._id);
    return res.status(200).json(new ApiResponse(200, customers, "Top customers list fetched"));
});

export {
    getDashboardSummary,
    getSalesValue,
    getOrdersCount,
    getTodaySales,
    getTopProducts,
    getTopCustomers
};
