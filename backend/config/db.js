import mongoose from "mongoose";

// Функция для подключения к базе данных
const connectDB = async () => {
    try {
        // Подключение к MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Вывод сообщения об успешном подключении
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Вывод ошибки в случае неудачного подключения
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
