import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ["ORDER", "PAYMENT", "STOCK", "CUSTOMER", "SYSTEM"],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        metadata: {
            type: Object, // Link to orderId, productId, etc.
            default: {}
        }
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
