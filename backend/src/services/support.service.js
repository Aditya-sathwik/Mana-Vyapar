import { SupportTicket } from "../models/SupportTicket.models.js";
import { User } from "../models/User.models.js";
import { ChatMessage } from "../models/ChatMessage.models.js";
import { ChatRoom } from "../models/ChatRoom.models.js";
import { ApiError } from "../utils/ApiError.js";
import { sendChatNotification } from "./notification.service.js";

/**
 * Automagically assigns a ticket to available support staff
 */
const autoAssignTicket = async (ticketId) => {
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) throw new ApiError(404, "Ticket not found");

    // Find all users with TICKET_MGMT permission
    const supportStaff = await User.find({
        permissions: { $in: ["TICKET_MGMT", "SUPPORT_ADMIN"] },
        isActive: true
    });

    if (supportStaff.length === 0) {
        console.warn("⚠️ No support staff available for auto-assignment");
        return null;
    }

    // Get workload for each staff member
    const staffWorkload = await Promise.all(
        supportStaff.map(async (staff) => {
            const count = await SupportTicket.countDocuments({
                assignedTo: staff._id,
                status: { $in: ["Open", "In Progress"] }
            });
            return { staffId: staff._id, count };
        })
    );

    // Sort by count and pick the least busy
    staffWorkload.sort((a, b) => a.count - b.count);
    const chosenStaff = staffWorkload[0].staffId;

    ticket.assignedTo = chosenStaff;
    ticket.assignedAt = new Date();
    if (ticket.status === "Open") ticket.status = "In Progress";

    await ticket.save();
    return chosenStaff;
};

const createTicket = async (merchantId, ticketData) => {
    const user = await User.findById(merchantId);
    if (!user) throw new ApiError(404, "Merchant not found");

    const ticket = await SupportTicket.create({
        merchantId,
        merchantName: user.fullname,
        merchantContact: {
            phone: user.phone,
            email: user.email
        },
        ...ticketData
    });

    // Create a ChatRoom for this ticket
    await ChatRoom.create({
        roomId: ticket.ticketNumber,
        type: "TICKET",
        participants: [merchantId],
        metadata: {
            ticketId: ticket._id,
            merchantId: merchantId
        }
    });

    // Attempt Auto-assignment
    await autoAssignTicket(ticket._id);

    return ticket;
};

const addTicketComment = async (ticketId, senderId, senderRole, messageData) => {
    const ticket = await SupportTicket.findOne({ $or: [{ ticketNumber: ticketId }, { _id: ticketId }] });
    if (!ticket) throw new ApiError(404, "Ticket not found");

    const { message, attachments, isInternal, messageType = "TEXT", tempId, replyTo } = messageData;

    // Persist as a ChatMessage
    const chatMessage = await ChatMessage.create({
        roomId: ticket.ticketNumber,
        sender: senderId,
        senderRole,
        messageType,
        content: message,
        attachments,
        isInternal,
        tempId,
        replyTo,
        status: "SENT"
    });

    await chatMessage.populate("sender", "fullname email avatar");
    if (replyTo) {
        await chatMessage.populate("replyTo", "content messageType");
    }
    // Update participants in ChatRoom if not already present
    await ChatRoom.findOneAndUpdate(
        { roomId: ticket.ticketNumber },
        { $addToSet: { participants: senderId } }
    );

    SupportTicket.findByIdAndUpdate(ticket._id, {
        lastActivityAt: new Date(),
        lastMessageSnippet: isInternal ? "Internal Note Added" : message.substring(0, 50),
        // Smart Automation: Update ticket status based on sender
        ...(senderRole === "Merchant" ? { status: "In Progress" } : { status: "Waiting for Customer" })
    }).exec();

    // Send Notification to the other party
    const receiverId = senderRole === "Merchant" ? ticket.assignedTo : ticket.merchantId;
    if (receiverId && !isInternal) {
        const sender = await User.findById(senderId).select("fullname");
        sendChatNotification(receiverId, sender?.fullname || "Support", ticket.ticketNumber, message.substring(0, 50));
    }

    return chatMessage;
};

const getChatHistory = async (roomId, userId, role, page = 1, limit = 50, search = "") => {
    const skip = (page - 1) * limit;

    const query = { roomId };

    // Search functionality
    if (search) {
        query.content = { $regex: search, $options: "i" };
    }

    // Hide internal messages from non-admins
    if (role !== "Admin") {
        query.isInternal = false;
    }

    const messages = await ChatMessage.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "fullname email avatar role")
        .populate("replyTo", "content messageType");

    return messages.reverse();

};


const markMessagesAsRead = async (roomId, readerId) => {
    const result = await ChatMessage.updateMany(
        {
            roomId,
            sender: { $ne: readerId }, // Don't mark your own messages as read
            status: { $ne: "READ" }
        },
        {
            $set: { status: "READ", readAt: new Date() }
        }
    );
    return result.modifiedCount > 0;
};


const getTicketDetails = async (ticketId, userId, role) => {
    const ticket = await SupportTicket.findById(ticketId).populate("assignedTo", "fullname email avatar");
    if (!ticket) throw new ApiError(404, "Ticket not found");

    // Check authorization
    if (role === "Merchant" && ticket.merchantId.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied to this ticket");
    }

    // Fetch message history from ChatMessage collection
    const messages = await ChatMessage.find({
        roomId: ticket.ticketNumber,
        ...(role === "Merchant" ? { isInternal: false } : {}) // Hide internal notes from merchants
    }).sort({ createdAt: 1 });

    return { ticket, messages };
};

const listTickets = async (userId, role, permissions = [], filters = {}) => {
    let query = {};

    if (role === "Merchant") {
        query.merchantId = userId;
    } else if (role === "Admin" || permissions.includes("TICKET_MGMT")) {
        // Admin or staff can see all, but maybe filtered by assignment
        if (filters.assignedToMe) {
            query.assignedTo = userId;
        }
    } else {
        throw new ApiError(403, "Unauthorized to list tickets");
    }

    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;

    return await SupportTicket.find(query).sort({ createdAt: -1 });
};

export {
    createTicket,
    addTicketComment,
    getTicketDetails,
    listTickets,
    autoAssignTicket,
    markMessagesAsRead,
    getChatHistory
};
