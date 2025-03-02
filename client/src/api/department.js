import axios from "axios";

const API_URL = "http://localhost:5000/api/department"; // Adjust this to your backend URL

// Get all departments
export const getDepartments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching departments: " + error.message);
  }
};

// Get a single department by ID
export const getDepartmentById = async (departmentId) => {
  try {
    const response = await axios.get(`${API_URL}/${departmentId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching department: " + error.message);
  }
};

// Add a new department
export const addDepartment = async (departmentData) => {
  try {
    const response = await axios.post(API_URL, departmentData);
    return response.data;
  } catch (error) {
    throw new Error("Error adding department: " + error.message);
  }
};

// Update a department
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    const response = await axios.put(`${API_URL}/${departmentId}`, departmentData);
    return response.data;
  } catch (error) {
    throw new Error("Error updating department: " + error.message);
  }
};

// Delete a department
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${departmentId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting department: " + error.message);
  }
};
