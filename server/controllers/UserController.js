import { validationResult } from 'express-validator';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email or Student ID already exists' });
    }
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('joinedClubs')
      .populate('eventReminders.event');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { unread } = req.query;
    let query = { user: userId };
    if (unread === 'true') {
      query.read = false;
    }
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};


export const getUsers = async (request, response) => {
    try {
        const users = await User.find({}); // Fetches all users without any condition
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({ error: error.message }); // Sending error message for better debugging
    }
}
