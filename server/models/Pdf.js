import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pdfFileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('PDF', pdfSchema);
