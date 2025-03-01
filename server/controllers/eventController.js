import { validationResult } from 'express-validator';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import User from '../models/user.js';

export const createEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Validate dates
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    if (endDate < startDate) {
      return res.status(400).json({ error: 'End date cannot be before start date' });
    }
    const event = new Event(req.body);
    // If organizer (club) is specified, add event to club's events
    if (req.body.organizer) {
      const club = await Club.findById(req.body.organizer);
      if (!club) {
        return res.status(404).json({ error: 'Organizer club not found' });
      }
      await event.save();
      club.events.push(event._id);
      await club.save();
    } else {
      await event.save();
    }
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const { startDate, endDate, organizer, tags, search, showPast = 'true' } = req.query;
    let query = {};

    // Date filtering
    if (startDate || endDate) {
      query.$and = [];
      if (startDate) {
        query.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        query.$and.push({ endDate: { $lte: new Date(endDate) } });
      }
    } else if (showPast !== 'true') {
      // Only filter future events if showPast is explicitly set to false
      query.startDate = { $gte: new Date() };
    }

    // Organizer filtering
    if (organizer) {
      query.organizer = organizer;
    }

    // Tags filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Search filtering
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Query:', JSON.stringify(query, null, 2));

    const events = await Event.find(query)
      .populate('organizer', 'name')
      .populate('attendees.user', 'name email')
      .sort({ startDate: 1 });

    console.log('Found events:', events.length);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
      query: query // Including query in response for debugging
    });
  } catch (error) {
    console.error('Error in getEvents:', error);
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer')
      .populate('attendees.user', 'name email');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const rsvpEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userId, status } = req.body;
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Find event
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    // Check capacity if status is "attending"
    if (status === 'attending' && event.capacity) {
      const attendingCount = event.attendees.filter(a => a.rsvpStatus === 'attending').length;
      if (attendingCount >= event.capacity) {
        return res.status(400).json({ error: 'Event has reached capacity' });
      }
    }
    // Update or add RSVP
    const existingRsvpIndex = event.attendees.findIndex(a => a.user.toString() === userId);
    if (existingRsvpIndex !== -1) {
      event.attendees[existingRsvpIndex].rsvpStatus = status;
      event.attendees[existingRsvpIndex].registeredAt = new Date();
    } else {
      event.attendees.push({
        user: userId,
        rsvpStatus: status,
        registeredAt: new Date()
      });
    }
    await event.save();
    // Add reminder and notification if attending
    if (status === 'attending') {
      const reminderTime = new Date(event.startDate);
      reminderTime.setDate(reminderTime.getDate() - 1);
      const hasReminder = user.eventReminders.some(r => r.event.toString() === event._id.toString());
      if (!hasReminder && reminderTime > new Date()) {
        user.eventReminders.push({
          event: event._id,
          reminderTime
        });
        await user.save();
        await Notification.create({
          user: userId,
          type: 'event_reminder',
          title: `Reminder: ${event.title}`,
          message: `Don't forget about the event "${event.title}" tomorrow at ${event.location}!`,
          relatedTo: {
            model: 'Event',
            id: event._id
          }
        });
      }
    }
    res.json({ message: 'RSVP updated successfully', event });
  } catch (error) {
    next(error);
  }
};

export const getTags = async (req, res, next) => {
  try {
    const tags = await Event.distinct('tags');
    res.json(tags);
  } catch (error) {
    next(error);
  }
};