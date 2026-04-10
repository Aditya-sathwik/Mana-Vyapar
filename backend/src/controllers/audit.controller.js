import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getMerchantAuditLogs } from "../services/audit.service.js";

/**
 * getStoreActivityFeed: API for merchants to see their business activity.
 */
const getStoreActivityFeed = asyncHandler(async (req, res) => {
    const { page, limit, action } = req.query;
    
    const logs = await getMerchantAuditLogs(req.user._id, { page, limit, action });

    return res.status(200).json(
        new ApiResponse(200, logs, "Store activity feed fetched successfully")
    );
});

export { getStoreActivityFeed };
