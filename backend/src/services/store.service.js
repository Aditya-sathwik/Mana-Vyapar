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
    const store = await Store.findOne({ slug });

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
