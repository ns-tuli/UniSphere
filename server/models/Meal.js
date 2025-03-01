// const mongoose = require("mongoose");
import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
  },
  allergens: { type: [String], required: true },
  categories: { type: [String], required: true },
  available: { type: Boolean, default: true },
  popularity: { type: Number, default: 0 },
  prepTime: { type: String, required: true },
});

// module.exports = mongoose.model("Meal", mealSchema);
export default mongoose.model("Meal", mealSchema);