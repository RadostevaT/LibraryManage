import mongoose from "mongoose";

// Схема для событий с книгами
const bookEventSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    eventType: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'bookEvents',
    versionKey: false
});

const BookEvent = mongoose.model('BookEvent', bookEventSchema);

export default BookEvent;
