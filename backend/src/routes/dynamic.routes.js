import { Router } from "express";
import { 
    syncCollection, 
    getAllCollections, 
    getCollectionData, 
    addEntry, 
    deleteEntry 
} from "../controllers/dynamic.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Internal Admin Routes (to manage collections)
// Secured for Super Admins only
router.route("/admin/sync").post(verifyJWT, authorizeRoles("Super Admin"), syncCollection);
router.route("/admin/list").get(verifyJWT, authorizeRoles("Super Admin"), getAllCollections);

// Public/Custom Endpoints (The "Dynamic" part)
// These would typically be used by developers or Postman
router.route("/collection/:slug")
    .get(getCollectionData)
    .post(verifyJWT, addEntry);

router.route("/collection/:slug/:id")
    .delete(verifyJWT, deleteEntry);

export default router;
