import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mealRoutes from "./routes/mealRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import faculty from "./routes/facultyRoutes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import navigationRoutes from "./routes/navigationRoutes.js";
import alertRoutes from "./routes/alerts.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentDataRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import path from "path";
import virtualQuizRoutes from "./routes/api/virtualQuiz.js";

import facultyRoutes from "./routes/facultyRoutes.js";
import { createServer } from "http";
import initializeSocketServer from "./socket-server.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5175", "http://localhost:3000"], // Add your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
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
app.use("/api/student", studentRoutes);
app.use("/api/lostfound", lostFoundRoutes);
app.use("/api/virtual-quiz", virtualQuizRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

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
