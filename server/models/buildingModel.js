import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  coordinates: {
    type: [Number], // [latitude, longitude]
    required: true,
  },
  description: String,
  facilities: [String],
  hours: String,
  image: String,
  accessibility: Boolean,
  events: [String],
});

export default mongoose.model("Building", buildingSchema);
