import express from "express";
import classController from "../controllers/classController.js";

const router = express.Router();

// Routes for class operations
router.get("/", classController.getClasses);  // Get all classes
router.get("/:classId", classController.getClassById);  // Get class by ID
router.post("/", classController.addClass);  // Add a new class
router.put("/:classId", classController.updateClass);  // Update class
router.delete("/:classId", classController.deleteClass);  // Delete class

export default router;
