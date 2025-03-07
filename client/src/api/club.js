// client\src\api\club.js

import axios from "axios";

// The base URL of your API, adjust this to your actual backend URL
const API_URL = "http://localhost:5000/api/clubs"; // Backend URL for clubs API

// Get all clubs
export const getClubs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  // Return data from the response
  } catch (error) {
    throw new Error("Error fetching clubs: " + error.message);
  }
};

// Get a single club by ID
export const getClub = async (clubId) => {
  try {
    const response = await axios.get(`${API_URL}/${clubId}`);
    return response.data;  // Return data from the response
  } catch (error) {
    throw new Error("Error fetching club by ID: " + error.message);
  }
};

// Create a new club
export const createClub = async (clubData) => {
  try {
    const response = await axios.post(API_URL, clubData);
    return response.data;  // Return the created club data
  } catch (error) {
    throw new Error("Error creating club: " + error.message);
  }
};

// Add a new member to a club (Admin only)
export const addMember = async (clubId, email, role) => {
    try {
      const response = await axios.post(
        `${API_URL}/${clubId}/members`,
        { email, role }
      );
      return response.data;  // Return the response after adding the member
    } catch (error) {
      throw new Error("Error adding member to the club: " + error.message);
    }
  };
  

export const updateClub = async (clubId, clubData) => {
    try {
      const response = await axios.put(`${API_URL}/${clubId}`, clubData);
      return response.data;  // Return the updated club data
    } catch (error) {
      throw new Error("Error updating club: " + error.message);
    }
  };
  
  // Delete a club by ID
  export const deleteClub = async (clubId) => {
    try {
      const response = await axios.delete(`${API_URL}/${clubId}`);
      return response.data;  // Return the response after successful deletion
    } catch (error) {
      throw new Error("Error deleting club: " + error.message);
    }
  };