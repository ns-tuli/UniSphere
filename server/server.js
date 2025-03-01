import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const GEMINI_AI_KEY = process.env.GEMINI_AI; // Access the environment variable

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_AI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true,
}));
app.use(express.json());

// Handle preflight requests
app.options('/api/chat', cors());

// Routes
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});