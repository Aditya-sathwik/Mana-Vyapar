import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DynamicCollection } from "../models/DynamicCollection.models.js";
import { v4 as uuidv4 } from 'uuid';

/**
 * Create or Update a Collection Definition
 */
const syncCollection = asyncHandler(async (req, res) => {
    const { name, slug, data } = req.body;

    if (!slug || !data) {
        throw new ApiError(400, "Slug and Data are required");
    }

    // Ensure data is an array
    const normalizedData = Array.isArray(data) ? data : [data];

    // Map data to ensure they have IDs if they don't
    const dataWithIds = normalizedData.map(item => ({
        _id: item._id || item.id || uuidv4(),
        ...item
    }));

    const collection = await DynamicCollection.findOneAndUpdate(
        { slug: slug.toLowerCase() },
        {
            name: name || slug,
            slug: slug.toLowerCase(),
            data: dataWithIds,
            createdBy: req.user._id,
            isActive: true
        },
        { upsert: true, new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, collection, "Collection synchronized successfully")
    );
});

/**
 * Get all available collections (Admin only)
 */
const getAllCollections = asyncHandler(async (req, res) => {
    const collections = await DynamicCollection.find({}).select("-data");
    return res.status(200).json(
        new ApiResponse(200, collections, "Collections retrieved successfully")
    );
});

/**
 * Universal GET Handler
 * Hits /api/v1/custom/:slug
 */
const getCollectionData = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    
    const collection = await DynamicCollection.findOne({ slug: slug.toLowerCase(), isActive: true });
    
    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    return res.status(200).json(
        new ApiResponse(200, collection.data, `Data for ${slug} retrieved`)
    );
});

/**
 * Universal POST Handler (Add entry)
 * Hits /api/v1/custom/:slug
 */
const addEntry = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const entry = req.body;

    if (!entry || Object.keys(entry).length === 0) {
        throw new ApiError(400, "Entry data is required");
    }

    const newEntry = {
        _id: uuidv4(),
        ...entry,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const collection = await DynamicCollection.findOneAndUpdate(
        { slug: slug.toLowerCase() },
        { $push: { data: newEntry } },
        { new: true }
    );

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    return res.status(201).json(
        new ApiResponse(201, newEntry, "Entry added successfully")
    );
});

/**
 * Universal DELETE Handler
 * Hits /api/v1/custom/:slug/:id
 */
const deleteEntry = asyncHandler(async (req, res) => {
    const { slug, id } = req.params;

    const collection = await DynamicCollection.findOneAndUpdate(
        { slug: slug.toLowerCase() },
        { $pull: { data: { _id: id } } },
        { new: true }
    );

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Entry deleted successfully")
    );
});

export {
    syncCollection,
    getAllCollections,
    getCollectionData,
    addEntry,
    deleteEntry
};
