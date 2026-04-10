import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT); // Secure all routes

router.route("/").get(getMyNotifications);
router.route("/mark-all-read").post(markAllAsRead);
router.route("/:notificationId").patch(markAsRead).delete(deleteNotification);

export default router;
