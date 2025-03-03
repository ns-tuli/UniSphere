import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

// Define Department Schema
const departmentSchema = new mongoose.Schema({
  departmentId: { type: Number, unique: true },
  name: { type: String, unique: true },  // E.g., CSE, SWE, MPE, etc.
  description: { type: String},  // Brief description of the department
  head: { type: String},  // Department head
  email: { type: String},
  contactNumber: { type: String },
  location: { type: String },  // Department's building/location
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }]  // Array of class references
});

departmentSchema.plugin(mongooseSequence(mongoose), {
  inc_field: "departmentId",  // Auto-increment departmentId
  start_seq: 1,  // Start incrementing from 1
});

export default mongoose.model("Department", departmentSchema);
