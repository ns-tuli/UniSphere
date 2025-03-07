// routes/newsRoutes.js
import express from 'express';
import newsController from '../controllers/newsController.js';

const router = express.Router();

// Route to get articles based on topics
router.post('/', newsController.readArticle);

export default router;