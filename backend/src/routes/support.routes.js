import { Router } from "express";
import { 
    createTicket, 
    listTickets, 
    getTicketDetails, 
    addComment, 
    reassignTicket,
    uploadAttachment 
} from "../controllers/support.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

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

router.route("/upload-attachment")
    .post(upload.single("attachment"), uploadAttachment);

export default router;
