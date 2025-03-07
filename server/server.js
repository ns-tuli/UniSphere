import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import mongoose from "mongoose"
import connectDB from "./config/db.js";
import faqData from "./data/faq_training_data.js"; // Fix import path
import adminRoutes from "./routes/adminRoutes.js";

import alertRoutes from "./routes/alerts.js";
import virtualQuizRoutes from "./routes/api/virtualQuiz.js";
import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import cookieParser from 'cookie-parser';
import faculty from "./routes/facultyRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import navigationRoutes from "./routes/navigationRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import studentRoutes from "./routes/studentDataRoutes.js";
import eventRoutes from './routes/eventRoutes.js';

import emailRoutes from './routes/emailRoutes.js';
import http from "http";
import { Server } from "socket.io";
import classroomRoutes from "./routes/classroomRoutes.js";
import newsRoutes from './routes/newsRoutes.js';  // Fixed missing quotes
import bodyParser from 'body-parser';
import quizRoutes from "./routes/quizRoutes.js"; // Import the quiz routes
import uploadRoutes from "./routes/uploadRoutes.js"; // Routes for file uploads

import { createServer } from "http";
import initializeSocketServer from "./socket-server.js";
import roadmapRoutes from './routes/roadmapRoutes.js';
import studentRoutes from "./routes/studentDataRoutes.js";
import userRoutes from './routes/userRoutes.js';

import bodyParser from 'body-parser';
import http from "http";
import { Server } from "socket.io";
import classroomRoutes from "./routes/classroomRoutes.js";
import newsRoutes from './routes/newsRoutes.js'; // Fixed missing quotes
import uploadRoutes from "./routes/uploadRoutes.js"; // Routes for file uploads

import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import menuRoutes from './routes/menuRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';




dotenv.config();

connectDB();

const app = express();

// CORS configuration - must be before any routes
app.use(
  cors({
    origin: ["http://localhost:5175", "http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"] // Add PUT and DELETE here
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files - make sure this is before any routes
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// Get the current file's directory path using import.meta.url
const __dirname = new URL('.', import.meta.url).pathname;
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// Create uploads directory if it doesn't exist
import { mkdir } from "fs/promises";
try {
  await mkdir("uploads", { recursive: true });
  console.log("Uploads directory created or already exists");
} catch (err) {
  if (err.code !== "EEXIST") {
    console.error("Error creating uploads directory:", err);
  }
}

const GEMINI_AI_KEY = process.env.GEMINI_AI; // Access the environment variable

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.options("/api/chat", cors());

// Add this function before the chat endpoint
const findRelevantFAQs = (message) => {
  const relevantFAQs = [];
  
  // Search through all categories
  Object.values(faqData.faqTrainingData).forEach(category => {
    Object.values(category).forEach(subcategory => {
      subcategory.forEach(qa => {
        if (qa.question.toLowerCase().includes(message.toLowerCase()) ||
            qa.answer.toLowerCase().includes(message.toLowerCase())) {
          relevantFAQs.push(qa);
        }
      });
    });
  });
  
  return relevantFAQs.slice(0, 2); // Return top 2 matches
};

// Chat endpoint with specific CORS handling
app.post("/api/chat", cors(), async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const relevantFAQs = findRelevantFAQs(message);
    const faqContext = relevantFAQs.map(faq => 
      `Q: ${faq.question}\nA: ${faq.answer}`
    ).join('\n\n');

    const prompt = `You are UniSphere's helpful assistant. You specialize in university-related topics including academics, campus life, and student services.
    
Here are some relevant FAQ entries that might help:
${faqContext}

Based on this context and your knowledge, please provide a helpful, friendly response to: ${message}`;

    const result = await model.generateContent(prompt);
    const botResponse = result.response.text();

    return res.json({ text: botResponse });
  } catch (error) {
    console.error("Error calling Gemini API:", error);y
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
app.use("/api/student", studentRoutes);
app.use("/api/lostfound", lostFoundRoutes);
app.use("/api/virtual-quiz", virtualQuizRoutes);
app.use('/api/email', emailRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
app.use("/api/classroom", classroomRoutes);
app.use("/api/news", newsRoutes);  // Fixed route path
app.use("/api/uploads", uploadRoutes); // Use the upload routes
app.use('/api/user',userRoutes)
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use("/api/events", eventRoutes); // Use the upload routes
app.use("/api/clubs", clubRoutes); // Use the upload routes
app.use("/api/auth", authRoutes)
app.use("/api/quiz", quizRoutes); // Use the upload routes


  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// MongoDB connection setup
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// GridFSBucket setup
let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
  app.locals.gfsBucket = gfsBucket;
  app.locals.db = mongoose.connection.db;
  console.log('GridFSBucket initialized.');
});


const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// Attach app to the httpServer for socket.io access in controllers
httpServer.app = app;

// Initialize socket server
const io = initializeSocketServer(httpServer);

// Make io available to the app
app.set("io", io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server initialized for real-time bus tracking`);
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);  // Log the error
  res.status(500).json({ message: 'Internal Server Error', error: err.message });  // Send detailed error message
});
app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/lostfound", lostFoundRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
