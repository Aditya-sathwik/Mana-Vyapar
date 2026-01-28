import mongoose from "mongoose";
import { User } from "../models/User.models.js";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";

dotenv.config({ path: "./.env" });

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
        console.log(`Connected to DB: ${DB_NAME}`);

        const user = await User.findOne({ email: "aditya@mail.com" });
        if (user) {
            console.log("✅ User Found!");
            console.log("Email:", user.email);
            console.log("Role:", user.role);
            console.log("ID:", user._id);
        } else {
            console.log("❌ User NOT Found in DB");
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAdmin();
