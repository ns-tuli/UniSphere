// models/Pdf.js
import mongoose from "mongoose";

// Define the PDF schema with userId reference
const pdfSchema = new mongoose.Schema({
  email: {type: String},
  pdfFileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Pdf = mongoose.model("PDF", pdfSchema);

export default Pdf;
