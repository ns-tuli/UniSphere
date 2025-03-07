import { validationResult } from 'express-validator';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createEvent = async (req, res, next) => {
  try {
    const { organizer, title, description, startDate, endDate, location, capacity, tags, imageUrl } = req.body;
    
    // Find the hosting club by its ID
    const club = await Club.findById(organizer);
    if (!club) {
      return res.status(404).json({ error: "Hosting club not found" });
    }

    // Extract the emails of the club members and set them as default attendees
    const defaultAttendees = club.members.map(member => ({
      email: member.email,  // Assuming `email` is a field in the `members` array of the Club model
      rsvpStatus: 'invited',
    }));

    // Create the new event with attendees populated from the club's members
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,  // Store the club reference here
      capacity,
      tags,
      imageUrl,
      attendees: defaultAttendees,
    });

    await event.save();
    
    res.status(201).json(event);  // Return the newly created event

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name')  // Populate the organizer with the club's name
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error in getEvents:', error);
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name')  // Populate the organizer (the hosting club) with its name
      .exec();
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

export const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { id } = req.params;
    const eventData = req.body;

    // Validate dates
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    if (endDate < startDate) {
      return res.status(400).json({ error: 'End date cannot be before start date' });
    }

    // Find event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update event data
    event.title = eventData.title || event.title;
    event.description = eventData.description || event.description;
    event.startDate = eventData.startDate || event.startDate;
    event.endDate = eventData.endDate || event.endDate;
    event.location = eventData.location || event.location;
    event.organizer = eventData.organizer || event.organizer;
    event.capacity = eventData.capacity || event.capacity;
    event.tags = eventData.tags || event.tags;
    event.imageUrl = eventData.imageUrl || event.imageUrl;

    // Save updated event
    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Remove event from the database
    await event.deleteOne();

    // Optionally: You can also remove the event from any other related collections, such as clubs or users.

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
