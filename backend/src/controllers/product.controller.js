import { asyncHandler } from "../utlis/asynchandler.js";
import { ApiResponse } from "../utlis/apiresponse.js";
import * as productService from "../services/product.service.js";

const createProduct = asyncHandler(async (req, res) => {
    const imageLocalPaths = req.files?.images?.map(file => file.path) || [];
    
    const product = await productService.createProduct(
        req.user._id,
        req.body,
        imageLocalPaths
    );

    return res.status(201).json(
        new ApiResponse(201, product, "Product added to inventory successfully")
    );
});

const getInventory = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts(req.user._id, req.query);
    
    return res.status(200).json(
        new ApiResponse(200, products, "Inventory fetched successfully")
    );
});

const getProductDetails = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.user._id, req.params.productId);
    
    return res.status(200).json(
        new ApiResponse(200, product, "Product details fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const imageLocalPaths = req.files?.images?.map(file => file.path) || [];
    
    const product = await productService.updateProduct(
        req.user._id, 
        req.params.productId, 
        req.body,
        imageLocalPaths
    );
    
    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.user._id, req.params.productId);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});

const adjustStock = asyncHandler(async (req, res) => {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    
    const product = await productService.updateStock(
        req.user._id,
        req.params.productId,
        Number(quantity),
        operation
    );

    return res.status(200).json(
        new ApiResponse(200, product, `Stock ${operation}ed successfully`)
    );
});

/**
 * 🌐 GET Public Products for a Storefront (No Auth)
 */
const getStoreProducts = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const products = await productService.getProductsByStoreSlug(slug, req.query);
    
    return res.status(200).json(
        new ApiResponse(200, products, "Store products fetched successfully")
    );
});

export {
    createProduct,
    getInventory,
    getProductDetails,
    updateProduct,
    deleteProduct,
    adjustStock,
    getStoreProducts
};
