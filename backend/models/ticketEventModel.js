import mongoose from "mongoose";

// Схема для событий читательских билетов
const ticketEventSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReaderTicket',
        required: true
    },
    eventType: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'ticketEvents',
    versionKey: false
});

const TicketEvent = mongoose.model('TicketEvent', ticketEventSchema);

export default TicketEvent;
