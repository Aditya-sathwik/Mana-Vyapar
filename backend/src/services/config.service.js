import { DynamicConfig } from "../models/DynamicConfig.models.js";

/**
 * getResolvedConfig: Merges global platform defaults with tier-specific 
 * and merchant-specific configuration overrides.
 */
export const getResolvedConfig = async (merchantTier, merchantId) => {
    // 1. 🌍 Fetch Global Defaults
    const globalConfig = await DynamicConfig.findOne({ group: "GLOBAL" });
    
    // 2. 🎁 Fetch Tier-Specific Overrides (FREE, PRO, ENTERPRISE)
    const tierConfig = await DynamicConfig.findOne({ group: `TIER_${merchantTier}` });

    // 3. 🧍 Optional: Fetch Merchant-Specific Overrides
    const merchantOverride = await DynamicConfig.findOne({ 
        group: "MERCHANT_SPECIFIC", 
        key: `MERCHANT_${merchantId}` 
    });

    // 4. 🧬 Merge in order of priority (Merchant > Tier > Global)
    const resolved = {
        ...(globalConfig?.config || {}),
        ...(tierConfig?.config || {}),
        ...(merchantOverride?.config || {}),
    };

    return resolved;
};

/**
 * createOrUpdateConfig: Helper to seed/update config blobs via admin flow.
 */
export const upsertConfig = async (key, group, config, userId) => {
    return await DynamicConfig.findOneAndUpdate(
        { key },
        { 
            $set: { config, group, lastUpdateBy: userId } 
        },
        { upsert: true, new: true }
    );
};
