import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    // Authentication fields
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },

    // Role-based access
    role: {
      type: String,
      enum: ["Super Admin", "Merchant", "Customer"],
      required: true,
      default: "Merchant",
    },

    // Common profile fields
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary URL
    },
    coverimage: {
      type: String, // Cloudinary URL
    },
    phone: {
      type: String,
      trim: true,
    },

    // Merchant-specific fields (only required if role is Merchant)
    businessName: {
      type: String,
      trim: true,
    },
    businessAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: "India" },
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // WhatsApp Business Automation Config
    whatsappBusinessNumber: {
      type: String,
      trim: true,
    },
    whatsappSettings: {
      automatedReplies: {
        type: Boolean,
        default: false,
      },
      welcomeMessage: {
        type: String,
        default: "Welcome to our store! How can we help you today?",
      },
      orderConfirmationEnabled: {
        type: Boolean,
        default: true,
      },
    },

    // 🎨 Branding & Customization (For SaaS support)
    branding: {
        primaryColor: { type: String, default: "#6366f1" }, // Default Indigo
        secondaryColor: { type: String, default: "#f43f5e" }, // Default Rose
        logo: { type: String }, // Shop Logo URL
        fontFamily: { type: String, default: "Inter, sans-serif" },
        socialLinks: {
            website: String,
            instagram: String,
            facebook: String,
        }
    },

    // ⚙️ Shop Settings
    settings: {
        currency: { type: String, default: "INR" },
        invoicePrefix: { type: String, default: "MV" },
        taxRate: { type: Number, default: 0 },
        lowStockAlert: { type: Boolean, default: true },
    },


    // Subscription & Tiering (For Dynamic Config)
    tier: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE",
      index: true,
    },

    // Subscription reference
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Customer association (only for Customer role)
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // CRM / Insights tracking for customers
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
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
