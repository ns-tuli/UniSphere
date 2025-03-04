// routes/uploadRoutes.js
import express from "express";
import upload from "../utils/uploadUtils.js"; // Importing the default export
import { uploadFile, getUploadedFiles } from "../controllers/uploadController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Route for uploading a file
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

// Route for fetching all uploaded files for the authenticated user
router.get("/files", verifyToken, getUploadedFiles);

export default router;
