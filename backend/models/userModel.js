import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Схема для пользователей
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    readerTicket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReaderTicket',
        unique: true,
    },
}, {
    timestamps: true
});

// Хэширование пароля перед сохранением пользователя
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Метод для проверки совпадения паролей
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;
