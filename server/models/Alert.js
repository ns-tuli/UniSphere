const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Alert", alertSchema);
