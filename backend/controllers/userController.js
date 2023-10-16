import asyncHandler from 'express-async-handler';
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import EventModel from "../models/eventModel.js";

const MIN_PASSWORD_LENGTH = 6;
const fullNamePattern = /^[\p{L}\s'-]+$/u;

// @desc    Auth user/set token
// route    POST /api/users/token
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error('Неправильный логин или пароль');
    }
});

// @desc    Register a new user
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});

    if (userExists) {
        res.status(400);
        throw new Error('Пользователь с таким email уже существует');
    }

    if (!fullNamePattern.test(name)) {
        res.status(400);
        throw new Error('Некорректное ФИО. Допустимы только буквы, пробелы, дефисы и апострофы.');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        res.status(400);
        throw new Error(`Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`);
    }

    const user = await User.create({
        name,
        email,
        password,
        isAdmin: false,
        readerTicket: {
            ticketNumber: null,
            dateIssued: null,
            expirationDate: null,
        }
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Logout user
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({message: 'User logged out'});
});

// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        readerTicket: req.user.readerTicket,
    };

    res.status(200).json(user);
});

// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all readers with the option to search by name
// route    GET /api/users/all-readers
// @access  Private (only for admin users)
const getAllReaders = asyncHandler(async (req, res) => {
    let {query} = req.query;

    const filters = {
        isAdmin: false,
    };

    if (query) {
        query = decodeURIComponent(query);
        if (!isNaN(query)) {
            // Если "query" является числом, то ищем по номеру читательского билета
            filters['readerTicket.ticketNumber'] = parseInt(query);
        } else {
            // Если "query" не является числом, то ищем по имени
            filters.name = { $regex: query, $options: 'i' };
        }
    }

    const readers = await User.find(filters);

    res.status(200).json(readers);
});

// @desc    Create reader ticket for a user
// @route   POST /api/users/create-reader-ticket
// @access  Private
const createReaderTicket = asyncHandler(async (req, res, next) => {
    try {
        const {userId} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (user.readerTicket && user.readerTicket.ticketNumber !== null) {
            res.status(400);
            throw new Error('У пользователя уже есть активный читательский билет');
        }

        // Генерация уникального номера билета
        async function generateUniqueTicketNumber() {
            const characters = '0123456789';
            const ticketLength = 8;
            let ticketNumber;
            let isUnique = false;

            while (!isUnique) {
                ticketNumber = '';

                for (let i = 0; i < ticketLength; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    ticketNumber += characters[randomIndex];
                }

                const existingUserWithTicket = await User.findOne({'readerTicket.ticketNumber': ticketNumber});

                if (!existingUserWithTicket) {
                    isUnique = true;
                }
            }

            return ticketNumber;
        }

        const ticketNumber = await generateUniqueTicketNumber();

        // Создание читательского билета
        const readerTicket = {
            ticketNumber,
            dateIssued: new Date(),
            expirationDate: new Date()
        };

        readerTicket.expirationDate.setFullYear(readerTicket.expirationDate.getFullYear() + 1);

        // Связывание билета с пользователем
        user.readerTicket = readerTicket;

        await user.save();

        // Создание записи о событии создания билета
        const ticketEvent = new EventModel({
            user: user._id,
            ticket: user.readerTicket,
            eventType: 'TicketCreated'
        });

        await ticketEvent.save();

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete reader ticket for a user
// @route   DELETE /api/users/delete-reader-ticket
// @access  Private
const deleteReaderTicket = asyncHandler(async (req, res, next) => {
    try {
        const {userId} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (!user.readerTicket || user.readerTicket.ticketNumber === null) {
            res.status(400);
            throw new Error('У пользователя нет читательского билета');
        }

        user.readerTicket = {
            ticketNumber: null,
            dateIssued: null,
            expirationDate: null,
        }

        await user.save();

        res.status(200).json({message: 'Читательский билет успешно удален'});
    } catch (error) {
        next(error);
    }
});

// @desc    Extend reader ticket expiration date
// @route   POST /api/users/extend-reader-ticket
// @access  Private
const extendReaderTicket = asyncHandler(async (req, res, next) => {
    try {
        const {userId} = req.body;

        const user = await User.findById(userId);

        if (!user.readerTicket || user.readerTicket.ticketNumber === null) {
            res.status(400);
            throw new Error('У пользователя нет читательского билета');
        }

        const currentDate = new Date();
        user.readerTicket.expirationDate = new Date(currentDate);
        user.readerTicket.expirationDate.setFullYear(currentDate.getFullYear() + 1);

        const updatedUser = await user.save();

        // Создание записи о событии продления билета
        const ticketEvent = new EventModel({
            user: user._id,
            ticket: user.readerTicket,
            eventType: 'TicketUpdated'
        });

        await ticketEvent.save();

        res.status(200).json({message: 'Читательский билет успешно продлен', updatedUser});
    } catch (error) {
        next(error);
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllReaders,
    createReaderTicket,
    deleteReaderTicket,
    extendReaderTicket
}
