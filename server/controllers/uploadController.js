import PDF from "../models/pdf.js";
import fs from "fs";
import path from "path";
import { verifyToken } from "../middlewares/auth.js";
import multer from "multer";
import dotenv from "dotenv";
import { extractTextFromFile } from "../utils/extractText.js"; // Assuming you have an extraction method

dotenv.config();

const upload = multer({ dest: "temp/" }); // Temporary storage for uploaded files

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const userId = req.user?.userId;
  if (!userId) {
    return res.status(400).json({ error: "userId is missing from request." });
  }

  try {
    const tempFilePath = path.join(__dirname, "../", req.file.path);
    const fileBuffer = fs.readFileSync(tempFilePath);

    // Extract text from the uploaded file
    const extractedText = await extractTextFromFile(fileBuffer); // Replace with your method to extract text from PDF

    if (!extractedText) {
      return res.status(400).json({ error: "Extracted text is empty." });
    }

    // Save the PDF info to the database
    const pdfData = new PDF({
      userId,
      pdfFileName: req.file.originalname,
    });

    await pdfData.save();

    fs.unlinkSync(tempFilePath); // Delete temp file

    res.status(200).json({
      message: "File uploaded successfully!",
      extractedText, // Send the extracted text in the response
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ error: "An error occurred during file upload." });
  }
};

export const getUploadedFiles = async (req, res) => {
  const { userId } = req.user;

  try {
    const files = await PDF.find({ userId }); // Fetch PDFs associated with the authenticated user
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "An error occurred while fetching files." });
  }
};
