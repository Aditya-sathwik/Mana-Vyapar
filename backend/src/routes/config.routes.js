import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upsertConfig } from "../services/config.service.js";

const router = Router();

// Secure all config routes to Super Admins only
router.use(verifyJWT, authorizeRoles("Admin"));

/**
 * @route POST /admin/config
 * @description Save a new JSON config blob (Tier or Global)
 */
router.post("/", asyncHandler(async (req, res) => {
    const { key, group, config, description } = req.body;
    
    const result = await upsertConfig(key, group, config, req.user._id);
    
    return res.status(200).json(
        new ApiResponse(200, result, "Configuration updated successfully")
    );
}));

export default router;
