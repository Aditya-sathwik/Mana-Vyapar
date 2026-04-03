import mongoose, { Schema } from "mongoose";
import { Category } from "./Category.models.js";

const productSchema = new Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
      trim: true,
    },

    // Pricing
    originalPrice: {
      type: Number, // The "Compare at" price (strikethrough)
      min: 0,
    },
    sellingPrice: {
      type: Number, // The actual price the customer pays
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number, // For profit calculation (merchant cost)
      min: 0,
    },
    discount: {
      type: Number, // Percentage or fixed? User said "discount same like shopify". I'll assume percentage but user can choose.
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Inventory
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },

    // Category hierarchy
    category: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    }],

    // Custom units (kg, inch, bundle, etc.)
    unit: {
      type: String,
      required: true,
      default: "piece",
      trim: true,
    },
    unitValue: {
      type: Number, // e.g., 1 kg, 12 inches
      default: 1,
    },

    // Product images
    images: [
      {
        url: String,
        altText: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // AI/Automation features
    isWhatsappSynced: {
      type: Boolean,
      default: false,
    },
    aiTags: [
      {
        type: String,
        trim: true,
      },
    ],
    visionConfidence: {
      type: Number, // AI confidence score for product recognition
      min: 0,
      max: 100,
    },
    lastAiScan: {
      type: Date,
    },

    // Merchant reference
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Product status
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Additional metadata
    barcode: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
productSchema.index({ merchantId: 1, category: 1 });
productSchema.index({ merchantId: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text", aiTags: "text" }); // Text search

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "Out of Stock";
  if (this.stock <= this.lowStockThreshold) return "Low Stock";
  return "In Stock";
});

// Method to check if product is low on stock
productSchema.methods.isLowStock = function () {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
};

// Method to update stock
productSchema.methods.updateStock = function (quantity, operation = "add") {
  if (operation === "add") {
    this.stock += quantity;
  } else if (operation === "subtract") {
    this.stock = Math.max(0, this.stock - quantity);
  }
  return this.save();
};

export const Product = mongoose.model("Product", productSchema);
