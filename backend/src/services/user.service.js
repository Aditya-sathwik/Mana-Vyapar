import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

/**
 * Service to handle business logic for User operations.
 */

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

export const registerUser = async ({
    fullname,
    username,
    email,
    password,
    phone,
    businessName,
    businessCategory,
    role = "Merchant",
    merchantId,
    avatarlocalpath,
    coverimagelocalpath
}) => {
    // If registering as a Customer, merchantId is REQUIRED and must be a valid Merchant
    if (role === "Customer") {
        if (!merchantId) {
            throw new ApiError(400, "Merchant ID is required for customer registration");
        }
        const merchant = await User.findOne({ _id: merchantId, role: "Merchant" });
        if (!merchant) {
            throw new ApiError(404, "Invalid Merchant ID provided");
        }
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Upload files to Cloudinary
    let avatar = null;
    if (avatarlocalpath) {
        avatar = await uploadOnCloudinary(avatarlocalpath);
    }

    let coverimage = null;
    if (coverimagelocalpath) {
        coverimage = await uploadOnCloudinary(coverimagelocalpath);
    }

    // Create user
    const user = await User.create({
        fullname,
        avatar: avatar?.url || "",
        coverimage: coverimage?.url || "",
        email,
        phone: phone || "",
        // Only include business info for Merchants
        businessName: role === "Merchant" ? (businessName || "") : undefined,
        businessCategory: role === "Merchant" ? (businessCategory || "General") : undefined,
        password,
        role,
        merchantId: role === "Customer" ? merchantId : null,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return createdUser;
};

export const loginUser = async ({ email, username, password, phone }) => {
    if (!email && !username && !phone) {
        throw new ApiError(400, "Email or username or phone is required");
    }

    const query = {
        $or: [
            { email: email ? email.toLowerCase() : undefined },
            { username: username ? username.toLowerCase() : undefined },
            { phone: phone ? phone : undefined }
        ].filter(condition => Object.values(condition)[0] !== undefined)
    }

    const user = await User.findOne(query);

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordMatched(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return { user: loggedInUser, accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );
};

export const refreshAccessToken = async (incomingRefreshToken) => {
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            validateBeforeSave: false
        };

        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save(options);

        return { accessToken, refreshToken: newRefreshToken };

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
};

export const changeCurrentPassword = async (user, { oldPassword, newPassword }) => {
    const isPasswordCorrect = await user.isPasswordMatched(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
};

export const updateAccountDetails = async (userId, { fullname, email, businessCategory }) => {
    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const updateFields = { fullname, email };
    if (businessCategory) updateFields.businessCategory = businessCategory;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: updateFields
        },
        { new: true }
    ).select("-password");

    return user;
};

export const updateUserAvatar = async (userId, avatarlocalpath) => {
    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return user;
};

export const updateUserCoverImage = async (userId, coverimagelocalpath) => {
    if (!coverimagelocalpath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    const coverimage = await uploadOnCloudinary(coverimagelocalpath);

    if (!coverimage.url) {
        throw new ApiError(400, "Error while uploading on cover image");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                coverimage: coverimage.url
            }
        },
        { new: true }
    ).select("-password");

    return user;
};



export const getAllUsers = async () => {
    const users = await User.find({}).select("-password -refreshToken");
    const totalCount = await User.countDocuments();
    return { users, totalCount };
}

export const getMerchantCustomers = async (merchantId) => {
    const customers = await User.find({ merchantId, role: "Customer" }).select("-password -refreshToken");
    return {
        customers,
        totalCount: customers.length
    };
}
