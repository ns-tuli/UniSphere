import express from "express";
import mealController from "../controllers/mealController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", mealController.getMeals);
router.get("/:mealId", mealController.getMealById);
router.post("/", upload.single("image"), mealController.addMeal);
router.put("/:mealId", upload.single("image"), mealController.updateMeal);
router.delete("/:mealId", mealController.deleteMeal);
router.put("/:mealId/popularity", mealController.updateMealPopularity);
router.get("/category/:category", mealController.getMealsByCategory);

export default router;
