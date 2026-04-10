import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    // High-level identification
    transactionNumber: {
      type: String,
      unique: true,
      default: function() {
        const random = Math.floor(1000 + Math.random() * 9000);
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `TRX-${dateStr}-${random}`;
      },
      required: true,
      index: true,
    },

    // Business context
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Customer association
    // Direct link to the merchant's customer list
    customerId: {
      type: Schema.Types.ObjectId,
      refPath: "customerModel",
      index: true,
    },
    customerModel: {
      type: String,
      required: true,
      enum: ["Customer", "User"],
      default: "Customer"
    },

    // Link to Khata for credit/debit tracking, or stays null for anonymous walk-ins
    khataId: {
      type: Schema.Types.ObjectId,
      ref: "Khata",
      index: true,
    },

    // 💡 Link back to the original order (if any)
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },

    // Snapshot of non-khata customer info for records
    customerInfo: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },

    // The Line Items (The heart of the sale)
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        sku: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unit: {
          type: String,
          default: "piece",
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        discount: {
          type: Number,
          default: 0,
          min: 0,
        },
        tax: {
          type: Number,
          default: 0,
          min: 0,
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Financial calculations
    financials: {
      subtotal: {
        type: Number,
        required: true,
        default: 0,
      },
      totalDiscount: {
        type: Number,
        default: 0,
      },
      totalTax: {
        type: Number,
        default: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
        default: 0,
      },
      roundOff: {
        type: Number,
        default: 0,
      },
      couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },
      couponCode: {
        type: String,
      },
    },

    // Payment fulfillment
    payment: {
      method: {
        type: String,
        enum: ["CASH", "UPI", "CARD", "KHATA", "WHATSAPP", "MULTIPLE"],
        required: true,
        default: "CASH",
      },
      status: {
        type: String,
        enum: ["PAID", "PARTIAL", "UNPAID"],
        required: true,
        default: "PAID",
      },
      paidAmount: {
        type: Number,
        required: true,
        default: 0,
      },
      balanceAmount: {
        type: Number, // Amount moved to customer's Khata/Credit
        default: 0,
      },
      // Detail for multi-mode payments
      splits: [
        {
          method: String,
          amount: Number,
          ref: String, // Transaction ID from UPI/Card
        },
      ],
    },

    // Transaction lifecycle
    type: {
      type: String,
      enum: ["SALE", "RETURN", "EXCHANGE", "ADJUSTMENT", "VOID", "REFUND"],
      default: "SALE",
      index: true,
    },
    
    // Notes & Metadata
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: [String],
    
    // For Vision AI / Bulk imports
    source: {
      type: String,
      enum: ["POS", "VISION_SCAN", "WHATSAPP", "BULK_IMPORT"],
      default: "POS",
    },
  },
  {
    timestamps: true,
  }
);

// Performance Indexes
transactionSchema.index({ merchantId: 1, createdAt: -1 });
transactionSchema.index({ merchantId: 1, type: 1 });
transactionSchema.index({ "payment.method": 1 });



// Auto-calculate financial summaries before saving
transactionSchema.pre("save", function (next) {
  this.financials.subtotal = this.items.reduce((sum, item) => {
    item.subtotal = (item.quantity * item.price) - item.discount + item.tax;
    return sum + (item.quantity * item.price);
  }, 0);

  this.financials.totalDiscount = this.items.reduce((sum, item) => sum + item.discount, 0);
  this.financials.totalTax = this.items.reduce((sum, item) => sum + item.tax, 0);
  
  const rawTotal = this.financials.subtotal - this.financials.totalDiscount + this.financials.totalTax;
  this.financials.grandTotal = Math.round(rawTotal);
  this.financials.roundOff = this.financials.grandTotal - rawTotal;

  // Determine balance to be pushed to Khata if payment method is KHATA
  if (this.payment.method === "KHATA") {
      this.payment.balanceAmount = this.financials.grandTotal - this.payment.paidAmount;
      this.payment.status = this.payment.paidAmount === 0 ? "UNPAID" : "PARTIAL";
  }

  next();
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
