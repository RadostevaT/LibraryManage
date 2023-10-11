import express from 'express';
import {getAllBookEvents, getAllEvents, getAllTicketEvents, getBookEventsByUser} from "../controllers/eventsController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/book-events').get(protect, getAllBookEvents);
router.route('/book-events/:id').get(protect, getBookEventsByUser);
router.route('/ticket-events').get(protect, getAllTicketEvents);
router.route('/all-events').get(protect, getAllEvents);

export default router;
