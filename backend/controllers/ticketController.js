import asyncHandler from 'express-async-handler';
import ReaderTicket from '../models/ticketModel.js';
import User from '../models/userModel.js';
import TicketEventModel from '../models/ticketEventModel.js';

// @desc    Create reader ticket for a user
// @route   POST /api/tickets/create
// @access  Private
const createTicket = asyncHandler(async (req, res, next) => {
    try {
        const {email} = req.body;

        async function generateUniqueTicketNumber() {
            const characters = '0123456789'; // Допустимые символы для номера билета
            const ticketLength = 8; // Длина номера билета

            let ticketNumber;
            let isUnique = false;

            // Генерируем уникальный номер билета, проверяя его на уникальность
            while (!isUnique) {
                ticketNumber = '';

                for (let i = 0; i < ticketLength; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    ticketNumber += characters[randomIndex];
                }

                // Проверяем, существует ли билет с таким номером
                const existingTicket = await ReaderTicket.findOne({ticketNumber});

                if (!existingTicket) {
                    isUnique = true; // Номер билета уникален
                }
            }

            return ticketNumber;
        }

        const ticketNumber = await generateUniqueTicketNumber();

        const user = await User.findOne({email});

        if (!user) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (user.readerTicket) {
            res.status(400);
            throw new Error('У пользователя уже есть активный читательский билет');
        }

        const dateIssued = new Date(); // Устанавливаем текущую дату и время

        // Создаем читательский билет
        const readerTicket = new ReaderTicket({
            user: user._id,
            ticketNumber,
            dateIssued,
            expirationDate: new Date(dateIssued.getTime() + 365 * 24 * 60 * 60 * 1000),
        });

        // Связываем билет с пользователем
        user.readerTicket = readerTicket._id;
        await user.save();

        // Сохраняем читательский билет
        const createdTicket = await readerTicket.save();

        // Создаем запись о событии создания билета
        const ticketEvent = new TicketEventModel({
            user: user._id,
            ticket: createdTicket._id,
            eventType: 'TicketCreated', // или другой подходящий тип события
        });

        await ticketEvent.save();

        res.status(201).json(createdTicket);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete reader ticket for a user
// @route   DELETE /api/tickets/delete
// @access  Private
const deleteTicket = asyncHandler(async (req, res, next) => {
    try {
        const {email, ticketNumber} = req.body;

        if (!email && !ticketNumber) {
            res.status(400);
            throw new Error('Параметр email или ticketNumber должен быть предоставлен');
        }

        let user;
        if (email) {
            user = await User.findOne({email});
        } else {
            // Если предоставлен параметр ticketNumber, найдем пользователя по билету
            const readerTicket = await ReaderTicket.findOne({ticketNumber});
            if (readerTicket) {
                user = await User.findById(readerTicket.user);
            }
        }

        if (!user) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        // Проверка, что у пользователя есть активный читательский билет
        if (!user.readerTicket) {
            res.status(400);
            throw new Error('У пользователя нет читательского билета');
        }

        // Найдем читательский билет пользователя
        const readerTicket = await ReaderTicket.findById(user.readerTicket);

        // Проверка действительности читательского билета
        const expirationDate = new Date(readerTicket.dateIssued);
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Дата истечения через 1 год

        if (Date.now() > expirationDate) {
            res.status(400);
            throw new Error('Читательский билет истек и не может быть удален');
        }

        // Удалим читательский билет
        if (readerTicket) {
            await ReaderTicket.deleteOne({_id: readerTicket._id});
        } else {
            // Обработка ситуации, когда readerTicket равен null
            res.status(404);
            throw new Error('Читательский билет не найден');
        }

        // Сбросим ссылку на читательский билет у пользователя
        user.readerTicket = null;
        await user.save();

        res.status(200).json({message: 'Читательский билет успешно удален'});
    } catch (error) {
        next(error);
    }
});

// @desc    Extend reader ticket expiration date
// @route   POST /api/tickets/extend
// @access  Private
const extendTicket = asyncHandler(async (req, res, next) => {
    try {
        const {ticketNumber} = req.body;
        let readerTicket; // Определите переменную readerTicket

        if (!ticketNumber) {
            res.status(400);
            throw new Error('Параметр ticketNumber должен быть предоставлен');
        }

        // Если предоставлен параметр ticketNumber, попробуйте найти билет по номеру
        if (ticketNumber) {
            readerTicket = await ReaderTicket.findOne({ticketNumber});
        }

        // Проверка действительности читательского билета
        const expirationDate = new Date(readerTicket.expirationDate); // Используйте expirationDate
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Увеличьте на 1 год

        // Обновите expirationDate на 1 год вперед от текущей даты
        const currentDate = new Date();
        readerTicket.expirationDate = new Date(currentDate);
        readerTicket.expirationDate.setFullYear(currentDate.getFullYear() + 1);

        // Сохраните обновленный читательский билет
        const updatedTicket = await readerTicket.save();

        // Создаем запись о событии создания билета
        const ticketEvent = new TicketEventModel({
            user: updatedTicket.user,
            ticket: updatedTicket._id,
            eventType: 'TicketUpdated', // или другой подходящий тип события
        });

        await ticketEvent.save();

        res.status(200).json({message: 'Читательский билет успешно продлен', updatedTicket});
    } catch (error) {
        next(error);
    }
});

// @desc    Get reader ticket for a user
// @route   GET /api/tickets/get-ticket-number
// @access  Public
const getTicketNumber = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400);
            throw new Error('Параметр userId должен быть предоставлен');
        }

        const user = await User.findById(userId).populate('readerTicket');

        if (!user) {
            res.status(404);
            throw new Error('Пользователь не найден');
        }

        if (!user.readerTicket) {
            res.status(404);
            throw new Error('У пользователя нет читательского билета');
        }

        const ticketNumber = user.readerTicket;

        res.status(200).json({ ticketNumber });
    } catch (error) {
        next(error);
    }
});

export {createTicket, deleteTicket, extendTicket, getTicketNumber};
