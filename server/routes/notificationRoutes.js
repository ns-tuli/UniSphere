import express from 'express';
import { cancel, list, schedule, send } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/schedule', schedule);
router.delete('/cancel/:id', cancel);
router.get('/list', list);
router.post('/send',send)

export default router;
