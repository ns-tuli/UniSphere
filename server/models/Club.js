import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: { type: String,  trim: true, unique: true },
  description: { type: String,  },
  category: { type: String,  },
  foundedYear: { type: Number },
  contactEmail: { type: String,  },
  logo: { type: String },
  members: [{
    email: { type: String },
    role: { type: String, enum: ['president', 'vice-president', 'treasurer', 'secretary', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Club', clubSchema);