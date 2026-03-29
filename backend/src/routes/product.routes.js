import { Router } from "express";
import {
    createProduct,
    getInventory,
    getProductDetails,
    updateProduct,
    deleteProduct,
    adjustStock,
    getStoreProducts
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/** 🌐 Public Route: Storefront Browsing (No Auth) **/
router.route("/store/:slug").get(getStoreProducts);

/** 🔐 Private Routes: Merchant Dashboard (Requires Auth) **/
router.use(verifyJWT);

router.route("/")
    .get(getInventory)
    .post(upload.fields([{ name: "images", maxCount: 5 }]), createProduct);

router.route("/:productId")
    .get(getProductDetails)
    .patch(upload.fields([{ name: "images", maxCount: 5 }]), updateProduct)
    .delete(deleteProduct);

router.route("/:productId/stock").patch(adjustStock);

export default router;
