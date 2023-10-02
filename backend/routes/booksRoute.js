import express from 'express';
import {
    getAllBooks,
    getBookById,
    updateBookById,
    issueBook,
    returnBook
} from '../controllers/booksController.js';
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Маршруты для книг
router.route('/').get(protect, getAllBooks);
router.route('/:id').get(protect, getBookById);
router.route('/:id').put(protect, updateBookById);
router.route('/issue').post(protect, issueBook);
router.route('/return').post(protect, returnBook);

export default router;
