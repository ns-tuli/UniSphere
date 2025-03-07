import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    mealId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: [
      {
        type: String,
        required: true,
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    prepTime: {
      type: String,
    },
    image: {
      type: String,
      default: "default-meal.jpg",
    },
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    popularity: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
