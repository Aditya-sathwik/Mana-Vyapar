import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to restrict access to Super Admins only.
 * Must be used after verifyJWT middleware.
 */
export const restrictTo = (...roles) => {
    return (req, _, next) => {
        if (!roles.includes(req.user?.role)) {
            throw new ApiError(
                403, 
                `Role: ${req.user?.role} is not allowed to access this resource`
            );
        }
        next();
    };
};
