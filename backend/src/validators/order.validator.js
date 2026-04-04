import Joi from "joi";

/**
 * orderSchema: Validates a new order.
 */
export const orderSchema = Joi.object({
    merchantId: Joi.string().required(),
    customerId: Joi.string().optional(),
    customerModel: Joi.string().valid("User", "Customer").default("User"),
    customerName: Joi.string().required(),
    customerPhoneNumber: Joi.string().required().regex(/^[0-9]{10}$/),
    customerEmail: Joi.string().email().optional(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().required().min(1).max(100),
        })
    ).required().min(1),
    paymentMethod: Joi.string().valid("CASH", "UPI", "CARD", "KHATA", "OTHER").default("CASH"),
    deliveryAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        landmark: Joi.string().optional(),
    }).optional(),
    customerNotes: Joi.string().allow("").optional(),
});
