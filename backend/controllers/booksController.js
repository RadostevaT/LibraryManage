import asyncHandler from 'express-async-handler';
import Book from '../models/bookModel.js';
import Event from "../models/eventModel.js";
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
            books = await Book.find({})
                .populate({
                    path: 'lastEventId',
                    populate: {
                        path: 'user',
                    },
                });
        }

        res.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Произошла ошибка'});
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
            res.status(404).json({message: 'Книга не найдена'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Произошла ошибка'});
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
            return res.status(400).json({message: 'Заполните все поля'});
        }

        const updatedBook = await Book.findByIdAndUpdate(id, req.body);

        if (updatedBook) {
            res.status(200).json({message: 'Успешно'});
        } else {
            res.status(404).json({message: 'Книга не обновлена'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
});

// @desc    Issue a book
// @route   POST /api/books/issue
// @access  Private
const issueBook = asyncHandler(async (req, res) => {
    try {
        const {userId, bookId} = req.body;

        // Проверка доступности книги
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({message: 'Книга не найдена'});
        }

        if (!book.available) {
            return res.status(400).json({message: 'Книга недоступна для выдачи'});
        }

        // Проверка наличия читательского билета у пользователя
        const user = await User.findById(userId);

        if (!user || !user.readerTicket) {
            return res.status(400).json({message: 'У пользователя нет читательского билета'});
        }

        // Обновление доступности книги
        book.available = false;

        // Создание записи о событии выдачи книги
        const bookEvent = new Event({
            user: userId,
            book: bookId,
            eventType: 'BookIssued',
        });

        await bookEvent.save();

        book.lastEventId = bookEvent._id;

        await book.save();

        res.status(200).json({message: 'Книга успешно выдана'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Произошла ошибка при выдаче книги'});
    }
});

// @desc    Return a book
// @route   POST /api/books/return
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
    try {
        const {bookId, userId} = req.body;

        // Проверка существования книги по указанному ID
        const book = await Book.findById(bookId);

        if (!book || book.available) {
            return res.status(404).json({message: 'Книгу нельзя вернуть'});
        }

        // Обновление доступности книги
        book.available = true;

        // Создание записи о событии возврата книги
        const createBookEvent = new Event({
            user: userId,
            book: bookId,
            eventType: 'BookReturned',
        });

        await createBookEvent.save();
        book.lastEventId = createBookEvent._id;

        await book.save();

        res.status(200).json({message: 'Книга успешно возвращена'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Произошла ошибка при возврате книги'});
    }
});

export {getAllBooks, getBookById, updateBookById, issueBook, returnBook};
