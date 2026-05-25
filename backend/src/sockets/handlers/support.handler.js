import * as supportService from "../../services/support.service.js";

/**
 * Support Socket Handlers
 */
export const registerSupportHandlers = (io, socket) => {
    // Join a ticket/room
    const handleJoin = (roomId) => {
        if (!roomId) return;
        socket.join(roomId);
        console.log(`🟢 ${socket.user.username} joined support room: ${roomId}`);
    };
    socket.on("join_ticket", handleJoin);
    socket.on("join_room", handleJoin);

    // Send a message within a ticket
    socket.on("send_message", async (data) => {
        const { roomId, content, contextType, contextId, messageType, tempId, replyTo } = data;
        console.log(`📩 Received socket "send_message" from user ${socket.user.username} (${socket.user.role}) for room [${roomId || contextId}] (tempId: ${tempId}): "${content?.substring(0, 30)}..."`);

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

            // Convert to plain object and append tempId so frontend deduplication matches
            const messageObject = message && typeof message.toObject === "function" 
                ? message.toObject() 
                : (message ? { ...message } : { ...data });
            messageObject.tempId = tempId;

            // 1. Acknowledge back to sender (SENT status)
            console.log(`   └─ Acknowledging & broadcasting message to room [${roomId || contextId}] (id: ${message?._id})`);
            socket.emit("message_sent", { tempId, messageId: message?._id, status: "SENT" });

            // 2. Broadcast to all participants in the room
            io.to(roomId || contextId).emit("receive_message", messageObject);
            
            // 3. Also emit 'new_message' for consistency with the controller
            io.to(roomId || contextId).emit("new_message", messageObject);
            
        } catch (err) {
            console.error("Socket Message Error:", err.message);
            socket.emit("error", { message: "Failed to send message: " + err.message });
        }
    });

    // Typing Indicators (Accepts { roomId } object or direct roomId string)
    socket.on("typing", (data) => {
        const roomId = typeof data === "string" ? data : data?.roomId;
        if (roomId) {
            socket.to(roomId).emit("user_typing", { userId: socket.user._id, username: socket.user.fullname });
        }
    });

    socket.on("stop_typing", (data) => {
        const roomId = typeof data === "string" ? data : data?.roomId;
        if (roomId) {
            socket.to(roomId).emit("user_stop_typing", { userId: socket.user._id });
        }
    });

    // Read Receipts (Accepts { roomId } object or direct roomId string)
    socket.on("mark_read", async (data) => {
        const roomId = typeof data === "string" ? data : data?.roomId;
        if (!roomId) return;
        try {
            const success = await supportService.markMessagesAsRead(roomId, socket.user._id);
            if (success) {
                io.to(roomId).emit("messages_read", { roomId, readerId: socket.user._id, readAt: new Date() });
            }
        } catch (err) {
            console.error("Read Receipt Error:", err.message);
        }
    });

    // Leave a ticket/room
    const handleLeave = (roomId) => {
        if (!roomId) return;
        socket.leave(roomId);
        console.log(`🟡 ${socket.user.username} left support room: ${roomId}`);
    };
    socket.on("leave_ticket", handleLeave);
    socket.on("leave_room", handleLeave);

};
