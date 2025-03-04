// utils/uploadUtils.js
import multer from "multer";
import path from "path";

// Define storage for uploaded files (using disk storage for simplicity)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save the files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use timestamp for unique file names
  }
});

// Create multer instance with storage configuration
const upload = multer({ storage: storage });

// Export the upload instance as the default export
export default upload;
