import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose"
import connectDB from "./config/db.js";
import mealRoutes from "./routes/mealRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import faculty from "./routes/facultyRoutes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import navigationRoutes from "./routes/navigationRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import http from "http";
import { Server } from "socket.io";
import classroomRoutes from "./routes/classroomRoutes.js";
import newsRoutes from './routes/newsRoutes.js';  // Fixed missing quotes
import bodyParser from 'body-parser';
import uploadRoutes from "./routes/uploadRoutes.js"; // Routes for file uploads


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
  methods: ["GET", "POST"]
}));

app.use(express.json());
app.use(bodyParser.json());

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
app.use('/api/uploads', uploadRoutes);  // Add the upload routes

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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});