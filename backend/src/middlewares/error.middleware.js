import { ApiError } from "../utils/ApiError.js";

/**
 * Central error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
    const checkStatusCode = err.statusCode || err.status || 500;

    // Only log critical server errors with the hot icon
    if (checkStatusCode >= 500) {
        console.error("🔥 Server Error caught in middleware:", err);
    } else if (checkStatusCode === 404) {
        // Log 404s with trace for debugging
        console.log(`ℹ️  Resource not found [404]: ${req.originalUrl}`);
        console.error("🔍 404 Trace:", err);
    } else {
        console.warn(`⚠️  Client Warning [${checkStatusCode}]: ${err.message}`);
    }

    let error = err;

    if (!(error instanceof ApiError)) {
        // Handle MongoDB Duplicate Key Errors (11000)
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue || {})[0] || "field";
            const message = field === "owner" 
                ? "You already have a store created. One merchant can only have one store." 
                : `Store with this ${field} already exists.`;
            error = new ApiError(409, message);
        } else {
            const statusCode = error.statusCode || 500;
            const message = error.message || "Something went wrong";
            error = new ApiError(statusCode, message, error?.errors || [], err.stack);
        }
    }

    const statusCode = error.statusCode || 500;
    const response = {
        success: false,
        message: error.message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(statusCode).json(response);
};

export { errorHandler };
