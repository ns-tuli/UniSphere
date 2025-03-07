import express from 'express';
import { markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.patch('/:id/read', markAsRead);

export default router;