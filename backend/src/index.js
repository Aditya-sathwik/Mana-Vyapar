// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js"
import { setupCronJobs } from "./queues/index.js";

dotenv.config({
    path: './.env'
})


import { createServer } from "http";
import { initializeSocket } from "./sockets/index.js";

const httpServer = createServer(app);

const io = await initializeSocket(httpServer);

// Attach io to app for use in controllers
app.set("io", io);

connectDB()
    .then(() => {
        // ⏰ Initialize Background Maintenance
        setupCronJobs().catch(err => console.error("❌ Cron Setup Failed:", err));

        httpServer.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
            console.log(`🚀 Socket.io initialized and ready`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })










/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/