import Department from "../models/Department.js";

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("courses");
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error });
  }
};

// Get a single department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.departmentId).populate("courses");
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: "Error fetching department", error });
  }
};

// Add a new department
const addDepartment = async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    await newDepartment.save();
    res.status(201).json({ message: "Department added successfully", department: newDepartment });
  } catch (error) {
    res.status(500).json({ message: "Error adding department", error });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.departmentId, 
      req.body, 
      { new: true }
    );
    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department updated successfully", department: updatedDepartment });
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.departmentId);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error });
  }
};

export default {
  getDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment
};
