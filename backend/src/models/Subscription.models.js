import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    // Plan details
    planType: {
      type: String,
      enum: ["Silver", "Gold"],
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Validity period
    validityDays: {
      type: Number,
      required: true,
      default: 30, // Default to monthly
    },

    // Merchant subscription tracking
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ["Active", "Expired", "Cancelled", "Pending"],
      default: "Pending",
    },

    // Payment tracking
    paymentId: {
      type: String, // Payment gateway transaction ID
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentDate: {
      type: Date,
    },

    // Auto-renewal
    autoRenew: {
      type: Boolean,
      default: false,
    },

    // Features included (optional for future expansion)
    features: [
      {
        name: String,
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
subscriptionSchema.index({ merchantId: 1, status: 1 });
subscriptionSchema.index({ expiryDate: 1 });

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function () {
  return this.status === "Active" && this.expiryDate > new Date();
};

// Method to calculate expiry date
subscriptionSchema.methods.calculateExpiryDate = function () {
  const expiry = new Date(this.startDate);
  expiry.setDate(expiry.getDate() + this.validityDays);
  return expiry;
};

// Pre-save hook to set expiry date
subscriptionSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("startDate") || this.isModified("validityDays")) {
    this.expiryDate = this.calculateExpiryDate();
  }
  next();
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
