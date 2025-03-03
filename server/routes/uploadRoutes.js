import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "../middlewares/auth.js";
import PDF from "../models/Pdf.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { extractTextFromFile } from "./quizRoutes.js"; // Import extractTextFromFile helper function
import axios from "axios"
dotenv.config();

const router = express.Router();
const upload = multer({ dest: "temp/" }); // Temporary storage for uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const cleanGeneratedText = (text) => {
  if (typeof text !== "string") {
    console.error("Unexpected response format: Expected a string.");
    return "";
  }

  // Remove unwanted characters and trim extra spaces
  const cleanedText = text
    .replace(/[\[\]'\"`{},]/g, "") // Remove characters like quotes, brackets, etc.
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces

  return cleanedText;
};

export const generateTitle = async (content) => {
  const prompt = `
    Generate a one-word title in Bangla for the following content:
    "${content}"
    Provide only the title as the response.
  `;

  console.log("Sending prompt to Gemini AI for title:", prompt);

  try {
    const response = await model.generateContent(prompt);

    // Log the full response to debug
    console.log("Gemini AI Full Response for Title:", JSON.stringify(response, null, 2));

    // Extract the title from the nested structure
    let title = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!title) {
      throw new Error("No title generated.");
    }

    // Clean the title
    title = cleanGeneratedText(title);

    // Ensure the title is a single word
    if (title.split(" ").length > 1) {
      throw new Error("The generated title is not a single word.");
    }

    console.log("Generated Title:", title);
    return title;
  } catch (error) {
    console.error("Error in generateTitle:", error.message);
    throw error;
  }
};

export const generateCaption = async (content) => {
  const prompt = `
    Generate a one-line caption in Bangla summarizing the following content:
    "${content}"
    Provide only the caption as the response.
  `;

  console.log("Sending prompt to Gemini AI for caption:", prompt);

  try {
    const response = await model.generateContent(prompt);

    // Log the full response to debug
    console.log("Gemini AI Full Response for Caption:", JSON.stringify(response, null, 2));

    // Extract the caption from the nested structure
    let caption = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!caption) {
      throw new Error("No caption generated.");
    }

    // Clean the caption
    caption = cleanGeneratedText(caption);

    // Stop trimming at the first full stop (Bangla: দাড়ি)
    const firstSentenceMatch = caption.match(/.*?[।.]/);
    if (firstSentenceMatch) {
      caption = firstSentenceMatch[0].trim(); // Reassign the `caption` variable
    }

    console.log("Generated Caption:", caption);
    return caption;
  } catch (error) {
    console.error("Error in generateCaption:", error.message);
    throw error;
  }
};

// Updated /upload route to include caption generation
router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // const userId = req.user?.userId;
    // console.log("UserId:", userId);
    // console.log(req.user?.userId) 
    // if (!userId) {
    //   return res.status(400).json({ error: "userId is missing from request." });
    // }

    try {
      const gfsBucket = req.app.locals.gfsBucket;
      if (!gfsBucket) {
        return res.status(500).json({ error: "GridFSBucket is not initialized." });
      }

      const tempFilePath = path.join(__dirname, "../", req.file.path);

      // Read the PDF file and extract text
      const fileBuffer = fs.readFileSync(tempFilePath);
      const extractedText = await extractTextFromFile(fileBuffer);

      if (!extractedText || typeof extractedText !== "string") {
        return res.status(400).json({ error: "Extracted text is invalid or empty." });
      }

      console.log("Extracted Text for Prompt:", extractedText.slice(0, 500)); // Debugging the extracted text

      // Generate AI title and caption
      
      
      const readStream = fs.createReadStream(tempFilePath);
      const uploadStream = gfsBucket.openUploadStream(req.file.originalname);

      readStream.pipe(uploadStream);

      uploadStream.on("finish", async () => {
        fs.unlinkSync(tempFilePath); // Delete temp file

        const pdfData = new PDF({
          pdfFileName: req.file.originalname,
          privacy:'public',
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
  }
);


export default router;