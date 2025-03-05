import express from "express";
import dotenv from "dotenv";
import { authorizeRole, authenticateUser } from "../middlewares/auth.js";
import { ObjectId } from "mongodb";
import { getDocument } from "pdfjs-dist"; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDF from "../models/Pdf.js";
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

// Helper to extract text from files
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

// Helper to clean AI-generated content
const cleanMarkdownFormatting = (content) => {
  return content.replace(/```[a-zA-Z0-9]*\n/g, "").replace(/```/g, "");
};

const cleanGeminiResponse = (response) => {
  if (typeof response !== "string") {
    console.error("Unexpected response format: Expected a string.");
    return [];
  }

  const cleanedResponse = response
    .replace(/[\[\]'\"`{},]/g, "")
    .replace(/\n+/g, "\n")
    .trim();

  const questionAnswerPairs = [];
  const lines = cleanedResponse.split("\n");

  for (let i = 0; i < lines.length; i += 2) {
    if (lines[i] && lines[i + 1]) {
      const question = lines[i].replace(/^question[:\s]*/i, "").trim();
      const answer = lines[i + 1].replace(/^answer[:\s]*/i, "").trim();
      if (question && answer) {
        questionAnswerPairs.push({
          question,
          answer,
        });
      }
    }
  }

  return questionAnswerPairs;
};

// Helper to generate quiz using AI
const generateQuizAdmin= async (text) => {
  const prompt = `You are an expert quiz creator. Based on the following text, generate a set of quiz questions and answers which are very advanced so that Admin can make hard questions. Each question should be a separate array element. Here is the text:\n\n${text}`;

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

const generateQuizEditor = async (text) => {
  const prompt = `You are an expert quiz creator. Based on the following text, generate a set of quiz questions and answers for a beginner Editor. Each question should be a separate array element. Here is the text:\n\n${text}`;

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


const generateAnswer = async (question, context = "") => {
  const prompt = context
    ? `Translate the following Banglish text to Bangla and provide answers based on the context. Context:\n"${context}".\nQuestion: "${question}".`
    : `I gave you a banglish or bangla text ${question}, you don't need to translate it to bangla, just make it a human to human conversation by replying in bangla, no need to provide any additional explanation".`;

  console.log("Sending prompt to Gemini AI:", prompt);

  try {
    const result = await model.generateContent(prompt);

    if (result.response && result.response.candidates) {
      const answer = result.response.candidates[0].content.parts[0].text;
      console.log("Generated answer:", answer);
      return answer;
    } else {
      throw new Error("Unexpected response structure from Gemini AI.");
    }
  } catch (error) {
    console.error("Error in generateAnswer:", error.message);
    throw error;
  }
};


// Generate Quiz Route
router.post(
  "/generate-quiz-Admin",
  
  async (req, res) => {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: "File ID is required to generate a quiz." });
    }

    try {
      const userRole = req.user.role;
      if (userRole !== "Editor" && userRole !== "Admin") {
        return res.status(403).json({ error: "Access denied. Unauthorized role." });
      }

      const gfsBucket = req.app.locals.gfsBucket;

      if (!gfsBucket) {
        return res.status(500).json({ error: "GridFSBucket is not initialized." });
      }

      const file = await req.app.locals.db.collection("uploads.files").findOne({ _id: new ObjectId(fileId) });

      if (!file) {
        return res.status(404).json({ error: "File not found." });
      }

      const fileBuffer = await fetchFileFromGridFS(gfsBucket, fileId);
      const fileType = file.filename.endsWith(".pdf") ? "pdf" : "docx";
      const fileText = await extractTextFromFile(fileBuffer);

      if (!fileText || fileText.trim() === "") {
        return res.status(400).json({ error: "File content is empty or could not be extracted." });
      }

      const questions = await generateQuizAdmin(fileText);

      res.status(200).json({ message: "Quiz generated successfully!", questions });
    } catch (error) {
      console.error("Error generating quiz:", error.message);
      res.status(500).json({ error: "Failed to generate quiz." });
    }
  }
);

router.post(
  "/generate-quiz-Editor",
  
  async (req, res) => {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: "File ID is required to generate a quiz." });
    }

    try {
      const userRole = req.user.role;
      if (userRole !== "Editor" && userRole !== "Admin") {
        return res.status(403).json({ error: "Access denied. Unauthorized role." });
      }

      const gfsBucket = req.app.locals.gfsBucket;

      if (!gfsBucket) {
        return res.status(500).json({ error: "GridFSBucket is not initialized." });
      }

      const file = await req.app.locals.db.collection("uploads.files").findOne({ _id: new ObjectId(fileId) });

      if (!file) {
        return res.status(404).json({ error: "File not found." });
      }

      const fileBuffer = await fetchFileFromGridFS(gfsBucket, fileId);
      const fileType = file.filename.endsWith(".pdf") ? "pdf" : "docx";
      const fileText = await extractTextFromFile(fileBuffer);

      if (!fileText || fileText.trim() === "") {
        return res.status(400).json({ error: "File content is empty or could not be extracted." });
      }

      const questions = await generateQuizEditor(fileText);

      res.status(200).json({ message: "Quiz generated successfully!", questions });
    } catch (error) {
      console.error("Error generating quiz:", error.message);
      res.status(500).json({ error: "Failed to generate quiz." });
    }
  }
);

// Pending Notes Route (Admins Only)
router.get(
  "/pending-notes",
  
  authorizeRole("Admin"),
  async (req, res) => {
    try {
      const files = await req.app.locals.db
        .collection("uploads.files")
        .find({ "metadata.status": "pending" })
        .toArray();

      res.status(200).json({
        message: "Pending notes retrieved successfully.",
        notes: files.map((file) => ({
          fileId: file._id,
          filename: file.filename,
          uploadDate: file.uploadDate,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve pending notes." });
    }
  }
);

// Approve Note Route (Admins Only)
router.put(
  "/approve-note/:id",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await req.app.locals.db
        .collection("uploads.files")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { "metadata.status": "approved" } }
        );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ error: "Note not found or already approved." });
      }

      res.status(200).json({ message: "Note approved successfully." });
    } catch (error) {
      console.error("Error approving note:", error.message);
      res.status(500).json({ error: "Failed to approve note." });
    }
  }
);

// Approved Notes Route (Editors Only)
router.get("/approved-notes", async (req, res) => {
  try {
    // Fetch approved notes from the PDF collection
    const notes = await PDF.find({}).select("pdfFileName aiGeneratedTitle aiGeneratedCaption").lean();

    if (!notes || notes.length === 0) {
      return res.status(404).json({ error: "No approved notes found." });
    }

    res.status(200).json({ notes });
  } catch (error) {
    console.error("Error fetching approved notes:", error.message);
    res.status(500).json({ error: "Failed to fetch approved notes." });
  }
});



// Download Note Route (Editors Only)
router.get(
  "/download-note/:id",
  
  authorizeRole("Editor", "Admin"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const gfsBucket = req.app.locals.gfsBucket;

      if (!gfsBucket) {
        return res.status(500).json({ error: "GridFSBucket is not initialized." });
      }

      const file = await req.app.locals.db
        .collection("uploads.files")
        .findOne({ _id: new ObjectId(id), "metadata.status": "approved" });

      if (!file) {
        return res.status(404).json({ error: "File not found or not approved." });
      }

      res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
      res.setHeader("Content-Type", file.contentType || "application/octet-stream");

      const readStream = gfsBucket.openDownloadStream(new ObjectId(id));
      readStream.pipe(res);

      readStream.on("error", (err) => {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download the file." });
      });
    } catch (error) {
      console.error("Error fetching note for download:", error.message);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);



// Chatbot functionalities
router.post('/ask-question', authenticateUser, async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'A valid question is required.' });
  }

  try {
    const answer = await generateAnswer('', question); // Generic question
    res.status(200).json({ message: 'Answer generated successfully!', question, answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate answer.' });
  }
});

// Chatbot Route: Chat about a specific note
router.post("/chat-about-note",  async (req, res) => {
  const { fileId, question } = req.body;

  if (!fileId || !question) {
    return res.status(400).json({ error: "File ID and question are required." });
  }

  try {
    const gfsBucket = req.app.locals.gfsBucket;

    if (!gfsBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized." });
    }

    const fileContent = await fetchFileFromGridFS(gfsBucket, fileId);
    const noteContent = await extractTextFromFile(fileContent);

    const answer = await generateAnswer(question, noteContent);
    res.status(200).json({ question, answer });
  } catch (error) {
    console.error("Error in /chat-about-note:", error.message);
    res.status(500).json({ error: "Failed to process the request." });
  }
});


export default router;

router.post("/chat", authenticateUser, async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "A valid question is required." });
  }

  try {
    const answer = await generateAnswer(question);
    res.status(200).json({ message: "Answer generated successfully!", question, answer });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate answer." });
  }
});