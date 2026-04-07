import express from "express";
import { 
    createStore, 
    getStoreBySlug, 
    updateStoreSettings, 
    getMyStore,
    updateStoreLogo,
    getWebsiteConfig,
    updateWebsiteConfig,
    addSection,
    updateSectionById,
    deleteSectionById,
    reorderSections,
    toggleSectionVisibility,
    deployWebsite
} from "../controllers/store.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Private routes (require authentication)
router.route("/me").get(verifyJWT, getMyStore);
router.route("/").post(verifyJWT, createStore);
router.route("/update").patch(verifyJWT, updateStoreSettings);
router.route("/logo").patch(verifyJWT, upload.single("logo"), updateStoreLogo);

// ===== Website Builder Routes =====
router.route("/website").get(verifyJWT, getWebsiteConfig);
router.route("/website").patch(verifyJWT, updateWebsiteConfig);
router.route("/website/sections").post(verifyJWT, addSection);
router.route("/website/sections/reorder").patch(verifyJWT, reorderSections);
router.route("/website/sections/:sectionId").patch(verifyJWT, updateSectionById);
router.route("/website/sections/:sectionId").delete(verifyJWT, deleteSectionById);
router.route("/website/sections/:sectionId/toggle").patch(verifyJWT, toggleSectionVisibility);
router.route("/website/deploy").post(verifyJWT, deployWebsite);

// Public route to fetch store details using slug 
// Must be PLACED AT THE VERY END so it acts as a dynamic fallback and doesn't intercept specific routes like /website
router.route("/:slug").get(getStoreBySlug);

export default router;
