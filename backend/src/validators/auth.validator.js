import Joi from "joi";

/**
 * registerSchema: Validates a new user (Merchant/Customer).
 */
export const registerSchema = Joi.object({
    fullname: Joi.string().required().min(3).max(50),
    email: Joi.string().email().optional().lowercase(),
    password: Joi.string().required().min(6),
    phone: Joi.string().required().regex(/^[0-9]{10}$/).message("Phone number must be exactly 10 digits"),
    role: Joi.string().valid("Merchant", "Customer", "Admin").default("Customer"),
    businessCategory: Joi.string().optional().default("General"),
    storeName: Joi.string().when("role", { 
        is: "Merchant", 
        then: Joi.required(), 
        otherwise: Joi.optional() 
    })
});

/**
 * loginSchema: Validates login credentials.
 */
export const loginSchema = Joi.object({
    email: Joi.string().optional(),
    username: Joi.string().optional(),
    phone: Joi.string().optional(),
    password: Joi.string().required()
}).or('email', 'username', 'phone');
