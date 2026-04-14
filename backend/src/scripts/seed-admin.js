import mongoose from "mongoose";
import { User } from "../models/User.models.js";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";

dotenv.config({ path: "./.env" });

const createMasterAdmin = async () => {
    try {
        console.log(`Connecting to MongoDB (DB: ${DB_NAME})...`);
        await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
        console.log("Connected ✅");

        const adminData = {
            fullname: "Aditya Master Admin",
            username: "aditya_master",
            email: "aditya@mail.com",
            password: "$@thU17723",
            role: "Admin",
            isVerified: true
        };

        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log("⚠️ Master Admin already exists updating password and role...");
            existingAdmin.password = adminData.password;
            existingAdmin.role = adminData.role;
            await existingAdmin.save();
            console.log("Master Admin updated successfully ✅");
        } else {
            await User.create(adminData);
            console.log("Master Admin created successfully ✅");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating master admin:", error);
        process.exit(1);
    }
};

createMasterAdmin();
