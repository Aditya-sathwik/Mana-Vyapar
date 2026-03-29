import express from "express";
import { 
    createStore, 
    getStoreBySlug, 
    updateStoreSettings, 
    getMyStore,
    updateStoreLogo
} from "../controllers/store.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Private routes (require authentication)
router.use(verifyJWT);

router.route("/").post(createStore);
router.route("/me").get(getMyStore);
router.route("/update").patch(updateStoreSettings);
router.route("/logo").patch(upload.single("logo"), updateStoreLogo);

// Public route to fetch store details using slug (Place after specific routes)
router.route("/:slug").get(getStoreBySlug);

export default router;
