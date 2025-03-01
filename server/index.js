import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to database
await connectDB();

// Routes
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/auth', authRoutes);

// Error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));