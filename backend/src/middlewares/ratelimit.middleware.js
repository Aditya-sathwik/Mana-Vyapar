import { rateLimit } from 'express-rate-limit'

/**
 * apiLimiter: General protection for all API routes.
 * 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window`
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
})

/**
 * authLimiter: Extra security for Login/Register.
 * Brute force protection: 5 attempts per 15 minutes.
 */
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10, // Max 10 login attempts
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many login attempts. Please wait 15 minutes before trying again."
    }
})
