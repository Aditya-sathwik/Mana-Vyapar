import { Router } from "express";
import { 
    createTicket, 
    listTickets, 
    getTicketDetails, 
    addComment, 
    reassignTicket 
} from "../controllers/support.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Secure all support routes

router.route("/tickets")
    .post(createTicket)
    .get(listTickets);

router.route("/tickets/:ticketId")
    .get(getTicketDetails);

router.route("/tickets/:ticketId/comments")
    .post(addComment);

router.route("/tickets/:ticketId/reassign")
    .patch(reassignTicket);

export default router;
