import { Khata } from "../models/Khata.models.js";
import { ApiError } from "../utlis/apierror.js";

/**
 * Service to handle business logic for Khata/Customer operations.
 */

export const createCustomerAccount = async (merchantId, customerData) => {
    const { customerName, customerPhoneNumber, customerEmail, creditLimit, notes } = customerData;

    if (!customerName || !customerPhoneNumber) {
        throw new ApiError(400, "Customer name and phone number are required");
    }

    // Check if customer already exists for this merchant
    const existing = await Khata.findOne({ merchantId, customerPhoneNumber });
    if (existing) {
        throw new ApiError(409, "Customer with this phone number already exists in your Khata");
    }

    return await Khata.create({
        merchantId,
        customerName,
        customerPhoneNumber,
        customerEmail,
        creditLimit: creditLimit || 0,
        notes
    });
};

export const getMerchantKhataList = async (merchantId, search = "") => {
    let filter = { merchantId };
    
    if (search) {
        filter.$or = [
            { customerName: { $regex: search, $options: "i" } },
            { customerPhoneNumber: { $regex: search, $options: "i" } }
        ];
    }

    return await Khata.find(filter).sort({ updatedAt: -1 });
};

export const getCustomerAccount = async (merchantId, khataId) => {
    const account = await Khata.findOne({ _id: khataId, merchantId });
    if (!account) {
        throw new ApiError(404, "Customer account not found");
    }
    return account;
};

export const addTransaction = async (merchantId, khataId, transactionData, recordedBy) => {
    const { type, amount, description, paymentMethod, orderId } = transactionData;

    const account = await Khata.findOne({ _id: khataId, merchantId });
    if (!account) {
        throw new ApiError(404, "Customer account not found");
    }

    if (type === "Credit") {
        return await account.addCredit(amount, description, orderId, recordedBy);
    } else if (type === "Payment Received") {
        return await account.addPayment(amount, paymentMethod, description, recordedBy);
    } else {
        throw new ApiError(400, "Invalid transaction type");
    }
};

export const deleteCustomerAccount = async (merchantId, khataId) => {
    // Usually, we don't delete financial data, but adding for completeness
    const account = await Khata.findOneAndDelete({ _id: khataId, merchantId });
    if (!account) {
        throw new ApiError(404, "Customer account not found or unauthorized");
    }
    return account;
};
