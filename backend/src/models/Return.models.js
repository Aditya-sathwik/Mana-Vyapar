import mongoose, { Schema } from "mongoose";

const returnSchema = new Schema(
  {
    // Return identification
    returnNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // References
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Product being returned
    productId: {
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

    // Return details
    reason: {
      type: String,
      required: true,
      enum: [
        "Damaged",
        "Defective",
        "Wrong Item",
        "Quality Issue",
        "Not as Described",
        "Changed Mind",
        "Other",
      ],
    },
    reasonDescription: {
      type: String,
      trim: true,
    },

    // Photo evidence (especially for damaged goods)
    photos: [
      {
        url: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],

    // Customer information
    customerName: {
      type: String,
      required: true,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
    },

    // Return status
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected", "Completed"],
      default: "Pending",
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
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // Refund information
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Credit to Khata", "Replacement", "Not Applicable"],
    },
    refundStatus: {
      type: String,
      enum: ["Pending", "Processed", "Completed", "Not Applicable"],
      default: "Pending",
    },
    refundDate: {
      type: Date,
    },

    // Replacement tracking
    replacementOrderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    // Internal notes
    internalNotes: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },

    // Pickup/Return logistics
    pickupScheduled: {
      type: Boolean,
      default: false,
    },
    pickupDate: {
      type: Date,
    },
    returnReceived: {
      type: Boolean,
      default: false,
    },
    returnReceivedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
returnSchema.index({ merchantId: 1, status: 1 });
returnSchema.index({ orderId: 1 });
returnSchema.index({ createdAt: -1 });

// Pre-save hook to generate return number
returnSchema.pre("save", async function (next) {
  if (this.isNew && !this.returnNumber) {
    const count = await mongoose.model("Return").countDocuments();
    this.returnNumber = `RET${Date.now()}${count + 1}`;
  }
  next();
});

// Method to update return status
returnSchema.methods.updateStatus = function (newStatus, note = "", updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy,
  });
  return this.save();
};

// Method to approve return
returnSchema.methods.approve = function (refundAmount, refundMethod, note = "") {
  this.status = "Approved";
  this.refundAmount = refundAmount;
  this.refundMethod = refundMethod;
  this.statusHistory.push({
    status: "Approved",
    timestamp: new Date(),
    note,
  });
  return this.save();
};

// Method to reject return
returnSchema.methods.reject = function (reason) {
  this.status = "Rejected";
  this.rejectionReason = reason;
  this.statusHistory.push({
    status: "Rejected",
    timestamp: new Date(),
    note: reason,
  });
  return this.save();
};

export const Return = mongoose.model("Return", returnSchema);
