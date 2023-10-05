import asyncHandler from 'express-async-handler';
import BookEvent from "../models/bookEventModel.js";
import TicketEvent from "../models/ticketEventModel.js";

// @desc    Get ALL BookEvent
// @route   GET /api/events/book-events
// @access  Private
const getAllBookEvents = asyncHandler(async (req, res) => {
    try {
        const bookEvents = await BookEvent.find({})
            .populate('user')
            .populate('book')
            .sort({createdAt: 'desc'});
        res.json(bookEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

// @desc    Get ALL BookEvent
// @route   GET /api/events/ticket-events
// @access  Private
const getAllTicketEvents = asyncHandler(async (req, res) => {
    try {
        const ticketEvents = await TicketEvent.find()
            .populate('user')
            .populate('ticket')
            .sort({createdAt: 'desc'});
        res.json(ticketEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

// @desc    Get ALL Events (BookEvent and TicketEvent)
// @route   GET /api/events/all-events
// @access  Private
const getAllEvents = asyncHandler(async (req, res) => {
    try {
        // Получаем все события из коллекции BookEvent
        const bookEvents = await BookEvent.find({})
            .populate('user')
            .populate('book')
            .sort({createdAt: 'desc'});

        // Получаем все события из коллекции TicketEvent
        const ticketEvents = await TicketEvent.find()
            .populate('user')
            .populate('ticket')
            .sort({createdAt: 'desc'});

        // Объединяем оба массива событий
        const allEvents = [...bookEvents, ...ticketEvents];

        // Сортируем события по дате создания в убывающем порядке
        allEvents.sort((a, b) => b.createdAt - a.createdAt);

        res.json(allEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

export {getAllBookEvents, getAllTicketEvents, getAllEvents};
