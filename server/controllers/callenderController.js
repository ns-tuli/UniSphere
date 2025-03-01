import Event from '../models/Event.js';

export const getCalendarEvents = async (req, res, next) => {
  try {
    const { year, month, userId } = req.query;
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    let query = {
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        {
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } }
          ]
        }
      ]
    };
    let events;
    if (userId) {
      events = await Event.find(query)
        .populate('organizer', 'name')
        .lean();
      events = events.map(event => {
        const attendee = event.attendees.find(a => a.user.toString() === userId);
        return {
          ...event,
          userRsvpStatus: attendee ? attendee.rsvpStatus : null
        };
      });
    } else {
      events = await Event.find(query)
        .populate('organizer', 'name');
    }
    const calendarDays = {};
    events.forEach(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      let current = new Date(Math.max(start, startDate));
      const lastDay = new Date(Math.min(end, endDate));
      while (current <= lastDay) {
        const dayKey = current.getDate();
        if (!calendarDays[dayKey]) {
          calendarDays[dayKey] = [];
        }
        calendarDays[dayKey].push(event);
        current.setDate(current.getDate() + 1);
      }
    });
    res.json(calendarDays);
  } catch (error) {
    next(error);
  }
};
