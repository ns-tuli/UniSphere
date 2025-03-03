import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    console.log("Fetching users, requester:", req.user); // Debug user
    const users = await User.find({}).select("-password");
    console.log("Users found:", users.length); // Debug results
    res.json(users);
  } catch (error) {
    console.error("Error in admin/users:", error); // Debug error
    res.status(400).json({ message: error.message });
  }
});

// Make user admin
router.put("/make-admin/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = "admin";
      const updatedUser = await user.save();
      res.json({
        message: "User promoted to admin",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove admin status
router.put("/remove-admin/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = "student";
      const updatedUser = await user.save();
      res.json({
        message: "Admin status removed",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
