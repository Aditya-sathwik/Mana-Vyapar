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
    return {
        _id: store._id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        logo: store.logo,
        theme: store.theme,
        sections: (store.sections || []).sort((a, b) => a.order - b.order),
        announcementBar: store.announcementBar || {},
        footerConfig: store.footerConfig || {},
        seoConfig: store.seoConfig || {},
        customPages: store.customPages || [],
        popupConfig: store.popupConfig || {},
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
        customPages,
        popupConfig,
        theme,
        name,
        description,
    } = websiteData;

    if (sections !== undefined) store.sections = sections;
    if (announcementBar !== undefined) store.announcementBar = announcementBar;
    if (footerConfig !== undefined) store.footerConfig = footerConfig;
    if (seoConfig !== undefined) store.seoConfig = seoConfig;
    if (customPages !== undefined) store.customPages = customPages;
    if (popupConfig !== undefined) store.popupConfig = popupConfig;
    if (theme !== undefined) store.theme = { ...store.theme?.toObject?.() || store.theme || {}, ...theme };
    if (name !== undefined) store.name = name;
    if (description !== undefined) store.description = description;

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

    // Set the order to be the last in the list
    sectionData.order = store.sections ? store.sections.length : 0;
    store.sections.push(sectionData);
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

    const sectionIndex = store.sections.findIndex(
        (s) => s._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
        throw new ApiError(404, "Section not found");
    }

    // Merge the updates
    Object.keys(sectionData).forEach((key) => {
        store.sections[sectionIndex][key] = sectionData[key];
    });

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

    store.sections = store.sections.filter(
        (s) => s._id.toString() !== sectionId
    );

    // Re-order remaining sections
    store.sections.forEach((s, i) => {
        s.order = i;
    });

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
        const section = store.sections.find((s) => s._id.toString() === id);
        if (section) {
            section.order = order;
        }
    });

    store.sections.sort((a, b) => a.order - b.order);
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

    const section = store.sections.find((s) => s._id.toString() === sectionId);
    if (!section) {
        throw new ApiError(404, "Section not found");
    }

    section.isVisible = !section.isVisible;
    await store.save();
    return store;
};

