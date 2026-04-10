// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app}from "./app.js"
import { setupCronJobs } from "./queues/index.js";

dotenv.config({
    path: './.env'
})



import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true
    }
});

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

    // Socket.io Logic
    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`👥 User ${socket.id} joined room: ${roomId}`);
        });

        socket.on("send_message", (data) => {
            // Broadcast to the specifically joined room (ticket ID)
            io.to(data.roomId).emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });
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