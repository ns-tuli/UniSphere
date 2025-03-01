// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const mealRoutes = require("./routes/mealRoutes");
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import errorHandler from './middlewares/error.js';
import authRoutes from './routes/auth.js';
import mealRoutes from "./routes/mealRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/api/meals", mealRoutes);
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/auth', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});