import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Insight } from "../models/Insight.models.js";
import * as InsightService from "../services/insight.service.js";

/**
 * @controller getMerchantDashboard
 * @description GET /insights/merchant - Fetches the pre-calculated high-speed snapshot for the merchant's dashboard.
 */
const getMerchantDashboard = asyncHandler(async (req, res) => {
    const merchantId = req.user._id;

    // ⚡ Logic delegated to service layer for fast-fetch and background sync
    const dashboardData = await InsightService.getMerchantDashboardInsights(merchantId);

    return res.status(200).json(
        new ApiResponse(200, dashboardData, "Dashboard snapshot fetched successfully")
    );
});

export {
    getMerchantDashboard
};
