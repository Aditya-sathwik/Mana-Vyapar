import { asyncHandler } from "../utlis/asynchandler.js";
import { ApiError } from "../utlis/apierror.js";
import { ApiResponse } from "../utlis/apiresponse.js";
import * as storeService from "../services/store.service.js";

/**
 * Create a new store for the authenticated merchant
 */
const createStore = asyncHandler(async (req, res) => {
    const store = await storeService.createStore(req.user._id, req.body);
    return res.status(201).json(
        new ApiResponse(201, store, "Store created and launched successfully")
    );
});

/**
 * Update store basic details
 */
const updateStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    let store;

    if (storeId) {
        store = await storeService.updateStore(storeId, req.body);
    } else {
        store = await storeService.updateStoreByOwnerId(req.user._id, req.body);
    }

    return res.status(200).json(
        new ApiResponse(200, store, "Store updated successfully")
    );
});

/**
 * Get store details by slug (Public)
 */
const getStoreBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const store = await storeService.getStoreBySlug(slug);

    return res.status(200).json(
        new ApiResponse(200, store, "Store details fetched successfully")
    );
});

/**
 * Update comprehensive store settings
 */
const updateStoreSettings = asyncHandler(async (req, res) => {
    const store = await storeService.updateStoreByOwnerId(req.user._id, req.body);

    return res.status(200).json(
        new ApiResponse(200, store, "Store settings updated successfully")
    );
});

/**
 * Get the authenticated merchant's store
 */
const getMyStore = asyncHandler(async (req, res) => {
    const store = await storeService.getStoreByOwnerId(req.user._id);

    return res.status(200).json(
        new ApiResponse(200, store, "Merchant store details fetched successfully")
    );
});

/**
 * Delete a store
 */
const deleteStore = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const store = await storeService.deleteStoreById(storeId || req.user.storeId); // Assuming storeId might be in user object or params

    return res.status(200).json(
        new ApiResponse(200, store, "Store deleted successfully")
    );
});

/**
 * Carousel Image Management
 */
const uploadCarousel = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const imageFiles = req.files; // Assuming multiple files

    if (!imageFiles || imageFiles.length === 0) {
        throw new ApiError(400, "No images uploaded");
    }

    const paths = imageFiles.map(file => file.path);
    const store = await storeService.uploadCorouselImages(storeId, paths);

    return res.status(200).json(
        new ApiResponse(200, store, "Carousel images uploaded successfully")
    );
});

const deleteCarouselImage = asyncHandler(async (req, res) => {
    const { storeId, imageId } = req.params;
    const store = await storeService.deleteCorouselImage(storeId, imageId);

    return res.status(200).json(
        new ApiResponse(200, store, "Carousel image deleted successfully")
    );
});

const updateStoreLogo = asyncHandler(async (req, res) => {
    const logolocalpath = req.file?.path;
    if (!logolocalpath) {
        throw new ApiError(400, "Logo file is missing");
    }

    const store = await storeService.updateStoreLogo(req.user._id, logolocalpath);

    return res.status(200).json(
        new ApiResponse(200, store, "Store logo updated successfully")
    );
});


// ============ WEBSITE BUILDER CONTROLLERS ============

/**
 * Get the full website builder config for the authenticated merchant
 */
const getWebsiteConfig = asyncHandler(async (req, res) => {
    const data = await storeService.getWebsiteConfig(req.user._id);
    return res.status(200).json(
        new ApiResponse(200, data, "Website config fetched successfully")
    );
});

/**
 * Update the website configuration (sections, theme, SEO, etc.)
 */
const updateWebsiteConfig = asyncHandler(async (req, res) => {
    const store = await storeService.updateWebsiteConfig(req.user._id, req.body);
    return res.status(200).json(
        new ApiResponse(200, store, "Website configuration saved successfully")
    );
});

/**
 * Add a new section to the website
 */
const addSection = asyncHandler(async (req, res) => {
    const store = await storeService.addSection(req.user._id, req.body);
    return res.status(201).json(
        new ApiResponse(201, store, "Section added successfully")
    );
});

/**
 * Update a specific section
 */
const updateSectionById = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    const store = await storeService.updateSection(req.user._id, sectionId, req.body);
    return res.status(200).json(
        new ApiResponse(200, store, "Section updated successfully")
    );
});

/**
 * Delete a section
 */
const deleteSectionById = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    const store = await storeService.deleteSection(req.user._id, sectionId);
    return res.status(200).json(
        new ApiResponse(200, store, "Section removed successfully")
    );
});

/**
 * Reorder sections
 */
const reorderSections = asyncHandler(async (req, res) => {
    const { orderMap } = req.body; // [{ id, order }, ...]
    const store = await storeService.reorderSections(req.user._id, orderMap);
    return res.status(200).json(
        new ApiResponse(200, store, "Sections reordered successfully")
    );
});

/**
 * Toggle section visibility
 */
const toggleSectionVisibility = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    const store = await storeService.toggleSectionVisibility(req.user._id, sectionId);
    return res.status(200).json(
        new ApiResponse(200, store, "Section visibility toggled")
    );
});

export {
    createStore,
    updateStore,
    getStoreBySlug,
    updateStoreSettings,
    getMyStore,
    deleteStore,
    uploadCarousel,
    deleteCarouselImage,
    updateStoreLogo,
    getWebsiteConfig,
    updateWebsiteConfig,
    addSection,
    updateSectionById,
    deleteSectionById,
    reorderSections,
    toggleSectionVisibility
};

