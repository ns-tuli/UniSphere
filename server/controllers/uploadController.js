import multer from 'multer';
import PDF from '../models/Pdf.js'; // Assuming you have a PDF model for saving file details
import ErrorResponse from '../utils/errorResponse.js'; // Utility for consistent error handling

// Set up multer to handle file storage and naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the folder where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({ storage }).single('file'); // Handle single file upload

// Upload file handler
export const uploadFile = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse('Error while uploading the file.', 500));
    }

    if (!req.file) {
      return next(new ErrorResponse('No file selected for upload.', 400));
    }

    try {
      // Save the file information in the database with the associated user
      const pdfData = new PDF({
        userId: req.user.id, // The user ID is obtained from the JWT token
        pdfFileName: req.file.filename,
        uploadedAt: new Date()
      });

      await pdfData.save();

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully!',
        file: req.file.filename // Return the uploaded file name in the response
      });
    } catch (error) {
      return next(new ErrorResponse('Error saving file data to database.', 500));
    }
  });
};

// Fetch uploaded files handler
export const getUploadedFiles = async (req, res, next) => {
  try {
    // Fetch files associated with the authenticated user (based on userId from JWT)
    const files = await PDF.find({ userId: req.user.id });

    if (files.length === 0) {
      return next(new ErrorResponse('No files found for this user.', 404));
    }

    res.status(200).json({
      success: true,
      files // Return the list of uploaded files
    });
  } catch (error) {
    return next(new ErrorResponse('Error fetching files from the database.', 500));
  }
};
