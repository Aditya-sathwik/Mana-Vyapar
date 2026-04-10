import mongoose, { Schema } from "mongoose";

const dynamicCollectionSchema = new Schema(
  {
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
    },
    description: {
      type: String,
      trim: true,
    },
    // The actual array of JSON documents
    data: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Useful for Postman/API metadata
    meta: {
      tags: [String],
      version: { type: Number, default: 1 },
    },
  },
  {
    timestamps: true,
  }
);


export const DynamicCollection = mongoose.model(
  "DynamicCollection",
  dynamicCollectionSchema
);
