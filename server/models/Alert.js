import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    required: true,
    enum: ["fire", "medical", "harassment", "accident", "security", "natural"],
  },
  message: String,
  location: {
    lat: Number,
    lng: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "resolved", "dismissed"],
    default: "active",
  },
  adminResponse: {
    seen: { type: Boolean, default: false },
    responseMessage: { type: String, default: "" },
    respondedAt: { type: Date },
  },
});

export default mongoose.model("Alert", alertSchema);
