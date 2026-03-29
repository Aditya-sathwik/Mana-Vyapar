import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    // 🧠 The magic happens here:
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category", // Refer back to this same model!
        default: null // Null means it's a Top-Level category like "Electronics"
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },
    image: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure a merchant cannot have two categories with the same name at the same level
categorySchema.index({ name: 1, parentCategory: 1, storeId: 1 }, { unique: true });

export const Category = mongoose.model("Category", categorySchema);
