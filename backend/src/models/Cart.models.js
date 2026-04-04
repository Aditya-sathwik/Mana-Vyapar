import mongoose, { Schema } from "mongoose";

/**
 * Cart Model: Persistent shopper cart logic. 
 * Allows abandoned cart tracking and cross-device shopping for Mana-Vyapar customers.
 */
const cartSchema = new Schema(
  {
    // The shopper (Resident customer or registered User)
    customerId: {
      type: Schema.Types.ObjectId,
      refPath: "customerModel", // Can point to 'User' or 'Customer'
      required: true,
      index: true,
    },
    customerModel: {
      type: String,
      required: true,
      enum: ["User", "Customer"],
      default: "User",
    },

    // The store the shopper is currently buying from
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // Price at the time it was added
        subtotal: { type: Number, required: true },
      }
    ],

    totalItems: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Ensuring one cart per Customer per Merchant (Isolated shopping)
cartSchema.index({ customerId: 1, merchantId: 1 }, { unique: true });

export const Cart = mongoose.model("Cart", cartSchema);
