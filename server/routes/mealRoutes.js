// const express = require("express");
// const router = express.Router();
// const mealController = require("../controllers/mealController");

import express from "express";
import router from "Router";

router.get("/", mealController.getMeals);
router.get("/:id", mealController.getMealById);
router.post("/", mealController.addMeal);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

module.exports = router;