import express from "express";
import busController from "../controllers/busController.js";

const router = express.Router();

router.get("/", busController.getBusSchedules);
router.get("/:busId", busController.getBusScheduleById);
router.post("/", busController.addBusSchedule);
router.put("/:busId", busController.updateBusSchedule);
router.delete("/:busId", busController.deleteBusSchedule);

router.put("/:busId/location", busController.updateBusLocation);
router.post("/:busId/notifications", busController.addBusNotification);
router.get("/:busId/notifications", busController.getBusNotifications);

export default router;
