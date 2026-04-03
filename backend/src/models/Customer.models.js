import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    // The specific merchant this customer belongs to
    // This allows the same phone number to exist for multiple merchants
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Basic Contact info
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Physical context
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },

    // CRM / Insights tracking (Single source of truth for customer habits)
    stats: {
      totalOrders: {
        type: Number,
        default: 0,
      },
      totalSpent: {
        type: Number,
        default: 0,
      },
      lastVisitDate: {
        type: Date,
      },
      averageOrderValue: {
        type: Number,
        default: 0,
      },
      preferredPaymentMethod: {
        type: String,
        enum: ["CASH", "UPI", "CARD", "KHATA"],
      },
    },

    // Business Logic fields
    tags: [String], // e.g. "VIP", "Frequent", "Credit-Blocked"
    isActive: {
      type: Boolean,
      default: true,
    },

    // Notes for the merchant
    internalNotes: {
      type: String,
    },

    // Optional link to Khata if they have a credit account
    khataId: {
      type: Schema.Types.ObjectId,
      ref: "Khata",
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Compound index ensures a merchant can't have two customers with the same phone,
// but two different merchants CAN have a customer with the same phone.
customerSchema.index({ merchantId: 1, phone: 1 }, { unique: true });

// Optimize for common queries
customerSchema.index({ merchantId: 1, "stats.totalSpent": -1 });
customerSchema.index({ merchantId: 1, lastVisitDate: -1 });

// Virtual to see if customer is a "Khata" customer
customerSchema.virtual("isKhataCustomer").get(function () {
  return !!this.khataId;
});

export const Customer = mongoose.model("Customer", customerSchema);
