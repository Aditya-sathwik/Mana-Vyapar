import { ApiError } from "../utils/ApiError.js";

/**
 * validate: A generic middleware to validate req.body against a Joi schema.
 * @param {import('joi').ObjectSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { 
        abortEarly: false, // Return all errors, not just the first one
        allowUnknown: true, // Allow fields not in the schema (e.g. CSRF tokens)
        stripUnknown: true // Remove fields not in the schema
    });

    if (error) {
        const errorDetails = error.details.map(detail => detail.message).join(", ");
        throw new ApiError(400, `Validation Error: ${errorDetails}`);
    }

    next();
};
