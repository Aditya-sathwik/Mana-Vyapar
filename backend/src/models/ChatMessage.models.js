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
    messageType: {
      type: String,
      enum: ["TEXT", "IMAGE", "VIDEO", "FILE", "AUDIO"],
      default: "TEXT",
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
    status: {
      type: String,
      enum: ["PENDING", "SENT", "DELIVERED", "READ"],
      default: "SENT",
    },
    readAt: {
      type: Date,
      default: null,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },

  },
  { timestamps: true }
);

chatMessageSchema.index({ roomId: 1, createdAt: -1 });


export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
