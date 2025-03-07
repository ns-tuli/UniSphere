import Meal from "../models/Meal.js";

// Get all meals
const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals", error });
  }
};

// Get a single meal by ID
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findOne({ mealId: req.params.mealId });
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meal", error });
  }
};

// Add a new meal
const addMeal = async (req, res) => {
  try {
    const mealData = req.body;
    if (req.file) {
      mealData.image = req.file.path;
    }
    const newMeal = new Meal(mealData);
    await newMeal.save();
    res.status(201).json({ message: "Meal added successfully", meal: newMeal });
  } catch (error) {
    res.status(500).json({ message: "Error adding meal", error });
  }
};

// Update a meal
const updateMeal = async (req, res) => {
  try {
    const mealData = req.body;
    if (req.file) {
      mealData.image = req.file.path;
    }
    const updatedMeal = await Meal.findOneAndUpdate(
      { mealId: req.params.mealId },
      mealData,
      { new: true }
    );
    if (!updatedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res
      .status(200)
      .json({ message: "Meal updated successfully", meal: updatedMeal });
  } catch (error) {
    res.status(500).json({ message: "Error updating meal", error });
  }
};

// Delete a meal
const deleteMeal = async (req, res) => {
  try {
    const deletedMeal = await Meal.findOneAndDelete({
      mealId: req.params.mealId,
    });
    if (!deletedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal", error });
  }
};

// Update a meal's popularity
const updateMealPopularity = async (req, res) => {
  try {
    const { popularity } = req.body;
    const updatedMeal = await Meal.findOneAndUpdate(
      { mealId: req.params.mealId },
      { popularity },
      { new: true }
    );
    if (!updatedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.status(200).json({ message: "Popularity updated", meal: updatedMeal });
  } catch (error) {
    res.status(500).json({ message: "Error updating popularity", error });
  }
};

// Get meals by category
const getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const meals = await Meal.find({ categories: category });
    res.status(200).json(meals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching meals by category", error });
  }
};

export default {
  getMeals,
  getMealById,
  addMeal,
  updateMeal,
  deleteMeal,
  updateMealPopularity,
  getMealsByCategory,
};
