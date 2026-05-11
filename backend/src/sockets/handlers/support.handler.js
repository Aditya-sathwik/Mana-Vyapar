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
        const { roomId, content, contextType, contextId } = data;

        try {
            let message;
            // Map the socket event to the support service
            if (contextType === "TICKET" || contextId) {
                message = await supportService.addTicketComment(
                    contextId || roomId,
                    socket.user._id,
                    socket.user.role,
                    { message: content }
                );
            }

            // Broadcast to all participants in the room
            io.to(roomId || contextId).emit("receive_message", message || data);
            
            // Also emit 'new_message' for consistency with the controller
            io.to(roomId || contextId).emit("new_message", message || data);
            
        } catch (err) {
            console.error("Socket Message Error:", err.message);
            socket.emit("error", { message: "Failed to send message: " + err.message });
        }
    });

    // Leave a ticket room
    socket.on("leave_ticket", (ticketId) => {
        socket.leave(ticketId);
        console.log(`🟡 ${socket.user.username} left ticket room: ${ticketId}`);
    });
};
