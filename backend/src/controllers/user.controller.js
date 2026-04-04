import { asyncHandler } from "../utlis/asynchandler.js";
import { ApiError } from '../utlis/apierror.js'
import { ApiResponse } from "../utlis/apiresponse.js";
import * as userService from "../services/user.service.js";
import { createAuditLog } from "../services/audit.service.js";
import { getResolvedConfig } from "../services/config.service.js";

/**
 * Controller to handle user registration.
 */
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password, phone, businessName, role, merchantId } = req.body;

    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const allowedRoles = ["Customer", "Merchant"];
    if (role && !allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid role requested for Registration");
    }

    const avatarlocalpath = req.files?.avatar ? req.files.avatar[0]?.path : null;
    const coverimagelocalpath = req.files?.coverimage ? req.files.coverimage[0]?.path : null;

    const user = await userService.registerUser({
        fullname,
        username,
        email,
        password,
        phone,
        businessName,
        role: role || "Merchant",
        merchantId,
        avatarlocalpath,
        coverimagelocalpath
    });

    return res.status(201).json(
        new ApiResponse(201, user, "User registered successfully")
    );
});

/**
 * Controller to handle user login.
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password, phone } = req.body;

    const { user, accessToken, refreshToken } = await userService.loginUser({
        email,
        username,
        password,
        phone
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    // 📜 Audit Log (Non-await)
    createAuditLog({
        userId: user._id,
        merchantId: user.merchantId || user._id,
        action: "USER_LOGIN",
        req
    });

    // ⚙️ Resolve Dynamic Config (Features/UI)
    const config = await getResolvedConfig(user.tier, user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user, config, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

/**
 * Controller to handle user logout.
 */
const logoutUser = asyncHandler(async (req, res) => {
    await userService.logoutUser(req.user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

/**
 * Controller to refresh access token using refresh token.
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const { accessToken, refreshToken } = await userService.refreshAccessToken(incomingRefreshToken);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            )
        );
});

/**
 * Controller to change current user's password.
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    await userService.changeCurrentPassword(req.user, { oldPassword, newPassword });

    // 📜 Audit Log (Non-await)
    createAuditLog({
        userId: req.user._id,
        merchantId: req.user.merchantId || req.user._id,
        action: "PASSWORD_CHANGED",
        req
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

/**
 * Controller to get current user details.
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    // ⚙️ Resolve Dynamic Config for current session
    const config = await getResolvedConfig(req.user.tier, req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, { user: req.user, config }, "Current user fetched successfully"));
});

/**
 * Controller to update account details (excluding images).
 */
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    const user = await userService.updateAccountDetails(req.user._id, { fullname, email });

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});

/**
 * Controller to update user avatar.
 */
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarlocalpath = req.file?.path;

    const user = await userService.updateUserAvatar(req.user._id, avatarlocalpath);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

/**
 * Controller to update user cover image.
 */
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverimagelocalpath = req.file?.path;

    const user = await userService.updateUserCoverImage(req.user._id, coverimagelocalpath);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

// fetch all users

const getAllUsers = asyncHandler(async (req, res) => {
    const { users, totalCount } = await userService.getAllUsers();
    return res
        .status(200)
        .json(new ApiResponse(200, { users, totalCount }, "All users fetched successfully"));
});

const getMerchantCustomers = asyncHandler(async (req, res) => {
    const { customers, totalCount } = await userService.getMerchantCustomers(req.user._id);
    return res
        .status(200)
        .json(new ApiResponse(200, { customers, totalCount }, "Merchant customers fetched successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getAllUsers,
    getMerchantCustomers
};