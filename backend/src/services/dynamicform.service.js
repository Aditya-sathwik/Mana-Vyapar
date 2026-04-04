import { DynamicForm } from "../models/DynamicForm.models.js";
import { FormSubmission } from "../models/FormSubmission.models.js";
import { ApiError } from "../utlis/apierror.js";

/**
 * createForm: Blueprint for a new custom store form.
 */
export const createForm = async (merchantId, formData) => {
    const { title, description, fields } = formData;

    if (!title || !fields || fields.length === 0) {
        throw new ApiError(400, "Form title and at least one field are required");
    }

    const form = new DynamicForm({
        title,
        description,
        merchantId,
        fields
    });

    return await form.save();
};

/**
 * submitForm: Captures customer response of a dynamic form.
 * Can be used by shoppers or registered users.
 */
export const submitForm = async (formId, submissionData) => {
    const { responses, customerId, customerModel, metadata } = submissionData;

    const form = await DynamicForm.findById(formId);
    if (!form || !form.isActive) {
        throw new ApiError(404, "Form not found or is currently inactive");
    }

    // 🔄 Transform flat object { label: val } into array [ { fieldLabel: label, value: val } ]
    const transformedResponses = Object.entries(responses || {}).map(([label, val]) => ({
        fieldLabel: label,
        value: val
    }));

    const submission = new FormSubmission({
        formId,
        merchantId: form.merchantId,
        customerId,
        customerModel: customerModel || "User",
        responses: transformedResponses,
        metadata
    });

    // 📊 Increment total submissions count
    await DynamicForm.findByIdAndUpdate(formId, { $inc: { totalSubmissions: 1 } });

    return await submission.save();
};

/**
 * getMerchantForms: List all blueprints for a shop.
 */
export const getMerchantForms = async (merchantId) => {
    return await DynamicForm.find({ merchantId }).sort({ createdAt: -1 });
};

/**
 * getFormSubmissions: Show audit log of all responses for a form.
 */
export const getFormSubmissions = async (merchantId, formId) => {
    // 🟠 Ensure this form belongs to this merchant
    const form = await DynamicForm.findOne({ _id: formId, merchantId });
    if (!form) throw new ApiError(404, "Form blueprint not found for this store");

    return await FormSubmission.find({ formId, merchantId })
        .populate("customerId", "name fullname phone")
        .sort({ createdAt: -1 });
};

/**
 * toggleFormStatus: Disable/Enable a form blueprint.
 */
export const toggleFormStatus = async (merchantId, formId, isActive) => {
    const form = await DynamicForm.findOneAndUpdate(
        { _id: formId, merchantId },
        { isActive },
        { new: true }
    );
    if (!form) throw new ApiError(404, "Form not found");
    return form;
};

/**
 * updateForm: Refine an existing form blueprint for a shop.
 */
export const updateForm = async (merchantId, formId, updateData) => {
    const { title, description, fields, accessType } = updateData;

    const form = await DynamicForm.findOneAndUpdate(
        { _id: formId, merchantId },
        { 
            $set: {
                title,
                description,
                fields,
                accessType
            }
        },
        { new: true, runValidators: true }
    );

    if (!form) throw new ApiError(404, "Form blueprint not found for this store");
    return form;
};

/**
 * deleteFormBlueprint: Cleanly remove a form and its metadata.
 */
export const deleteFormBlueprint = async (merchantId, formId) => {
    const form = await DynamicForm.findOneAndDelete({ _id: formId, merchantId });
    if (!form) throw new ApiError(404, "Form not found or unauthorized");
    return form;
};

/**
 * getPublicForm: Fetch minimal form details for public shoppers (no auth).
 */
export const getPublicForm = async (formId) => {
    const form = await DynamicForm.findOne({ _id: formId, isActive: true })
        .select("title description fields isActive accessType merchantId");
    
    if (!form) throw new ApiError(404, "Form not found or currently unavailable");
    return form;
};
