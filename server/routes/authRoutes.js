import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// DEV ONLY - Remove in production
router.post("/make-admin", async (req, res) => {
  try {
    const { email, secretKey } = req.body;

    // Add a secret key check for basic security
    if (secretKey !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: "Invalid secret key" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.json({ message: `Successfully made ${email} an admin` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
