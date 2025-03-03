import axios from "axios";

const API_URL = "http://localhost:5000";

// Get all faculty
export const getFaculty = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/faculty`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get faculty by ID
export const getFacultyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/faculty/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add new faculty
export const addFaculty = async (facultyData) => {
  try {
    const response = await axios.post(`${API_URL}/api/faculty`, facultyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update faculty
export const updateFaculty = async (id, facultyData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/faculty/${id}`,
      facultyData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete faculty
export const deleteFaculty = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/faculty/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
