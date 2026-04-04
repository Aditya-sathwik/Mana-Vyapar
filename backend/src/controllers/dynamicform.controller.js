import { asyncHandler } from "../utlis/asynchandler.js";
import { ApiResponse } from "../utlis/apiresponse.js";
import { ApiError } from "../utlis/apierror.js";
import { DynamicForm } from "../models/DynamicForm.models.js";
import {
    createForm,
    submitForm,
    getMerchantForms,
    getFormSubmissions,
    getPublicForm,
    updateForm,
    deleteFormBlueprint as deleteFormService
} from "../services/dynamicform.service.js";

/**
 * createFormBlueprint: Allows a merchant to define a new custom form.
 */
const createFormBlueprint = asyncHandler(async (req, res) => {
    const merchantId = req.user._id;
    const form = await createForm(merchantId, req.body);

    return res.status(201).json(
        new ApiResponse(201, form, "Custom form blueprint created successfully")
    );
});

/**
 * submitFormResponse: Captures the actual data from a shopper.
 */
const submitFormResponse = asyncHandler(async (req, res) => {
    const { formId } = req.params;
    const { responses } = req.body;
    
    // 🔍 Fetch form to check access rules
    const form = await DynamicForm.findById(formId);
    if (!form || !form.isActive) {
        throw new ApiError(404, "This form is no longer accepting responses.");
    }

    // 🛡️ Enforce Access Control
    if (form.accessType === "REGISTERED" && !req.user) {
        throw new ApiError(401, "Only registered customers can fill this form. Please login first.");
    }

    const customerId = req.user?._id;

    const submission = await submitForm(formId, {
        customerId,
        responses
    });

    return res.status(201).json(
        new ApiResponse(201, submission, "Response submitted successfully")
    );
});

/**
 * listMerchantForms: Lists all forms built by a specific shop.
 */
const listMerchantForms = asyncHandler(async (req, res) => {
    const merchantId = req.user._id;
    const forms = await getMerchantForms(merchantId);

    return res.status(200).json(
        new ApiResponse(200, forms, "Merchant form blueprints fetched successfully")
    );
});

/**
 * listFormResponses: Shows the audit trail of all entries for a form.
 */
const listFormResponses = asyncHandler(async (req, res) => {
    const { formId } = req.params;
    const merchantId = req.user._id;
    
    // 🔍 Get form details for the UI
    const form = await DynamicForm.findOne({ _id: formId, merchantId });
    if (!form) throw new ApiError(404, "Form not found");

    const submissions = await getFormSubmissions(merchantId, formId);

    return res.status(200).json(
        new ApiResponse(200, { form, submissions }, "Form responses fetched successfully")
    );
});

/**
 * updateFormBlueprint: Allows a merchant to modify their custom form.
 */
const updateFormBlueprint = asyncHandler(async (req, res) => {
    const { formId } = req.params;
    const merchantId = req.user._id;
    
    const form = await updateForm(merchantId, formId, req.body);

    return res.status(200).json(
        new ApiResponse(200, form, "Form blueprint updated successfully")
    );
});

/**
 * deleteFormBlueprint: Cleanly remove a form from the system.
 */
const deleteFormBlueprint = asyncHandler(async (req, res) => {
    const { formId } = req.params;
    const merchantId = req.user._id;
    
    await deleteFormService(merchantId, formId);

    return res.status(200).json(
        new ApiResponse(200, null, "Form blueprint removed successfully")
    );
});

/**
 * getPublicFormById: Returns form fields for shoppers (No token).
 */
const getPublicFormById = asyncHandler(async (req, res) => {
    const { formId } = req.params;
    const form = await getPublicForm(formId);

    return res.status(200).json(
        new ApiResponse(200, form, "Public form data fetched successfully")
    );
});

export {
    createFormBlueprint,
    submitFormResponse,
    listMerchantForms,
    listFormResponses,
    getPublicFormById,
    updateFormBlueprint,
    deleteFormBlueprint
};
