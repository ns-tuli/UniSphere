// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const mealRoutes = require("./routes/mealRoutes");

import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cors from "cors";
import connectDB from "./config/db.js";
import mealRoutes from "./routes/mealRoutes.js";
import busRoutes from "./routes/busRoutes.js"
import classRoutes from "./routes/classRoutes.js"
import departmentRoutes from "./routes/departmentRoutes.js"
import roadmapRoutes from "./routes/roadmapRoutes.js";
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const GEMINI_AI_KEY = process.env.GEMINI_AI; // Access the environment variable

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_AI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

app.options('/api/chat', cors());



app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Define the prompt
    const prompt = `You are a formal assistant. Answer the following question in formal English: ${message}`;

    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);
    const botResponse = result.response.text();

    // Send the response back to the client
    return res.json({ text: botResponse });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ error: 'Failed to process your message' });
  }
});

// Routes
app.use("/api/meals", mealRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/class", classRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/roadmap", roadmapRoutes); // Use roadmap routes
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/quiz", quizRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let gfsBucket;

mongoose.connection.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
  app.locals.gfsBucket = gfsBucket;
  app.locals.db = mongoose.connection.db;
  console.log('GridFSBucket initialized.');
});