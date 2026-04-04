import { Router } from "express";
import * as TransactionController from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyTransactionOwnership, validateSaleItems } from "../middlewares/transaction.middleware.js";

const router = Router();

// 🔑 All Transaction routes are Merchant-restricted (JWT Protected)
router.use(verifyJWT);

/**
 * @route POST /v1/transactions/sale
 * @description Records a new POS sale and deducts inventory stock.
 */
router.post("/sale", validateSaleItems, TransactionController.executeSale);

/**
 * @route GET /v1/transactions/history
 * @description Fetches logs of all sales for the merchant.
 */
router.get("/history", TransactionController.getHistory);
router.get("/customer-history", TransactionController.getCustomerHistory);

/**
 * @route PATCH /v1/transactions/update/:transactionId
 * @description Allows merchant to update notes/tags on an existing sale.
 */
router.patch("/update/:transactionId", verifyTransactionOwnership, TransactionController.updateMetadata);

/**
 * @route POST /v1/transactions/void/:transactionId
 * @description Formal Cancellation: Marks sale as VOID and reverts inventory stock.
 */
router.post("/void/:transactionId", verifyTransactionOwnership, TransactionController.voidSale);

export default router;
