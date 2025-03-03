import express from "express";
import {
  getStudentData,
  updateStudentData,
  createStudentData,
  deleteStudentData,
} from "../controllers/studentDataController.js";

const router = express.Router();

router.get("/:studentId", getStudentData);
router.post("/", createStudentData);
router.put("/:studentId", updateStudentData);
router.delete("/:studentId", deleteStudentData);

export default router;
