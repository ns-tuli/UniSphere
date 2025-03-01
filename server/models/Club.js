import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  foundedYear: { type: Number },
  meetingSchedule: { type: String },
  contactEmail: { type: String, required: true },
  socialMedia: {
    website: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  logo: { type: String },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['president', 'vice-president', 'treasurer', 'secretary', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Club', clubSchema);