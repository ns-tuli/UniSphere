import express from "express";
import {
  getCampusBuildings,
  getBuildingDetails,
  getNavigationRoute,
} from "../controllers/navigationController.js";

const router = express.Router();

router.get("/buildings", getCampusBuildings);
router.get("/building/:id", getBuildingDetails);
router.get("/route/:from/:to", getNavigationRoute);

export default router;
