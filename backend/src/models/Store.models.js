import mongoose, { Schema } from "mongoose";

// --- Website Builder: Section Sub-Schema ---
const sectionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "hero",           // Big banner with text & image
        "image_slider",   // Carousel/slideshow
        "featured_products", // Auto-populated products
        "categories_grid",   // Shop by category
        "text_block",     // Simple text/announcement
        "testimonials",   // Customer reviews
        "features_bar",   // Trust badges (Free Delivery etc.)
        "gallery",        // Photo grid
        "faq",            // Accordion FAQ
        "cta",            // Call to Action banner
        "video",          // Embedded video
        "newsletter",     // Email signup
        "countdown",      // Sale countdown timer
      ],
    },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },

    // — Hero / CTA / Text Block fields —
    backgroundImage: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    buttonLink: { type: String, default: "" },
    textContent: { type: String, default: "" },
    alignment: { type: String, enum: ["left", "center", "right"], default: "center" },

    // — Image Slider items —
    slides: [
      {
        imageUrl: { type: String },
        heading: { type: String },
        description: { type: String },
        linkUrl: { type: String },
        linkText: { type: String },
      },
    ],

    // — Features Bar items —
    features: [
      {
        icon: { type: String },   // emoji or icon name
        title: { type: String },
        description: { type: String },
      },
    ],

    // — Testimonials items —
    testimonials: [
      {
        name: { type: String },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        comment: { type: String },
        avatar: { type: String },
      },
    ],

    // — Gallery items —
    images: [
      {
        url: { type: String },
        caption: { type: String },
      },
    ],

    // — FAQ items —
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    // — Video section —
    videoUrl: { type: String, default: "" },

    // — Countdown Timer —
    countdownDate: { type: Date },
    countdownLabel: { type: String, default: "" },

    // — Style overrides per-section —
    backgroundColor: { type: String, default: "" },
    textColor: { type: String, default: "" },
    padding: { type: String, default: "normal" }, // "compact", "normal", "spacious"
  },
  { _id: true }
);

// --- Custom Pages Sub-Schema ---
const customPageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, default: "" },       // Rich text / HTML
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

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
      accentColor: {
        type: String,
        default: "#f59e0b", // Amber accent
      },
      fontFamily: {
        type: String,
        default: "Inter",
      },
      headingFont: {
        type: String,
        default: "Manrope",
      },
      borderRadius: {
        type: String,
        default: "rounded",  // "sharp", "rounded", "pill"
      },
      darkMode: {
        type: Boolean,
        default: false,
      }
    },
    socialLinks: {
      whatsapp: String,
      instagram: String,
      facebook: String,
      twitter: String,
      youtube: String,
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

    // ============ WEBSITE BUILDER FIELDS (LIVE) ============
    sections: [sectionSchema],
    announcementBar: {
      isActive: { type: Boolean, default: false },
      text: { type: String, default: "" },
      link: { type: String, default: "" },
      backgroundColor: { type: String, default: "#059467" },
      textColor: { type: String, default: "#ffffff" },
    },
    footerConfig: {
      copyrightText: { type: String, default: "" },
      showSocialLinks: { type: Boolean, default: true },
      showContactInfo: { type: Boolean, default: true },
      columns: [
        {
          title: { type: String },
          links: [
            {
              label: { type: String },
              url: { type: String },
            },
          ],
        },
      ],
    },
    seoConfig: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
      ogImage: { type: String, default: "" },
      favicon: { type: String, default: "" },
    },

    // ============ WEBSITE BUILDER DRAFT CONFIG ============
    draftConfig: {
      sections: [sectionSchema],
      theme: {
        primaryColor: { type: String, default: "#059467" },
        secondaryColor: { type: String, default: "#0f172a" },
        accentColor: { type: String, default: "#f59e0b" },
        fontFamily: { type: String, default: "Inter" },
        headingFont: { type: String, default: "Manrope" },
        borderRadius: { type: String, default: "rounded" },
        darkMode: { type: Boolean, default: false },
      },
      announcementBar: {
        isActive: { type: Boolean, default: false },
        text: { type: String, default: "" },
        link: { type: String, default: "" },
        backgroundColor: { type: String, default: "#059467" },
        textColor: { type: String, default: "#ffffff" },
      },
      footerConfig: {
        copyrightText: { type: String, default: "" },
        showSocialLinks: { type: Boolean, default: true },
        showContactInfo: { type: Boolean, default: true },
        columns: [{ title: { type: String }, links: [{ label: { type: String }, url: { type: String } }] }],
      },
      seoConfig: {
        metaTitle: { type: String, default: "" },
        metaDescription: { type: String, default: "" },
        keywords: [{ type: String }],
        ogImage: { type: String, default: "" },
        favicon: { type: String, default: "" },
      },
      lastSaved: { type: Date, default: Date.now }
    },

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
