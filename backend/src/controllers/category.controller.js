import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as categoryService from "../services/category.service.js";

/**
 * ➕ Add a new category (Merchant Only)
 */
const addCategory = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const category = await categoryService.createCategory(req.user._id, storeId, req.body);
    
    return res.status(201).json(
        new ApiResponse(201, category, "Category added successfully")
    );
});

/**
 * 🌳 Fetch the recursive Tree (Public/Storefront)
 */
const getTree = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const tree = await categoryService.getCategoryTree(storeId);
    
    return res.status(200).json(
        new ApiResponse(200, tree, "Category tree fetched successfully")
    );
});

/**
 * 📋 List all categories with Pagination/Search (Merchant Dashboard)
 */
const getCategories = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const options = {
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
        parentCategory: req.query.parentCategory
    };
    
    const result = await categoryService.getAllCategories(storeId, options);
    
    return res.status(200).json(
        new ApiResponse(200, result, "Categories retrieved successfully")
    );
});

/**
 * ✏️ Update a category
 */
const updateCategory = asyncHandler(async (req, res) => {
    const { storeId, categoryId } = req.params;
    const category = await categoryService.updateCategory(storeId, categoryId, req.body);
    
    return res.status(200).json(
        new ApiResponse(200, category, "Category updated successfully")
    );
});

/**
 * ❌ Delete a category
 */
const deleteCategory = asyncHandler(async (req, res) => {
    const { storeId, categoryId } = req.params;
    await categoryService.deleteCategory(storeId, categoryId);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Category deleted successfully")
    );
});

export { 
    addCategory, 
    getTree, 
    getCategories, 
    updateCategory, 
    deleteCategory 
};
