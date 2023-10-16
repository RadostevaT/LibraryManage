import asyncHandler from 'express-async-handler';
import Event from "../models/eventModel.js";

// @desc    Get BookEvents by user id
// @route   GET api/events/book-events/:id
// @access  Private
const getBookEventsByUser = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const bookEvents = await Event.find({user: id, eventType: /Book/})
            .populate('book')
            .populate('user');

        if (bookEvents) {
            res.status(200).json(bookEvents);
        } else {
            res.status(404).json({message: 'Книги не найдены'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Произошла ошибка'});
    }
});

// @desc    Get ALL Events
// @route   GET /api/events/all-events
// @access  Private
const getAllEvents = asyncHandler(async (req, res) => {
    try {
        // Получаем все события из коллекции BookEvent
        const Events = await Event.find({})
            .populate('user')
            .populate('book')
            .sort({createdAt: 'desc'});

        // Сортируем события по дате создания в убывающем порядке
        Events.sort((a, b) => b.createdAt - a.createdAt);

        res.json(Events);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Внутренняя ошибка сервера'});
    }
});

export {getAllEvents, getBookEventsByUser};
