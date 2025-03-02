import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/studentData";

export const getStudentData = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch student data"
    );
  }
};

export const createStudentData = async (studentData) => {
  try {
    const response = await axios.post(API_BASE_URL, studentData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create student data"
    );
  }
};

export const updateStudentData = async (studentId, updateData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${studentId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update student data"
    );
  }
};

export const deleteStudentData = async (studentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete student data"
    );
  }
};
