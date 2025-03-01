import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateUser, authorizeRole } from "../middlewares/auth.js";

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user." });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Protected Route for Authenticated Users
router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({ message: "Welcome to your profile!", user: req.user });
});

// Admin-Only Route
router.get("/admin", authenticateUser, authorizeRole("admin"), (req, res) => {
  res.status(200).json({ message: "Admin dashboard access granted." });
});

// Logout Route
router.post("/logout", authenticateUser, (req, res) => {
  // Client-side should handle token removal
  res.status(200).json({ message: "Logged out successfully." });
});

export default router;