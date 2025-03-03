import express from "express";
import Classroom from "../models/Classroom.js";

const router = express.Router();

// Get classroom data
router.get("/:roomId", async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ roomId: req.params.roomId });
    if (!classroom) return res.status(404).json({ message: "Classroom not found" });
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save whiteboard data
router.post("/:roomId", async (req, res) => {
  try {
    let classroom = await Classroom.findOne({ roomId: req.params.roomId });
    if (!classroom) {
      classroom = new Classroom({ roomId: req.params.roomId, whiteboardData: req.body.whiteboardData });
    } else {
      classroom.whiteboardData = req.body.whiteboardData;
    }
    await classroom.save();
    res.json({ message: "Whiteboard data saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
