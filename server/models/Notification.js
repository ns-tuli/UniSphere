import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['event_reminder', 'event_update', 'club_update', 'new_event'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedTo: {
    model: { type: String, enum: ['Event', 'Club'] },
    id: { type: mongoose.Schema.Types.ObjectId }
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);