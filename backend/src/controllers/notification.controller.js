import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/Notification.models.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * getMyNotifications: Fetch all notifications for the logged-in user.
 */
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);

    return res.status(200).json(
        new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});

/**
 * markAsRead: Mark a specific notification as read.
 */
const markAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: req.user._id },
        { $set: { isRead: true } },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    );
});

/**
 * markAllAsRead: Mark all notifications for the current user as read.
 */
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "All notifications marked as read")
    );
});

/**
 * deleteNotification: Remove a notification.
 */
const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const result = await Notification.findOneAndDelete({
        _id: notificationId,
        user: req.user._id
    });

    if (!result) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Notification deleted successfully")
    );
});

export {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
