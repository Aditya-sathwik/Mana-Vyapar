import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    // The specific merchant this coupon belongs to
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Identification (Unique per merchant)
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // Custom configuration
    type: {
      type: String,
      enum: ["FLAT", "PERCENTAGE"],
      required: true,
      default: "FLAT",
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },

    // Constraints & Limits
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number, // Cap for PERCENTAGE coupons
      default: 0,
    },
    // Targeted Rewards (Optional)
    targetCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    // Limit per unique customer
    perCustomerLimit: {
      type: Number,
      default: 1, // Default to once per customer if not specified
    },
    usageLimit: {
      type: Number, // Overall limit for this coupon across all customers
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },

    // Lifecycle
    expiryDate: {
      type: Date,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Metadata
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure merchant doesn't have duplicate codes
couponSchema.index({ merchantId: 1, code: 1 }, { unique: true });

// Helper to check if coupon is valid for a specific amount
couponSchema.methods.isValid = function (orderAmount) {
  const now = new Date();
  
  if (!this.isActive) return false;
  if (this.expiryDate && this.expiryDate < now) return false;
  if (orderAmount < this.minOrderAmount) return false;

  return true;
};

// Helper to calculate discount amount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (this.type === "FLAT") {
    return Math.min(this.value, orderAmount);
  }
  
  const discount = (orderAmount * this.value) / 100;
  
  // Apply max discount cap if it's set and > 0
  if (this.maxDiscountAmount > 0) {
    return Math.min(discount, this.maxDiscountAmount);
  }
  
  return discount;
};

export const Coupon = mongoose.model("Coupon", couponSchema);
