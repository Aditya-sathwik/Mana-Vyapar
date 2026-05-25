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
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                const allowedPatterns = [
                    /^http:\/\/localhost:\d+$/,
                    /^http:\/\/.*\.lvh\.me:\d+$/
                ];

                const isAllowed = allowedPatterns.some(pattern => pattern.test(origin)) ||
                    origin === process.env.CORS_ORIGIN ||
                    process.env.CORS_ORIGIN === "*";

                if (isAllowed) {
                    callback(null, origin);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
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
