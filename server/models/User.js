import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], required: true },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  uploadedPdfs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PDF" }], // References to uploaded PDFs
  downloadedPdfs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PDF" }], // References to downloaded PDFs
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Check if model exists before compiling
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;