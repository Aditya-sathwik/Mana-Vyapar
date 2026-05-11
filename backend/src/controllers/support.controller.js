import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as supportService from "../services/support.service.js";

const createTicket = asyncHandler(async (req, res) => {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
        throw new ApiError(400, "Title, description, and category are required");
    }

    const ticket = await supportService.createTicket(req.user._id, {
        title,
        description,
        category,
        priority
    });

    return res.status(201).json(
        new ApiResponse(201, ticket, "Ticket created successfully and assigned to an agent")
    );
});

const listTickets = asyncHandler(async (req, res) => {
    const { status, priority, assignedToMe } = req.query;
    
    const tickets = await supportService.listTickets(
        req.user._id, 
        req.user.role, 
        req.user.permissions, 
        { status, priority, assignedToMe: assignedToMe === "true" }
    );

    return res.status(200).json(
        new ApiResponse(200, tickets, "Tickets fetched successfully")
    );
});

const getTicketDetails = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    const details = await supportService.getTicketDetails(
        ticketId, 
        req.user._id, 
        req.user.role
    );

    return res.status(200).json(
        new ApiResponse(200, details, "Ticket details fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const { message, isInternal, attachments } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    const comment = await supportService.addTicketComment(
        ticketId,
        req.user._id,
        req.user.role,
        { message, isInternal, attachments }
    );

    // Get Socket.io instance and broadcast
    const io = req.app.get("io");
    if (io) {
        io.to(comment.roomId).emit("new_message", comment);
    }

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
});

const reassignTicket = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    // Only Admin or users with TICKET_MGMT can reassign
    if (req.user.role !== "Admin" && !req.user.permissions?.includes("TICKET_MGMT")) {
        throw new ApiError(403, "You do not have permission to reassign tickets");
    }

    const newStaffId = await supportService.autoAssignTicket(ticketId);

    return res.status(200).json(
        new ApiResponse(200, { assignedTo: newStaffId }, "Ticket reassigned successfully")
    );
});

export {
    createTicket,
    listTickets,
    getTicketDetails,
    addComment,
    reassignTicket
};
