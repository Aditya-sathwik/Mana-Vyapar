import { Category } from "../models/Category.models.js";
import { ApiError } from "../utlis/apierror.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";

/* 🌳 The Tree Builder Logic */
export const getCategoryTree = async (storeId) => {
    // 1. Get every category for this store
    const categories = await Category.find({ storeId, isActive: true });

    // 2. Identify the "Roots" (Top-level categories like Electronics)
    const categoryTree = categories.filter(cat => cat.parentCategory === null)
        .map(root => {
            // 3. For each Root, find its direct children
            return {
                ...root._doc,
                children: buildChildren(categories, root._id)
            };
        });

    return categoryTree;
};

/* 🦴 The Recursive Helper */
function buildChildren(allCategories, parentId) {
    return allCategories
        .filter(cat => String(cat.parentCategory) === String(parentId))
        .map(child => ({
            ...child._doc,
            children: buildChildren(allCategories, child._id) // <--- Recursion!
        }));
}

export const createCategory = async (merchantId, storeId, data) => {
    const { name, parentCategory, image } = data;
    
    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, '-');

    const category = await Category.create({
        name,
        slug,
        parentCategory: parentCategory || null,
        storeId,
        image,
        isActive: true
    });

    return category;
};

export const getAllCategories = async (storeId, options = {}) => {
    const { search, page = 1, limit = 10, parentCategory } = options;

    if (!storeId) {
        throw new ApiError(400, "Store ID is required");
    }

    const filter = { storeId };
    
    // Explicitly check for parentCategory filtering
    if (parentCategory !== undefined) {
        filter.parentCategory = parentCategory === "null" ? null : parentCategory;
    }

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const count = await Category.countDocuments(filter);

    return { 
        categories, 
        totalPages: Math.ceil(count / limit), 
        currentPage: Number(page), 
        totalCategories: count 
    };
};

export const getCategoryById = async (storeId, categoryId) => {
    if (!storeId || !categoryId) {
        throw new ApiError(400, "Store ID and Category ID are required");
    }

    const category = await Category.findOne({ _id: categoryId, storeId });
    if (!category) {
        throw new ApiError(404, "Category not found");
    }
    return category;
};

export const updateCategory = async (storeId, categoryId, data) => {
    if (!storeId || !categoryId) {
        throw new ApiError(400, "Store ID and Category ID are required");
    }

    const category = await Category.findOne({ _id: categoryId, storeId });
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const { name, parentCategory, image, isActive } = data;
    if (name) {
        category.name = name;
        category.slug = name.toLowerCase().trim().replace(/\s+/g, '-');
    }
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (image) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return category;
};

export const deleteCategory = async (storeId, categoryId) => {
    if (!storeId || !categoryId) {
        throw new ApiError(400, "Store ID and Category ID are required");
    }

    const category = await Category.findOne({ _id: categoryId, storeId });
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Optional: Check if it has children before deleting
    const hasChildren = await Category.findOne({ parentCategory: categoryId });
    if (hasChildren) {
        throw new ApiError(400, "Cannot delete category with sub-categories. Delete sub-categories first.");
    }

    await category.deleteOne();
    return category;
};
