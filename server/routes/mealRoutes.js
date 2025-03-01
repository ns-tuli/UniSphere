// const express = require("express");
// const router = express.Router();
// const mealController = require("../controllers/mealController");

import express from "express";
import mealController from "../controllers/mealController.js";

const router = express.Router();

router.get("/", mealController.getMeals);
router.get("/:id", mealController.getMealById);
router.post("/", mealController.addMeal);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

export default router;