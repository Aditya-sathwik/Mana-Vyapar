import { ApiError } from "../utlis/apierror.js";
import { asyncHandler } from "../utlis/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

/**
 * optionalJWT: Middleware to populate req.user if token is present, but doesn't fail if not.
 */
export const optionalJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (token) {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            if (user) req.user = user;
        }
        next()
    } catch (error) {
        // Fail silently but proceed (user remains null)
        next()
    }
})

/**
 * authorizeRoles: Middleware to restrict access based on user role.
 */
export const authorizeRoles = (...roles) => {
    return (req, _, next) => {
        if (!roles.includes(req.user?.role)) {
            throw new ApiError(403, `Access denied: Role '${req.user?.role}' is not authorized.`);
        }
        next();
    };
};
