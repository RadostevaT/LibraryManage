import express from 'express';
import {createTicket, deleteTicket, extendTicket, getTicketNumber} from "../controllers/ticketController.js";
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/create').post(protect, createTicket);
router.route('/delete').delete(protect, deleteTicket);
router.route('/extend').post(protect, extendTicket);
router.route('/get-ticket-number').get(protect, getTicketNumber);

export default router;
