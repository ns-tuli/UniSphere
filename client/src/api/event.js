//client\src\api\event.js

import axios from "axios";

// The base URL of your API, adjust this to your actual backend URL
const API_URL = "http://localhost:5000/api/events"; // Adjust as needed

// Get all events
export const getEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  // Return data from the response
  } catch (error) {
    throw new Error("Error fetching events: " + error.message);
  }
};

// Get a single event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/${eventId}`);
    return response.data;  // Return data from the response
  } catch (error) {
    throw new Error("Error fetching event by ID: " + error.message);
  }
};

// Add a new event
export const addEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData);
    return response.data;  // Return the created event data
  } catch (error) {
    throw new Error("Error adding event: " + error.message);
  }
};

// Update an existing event by ID
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${API_URL}/${eventId}`, eventData);
    return response.data;  // Return updated event data
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
};

// Delete an event by ID
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/${eventId}`);
    return response.data;  // Return the response from deletion (e.g., success message)
  } catch (error) {
    throw new Error("Error deleting event: " + error.message);
  }
};