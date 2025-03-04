import express from "express";
import {
  getStudentData,
  updateStudentData,
  createStudentData,
  deleteStudentData,
} from "../controllers/studentDataController.js";
import { updateUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/:studentId", getStudentData);
router.post("/", createStudentData);

router.delete("/:studentId", deleteStudentData);
router.put("/", updateUser);

export default router;
