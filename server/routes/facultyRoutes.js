import express from "express";
import multer from "multer";
import Faculty from "../models/faculty.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Get all faculty
router.get("/", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get faculty by ID
router.get("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new faculty with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const facultyData = req.body;
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      facultyData.image = {
        public_id: result.public_id,
        url: result.url,
      };
    }

    const faculty = new Faculty(facultyData);
    const newFaculty = await faculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update faculty with image
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const facultyData = req.body;
    const existingFaculty = await Faculty.findById(req.params.id);

    if (req.file) {
      // Delete old image if exists
      if (existingFaculty.image?.public_id) {
        await deleteFromCloudinary(existingFaculty.image.public_id);
      }

      // Upload new image
      const result = await uploadToCloudinary(req.file);
      facultyData.image = {
        public_id: result.public_id,
        url: result.url,
      };
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      facultyData,
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(updatedFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete faculty and image
router.delete("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Delete image from Cloudinary if exists
    if (faculty.image?.public_id) {
      await deleteFromCloudinary(faculty.image.public_id);
    }

    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
