import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  officeHours: {
    type: String,
  },
  office: {
    type: String,
  },
  education: {
    type: String,
  },
  expertise: [
    {
      type: String,
    },
  ],
  linkedin: {
    type: String,
  },
  googleScholar: {
    type: String,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
facultySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Faculty", facultySchema);
