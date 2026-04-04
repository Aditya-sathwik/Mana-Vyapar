import mongoose, { Schema } from "mongoose";

/**
 * DynamicConfig: High-level system configuration for the SaaS platform.
 * This allows us to toggle features and change UI behavior without code deployments.
 */
const dynamicConfigSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true, // E.g., 'MERCHANT_FEATURES_BASIC' or 'GLOBAL_PLATFORM_CONFIG'
    },
    
    // The actual configuration blob
    config: {
      type: Object,
      required: true,
      default: {},
    },

    // Optional: Grouping (e.g., 'TIER_FREE', 'TIER_PRO', 'SPECIFIC_MERCHANT')
    group: {
      type: String,
      default: "GLOBAL",
      index: true,
    },

    description: String,
    lastUpdateBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

export const DynamicConfig = mongoose.model("DynamicConfig", dynamicConfigSchema);
