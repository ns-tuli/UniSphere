import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentId: { type: String, unique: true, sparse: true },
    department: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    profileImage: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
    },
    joinDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
  
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      default: "Spring 2024",
    },
    phone: String,
    address: String,
    cgpa: {
      type: Number,
      default: 0.0,
    },
    credits: {
      type: Number,
      default: 0,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    picture: String,
    currentCourses: [
      {
        code: String,
        name: String,
        credits: Number,
      },
    ],
  },
  
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
