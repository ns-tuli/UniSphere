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
    const formData = new FormData();
    Object.keys(mealData).forEach((key) => {
      if (key === "image" && mealData[key] instanceof File) {
        formData.append("image", mealData[key]);
      } else {
        formData.append(key, mealData[key]);
      }
    });

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error adding meal: " + error.message);
  }
};

// Update a meal
export const updateMeal = async (mealId, mealData) => {
  try {
    const formData = new FormData();
    Object.keys(mealData).forEach((key) => {
      if (key === "image" && mealData[key] instanceof File) {
        formData.append("image", mealData[key]);
      } else {
        formData.append(key, mealData[key]);
      }
    });

    const response = await axios.put(`${API_URL}/${mealId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

// Get meals by category
export const getMealsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/category/${category}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching meals by category: " + error.message);
  }
};

// Update meal popularity
export const updateMealPopularity = async (mealId, popularity) => {
  try {
    const response = await axios.put(`${API_URL}/${mealId}/popularity`, {
      popularity,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error updating meal popularity: " + error.message);
  }
};
