//path: client/src/api/meal.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/meals"; // Adjust this to your backend URL

// Get all meals
export const getMeals = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching meals: " + error.message);
  }
};

// Get a single meal by ID
export const getMealById = async (mealId) => {
  try {
    const response = await axios.get(`${API_URL}/${mealId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching meal: " + error.message);
  }
};

// Add a new meal
export const addMeal = async (mealData) => {
  try {
    const response = await axios.post(API_URL, mealData);
    return response.data;
  } catch (error) {
    throw new Error("Error adding meal: " + error.message);
  }
};

// Update a meal
export const updateMeal = async (mealId, mealData) => {
  try {
    const response = await axios.put(`${API_URL}/${mealId}`, mealData);
    return response.data;
  } catch (error) {
    throw new Error("Error updating meal: " + error.message);
  }
};

// Delete a meal
export const deleteMeal = async (mealId) => {
  try {
    const response = await axios.delete(`${API_URL}/${mealId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting meal: " + error.message);
  }
};
