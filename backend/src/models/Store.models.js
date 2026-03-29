import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One store per merchant for now
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // Cloudinary URL
    },
    corouselImages: [
      {
        url: { type: String, required: true },
        title: { type: String },
        subtitle: { type: String },
        link: { type: String },
      }
    ],
    theme: {
      primaryColor: {
        type: String,
        default: "#059467", // Default Mana-Vyapar Green
      },
      secondaryColor: {
        type: String,
        default: "#0f172a", // Default Slate
      },
      fontFamily: {
        type: String,
        default: "Inter",
      }
    },
    socialLinks: {
      whatsapp: String,
      instagram: String,
      facebook: String,
      twitter: String,
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },
    categories: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        isActive: { type: Boolean, default: true },
      }
    ],
    openingHours: [
      {
        dayGroup: { type: String, required: true }, // e.g., "Monday - Friday"
        openTime: { type: String, default: "09:00" },
        closeTime: { type: String, default: "21:00" },
        isClosed: { type: Boolean, default: false }
      }
    ],
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-generate slug from name if not provided
storeSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

export const Store = mongoose.model("Store", storeSchema);
