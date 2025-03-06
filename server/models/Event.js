import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String,  trim: true },
  description: { type: String,  },
  startDate: { type: Date,  },
  endDate: { type: Date,  },
  location: { type: String,  },
  organizer: { type: String },
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