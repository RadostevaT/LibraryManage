import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import cookieParser from 'cookie-parser';
import {notFound, errorHandler} from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const port = process.env.port || 5000;

await connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

import userRoutes from "./routes/userRoutes.js";
import booksRoute from "./routes/booksRoute.js";
import ticketRoute from "./routes/ticketRoute.js";

app.use('/api/users', userRoutes);
app.use('/api/books', booksRoute);
app.use('/api/tickets', ticketRoute);

app.get('/', (req, res) => res.send('Server is ready'));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
