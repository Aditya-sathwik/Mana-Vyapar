import { Router } from "express";
import {
    createProduct,
    getInventory,
    getProductDetails,
    updateProduct,
    deleteProduct,
    adjustStock
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// All product routes are secured because they belong to a Merchant
router.use(verifyJWT);

router.route("/")
    .get(getInventory)
    .post(upload.fields([{ name: "images", maxCount: 5 }]), createProduct);

router.route("/:productId")
    .get(getProductDetails)
    .patch(updateProduct)
    .delete(deleteProduct);

router.route("/:productId/stock").patch(adjustStock);

export default router;
