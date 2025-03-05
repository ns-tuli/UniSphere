import express from 'express';
import { uploadFile, getUploadedFiles } from '../controllers/uploadController.js';
import { verifyToken } from '../middlewares/auth.js';  // Middleware to verify JWT token

const router = express.Router();

// Route to upload a file (POST)
router.post('/upload', verifyToken, uploadFile);

// Route to get uploaded files (GET)
router.get('/files', verifyToken, getUploadedFiles);

export default router;
