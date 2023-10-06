import mongoose from "mongoose";

// Схема для читательских билетов
const readerTicketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ticketNumber: {
        type: Number,
        unique: true,
        required: true,
    },
    dateIssued: {
        type: Date,
        required: true,
        default: Date.now,
    },
    expirationDate: {
        type: Date,
        required: true,
    }
});

const ReaderTicket = mongoose.model('ReaderTicket', readerTicketSchema, 'tickets');

export default ReaderTicket;
