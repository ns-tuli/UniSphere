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
  
  // Club Schema
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
  