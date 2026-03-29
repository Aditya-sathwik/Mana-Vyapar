import { Product } from "../models/Product.models.js";
import { Store } from "../models/Store.models.js";
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

    // Check if SKU is unique if provided for this merchant
    if (sku) {
        const existingProduct = await Product.findOne({ sku, merchantId });
        if (existingProduct) {
            throw new ApiError(409, "Product with this SKU already exists in your inventory");
        }
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    if (imageLocalPaths.length > 0) {
        for (const path of imageLocalPaths) {
            const result = await uploadOnCloudinary(path);
            if (result?.url) {
                uploadedImages.push({
                    url: result.url,
                    isPrimary: uploadedImages.length === 0
                });
            }
        }
    } else if (productData.imageUrl) {
        uploadedImages.push({
            url: productData.imageUrl,
            isPrimary: true
        });
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

    return await product.populate("category", "name slug image");
};

export const getAllProducts = async (merchantId, query = {}) => {
    const { category, isActive, search, page = 1, limit = 50 } = query;

    const skip = (page - 1) * limit;
    let filter = { merchantId };

    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive;

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } }
        ];
    }

    const products = await Product.find(filter)
        .populate("category", "name slug image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return {
        products,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

/** 🌐 Public API for a specific store */
export const getProductsByStoreSlug = async (slug, query = {}) => {
    const { categoryId, search, minPrice, maxPrice, sort = "-createdAt" } = query;

    const store = await Store.findOne({ slug, isActive: true });
    if (!store) throw new ApiError(404, "Store not found");

    const filter = {
        merchantId: store.owner,
        isActive: true
    };

    if (categoryId) filter.category = categoryId;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    return await Product.find(filter)
        .populate("category", "name slug image")
        .sort(sort);
};

export const getProductById = async (merchantId, productId) => {
    const product = await Product.findOne({ _id: productId, merchantId }).populate("category", "name slug image");
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return product;
};

export const updateProduct = async (merchantId, productId, updateData, imageLocalPaths = []) => {
    const { name, price, stock, category, unit, sku, description, lowStockThreshold, brand, imageUrl } = updateData;

    const updateFields = { ...updateData };
    
    // Upload new images to Cloudinary if provided
    const uploadedImages = [];
    if (imageLocalPaths.length > 0) {
        for (const path of imageLocalPaths) {
            const result = await uploadOnCloudinary(path);
            if (result?.url) {
                uploadedImages.push({
                    url: result.url,
                    isPrimary: uploadedImages.length === 0
                });
            }
        }
        updateFields.images = uploadedImages;
    } else if (imageUrl) {
        // If a manual URL is provided, put it in the images array
        updateFields.images = [{ url: imageUrl, isPrimary: true }];
    }

    const product = await Product.findOneAndUpdate(
        { _id: productId, merchantId },
        { $set: updateFields },
        { new: true }
    ).populate("category", "name slug image");

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
    return await product.populate("category", "name slug image");
};
