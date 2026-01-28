import { Product } from "../models/Product.models.js";
import { ApiError } from "../utlis/apierror.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";

/**
 * Service to handle business logic for Product/Inventory operations.
 */

export const createProduct = async (merchantId, productData, imageLocalPaths = []) => {
    const { name, price, stock, category, unit, sku, description, lowStockThreshold, brand } = productData;

    if (!name || !price || !category) {
        throw new ApiError(400, "Name, price and category are required");
    }

    // Check if SKU is unique if provided
    if (sku) {
        const existingProduct = await Product.findOne({ sku, merchantId });
        if (existingProduct) {
            throw new ApiError(409, "Product with this SKU already exists in your inventory");
        }
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const path of imageLocalPaths) {
        const result = await uploadOnCloudinary(path);
        if (result?.url) {
            uploadedImages.push({ 
                url: result.url, 
                isPrimary: uploadedImages.length === 0 
            });
        }
    }

    const product = await Product.create({
        name,
        price,
        stock: stock || 0,
        category,
        unit: unit || "piece",
        sku,
        description,
        lowStockThreshold,
        brand,
        merchantId,
        images: uploadedImages
    });

    return product;
};

export const getAllProducts = async (merchantId, query = {}) => {
    const { category, isActive, search } = query;
    
    let filter = { merchantId };
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive;
    
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } }
        ];
    }

    return await Product.find(filter).sort({ createdAt: -1 });
};

export const getProductById = async (merchantId, productId) => {
    const product = await Product.findOne({ _id: productId, merchantId });
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return product;
};

export const updateProduct = async (merchantId, productId, updateData) => {
    const product = await Product.findOneAndUpdate(
        { _id: productId, merchantId },
        { $set: updateData },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found or unauthorized");
    }

    return product;
};

export const deleteProduct = async (merchantId, productId) => {
    const product = await Product.findOneAndDelete({ _id: productId, merchantId });
    if (!product) {
        throw new ApiError(404, "Product not found or unauthorized");
    }
    return product;
};

export const updateStock = async (merchantId, productId, quantity, operation) => {
    const product = await Product.findOne({ _id: productId, merchantId });
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await product.updateStock(quantity, operation);
    return product;
};
