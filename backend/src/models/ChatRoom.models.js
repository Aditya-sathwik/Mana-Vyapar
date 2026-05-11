import mongoose, { Schema } from "mongoose";

const chatRoomSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["TICKET", "ORDER", "DIRECT"],
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    metadata: {
      ticketId: { type: Schema.Types.ObjectId, ref: "SupportTicket" },
      orderId: { type: Schema.Types.ObjectId, ref: "Order" },
      merchantId: { type: Schema.Types.ObjectId, ref: "User" },
      customerId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
