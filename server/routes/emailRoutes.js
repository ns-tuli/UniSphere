import express from 'express';
import { sendEmailToUsers } from '../controllers/emailController.js';

const router = express.Router();

// Route to send email notification to users based on role
router.post('/sendemail', sendEmailToUsers);

export default router;
