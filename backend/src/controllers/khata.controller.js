import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as khataService from "../services/khata.service.js";

const createCustomer = asyncHandler(async (req, res) => {
    const account = await khataService.createCustomerAccount(req.user._id, req.body);

    return res.status(201).json(
        new ApiResponse(201, account, "Customer added to Khata successfully")
    );
});

const getKhataList = asyncHandler(async (req, res) => {
    const { search, page, limit } = req.query;
    const list = await khataService.getMerchantKhataList(req.user._id, search, page, limit);
    
    return res.status(200).json(
        new ApiResponse(200, list, "Khata list fetched successfully")
    );
});

const getCustomerDetails = asyncHandler(async (req, res) => {
    const account = await khataService.getCustomerAccount(req.user._id, req.params.khataId);
    
    return res.status(200).json(
        new ApiResponse(200, account, "Customer details fetched successfully")
    );
});

const performTransaction = asyncHandler(async (req, res) => {
    const account = await khataService.addTransaction(
        req.user._id,
        req.params.khataId,
        req.body,
        req.user._id // recordedBy
    );

    return res.status(200).json(
        new ApiResponse(200, account, "Transaction recorded successfully")
    );
});

const deleteCustomer = asyncHandler(async (req, res) => {
    await khataService.deleteCustomerAccount(req.user._id, req.params.khataId);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Customer removed from Khata")
    );
});

export {
    createCustomer,
    getKhataList,
    getCustomerDetails,
    performTransaction,
    deleteCustomer
};
