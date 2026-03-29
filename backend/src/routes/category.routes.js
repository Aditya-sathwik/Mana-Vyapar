import express from "express";
import { 
    addCategory, 
    getTree, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

/** 🌐 Public Routes (Storefront) **/
// Get the entire recursive tree for a specific store - Open to all
router.route("/tree/:storeId").get(getTree);

// Fetch all categories for a store - Open to all (for storefront filters)
router.route("/all/:storeId").get(getCategories);

/** 🔐 Private Routes (Merchant Dashboard) **/
// Everything below this line requires authentication
router.use(verifyJWT);

// Create a new category for a store - Merchant only
router.route("/:storeId").post(addCategory);

// Manage specific categories (Update/Delete) - Merchant only
router.route("/:storeId/:categoryId")
    .patch(updateCategory)
    .delete(deleteCategory);

export default router;
