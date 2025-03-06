import express from 'express';
import { body } from 'express-validator';
import { createEvent, getEvent, getEvents, getTags, rsvpEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post(
  '/', createEvent
);
router.get('/tags', getTags);
router.post('/:id/rsvp', rsvpEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);



export default router;