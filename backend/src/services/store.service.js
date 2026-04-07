import { Store } from "../models/Store.models.js";
import { ApiError } from "../utlis/apierror.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";
import { Category } from "../models/Category.models.js";


export const createStore = async (merchantId, storeData) => {
    const { name, description, slug } = storeData;

    if (!name) {
        throw new ApiError(400, "Store name is required");
    }

    const existingStore = await Store.findOne({
        $or: [{ name }, { slug: slug || name.toLowerCase().split(" ").join("-") }]
    });

    if (existingStore) {
        throw new ApiError(409, "Store with this name or slug already exists");
    }

    const store = await Store.create({
        name,
        slug: slug || name.toLowerCase().split(" ").join("-"),
        description,
        owner: merchantId
    });

    return store;
}


export const updateStoreByOwnerId = async (ownerId, storeData) => {
    const { name, description, slug, theme, socialLinks, contactInfo, corouselImages, isActive } = storeData;

    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    if (name) store.name = name;
    if (description) store.description = description;
    if (slug) store.slug = slug;
    if (theme) store.theme = theme;
    if (socialLinks) store.socialLinks = socialLinks;
    if (contactInfo) store.contactInfo = contactInfo;
    if (corouselImages) store.corouselImages = corouselImages;
    if (isActive !== undefined) store.isActive = isActive;

    await store.save();
    return store;
}

export const updateStore = async (storeId, storeData) => {
    const { name, description, slug } = storeData;

    const store = await Store.findByIdAndUpdate(
        storeId,
        {
            $set: {
                name,
                description,
                slug: slug || (name ? name.toLowerCase().split(" ").join("-") : undefined)
            }
        },
        { new: true }
    );

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    return store;
}

export const getStoreBySlug = async (slug) => {
    if (!slug) {
        throw new ApiError(400, "Slug is required");
    }

    // Normalize slug (must match pre-save hook logic: lowercase, alphanumeric/hyphens)
    const normalizedSlug = slug
        .toLowerCase()
        .replace(/[^\w-]+/g, "");

    const store = await Store.findOne({ slug: normalizedSlug });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    return store;
}

export const deleteStoreById = async (storeId) => {
    if (!storeId) {
        throw new ApiError(400, "Store ID is required");
    }
    const store = await Store.findByIdAndDelete(storeId);

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    return store;
}


export const getStoreByOwnerId = async (ownerId) => {
    if (!ownerId) {
        throw new ApiError(400, "Owner ID is required");
    }
    const store = await Store.findOne({ owner: ownerId });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    return store;
}


export const uploadCorouselImages = async (storeId, imageLocalPaths) => {
    if (!storeId) {
        throw new ApiError(400, "Store ID is required");
    }
    const store = await Store.findById(storeId);

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

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

    store.corouselImages = uploadedImages;
    await store.save();

    return store;
}


export const updateCorouselImages = async (storeId, imageLocalPaths) => {
    if (!storeId) {
        throw new ApiError(400, "Store ID is required");
    }
    const store = await Store.findById(storeId);

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

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

    store.corouselImages = uploadedImages;
    await store.save();

    return store;
}


export const deleteCorouselImage = async (storeId, imageId) => {
    if (!storeId) {
        throw new ApiError(400, "Store ID is required");
    }
    const store = await Store.findById(storeId);

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const uploadedImages = store.corouselImages.filter((image) => image._id !== imageId);
    store.corouselImages = uploadedImages;
    await store.save();

    return store;
}

export const addCategory = async (storeId, categoryData) => {
    if (!storeId) {
        throw new ApiError(400, "Store ID is required");
    }
    const store = await Store.findById(storeId);

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const { name, image, isActive } = categoryData;
    if (!name) {
        throw new ApiError(400, "Category name is required");
    }
    const category = await Category.create({
        name,
        image,
        isActive
    });
    store.categories.push(category);
    await store.save();
    return store;
}

export const updateStoreLogo = async (ownerId, logoLocalPath) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const result = await uploadOnCloudinary(logoLocalPath);
    if (!result?.url) {
        throw new ApiError(400, "Error while uploading logo");
    }

    store.logo = result.url;
    await store.save();
    return store;
}


// ============ WEBSITE BUILDER SERVICES ============

/**
 * Get the full website builder data for a merchant
 */
export const getWebsiteConfig = async (ownerId) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    // Initialize draftConfig if it's missing (for existing stores)
    if (!store.draftConfig || !store.draftConfig.sections || store.draftConfig.sections.length === 0) {
        store.draftConfig = {
            sections: store.sections || [],
            theme: store.theme || {},
            announcementBar: store.announcementBar || {},
            footerConfig: store.footerConfig || {},
            seoConfig: store.seoConfig || {},
            lastSaved: new Date()
        };
        await store.save();
    }

    const draft = store.draftConfig;

    return {
        _id: store._id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        logo: store.logo,
        theme: draft.theme || store.theme || {},
        sections: (draft.sections || []).sort((a, b) => a.order - b.order),
        announcementBar: draft.announcementBar || store.announcementBar || {},
        footerConfig: draft.footerConfig || store.footerConfig || {},
        seoConfig: draft.seoConfig || store.seoConfig || {},
        socialLinks: store.socialLinks || {},
        contactInfo: store.contactInfo || {},
        corouselImages: store.corouselImages || [],
    };
};

/**
 * Update the entire website configuration
 */
export const updateWebsiteConfig = async (ownerId, websiteData) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const {
        sections,
        announcementBar,
        footerConfig,
        seoConfig,
        theme,
        name,
        description,
    } = websiteData;

    // Ensure draftConfig exists
    if (!store.draftConfig) store.draftConfig = {};

    if (sections !== undefined) store.draftConfig.sections = sections;
    if (announcementBar !== undefined) store.draftConfig.announcementBar = announcementBar;
    if (footerConfig !== undefined) store.draftConfig.footerConfig = footerConfig;
    if (seoConfig !== undefined) store.draftConfig.seoConfig = seoConfig;
    
    if (theme !== undefined) {
        store.draftConfig.theme = { 
            ...store.draftConfig.theme?.toObject?.() || store.draftConfig.theme || {}, 
            ...theme 
        };
    }

    if (name !== undefined) store.name = name;
    if (description !== undefined) store.description = description;

    store.draftConfig.lastSaved = new Date();
    await store.save();
    return store;
};

/**
 * Add a new section to the website
 */
export const addSection = async (ownerId, sectionData) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    if (!store.draftConfig) store.draftConfig = { sections: [] };

    // Set the order to be the last in the list
    sectionData.order = store.draftConfig.sections ? store.draftConfig.sections.length : 0;
    store.draftConfig.sections.push(sectionData);
    store.draftConfig.lastSaved = new Date();
    await store.save();
    return store;
};

/**
 * Update a specific section
 */
export const updateSection = async (ownerId, sectionId, sectionData) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const sectionIndex = store.draftConfig.sections.findIndex(
        (s) => s._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
        throw new ApiError(404, "Section not found in draft");
    }

    // Merge the updates
    Object.keys(sectionData).forEach((key) => {
        store.draftConfig.sections[sectionIndex][key] = sectionData[key];
    });

    store.draftConfig.lastSaved = new Date();
    await store.save();
    return store;
};

/**
 * Delete a section
 */
export const deleteSection = async (ownerId, sectionId) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    store.draftConfig.sections = store.draftConfig.sections.filter(
        (s) => s._id.toString() !== sectionId
    );

    // Re-order remaining sections
    store.draftConfig.sections.forEach((s, i) => {
        s.order = i;
    });

    store.draftConfig.lastSaved = new Date();
    await store.save();
    return store;
};

/**
 * Reorder sections via array of { id, order }
 */
export const reorderSections = async (ownerId, orderMap) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    orderMap.forEach(({ id, order }) => {
        const section = store.draftConfig.sections.find((s) => s._id.toString() === id);
        if (section) {
            section.order = order;
        }
    });

    store.draftConfig.sections.sort((a, b) => a.order - b.order);
    store.draftConfig.lastSaved = new Date();
    await store.save();
    return store;
};

/**
 * Toggle section visibility
 */
export const toggleSectionVisibility = async (ownerId, sectionId) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const section = store.draftConfig.sections.find((s) => s._id.toString() === sectionId);
    if (!section) {
        throw new ApiError(404, "Section not found");
    }

    section.isVisible = !section.isVisible;
    store.draftConfig.lastSaved = new Date();
    await store.save();
    return store;
};

/**
 * Deploy the draft website configuration to the live storefront
 */
export const deployWebsite = async (ownerId) => {
    const store = await Store.findOne({ owner: ownerId });
    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    if (!store.draftConfig) {
        throw new ApiError(400, "No draft configuration found to deploy");
    }

    // Atomic deployment: Copy draft fields to live fields
    const { sections, theme, announcementBar, footerConfig, seoConfig } = store.draftConfig;

    if (sections !== undefined) store.sections = sections;
    if (theme !== undefined) store.theme = theme;
    if (announcementBar !== undefined) store.announcementBar = announcementBar;
    if (footerConfig !== undefined) store.footerConfig = footerConfig;
    if (seoConfig !== undefined) store.seoConfig = seoConfig;

    await store.save();
    return store;
};
