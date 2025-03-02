import express from "express";
import departmentController from "../controllers/departmentController.js";

const router = express.Router();

// Routes for department operations
router.get("/", departmentController.getDepartments);  // Get all departments
router.get("/:departmentId", departmentController.getDepartmentById);  // Get department by ID
router.post("/", departmentController.addDepartment);  // Add a new department
router.put("/:departmentId", departmentController.updateDepartment);  // Update department
router.delete("/:departmentId", departmentController.deleteDepartment);  // Delete department

export default router;
