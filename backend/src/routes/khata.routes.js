import { Router } from "express";
import {
    createCustomer,
    getKhataList,
    getCustomerDetails,
    performTransaction,
    deleteCustomer
} from "../controllers/khata.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .get(getKhataList)
    .post(createCustomer);

router.route("/:khataId")
    .get(getCustomerDetails)
    .delete(deleteCustomer);

router.route("/:khataId/transaction").post(performTransaction);

export default router;
