import mongoose from "mongoose";

// Схема для событий
const eventSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
}, {
    timestamps: true,
    collection: 'events',
    versionKey: false
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
