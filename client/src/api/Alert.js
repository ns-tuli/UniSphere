import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create new alert
export const createAlert = async (alertData) => {
  try {
    const response = await axios.post(`${API_URL}/alerts`, alertData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create alert");
  }
};

// Get all alerts
export const getAlerts = async () => {
  try {
    const response = await axios.get(`${API_URL}/alerts`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch alerts");
  }
};

// Update alert status
export const updateAlert = async (alertId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/alerts/${alertId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update alert");
  }
};
