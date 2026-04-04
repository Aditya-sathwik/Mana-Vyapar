import mongoose, { Schema } from "mongoose";

/**
 * AuditLog Model: The "Black Box" of Mana-Vyapar.
 * Tracks every critical activity for security, debugging, and fraud detection.
 */
const auditLogSchema = new Schema(
  {
    // The actor who performed the action
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // The context merchant (Useful for merchant-specific audits)
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Standardized action names
    action: {
        type: String,
        required: true,
        enum: [
            "ORDER_CREATED", "ORDER_CONFIRMED", "ORDER_CANCELLED", "ORDER_STATUS_UPDATED",
            "SALE_COMPLETED", "TRANSACTION_VOIDED", "REFUND_PROCESSED",
            "STOCK_UPDATED", "PRODUCT_PRICE_CHANGED",
            "USER_LOGIN", "PASSWORD_CHANGED", "ACCOUNT_UPDATED",
            "COUPON_CREATED", "COUPON_MODIFIED", "COUPON_DELETED"
        ],
        index: true,
    },

    // The resource being affected (e.g. OrderId, TransactionId, ProductId)
    resourceId: {
        type: Schema.Types.ObjectId,
        index: true,
    },
    resourceType: {
        type: String, // "Order", "Transaction", "Product", etc.
    },

    // Flexible metadata for deep debugging (e.g. Old value vs New value)
    metadata: {
        type: Schema.Types.Mixed,
    },

    // Network context for fraud detection
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need record time
  }
);

// High-performance search for latest logs
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
