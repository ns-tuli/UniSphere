// models/Pdf.js
import mongoose from "mongoose";

// Define the PDF schema with userId reference
const pdfSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pdfFileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",  // This will reference the User model
    required: true 
  },
});

const Pdf = mongoose.model("PDF", pdfSchema);

export default Pdf;
