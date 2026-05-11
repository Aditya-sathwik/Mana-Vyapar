import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["Admin", "Merchant", "Customer", "Support"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        url: String,
        fileType: String,
        filename: String,
      },
    ],
    isInternal: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
