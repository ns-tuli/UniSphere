import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    due: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["assignment", "exam", "project", "reading", "other"],
      default: "assignment",
    },
    course: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reminderSet: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
