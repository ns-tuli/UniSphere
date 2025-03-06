import StudentData from "../models/studentData.js";
import User from "../models/User.js";

export const getStudentData = async (req, res) => {
  try {
    console.log("fetching...")
    const userId = req.body.id; // Get user from auth middleware
    console.log(userId)
    const studentData = await User.findById(userId)

    if (!studentData) {
      return res.status(404).json({ message: "Student data not found" });
    }

    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudentData = async (req, res) => {
  try {
    const userId = req.user.id; // Get user from auth middleware

    // Check if student data already exists
    const User = await User.findOne({ user: userId });
    if (existingData) {
      return res.status(400).json({ message: "Student data already exists" });
    }

    const newStudentData = new StudentData({
      ...req.body,
      user: userId,
    });
    await newStudentData.save();
    res.status(201).json(newStudentData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateStudentData = async (req, res) => {
  try {
    const userId = req.user.id; // Get user from auth middleware
    const updatedData = await StudentData.findOneAndUpdate(
      { user: userId },
      { ...req.body, lastUpdated: Date.now() },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Student data not found" });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStudentData = async (req, res) => {
  try {
    const userId = req.user._id; // Get user from auth middleware
    const deletedData = await StudentData.findOneAndDelete({ user: userId });

    if (!deletedData) {
      return res.status(404).json({ message: "Student data not found" });
    }

    res.status(200).json({ message: "Student data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
