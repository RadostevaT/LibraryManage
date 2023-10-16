import express from 'express';
import {getAllEvents, getBookEventsByUser} from "../controllers/eventsController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/book-events/:id').get(protect, getBookEventsByUser);
router.route('/all-events').get(protect, getAllEvents);

export default router;
