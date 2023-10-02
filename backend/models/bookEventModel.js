import mongoose from "mongoose";

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
    collection: 'bookEvents'
});

const BookEvent = mongoose.model('BookEvent', bookEventSchema);

export default BookEvent;
