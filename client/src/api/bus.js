import axios from "axios";

// The base URL of your API, adjust this to your actual backend URL
const API_URL = "http://localhost:5000/api/bus-schedules"; // Adjust as needed

// Get all bus schedules
export const getBusSchedules = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching bus schedules: " + error.message);
  }
};

// Get a single bus schedule by busId
export const getBusScheduleById = async (busId) => {
  try {
    const response = await axios.get(`${API_URL}/${busId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching bus schedule by ID: " + error.message);
  }
};

// Add a new bus schedule
export const addBusSchedule = async (busScheduleData) => {
  try {
    const response = await axios.post(API_URL, busScheduleData);
    return response.data;
  } catch (error) {
    throw new Error("Error adding bus schedule: " + error.message);
  }
};

// Update an existing bus schedule by busId
export const updateBusSchedule = async (busId, busScheduleData) => {
  try {
    const response = await axios.put(`${API_URL}/${busId}`, busScheduleData);
    return response.data;
  } catch (error) {
    throw new Error("Error updating bus schedule: " + error.message);
  }
};

// Delete a bus schedule by busId
export const deleteBusSchedule = async (busId) => {
  try {
    const response = await axios.delete(`${API_URL}/${busId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting bus schedule: " + error.message);
  }
};
