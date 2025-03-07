import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllItems,
  createItem,
  updateItemStatus,
  deleteItem,
  bulkDeleteItems,
} from "../controllers/lostFoundController.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Public routes
router.get("/items", getAllItems);
router.post("/report", upload.single("image"), createItem);
router.patch("/items/:id", updateItemStatus);
router.delete("/items/:id", deleteItem);
router.post("/bulk-delete", bulkDeleteItems);

export default router;
