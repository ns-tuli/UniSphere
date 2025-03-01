// const Meal = require("../models/Meal");
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
    const meal = await Meal.findById(req.params.id);
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
    const newMeal = new Meal(req.body);
    await newMeal.save();
    res.status(201).json({ message: "Meal added successfully", meal: newMeal });
  } catch (error) {
    res.status(500).json({ message: "Error adding meal", error });
  }
};

// Update a meal
const updateMeal = async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.status(200).json({ message: "Meal updated successfully", meal: updatedMeal });
  } catch (error) {
    res.status(500).json({ message: "Error updating meal", error });
  }
};

// Delete a meal
const deleteMeal = async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
    if (!deletedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal", error });
  }
};

// ...existing code...

export default {
    getMeals,
    getMealById,
    addMeal,
    updateMeal,
    deleteMeal,
  };