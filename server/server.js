import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import adminRoutes from "./routes/adminRoutes.js";
import alertRoutes from "./routes/alerts.js";
import authRoutes from './routes/authRoutes.js';
import busRoutes from "./routes/busRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import clubRoutes from './routes/clubRoutes.js';
import departmentRoutes from "./routes/departmentRoutes.js";
import eventRoutes from './routes/eventRoutes.js';
import faculty from "./routes/facultyRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import navigationRoutes from "./routes/navigationRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';
import roadmapRoutes from "./routes/roadmapRoutes.js";
import searchRoutes from './routes/searchRoutes.js';
import userRoutes from './routes/userRoutes.js';


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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);


const GEMINI_AI_KEY = process.env.GEMINI_AI; // Access the environment variable

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.options("/api/chat", cors());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const prompt = `You are UniSphere's helpful assistant. You specialize in university-related topics including academics, campus life, and student services. 
    Please provide a helpful, friendly response to: ${message}`;

    const result = await model.generateContent(prompt);
    const botResponse = result.response.text();

    return res.json({ text: botResponse });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: "Failed to process your message" });
  }
});

// Routes
app.use("/api/meals", mealRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/class", classRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/roadmap", roadmapRoutes); // Use roadmap routes
app.use("/api/faculty", faculty);
app.use("/api/navigation", navigationRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
