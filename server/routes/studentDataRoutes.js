import express from "express";
import { updateUser } from "../controllers/authController.js";
import {
  createStudentData,
  deleteStudentData,
  getStudentData
} from "../controllers/studentDataController.js";

const router = express.Router();

router.post("/", getStudentData);
router.post("/", createStudentData);

router.delete("/:studentId", deleteStudentData);
router.put("/", updateUser);

export default router;
