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
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
