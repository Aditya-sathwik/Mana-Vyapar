import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/ratelimit.middleware.js";

const app = express();

// Middlewares
// Dynamic CORS to support multi-tenant local subdomains (*.lvh.me)
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps/curl)
        if (!origin) return callback(null, true);

        const allowedPatterns = [
            /^http:\/\/localhost:\d+$/,
            /^http:\/\/.*\.lvh\.me:\d+$/
        ];

        const isAllowed = allowedPatterns.some(pattern => pattern.test(origin)) ||
            origin === process.env.CORS_ORIGIN;

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`🚫 [CORS]: Blocked Origin -> ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

// 🛡️ Global Rate Limiting
app.use("/api", apiLimiter);

// Routes import
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import khataRouter from "./routes/khata.routes.js";
import storeRouter from "./routes/store.routes.js";
import categoryRouter from "./routes/category.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import orderRouter from "./routes/order.routes.js";
import insightRouter from "./routes/insight.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import cartRouter from "./routes/cart.routes.js";
import intelligenceRouter from "./routes/intelligence.routes.js";
import auditRouter from "./routes/audit.routes.js";
import dynamicFormRouter from "./routes/dynamicform.routes.js";
import merchantRouter from "./routes/merchant.routes.js";
import configRouter from "./routes/config.routes.js";
import dynamicDataRouter from "./routes/dynamic.routes.js";
import supportRouter from "./routes/support.routes.js";
import notificationRouter from "./routes/notification.routes.js";

// Routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/khata', khataRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/coupons', couponRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/insights', insightRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/intelligence', intelligenceRouter);
app.use('/api/v1/audit', auditRouter);
app.use('/api/v1/dynamic-forms', dynamicFormRouter);
app.use("/api/v1/merchants", merchantRouter);
app.use("/api/v1/admin/config", configRouter);
app.use("/api/v1/dynamic", dynamicDataRouter);
app.use("/api/v1/support", supportRouter);
app.use("/api/v1/notifications", notificationRouter);

// Error Handler Middleware (must be last)
app.use(errorHandler);

export { app };