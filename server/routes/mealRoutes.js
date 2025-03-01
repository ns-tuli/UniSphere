// const express = require("express");
// const router = express.Router();
// const mealController = require("../controllers/mealController");

import express from "express";
import mealController from "../controllers/mealController.js";

const router = express.Router();

router.get("/", mealController.getMeals);
router.get("/:mealId", mealController.getMealById);
router.post("/", mealController.addMeal);
router.put("/:mealId", mealController.updateMeal);
router.delete("/:mealId", mealController.deleteMeal);

export default router;