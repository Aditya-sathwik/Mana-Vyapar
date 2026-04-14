import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.models.js";
import { authLimiter } from "../middlewares/ratelimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

// --- PUBLIC ROUTES ---
router.route("/register").post(
    authLimiter,
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 }
    ]),
    validate(registerSchema),
    registerUser
);

router.route("/login").post(
    authLimiter,
    validate(loginSchema),
    loginUser
);
router.route("/refresh-token").post(refreshAccessToken);

// --- SECURED ROUTES ---
router.use(verifyJWT);

// Auth Actions
router.route("/logout").post(logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Merchant Specific
router.route("/merchant-customers").get(
    verifyJWT, 
    restrictTo("Merchant"), 
    getMerchantCustomers
);

// Image updates
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverimage"), updateUserCoverImage);

// --- MASTER CONTROL (Admin Only) ---
router.route("/admin/all-merchants").get(
    restrictTo("Admin"),
    asyncHandler(async (req, res) => {
        const merchants = await User.find({ role: "Merchant" }).select("-password -refreshToken");
        return res.status(200).json(
            new ApiResponse(200, merchants, "All merchants fetched successfully")
        );
    })
);

router.route("/admin/user/:userId/features").patch(
    restrictTo("Admin"),
    asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const { features } = req.body;

        if (!Array.isArray(features)) {
            return res.status(400).json(new ApiResponse(400, null, "Features must be an array"));
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { features },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        return res.status(200).json(
            new ApiResponse(200, user, "User features updated successfully")
        );
    })
);


router.route("/admin/all-users").get(
    verifyJWT,
    restrictTo("Admin"),
    getAllUsers
);

export default router;
