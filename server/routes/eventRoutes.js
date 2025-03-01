import express from 'express';
import { body } from 'express-validator';
import { createEvent, getEvent, getEvents, getTags, rsvpEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate')
      .isISO8601()
      .withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.startDate)) {
          throw new Error('End date cannot be before start date');
        }
        return true;
      }),
    body('location').notEmpty().withMessage('Location is required')
  ],
  createEvent
);

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/:id/rsvp', rsvpEvent);
router.get('/tags', getTags);

export default router;