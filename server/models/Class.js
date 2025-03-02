import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

// Define Class Schema
const classSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Explicitly define _id
  classId: { type: Number, unique: true },
  department: { type: String, required: true },  // Reference to Department
  courseCode: { type: String},
  name: { type: String},
  description: { type: String},
  credits: { type: Number},
  days: { type: [String]},  // ['Monday', 'Wednesday']
  time: { type: String},
  location: { type: String},
  professor: { type: String},
  email: { type: String},
  officeHours: { type: String },
  officeLocation: { type: String },
  learningOutcomes: [
    { type: String }
  ],
  materials:[
    {type: String}
  ],
  assignments: [
    {
      name: { type: String},
      dueDate: { type: Date},
      points: { type: Number},
      status: { type: String, enum: ["completed", "upcoming", "ongoing"], default: "upcoming" }
    }
  ]
});

// Add a pre-save hook to generate classId if not present
classSchema.pre('save', async function(next) {
  if (!this.classId) {
    try {
      const lastClass = await this.constructor.findOne({}, {}, { sort: { classId: -1 } });
      this.classId = lastClass ? lastClass.classId + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

classSchema.plugin(mongooseSequence(mongoose), {
  inc_field: "classId",  // Auto-increment classId
  start_seq: 1,  // Start incrementing from 1
});

export default mongoose.model("Class", classSchema);
