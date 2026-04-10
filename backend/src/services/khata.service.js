import { Customer } from "../models/Customer.models.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Service to handle business logic for Unified Customer/Khata operations.
 */

export const createCustomerAccount = async (merchantId, customerData) => {
    const { customerName, customerPhoneNumber, customerEmail, creditLimit, notes } = customerData;

    if (!customerName || !customerPhoneNumber) {
        throw new ApiError(400, "Customer name and phone number are required");
    }

    // Check if customer already exists for this merchant
    const existing = await Customer.findOne({ merchantId, phone: customerPhoneNumber });
    if (existing) {
        throw new ApiError(409, "Customer with this phone number already exists in your records");
    }

    return await Customer.create({
        merchantId,
        name: customerName,
        phone: customerPhoneNumber,
        email: customerEmail,
        creditLimit: creditLimit || 0,
        internalNotes: notes
    });
};

export const getMerchantKhataList = async (merchantId, search = "", page = 1, limit = 20) => {
    let filter = { merchantId };
    
    if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
            { name: { $regex: escapedSearch, $options: "i" } },
            { phone: { $regex: escapedSearch, $options: "i" } }
        ];
    }

    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
        .sort({ updatedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    return {
        customers,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

export const getCustomerAccount = async (merchantId, customerId) => {
    const customer = await Customer.findOne({ _id: customerId, merchantId });
    if (!customer) {
        throw new ApiError(404, "Customer profile not found");
    }
    return customer;
};

export const addTransaction = async (merchantId, customerId, transactionData, recordedBy) => {
    const { type, amount, description, paymentMethod, orderId } = transactionData;

    const customer = await Customer.findOne({ _id: customerId, merchantId });
    if (!customer) {
        throw new ApiError(404, "Customer profile not found");
    }

    if (type === "Credit") {
        return await customer.addCredit(amount, description, orderId, recordedBy);
    } else if (type === "Payment Received") {
        return await customer.addPayment(amount, paymentMethod, description, recordedBy);
    } else {
        throw new ApiError(400, "Invalid transaction type");
    }
};

export const deleteCustomerAccount = async (merchantId, customerId) => {
    const customer = await Customer.findOneAndDelete({ _id: customerId, merchantId });
    if (!customer) {
        throw new ApiError(404, "Customer profile not found or unauthorized");
    }
    return customer;
};
