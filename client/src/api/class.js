import axios from "axios";

const API_URL = "http://localhost:5000/api/class"; // Adjust this to your backend URL

// Get all classes
export const getClasses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching classes: " + error.message);
  }
};

// Get a single class by ID
export const getClassById = async (classId) => {
  try {
    const response = await axios.get(`${API_URL}/${classId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching class: " + error.message);
  }
};

// Add a new class
export const addClass = async (classData) => {
  try {
    const response = await axios.post(API_URL, classData);
    return response.data;
  } catch (error) {
    throw new Error("Error adding class: " + error.message);
  }
};

// Update a class
export const updateClass = async (classId, classData) => {
  try {
    const response = await axios.put(`${API_URL}/${classId}`, classData);
    return response.data;
  } catch (error) {
    throw new Error("Error updating class: " + error.message);
  }
};

// Delete a class
export const deleteClass = async (classId) => {
  try {
    const response = await axios.delete(`${API_URL}/${classId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting class: " + error.message);
  }
};
