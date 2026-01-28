import { ApiError } from "../utlis/apierror.js";

/**
 * Central error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error caught in middleware:", err);
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
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
