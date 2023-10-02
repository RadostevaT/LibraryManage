import asyncHandler from 'express-async-handler';
import Book from '../models/bookModel.js';
import BookEvent from "../models/bookEventModel.js";
import User from "../models/userModel.js";

// @desc    Get ALL books with an option search
// @route   GET /api/books
// @access  Private
const getAllBooks = asyncHandler(async (req, res) => {
    try {
        const {query} = req.query;
        let books;

        if (query) {
            books = await Book.find({
                $or: [
                    {title: {$regex: query, $options: 'i'}},
                    {author: {$regex: query, $options: 'i'}},
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
        res.status(500).json({message: 'Something went wrong'});
    }
});

// @desc    Get ONE book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({message: 'Book not found'});
        }
    } catch (error) {
        res.status(500).json({message: 'Something went wrong'});
    }
});

// @desc    Update a book
// @route   POST /api/books/:id
// @access  Private
const updateBookById = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const {title, author, publishYear} = req.body;

        if (!title || !author || !publishYear) {
            return res.status(400).json({message: 'Send all fields'});
        }

        const updatedBook = await Book.findByIdAndUpdate(id, req.body);

        if (updatedBook) {
            res.status(200).json({message: 'Success'});
        } else {
            res.status(404).json({message: 'Book not updated'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// @desc    Issue a book
// @route   POST /api/books/issue
// @access  Private
const issueBook = asyncHandler(async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        // Проверьте, доступна ли книга
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Книга не найдена' });
        }

        if (!book.available) {
            return res.status(400).json({ message: 'Книга недоступна для выдачи' });
        }

        // Проверьте наличие у пользователя читательского билета
        const user = await User.findById(userId);

        if (!user || !user.readerTicket) {
            return res.status(400).json({ message: 'У пользователя нет читательского билета' });
        }

        // Обновите доступность книги
        book.available = false;
        await book.save();

        // Создайте запись о событии выдачи книги
        const bookEvent = new BookEvent({
            user: userId,
            book: bookId,
            eventType: 'BookIssued',
        });

        await bookEvent.save();

        res.status(200).json({ message: 'Книга успешно выдана' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Произошла ошибка при выдаче книги' });
    }
});

// @desc    Return a book
// @route   POST /api/books/return
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        // Проверьте, существует ли книга с указанным ID
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Книга не найдена' });
        }

        // Проверьте, доступна ли книга для возврата
        if (book.available) {
            return res.status(400).json({ message: 'Книга уже доступна' });
        }

        // Обновите доступность книги
        book.available = true;
        await book.save();

        // Создайте запись о событии возврата книги
        const bookEvent = new BookEvent({
            user: userId,
            book: bookId,
            eventType: 'BookReturned',
        });

        await bookEvent.save();

        res.status(200).json({ message: 'Книга успешно возвращена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Произошла ошибка при возврате книги' });
    }
});

export {getAllBooks, getBookById, updateBookById, issueBook, returnBook};
