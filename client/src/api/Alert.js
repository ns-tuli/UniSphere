import axios from "./axiosConfig";

// Create new alert
export const createAlert = async (alertData) => {
  try {
    const response = await axios.post("/api/alerts", alertData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Get all alerts
export const getAlerts = async () => {
  try {
    const response = await axios.get("/api/alerts");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Update alert status
export const updateAlert = async (id, status) => {
  try {
    const response = await axios.patch(`/api/alerts/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
