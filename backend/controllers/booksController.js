import asyncHandler from 'express-async-handler';
import Book from '../models/bookModel.js';

// Получение всех книг с возможностью поиска
const getAllBooks = asyncHandler(async (req, res) => {
    try {
        const { query } = req.query;
        let books;

        if (query) {
            books = await Book.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { author: { $regex: query, $options: 'i' } },
                ],
            });
        } else {
            books = await Book.find({});
        }

        res.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Получение одной книги по ID
const getBookById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Обновление книги по ID
const updateBookById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, publishYear } = req.body;

        if (!title || !author || !publishYear) {
            return res.status(400).json({ message: 'Send all fields' });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, req.body);

        if (updatedBook) {
            res.status(200).json({ message: 'Success' });
        } else {
            res.status(404).json({ message: 'Book not updated' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { getAllBooks, getBookById, updateBookById };
