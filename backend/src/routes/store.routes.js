import express from "express";
import { 
    createStore, 
    getStoreBySlug, 
    updateStoreSettings, 
    getMyStore 
} from "../controllers/store.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route to fetch store details using slug
router.route("/:slug").get(getStoreBySlug);

// Private routes (require authentication)
router.use(verifyJWT);

router.route("/").post(createStore);
router.route("/me").get(getMyStore);
router.route("/update").patch(updateStoreSettings);

export default router;
