import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter"
import { createClient } from "redis";
import { socketAuth } from "./middlewares.js";
import { registerSupportHandlers } from "./handlers/support.handler.js";

/**
 * Initialize Socket.io
 * @param {import("http").Server} httpServer 
 */
export const initializeSocket = async (httpServer) => {

    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();


    await Promise.all([pubClient.connect(), subClient.connect()]);

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            credentials: true
        },
        adapter: createAdapter(pubClient, subClient)
    });

    // Apply Middleware
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log(`🚀 Socket Connected: ${socket.user.username} (${socket.id})`);

        // Register Specific Handlers
        registerSupportHandlers(io, socket);

        // Global Disconnect handler
        socket.on("disconnect", () => {
            console.log(`🔌 Socket Disconnected: ${socket.id}`);
        });
    });

    return io;
};
