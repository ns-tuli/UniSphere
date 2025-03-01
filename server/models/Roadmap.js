import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  course: { type: String, required: true },
  goals: { type: Object, required: true },
  experience: { type: Object, required: true },
  timeCommitment: { type: Object, required: true },
  preferences: { type: Object, required: true },
  tools: { type: String },
  feedback: { type: String },
  generatedRoadmap: { type: String, required: true },
});

// Create the model
const Roadmap = mongoose.model("Roadmap", roadmapSchema);

// Export the model as default
export default Roadmap;