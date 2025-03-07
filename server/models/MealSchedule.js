import mongoose from 'mongoose';

const MealScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
}, { timestamps: true });

// Compound index to ensure unique meal type per day
MealScheduleSchema.index({ day: 1, mealType: 1 }, { unique: true });

export default mongoose.model('MealSchedule', MealScheduleSchema);

// models/Order.js
