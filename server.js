import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import webRoutes from './routes/web.js';
import apiRoutes from './routes/api.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// database connection
connectDB();

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => console.log(`Application running on http://localhost:${PORT}`));