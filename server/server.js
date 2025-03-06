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
import departmentRoutes from "./routes/departmentRoutes.js";
import faculty from "./routes/facultyRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import navigationRoutes from "./routes/navigationRoutes.js";
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"] // Add PUT and DELETE here
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Create uploads directory if it doesn't exist
import { mkdir } from "fs/promises";
try {
  await mkdir("uploads", { recursive: true });
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
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/faculty", faculty);
app.use("/api/navigation", navigationRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/news", newsRoutes);  // Fixed route path
app.use("/api/uploads", uploadRoutes); // Use the upload routes
app.use('/api/user',userRoutes)
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("room:join", async ({ room }) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
    
    if (!rooms[room]) {
      rooms[room] = { whiteboardData: "" };
    }
    
    socket.emit("whiteboard:update", rooms[room].whiteboardData);
  });

  socket.on("whiteboard:draw", ({ room, data }) => {
    rooms[room].whiteboardData = data;
    socket.to(room).emit("whiteboard:update", data);
  });

  socket.on("video:call", ({ to, offer }) => {
    io.to(to).emit("video:incomingCall", { from: socket.id, offer });
  });

  socket.on("video:answer", ({ to, answer }) => {
    io.to(to).emit("video:callAccepted", { from: socket.id, answer });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
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