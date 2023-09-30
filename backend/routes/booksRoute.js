import express from 'express';
import {
    getAllBooks,
    getBookById,
    updateBookById,
} from '../controllers/booksController.js';

const router = express.Router();

// Маршруты для книг
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBookById);

export default router;
