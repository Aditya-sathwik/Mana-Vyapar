import { Router } from "express";
import { verifyJWT, optionalJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import {
    createFormBlueprint,
    submitFormResponse,
    listMerchantForms,
    listFormResponses,
    getPublicFormById,
    updateFormBlueprint,
    deleteFormBlueprint
} from "../controllers/dynamicform.controller.js";

const router = Router();

/**
 * @route POST /v1/dynamic-forms/submit/:formId
 * @description Submit a form response (Public / Shopper)
 */
router.post("/submit/:formId", optionalJWT, submitFormResponse);

/**
 * @route GET /v1/dynamic-forms/public/:formId
 * @description Fetch form blueprint for shoppers (No token needed)
 */
router.get("/public/:formId", optionalJWT, getPublicFormById);

// 🔑 All other routes require authentication and Merchant Role
router.use(verifyJWT);
router.use(restrictTo("Merchant"));

/**
 * @route POST /v1/dynamic-forms/create
 * @description Create a new form blueprint
 */
router.post("/create", createFormBlueprint);

/**
 * @route GET /v1/dynamic-forms/list
 * @description List all forms for the logged-in merchant
 */
router.get("/list", listMerchantForms);

/**
 * @route GET /v1/dynamic-forms/:formId/responses
 * @description View all responses for a specific form
 */
router.get("/:formId/responses", listFormResponses);

/**
 * @route PATCH /v1/dynamic-forms/:formId
 * @description Update an existing form blueprint
 */
router.patch("/:formId", updateFormBlueprint);

/**
 * @route DELETE /v1/dynamic-forms/:formId
 * @description Securely remove a form blueprint
 */
router.delete("/:formId", deleteFormBlueprint);

export default router;
