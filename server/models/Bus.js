import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

// Define the schema for the bus schedule
const busScheduleSchema = new mongoose.Schema({
  busId: { type: Number, unique: true },
  name: { type: String, required: true },
  schedule: [
    {
      time: { type: String },
      status: { type: String },
    },
  ],
  stops: { type: [String] },
  busNumber: { type: String },
  driver: { type: String },
  capacity: { type: String },
  accessibility: { type: Boolean },
  estimatedTime: { type: String },
  currentLocation: { type: String },
  // Add real-time location tracking
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  // Add notification fields
  notifications: [
    {
      type: {
        type: String,
        enum: ["delay", "detour", "schedule_change", "other"],
      },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
      isActive: { type: Boolean, default: true },
    },
  ],
  // Track if the bus is currently active
  isActive: { type: Boolean, default: true },
});

// Apply the mongoose-sequence plugin for auto-increment
busScheduleSchema.plugin(mongooseSequence(mongoose), {
  inc_field: "busId", // This will be the field that gets auto-incremented
  start_seq: 1, // Start the id from 1
});

// Create and export the model
const BusSchedule = mongoose.model("BusSchedule", busScheduleSchema);

export default BusSchedule;
