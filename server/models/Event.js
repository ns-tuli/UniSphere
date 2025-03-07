import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String,  trim: true },
  description: { type: String,  },
  startDate: { type: Date,  },
  endDate: { type: Date,  },
  location: { type: String,  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  capacity: { type: Number, default: null },
  tags: [{ type: String, trim: true }],
  imageUrl: { type: String, default: null },
  attendees: [{
    email: { type: String },
    rsvpStatus: { type: String, enum: ['attending', 'invited', 'declined'], default: 'invited' },
    registeredAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);