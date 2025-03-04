import mongoose from "mongoose";

const studentDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },

  department: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    default: "Spring 2024",
  },
  phone: String,
  address: String,
  cgpa: {
    type: Number,
    default: 0.0,
  },
  credits: {
    type: Number,
    default: 0,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  picture: String,
  currentCourses: [
    {
      code: String,
      name: String,
      credits: Number,
    },
  ],
  achievements: [String],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StudentData", studentDataSchema);
