import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  whiteboardData: { type: String, default: "" },
});

export default mongoose.model("Classroom", ClassroomSchema);
