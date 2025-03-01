import express from "express";
import busController from "../controllers/busController.js";

const router = express.Router();

router.get("/", busController.getBusSchedules);
router.get("/:busId", busController.getBusScheduleById);
router.post("/", busController.addBusSchedule);
router.put("/:busId", busController.updateBusSchedule);
router.delete("/:busId", busController.deleteBusSchedule);

export default router;