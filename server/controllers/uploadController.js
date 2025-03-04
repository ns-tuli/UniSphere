// controllers/uploadController.js
import PDF from "../models/Pdf.js";
import upload from "../utils/uploadUtils.js"; // Helper function to handle file upload to storage

// Handle file upload
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const { userId } = req.user;  // Extract userId from the authenticated user

  if (!userId) {
    return res.status(400).json({ error: "User ID is missing from the request." });
  }

  try {
    // Save the PDF file information in the database along with the userId
    const pdfData = new PDF({
      pdfFileName: req.file.originalname,
      uploadedAt: new Date(),
      userId: userId,  // Associate the file with the authenticated user
    });

    await pdfData.save();

    res.status(200).json({ message: "File uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "An error occurred during file upload." });
  }
};

// Fetch uploaded files for the authenticated user
export const getUploadedFiles = async (req, res) => {
  const { userId } = req.user; // Extract userId from the authenticated user

  try {
    const files = await PDF.find({ userId }); // Fetch PDFs associated with the authenticated user
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "An error occurred while fetching files." });
  }
};
