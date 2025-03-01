import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from "./config/db.js";
import mealRoutes from "./routes/mealRoutes.js";
import busRoutes from "./routes/busRoutes.js"
import roadmapRoutes from "./routes/roadmapRoutes.js"; // Import roadmap routes


// Load environment variables
dotenv.config();

const app = express();
const GEMINI_AI_KEY = process.env.GEMINI_AI; // Access the environment variable


// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true,
}));
app.use(express.json());


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

app.use("/api/meals", mealRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/roadmap", roadmapRoutes); // Use roadmap routes


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});