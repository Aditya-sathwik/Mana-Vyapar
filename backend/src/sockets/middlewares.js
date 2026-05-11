import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";

/**
 * Socket.io Authentication Middleware
 */
export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");
        
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        
        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }

        socket.user = user;
        next();
    } catch (err) {
        console.error("Socket Auth Error:", err.message);
        next(new Error("Authentication error: Invalid token"));
    }
};
