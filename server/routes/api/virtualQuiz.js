import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "cloudinary";
import axios from "axios";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure PDF.js for Node environment
const DUMMY_CMAP_URL = "dummy";
const DUMMY_CMAP_PACKED = true;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Configure local storage as fallback
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"), false);
    }
  },
}).single("file");

// Handle file upload
router.post("/upload", (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        msg: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "No file uploaded",
      });
    }

    try {
      // Upload to Cloudinary if credentials exist
      if (process.env.CLOUDINARY_API_KEY) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "virtual_quiz",
        });

        // Delete local file after Cloudinary upload
        fs.unlinkSync(req.file.path);

        return res.json({
          success: true,
          file: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        });
      }

      // Use local file if no Cloudinary credentials
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      return res.json({
        success: true,
        file: {
          url: fileUrl,
          publicId: req.file.filename,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        success: false,
        msg: "Error uploading file",
      });
    }
  });
});

// @route   GET api/virtual-quiz/test
// @desc    Test route
// @access  Public
router.get("/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({ msg: "Virtual Quiz API is working" });
});

// @route   POST api/virtual-quiz/extract-text
// @desc    Extract text from a PDF or image
// @access  Private
router.post("/extract-text", async (req, res) => {
  try {
    const { fileUrl, fileType } = req.body;
    console.log("Received request:", { fileUrl, fileType });

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        msg: "File URL is required",
      });
    }

    let extractedText = "";

    // Extract text from PDF
    if (fileType === "pdf") {
      try {
        console.log("Downloading PDF file...");
        // Download the PDF file
        const response = await axios.get(fileUrl, {
          responseType: "arraybuffer",
          timeout: 30000, // 30 seconds timeout
        });
        console.log("PDF downloaded successfully");

        const buffer = Buffer.from(response.data);
        console.log("Buffer created, size:", buffer.length);

        // Convert Buffer to Uint8Array for pdf.js
        const uint8Array = new Uint8Array(buffer);
        console.log("Converting to Uint8Array, size:", uint8Array.length);

        // Load and parse PDF with Node.js configuration
        console.log("Loading PDF document...");
        const loadingTask = pdfjsLib.getDocument({
          data: uint8Array,
          cMapUrl: DUMMY_CMAP_URL,
          cMapPacked: DUMMY_CMAP_PACKED,
        });

        const pdf = await loadingTask.promise;
        console.log("PDF loaded successfully, pages:", pdf.numPages);

        let text = "";

        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          console.log(`Processing page ${i}/${pdf.numPages}`);
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + " ";
        }

        extractedText = text.trim();
        console.log("Text extraction completed, length:", extractedText.length);
      } catch (pdfError) {
        console.error("PDF extraction error:", pdfError);
        console.error("Error stack:", pdfError.stack);
        return res.status(500).json({
          success: false,
          msg: "Failed to extract text from PDF",
          error: pdfError.message,
          stack: pdfError.stack,
        });
      }
    }
    // Extract text from image using OCR
    else if (fileType === "image") {
      try {
        console.log("Initializing Tesseract worker...");
        const worker = await createWorker();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        console.log("Tesseract worker initialized");

        // Download the image
        console.log("Downloading image...");
        const response = await axios.get(fileUrl, {
          responseType: "arraybuffer",
          timeout: 30000,
        });
        console.log("Image downloaded successfully");

        const buffer = Buffer.from(response.data);
        console.log("Image buffer created, size:", buffer.length);

        // Recognize text from image buffer
        console.log("Starting OCR processing...");
        const { data } = await worker.recognize(buffer);
        extractedText = data.text;
        console.log("OCR completed, text length:", extractedText.length);

        await worker.terminate();
        console.log("Tesseract worker terminated");
      } catch (ocrError) {
        console.error("OCR error:", ocrError);
        console.error("Error stack:", ocrError.stack);
        return res.status(500).json({
          success: false,
          msg: "Failed to extract text from image",
          error: ocrError.message,
          stack: ocrError.stack,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        msg: "Unsupported file type",
      });
    }

    // If no text was extracted or text is too short
    if (!extractedText || extractedText.trim().length < 5) {
      console.log("Warning: Minimal or no text extracted");
      return res.status(200).json({
        success: true,
        text: "No readable text found in the document. The file might be scanned, encrypted, or contain only images.",
        warning: "minimal_text",
      });
    }

    console.log("Successfully extracted text, sending response");
    res.json({
      success: true,
      text: extractedText,
    });
  } catch (err) {
    console.error("Error extracting text:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      success: false,
      msg: "Server error during text extraction",
      error: err.message,
      stack: err.stack,
    });
  }
});

// @route   POST api/virtual-quiz/chat
// @desc    Chat with AI using extracted text as context
// @access  Private
router.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        msg: "Message is required",
      });
    }

    // Check if Gemini API is available
    if (!GEMINI_AI_KEY || !model) {
      console.warn(
        "Gemini API key not found or initialization failed. Using fallback response."
      );

      // Generate a simple fallback response
      const keywords = message.toLowerCase().split(/\s+/);
      const sentences = context
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);

      // Find sentences containing keywords from the user's message
      const relevantSentences = sentences.filter((sentence) =>
        keywords.some(
          (keyword) =>
            keyword.length > 3 && sentence.toLowerCase().includes(keyword)
        )
      );

      let fallbackResponse;
      if (relevantSentences.length > 0) {
        fallbackResponse =
          "Here's what I found in your document:\n\n" +
          relevantSentences.slice(0, 3).join(". ") +
          ".";
      } else {
        fallbackResponse =
          "I couldn't find specific information about that in your document. Could you try asking a different question?";
      }

      return res.json({
        success: true,
        message: fallbackResponse,
        fallback: true,
      });
    }

    // Use Gemini API for chat
    try {
      const prompt = `You are a helpful assistant that answers questions based on the following document content. 
      Please provide a concise and accurate response based ONLY on the information in the document.
      
      DOCUMENT CONTENT:
      ${context}
      
      USER QUESTION:
      ${message}`;

      const result = await model.generateContent(prompt);
      const botResponse = result.response.text();

      res.json({
        success: true,
        message: botResponse,
      });
    } catch (aiError) {
      console.error("Gemini API error:", aiError);

      // Generate a simple fallback response
      const keywords = message.toLowerCase().split(/\s+/);
      const sentences = context
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);

      // Find sentences containing keywords from the user's message
      const relevantSentences = sentences.filter((sentence) =>
        keywords.some(
          (keyword) =>
            keyword.length > 3 && sentence.toLowerCase().includes(keyword)
        )
      );

      let fallbackResponse;
      if (relevantSentences.length > 0) {
        fallbackResponse =
          "I'm having trouble connecting to the AI service, but here's what I found in your document:\n\n" +
          relevantSentences.slice(0, 3).join(". ") +
          ".";
      } else {
        fallbackResponse =
          "I'm having trouble connecting to the AI service and couldn't find specific information about that in your document. Please try again later.";
      }

      return res.json({
        success: true,
        message: fallbackResponse,
        fallback: true,
      });
    }
  } catch (err) {
    console.error("Error in chat:", err);
    res.status(500).json({
      success: false,
      msg: "Server error during chat",
      error: err.message,
    });
  }
});

// @route   POST api/virtual-quiz/delete-file
// @desc    Delete a file from Cloudinary or local storage
// @access  Private
router.post("/delete-file", async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        msg: "Public ID is required",
      });
    }

    // If using local storage
    if (useLocalStorage) {
      const filePath = path.join(__dirname, "../../../uploads", publicId);

      // Check if file exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.json({ success: true });
    }

    // If using Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok") {
        return res.status(400).json({
          success: false,
          msg: "Failed to delete file from Cloudinary",
        });
      }

      res.json({ success: true });
    } catch (cloudinaryError) {
      console.error("Cloudinary delete error:", cloudinaryError);
      return res.status(500).json({
        success: false,
        msg: "Error deleting file from Cloudinary",
        error: cloudinaryError.message,
      });
    }
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({
      success: false,
      msg: "Server error during file deletion",
      error: err.message,
    });
  }
});

// @route   POST api/virtual-quiz/generate-quiz
// @desc    Generate quiz questions based on a topic
// @access  Public
router.post("/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty = "medium", questionCount = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        msg: "Topic is required",
      });
    }

    // Check if Gemini API is available
    if (!GEMINI_AI_KEY || !model) {
      console.warn(
        "Gemini API key not found or initialization failed. Using fallback response."
      );
      return res.status(500).json({
        success: false,
        msg: "AI service is currently unavailable",
      });
    }

    // Use Gemini API to generate quiz questions
    try {
      const prompt = `You are a quiz generator. Create ${questionCount} ${difficulty} difficulty level questions about "${topic}".
      
      Format your response as a valid JSON array of objects with the following structure:
      [
        {
          "question": "The question text goes here?",
          "answer": "The correct answer goes here"
        }
      ]
      
      Make sure the questions are factually accurate and appropriate for ${difficulty} difficulty level.
      For easy questions, focus on basic facts and definitions.
      For medium questions, include more detailed knowledge and some application of concepts.
      For hard questions, include complex concepts, specific details, and challenging applications.
      
      ONLY return the JSON array with no additional text or explanation.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract JSON from the response
      let questions;
      try {
        // Find JSON array in the response
        const jsonMatch = responseText.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      } catch (jsonError) {
        console.error("Error parsing JSON from AI response:", jsonError);
        console.log("Raw response:", responseText);

        // Attempt to fix common JSON formatting issues
        try {
          // Replace single quotes with double quotes
          const fixedJson = responseText
            .replace(/'/g, '"')
            .replace(/\n/g, " ")
            .trim();

          // Try to extract JSON array
          const match = fixedJson.match(/\[\s*\{.*\}\s*\]/s);
          if (match) {
            questions = JSON.parse(match[0]);
          } else {
            throw new Error("Could not extract JSON array after fixing");
          }
        } catch (fixError) {
          console.error("Error after attempting to fix JSON:", fixError);

          // Generate fallback questions if JSON parsing fails
          questions = generateFallbackQuestions(
            topic,
            parseInt(questionCount),
            difficulty
          );
        }
      }

      // Validate questions format
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions format");
      }

      // Ensure each question has the required fields
      questions = questions.map((q) => ({
        question: q.question || `What is an important fact about ${topic}?`,
        answer: q.answer || "Information not available",
      }));

      // Limit to requested question count
      questions = questions.slice(0, parseInt(questionCount));

      res.json({
        success: true,
        questions,
      });
    } catch (aiError) {
      console.error("Gemini API error:", aiError);

      // Generate fallback questions
      const fallbackQuestions = generateFallbackQuestions(
        topic,
        parseInt(questionCount),
        difficulty
      );

      res.json({
        success: true,
        questions: fallbackQuestions,
        fallback: true,
      });
    }
  } catch (err) {
    console.error("Error generating quiz:", err);
    res.status(500).json({
      success: false,
      msg: "Server error during quiz generation",
      error: err.message,
    });
  }
});

// Helper function to generate fallback questions when AI fails
function generateFallbackQuestions(topic, count = 5, difficulty = "medium") {
  const questions = [];

  // Basic question templates
  const templates = [
    {
      q: `What is ${topic}?`,
      a: `${topic} is a concept or subject in its relevant field.`,
    },
    {
      q: `Who is associated with ${topic}?`,
      a: `Various experts and scholars have contributed to ${topic}.`,
    },
    {
      q: `When did ${topic} become significant?`,
      a: `${topic} gained significance at an important point in history.`,
    },
    {
      q: `Why is ${topic} important?`,
      a: `${topic} is important for various reasons in its field.`,
    },
    {
      q: `How does ${topic} work?`,
      a: `${topic} functions through specific processes relevant to its domain.`,
    },
    {
      q: `What are the main components of ${topic}?`,
      a: `${topic} consists of several key components or elements.`,
    },
    {
      q: `Where is ${topic} commonly found or used?`,
      a: `${topic} is commonly found or used in specific contexts.`,
    },
    {
      q: `What is a common misconception about ${topic}?`,
      a: `There are several misconceptions about ${topic} that experts have clarified.`,
    },
    {
      q: `How has ${topic} evolved over time?`,
      a: `${topic} has evolved significantly throughout its history.`,
    },
    {
      q: `What is the future of ${topic}?`,
      a: `Experts predict various developments in the future of ${topic}.`,
    },
  ];

  // Generate the requested number of questions
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    questions.push({
      question: template.q,
      answer: template.a,
    });
  }

  return questions;
}

export default router;
