import express from 'express';
import { body } from 'express-validator';
import { createUser, getNotifications, getUser, getUsers } from '../controllers/UserController.js';

const router = express.Router();

// Create a new user
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('studentId').notEmpty().withMessage('Student ID is required')
  ],
  createUser
);

// Get user by ID
router.get('/:id', getUser);

router.get('/', getUsers);

// Get notifications for a user
router.get('/:userId/notifications', getNotifications);

export default router;