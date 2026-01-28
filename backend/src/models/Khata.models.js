import mongoose, { Schema } from "mongoose";

const khataSchema = new Schema(
  {
    // Merchant reference
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Customer information
    customerName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    customerAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    // Current balance
    balance: {
      type: Number,
      default: 0,
      // Positive = Customer owes merchant (Credit given to customer)
      // Negative = Merchant owes customer (Advance payment)
    },

    // Credit limit (optional)
    creditLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Transaction history
    transactions: [
      {
        transactionId: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
          required: true,
        },
        type: {
          type: String,
          enum: ["Credit", "Debit", "Payment Received", "Payment Made"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        description: {
          type: String,
          trim: true,
        },
        // Reference to order if transaction is related to an order
        orderId: {
          type: Schema.Types.ObjectId,
          ref: "Order",
        },
        // Balance after this transaction
        balanceAfter: {
          type: Number,
          required: true,
        },
        // Payment method (for payments)
        paymentMethod: {
          type: String,
          enum: ["Cash", "UPI", "Card", "Bank Transfer", "Other"],
        },
        // Recorded by
        recordedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        // Attachments (receipts, etc.)
        attachments: [
          {
            url: String,
            type: String, // 'receipt', 'invoice', etc.
          },
        ],
      },
    ],

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    blockedReason: {
      type: String,
    },

    // Reminder settings
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    lastReminderSent: {
      type: Date,
    },

    // Notes
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for merchant and customer lookup
khataSchema.index({ merchantId: 1, customerPhoneNumber: 1 }, { unique: true });
khataSchema.index({ merchantId: 1, balance: 1 });

// Virtual for outstanding amount (absolute value)
khataSchema.virtual("outstandingAmount").get(function () {
  return Math.abs(this.balance);
});

// Virtual to check if customer owes money
khataSchema.virtual("hasOutstanding").get(function () {
  return this.balance > 0;
});

// Method to add a credit transaction (customer buys on credit)
khataSchema.methods.addCredit = function (amount, description, orderId = null, recordedBy = null) {
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  const newBalance = this.balance + amount;

  this.transactions.push({
    transactionId,
    date: new Date(),
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

// Method to add a payment (customer pays)
khataSchema.methods.addPayment = function (
  amount,
  paymentMethod,
  description = "Payment received",
  recordedBy = null
) {
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  const newBalance = this.balance - amount;

  this.transactions.push({
    transactionId,
    date: new Date(),
    type: "Payment Received",
    amount,
    description,
    balanceAfter: newBalance,
    paymentMethod,
    recordedBy,
  });

  this.balance = newBalance;
  return this.save();
};

// Method to check if credit limit is exceeded
khataSchema.methods.isCreditLimitExceeded = function () {
  return this.creditLimit > 0 && this.balance > this.creditLimit;
};

// Method to get transaction history for a date range
khataSchema.methods.getTransactionsByDateRange = function (startDate, endDate) {
  return this.transactions.filter((txn) => txn.date >= startDate && txn.date <= endDate);
};

export const Khata = mongoose.model("Khata", khataSchema);
