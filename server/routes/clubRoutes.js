import express from 'express';
import { body } from 'express-validator';
import { createClub, getCategories, getClub, getClubs, joinClub } from '../controllers/clubController.js';

const router = express.Router();

// Create a new club
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Club name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('contactEmail').isEmail().withMessage('Valid contact email is required')
  ],
  createClub
);

router.get('/', getClubs);
router.get('/categories', getCategories);
router.get('/:id', getClub);

router.post(
  '/:id/join',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('role').optional().isIn(['member', 'president', 'vice-president', 'treasurer', 'secretary'])
      .withMessage('Invalid role')
  ],
  joinClub
);


export default router;