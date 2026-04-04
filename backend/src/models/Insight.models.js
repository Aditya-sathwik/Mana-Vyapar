import mongoose, { Schema } from "mongoose";

/**
 * Insight Model: Stores daily/weekly snapshots of merchant performance.
 * This makes the dashboard load instantly without recalculating millions of rows.
 */
const insightSchema = new Schema(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    // 💰 Financial Highlights
    financials: {
      totalRevenue: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      aov: { type: Number, default: 0 }, // Average Order Value
      todayRevenue: { type: Number, default: 0 },
    },

    // 🧍 Top Customers (Dynamic snapshots)
    topCustomers: [
      {
        name: String,
        phone: String,
        totalSpent: Number,
        totalOrders: Number,
        lastTransactionDate: Date,
      }
    ],

    // 📈 Popular Inventory
    fastMovingProducts: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        totalSold: Number,
        revenue: Number,
      }
    ],

    // ⚠️ Stock Alerts
    lowStockItems: [
      {
        name: String,
        stock: Number,
        threshold: Number,
      }
    ],

    // 📊 Revenue Trends (Dynamic analytics)
    revenueTrend: [ { date: String, amount: Number } ],
    weeklyRevenueTrend: [ { week: String, amount: Number } ], 
    monthlyRevenueTrend: [ { month: String, amount: Number } ],

    // 🧍 Advanced Customer Analytics (CLV)
    customerSegments: {
      loyalCount: { type: Number, default: 0 }, // Top 5% by orders
      highValueCount: { type: Number, default: 0 }, // Top 5% by spent
      atRiskCount: { type: Number, default: 0 }, // No visit in 60 days
      newCount: { type: Number, default: 0 }, // Last 15 days
    },

    // 🔮 Intelligence (Basic prediction logic)
    demandPredictions: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        currentStock: Number,
        predictedOutDate: Date, // Simplified "velocity check"
        status: { type: String, enum: ["HEALTHY", "RESTOCK_SOON", "CRITICAL"], default: "HEALTHY" }
      }
    ],

    lastCalculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensuring one insight record per merchant (which we update frequently)
insightSchema.index({ merchantId: 1, updatedAt: -1 });

export const Insight = mongoose.model("Insight", insightSchema);
