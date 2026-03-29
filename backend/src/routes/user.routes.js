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
    getAllUsers
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utlis/asynchandler.js";
import { ApiResponse } from "../utlis/apiresponse.js";
import { User } from "../models/User.models.js";

const router = Router();

// --- PUBLIC ROUTES ---
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// --- SECURED ROUTES ---
router.use(verifyJWT);

// Auth Actions
router.route("/logout").post(logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Image updates
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverimage"), updateUserCoverImage);

// --- MASTER CONTROL (Super Admin Only) ---
router.route("/admin/all-merchants").get(
    restrictTo("Super Admin"),
    asyncHandler(async (req, res) => {
        const merchants = await User.find({ role: "Merchant" }).select("-password -refreshToken");
        return res.status(200).json(
            new ApiResponse(200, merchants, "All merchants fetched successfully")
        );
    })
);


router.route("/admin/all-users").get(
    verifyJWT,
    restrictTo("Super Admin"),
    getAllUsers
);

export default router;
