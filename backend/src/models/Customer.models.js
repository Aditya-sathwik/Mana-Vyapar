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

    // 💳 Khata / Ledger Integration (Now part of Customer)
    balance: {
      type: Number,
      default: 0,
      // Positive = Customer owes merchant, Negative = Merchant owes customer
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        transactionId: String,
        date: { type: Date, default: Date.now },
        type: {
          type: String,
          enum: ["Credit", "Debit", "Payment Received", "Payment Made"],
        },
        amount: Number,
        description: String,
        orderId: { type: Schema.Types.ObjectId, ref: "Order" },
        balanceAfter: Number,
        recordedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// khataId is removed as Customer is now the ledger
// customerSchema.index({ merchantId: 1, phone: 1 }, { unique: true }); // Already exists

// Virtual for outstanding amount
customerSchema.virtual("outstandingAmount").get(function () {
  return Math.abs(this.balance);
});

// Methods ported from Khata model
customerSchema.methods.addCredit = function (amount, description, orderId = null, recordedBy = null) {
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  const newBalance = this.balance + amount;
  this.transactions.push({
    transactionId,
    type: "Credit",
    amount,
    description,
    orderId,
    balanceAfter: newBalance,
    recordedBy,
  });
  this.balance = newBalance;
  return this.save();
};

customerSchema.methods.addPayment = function (amount, paymentMethod, description = "Payment received", recordedBy = null) {
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  const newBalance = this.balance - amount;
  this.transactions.push({
    transactionId,
    type: "Payment Received",
    amount,
    description,
    balanceAfter: newBalance,
    recordedBy,
  });
  this.balance = newBalance;
  return this.save();
};

// 🚀 CRITICAL: Unified CRM + Ledger Entity
// Compund index ensures phone number uniqueness per merchant
customerSchema.index({ merchantId: 1, phone: 1 }, { unique: true });
customerSchema.index({ merchantId: 1, balance: -1 });

export const Customer = mongoose.model("Customer", customerSchema);
