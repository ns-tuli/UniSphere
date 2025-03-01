import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  capacity: { type: Number, default: null },
  tags: [{ type: String, trim: true }],
  imageUrl: { type: String, default: null },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rsvpStatus: { type: String, enum: ['attending', 'maybe', 'declined'], default: 'attending' },
    registeredAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);