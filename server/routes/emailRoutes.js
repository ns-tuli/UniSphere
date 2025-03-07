import express from 'express';
import { sendEmailToUsers } from '../controllers/emailController.js';

const router = express.Router();

// Route to send email notification to all users
router.post('/sendemail', sendEmailToUsers);

export default router;
