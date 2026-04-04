import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    // Order identification
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Merchant reference
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Customer association (replaces raw strings where possible)
    customerId: {
      type: Schema.Types.ObjectId,
      refPath: "customerModel",
      index: true,
    },
    customerModel: {
      type: String,
      enum: ["Customer", "User"],
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
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
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },

    // Order source tracking
    trackingNumber: {
      type: String,
      trim: true
    },
    returnReason: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      enum: ["WhatsApp", "Vision AI Scan", "Manual"],
      required: true,
      default: "Manual",
    },

    // WhatsApp specific fields
    whatsappConversationId: {
      type: String,
      trim: true,
    },
    whatsappMessageId: {
      type: String,
      trim: true,
    },

    // Vision AI specific fields
    visionScanId: {
      type: String,
      trim: true,
    },
    scanImageUrl: {
      type: String,
    },

    // Order items
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
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
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharges: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "PLACED", 
        "CONFIRMED", 
        "PROCESSING", 
        "SHIPPED", 
        "DELIVERED", 
        "CANCELLED",
        "RETURN_REQUESTED", // 🔄 New
        "RETURNED"        // 🔄 New
      ],
      default: "PLACED",
      index: true,
    },
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],

    // Payment
    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "KHATA", "OTHER"],
      default: "CASH",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "PARTIAL", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paidAmount: {
      type: Number,
      default: 0,
    },

    // Delivery tracking
    expectedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },

    // Notes
    customerNotes: {
      type: String,
    },
    internalNotes: {
      type: String,
    },

    // Finalized Transaction Reference
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
orderSchema.index({ merchantId: 1, status: 1 });
orderSchema.index({ merchantId: 1, createdAt: -1 });

// Pre-save hook to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

// Pre-save hook to calculate totals
orderSchema.pre("save", function (next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => {
    item.subtotal = item.quantity * item.price;
    return sum + item.subtotal;
  }, 0);

  // Calculate total amount
  this.totalAmount = this.subtotal + this.tax + this.deliveryCharges - this.discount;

  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus, note = "") {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
  });
  return this.save();
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  return ["Pending", "Confirmed"].includes(this.status);
};

export const Order = mongoose.model("Order", orderSchema);
