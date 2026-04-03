import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

// Routes import
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import khataRouter from "./routes/khata.routes.js";
import storeRouter from "./routes/store.routes.js";
import categoryRouter from "./routes/category.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

// Routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/khata', khataRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/transactions', transactionRouter);

// Error Handler Middleware (must be last)
app.use(errorHandler);

export { app };