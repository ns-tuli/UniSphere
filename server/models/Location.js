import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["building", "classroom", "office", "other"],
    default: "other",
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  description: String,
  icon: {
    type: String,
    default: "box", // default 3D shape
  },
});

export default mongoose.model("Location", locationSchema);
