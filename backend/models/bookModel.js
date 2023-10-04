import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishYear: {
        type: Number,
        required: true
    },
    idShelf: {
        type: Number,
        required: true
    },
    idRack: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    lastEventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookEvent'
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
