import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import User from "../models/User.js";
const router = express.Router();
import PDF from "../models/Pdf.js";
router.get("/profile", verifyToken, async (req, res) => {
    try {
      if (!req.user || !req.user.userId) {
        console.error("User ID missing in request.");
        return res.status(400).json({ error: "User not authenticated." });
      }
  
      const user = await User.findById(req.user.userId).select("-password");
      console.log("USEr:", req.user.userId)
      if (!user) {
        console.error("User not found.");
        return res.status(404).json({ error: "User not found." });
      }
  
      const uploadedPdfs = await PDF.find({ userId: req.user.userId });
      const downloadedPdfs = []; // Add logic for downloaded PDFs if tracking is implemented
  
      res.status(200).json({ user, uploadedPdfs, downloadedPdfs });
    } catch (error) {
      console.error("Error in /profile route:", error.message);
      res.status(500).json({ error: "Failed to fetch profile data." });
    }
  });
  router.put("/username", verifyToken, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { username: req.body.username },
        { new: true }
      );
      res.status(200).json({ username: user.username });
    } catch (error) {
      res.status(500).json({ error: "Failed to update username." });
    }
  });
  
  router.put("/social-links", verifyToken, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { socialLinks: req.body.socialLinks },
        { new: true }
      );
      res.status(200).json({ socialLinks: user.socialLinks });
    } catch (error) {
      res.status(500).json({ error: "Failed to update social links." });
    }
  });
  
  
  router.get("/pdfs", verifyToken, async (req, res) => {
    try {
      const userId = req.user?.userId; // Logged-in user's userId
  
      // Find PDFs where the userId matches
      const userPdfs = await PDF.find({ userId }).select("pdfFileName aiGeneratedTitle aiGeneratedCaption uploadedAt").lean();
  
      if (!userPdfs || userPdfs.length === 0) {
        return res.status(404).json({ error: "No PDFs found for this user." });
      }
  
      res.status(200).json({ pdfs: userPdfs });
    } catch (error) {
      console.error("Error fetching PDFs:", error.message);
      res.status(500).json({ error: "Failed to fetch PDFs." });
    }
  });
  
  router.put("/pdfs/:id/toggle-privacy", verifyToken, async (req, res) => {
    try {
      const pdfId = req.params.id;
      const { doubleClick } = req.body; // Determine if this is a double-click
      const pdf = await PDF.findById(pdfId);
  
      if (!pdf) {
        return res.status(404).json({ error: "PDF not found." });
      }
  
      if (pdf.userId !== req.user.userId) {
        return res.status(403).json({ error: "Unauthorized to change this PDF's privacy." });
      }
  
      if (doubleClick) {
        // Revert the last toggle state
        pdf.privacy = pdf.privacy === "public" ? "private" : "public";
      } else {
        // Regular toggle
        pdf.privacy = pdf.privacy === "public" ? "private" : "public";
      }
  
      await pdf.save();
      res.status(200).json({ message: "Privacy updated successfully.", privacy: pdf.privacy });
    } catch (error) {
      console.error("Error toggling PDF privacy:", error.message);
      res.status(500).json({ error: "Failed to toggle privacy." });
    }
  });
  
  export default router