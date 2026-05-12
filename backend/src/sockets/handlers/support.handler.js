import * as supportService from "../../services/support.service.js";

/**
 * Support Socket Handlers
 */
export const registerSupportHandlers = (io, socket) => {
    // Join a ticket room
    socket.on("join_ticket", (ticketId) => {
        socket.join(ticketId);
        console.log(`🟢 ${socket.user.username} joined ticket room: ${ticketId}`);
    });

    // Send a message within a ticket
    socket.on("send_message", async (data) => {
        const { roomId, content, contextType, contextId, messageType, tempId, replyTo } = data;

        try {
            let message;
            // Map the socket event to the support service
            if (contextType === "TICKET" || contextId || roomId) {
                message = await supportService.addTicketComment(
                    contextId || roomId,
                    socket.user._id,
                    socket.user.role,
                    { message: content, messageType, tempId, replyTo }
                );
            }

            // 1. Acknowledge back to sender (SENT status)
            socket.emit("message_sent", { tempId, messageId: message?._id, status: "SENT" });

            // 2. Broadcast to all participants in the room
            io.to(roomId || contextId).emit("receive_message", message || data);
            
            // 3. Also emit 'new_message' for consistency with the controller
            io.to(roomId || contextId).emit("new_message", message || data);
            
        } catch (err) {
            console.error("Socket Message Error:", err.message);
            socket.emit("error", { message: "Failed to send message: " + err.message });
        }
    });

    // Typing Indicators
    socket.on("typing", ({ roomId }) => {
        socket.to(roomId).emit("user_typing", { userId: socket.user._id, username: socket.user.fullname });
    });

    socket.on("stop_typing", ({ roomId }) => {
        socket.to(roomId).emit("user_stop_typing", { userId: socket.user._id });
    });

    // Read Receipts
    socket.on("mark_read", async ({ roomId }) => {
        try {
            const success = await supportService.markMessagesAsRead(roomId, socket.user._id);
            if (success) {
                io.to(roomId).emit("messages_read", { roomId, readerId: socket.user._id, readAt: new Date() });
            }
        } catch (err) {
            console.error("Read Receipt Error:", err.message);
        }
    });

    // Leave a ticket room
    socket.on("leave_ticket", (ticketId) => {
        socket.leave(ticketId);
        console.log(`🟡 ${socket.user.username} left ticket room: ${ticketId}`);
    });
};
