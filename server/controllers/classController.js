import Class from "../models/Class.js";
import Department from "../models/Department.js";

// Get all classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("department");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};

// Get a single class by ID
const getClassById = async (req, res) => {
  try {
    // Change to find by classId instead of _id
    const classData = await Class.findOne({
      classId: parseInt(req.params.classId),
    });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classData);
  } catch (error) {
    console.error("Get class by ID error:", error); // Add this for debugging
    res.status(500).json({ message: "Error fetching class", error });
  }
};

// Add a new class
const addClass = async (req, res) => {
  try {
    // Find the department by name (instead of using the ObjectId)
    const department = await Department.findOne({ name: req.body.department });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Create a new class with the department's name
    const newClass = new Class({ ...req.body, department: department.name });
    department.courses.push(newClass); // Add class to department's courses array
    await department.save();
    await newClass.save();

    res
      .status(201)
      .json({ message: "Class added successfully", class: newClass });
  } catch (error) {
    res.status(500).json({ message: "Error adding class", error });
  }
};

// Update a class
const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findOneAndUpdate(
      { classId: parseInt(req.params.classId) },
      req.body,
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res
      .status(200)
      .json({ message: "Class updated successfully", class: updatedClass });
  } catch (error) {
    console.error("Update class error:", error); // Add this for debugging
    res.status(500).json({ message: "Error updating class", error });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findOneAndDelete({
      classId: parseInt(req.params.classId),
    });

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Delete class error:", error); // Add this for debugging
    res.status(500).json({ message: "Error deleting class", error });
  }
};

export default {
  getClasses,
  getClassById,
  addClass,
  updateClass,
  deleteClass,
};
