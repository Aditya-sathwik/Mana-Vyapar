import { SupportTicket } from "../models/SupportTicket.models.js";
import { User } from "../models/User.models.js";
import { ChatMessage } from "../models/ChatMessage.models.js";
import { ChatRoom } from "../models/ChatRoom.models.js";
import { ApiError } from "../utils/ApiError.js";

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
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) throw new ApiError(404, "Ticket not found");

    const { message, attachments, isInternal } = messageData;

    // Add to ticket updates array (for legacy/history)
    await ticket.addUpdate(message, senderId, senderRole, attachments, isInternal);

    // Persist as a ChatMessage
    const chatMessage = await ChatMessage.create({
        roomId: ticket.ticketNumber,
        sender: senderId,
        senderRole,
        content: message,
        attachments,
        isInternal
    });

    // Update participants in ChatRoom if not already present
    await ChatRoom.findOneAndUpdate(
        { roomId: ticket.ticketNumber },
        { $addToSet: { participants: senderId } }
    );

    return chatMessage;
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
    autoAssignTicket
};
