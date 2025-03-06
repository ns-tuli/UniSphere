import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDF from "../models/Pdf.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";// Import extractTextFromFile helper function
import axios from "axios";
import { getDocument } from 'pdfjs-dist';

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "temp/" }); // Temporary storage for uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to clean generated text from AI response
const cleanGeneratedText = (text) => {
  if (typeof text !== "string") {
    console.error("Unexpected response format: Expected a string.");
    return "";
  }

  return text
    .replace(/[\[\]'\"`{},]/g, "")  // Remove unwanted characters
    .replace(/\s+/g, " ")           // Replace multiple spaces with one
    .trim();                        // Trim leading/trailing spaces
};



export const extractTextFromFile = async (data) => {
  try {
    // Convert Buffer to Uint8Array
    const uint8ArrayData = new Uint8Array(data);

    console.log('Parsing PDF...');
    const pdf = await getDocument(uint8ArrayData).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      text += `${pageText}`;
    }

    console.log('PDF text extraction complete.');
    console.log('Extracted PDF Text:', text.slice(0, 500)); // Log the first 500 characters for debugging
    return text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF using pdfjs-dist:', error.message);
    return ''; // Handle error gracefully
  }
};


// Route to upload a file and generate AI title and caption
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const gfsBucket = req.app.locals.gfsBucket;
    if (!gfsBucket) return res.status(500).json({ error: "GridFSBucket is not initialized." });

    const tempFilePath = path.join(__dirname, "../", req.file.path);
    const fileBuffer = fs.readFileSync(tempFilePath);
    const extractedText = await extractTextFromFile(fileBuffer);

    if (!extractedText || typeof extractedText !== "string") {
      return res.status(400).json({ error: "Extracted text is invalid or empty." });
    }

    console.log("Extracted Text for Prompt:", extractedText.slice(0, 500));


    const metadata = { status: "pending", uploader: "unknown" };

    const readStream = fs.createReadStream(tempFilePath);
    const uploadStream = gfsBucket.openUploadStream(req.file.originalname, { metadata });

    readStream.pipe(uploadStream);

    uploadStream.on("finish", async () => {
      fs.unlinkSync(tempFilePath); // Delete temp file

      const pdfData = new PDF({
        pdfFileName: req.file.originalname
      });

      await pdfData.save();

      res.status(200).json({
        message: "File uploaded successfully!",
        fileId: uploadStream.id,
        filename: req.file.originalname,
      });
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading file to GridFS:", err);
      res.status(500).json({ error: "Failed to upload file." });
    });
  } catch (error) {
    console.error("Error during file upload:", error.message);
    res.status(500).json({ error: "An error occurred during file upload." });
  }
});

// Helper to fetch file from GridFS
const fetchFileFromGridFS = async (gfsBucket, fileId) => {
  return new Promise((resolve, reject) => {
    const readStream = gfsBucket.openDownloadStream(new ObjectId(fileId));
    const chunks = [];
    readStream.on("data", (chunk) => chunks.push(chunk));
    readStream.on("end", () => resolve(Buffer.concat(chunks)));
    readStream.on("error", (err) => reject(err));
  });
};

// Function to generate quiz questions for Admin or Editor
const generateQuiz = async (text, userType) => {
  const prompt = `You are an expert quiz creator. Based on the following text, generate a set of quiz questions and answers for a ${userType}. Each question should be a separate array element. Here is the text:\n\n${text}`;

  try {
    const result = await model.generateContent(prompt);
    if (result.response && result.response.candidates) {
      const quizContent = result.response.candidates[0].content.parts[0].text;
      const cleanedContent = cleanMarkdownFormatting(quizContent);
      return cleanGeminiResponse(cleanedContent);
    } else {
      throw new Error("Failed to generate quiz questions.");
    }
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    throw error;
  }
};

// Route to generate quiz for Admin or Editor
router.post("/generate-quiz", async (req, res) => {
  const { fileId, userType } = req.body;

  if (!fileId || !userType) {
    return res.status(400).json({ error: "File ID and user type are required." });
  }

  try {
    const gfsBucket = req.app.locals.gfsBucket;
    if (!gfsBucket) return res.status(500).json({ error: "GridFSBucket is not initialized." });

    const file = await req.app.locals.db.collection("uploads.files").findOne({ _id: new ObjectId(fileId) });
    if (!file) return res.status(404).json({ error: "File not found." });

    const fileBuffer = await fetchFileFromGridFS(gfsBucket, fileId);
    const fileText = await extractTextFromFile(fileBuffer);

    if (!fileText || fileText.trim() === "") {
      return res.status(400).json({ error: "File content is empty or could not be extracted." });
    }

    const questions = await generateQuiz(fileText, userType);
    res.status(200).json({ message: "Quiz generated successfully!", questions });
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

export default router;
