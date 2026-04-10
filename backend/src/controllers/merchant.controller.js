import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * updateStoreBranding: Allows a merchant to customize their shop colors, logo, and fonts.
 */
const updateStoreBranding = asyncHandler(async (req, res) => {
    const { primaryColor, secondaryColor, fontFamily, socialLinks } = req.body;
    
    // Only merchants/admins can do this
    if (req.user.role !== "Merchant" && req.user.role !== "Super Admin") {
        throw new ApiError(403, "Only merchants can update store branding");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                branding: {
                    primaryColor,
                    secondaryColor,
                    fontFamily,
                    socialLinks
                }
            }
        },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, user.branding, "Store branding updated successfully")
    );
});

/**
 * updateStoreSettings: Allows a merchant to update their currency, tax, and inventory settings.
 */
const updateStoreSettings = asyncHandler(async (req, res) => {
    const { currency, invoicePrefix, taxRate, lowStockAlert } = req.body;
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                settings: {
                    currency,
                    invoicePrefix,
                    taxRate,
                    lowStockAlert
                }
            }
        },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, user.settings, "Store settings updated successfully")
    );
});

/**
 * getStorePublicProfile: Allows shoppers to see a shop's branding before they order.
 */
const getStorePublicProfile = asyncHandler(async (req, res) => {
    const { merchantId } = req.params;

    const merchant = await User.findOne({ _id: merchantId, role: "Merchant", isActive: true })
        .select("businessName fullname branding stats businessAddress");

    if (!merchant) {
        throw new ApiError(404, "Store not found or currently inactive");
    }

    return res.status(200).json(
        new ApiResponse(200, merchant, "Store profile fetched successfully")
    );
});

export {
    updateStoreBranding,
    updateStoreSettings,
    getStorePublicProfile
};
