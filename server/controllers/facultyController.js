import express from "express";
import {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  searchFaculty,
} from "../controllers/facultyController.js";
const router = express.Router();

// Get all faculty
router.get("/", getAllFaculty);

// Get faculty by ID
router.get("/:id", getFacultyById);

// Create new faculty
router.post("/", createFaculty);

// Update faculty
router.put("/:id", updateFaculty);

// Delete faculty
router.delete("/:id", deleteFaculty);

// Search faculty
router.get("/search", searchFaculty);

export default router;
