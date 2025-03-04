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
    const formData = new FormData();

    // Append image if it exists
    if (facultyData.image) {
      formData.append("image", facultyData.image);
    }

    // Append other faculty data
    Object.keys(facultyData).forEach((key) => {
      if (key !== "image") {
        if (Array.isArray(facultyData[key])) {
          formData.append(key, JSON.stringify(facultyData[key]));
        } else {
          formData.append(key, facultyData[key]);
        }
      }
    });

    const response = await axios.post(`${API_URL}/api/faculty`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update faculty
export const updateFaculty = async (id, facultyData) => {
  try {
    const formData = new FormData();

    if (facultyData.image) {
      formData.append("image", facultyData.image);
    }

    Object.keys(facultyData).forEach((key) => {
      if (key !== "image") {
        if (Array.isArray(facultyData[key])) {
          formData.append(key, JSON.stringify(facultyData[key]));
        } else {
          formData.append(key, facultyData[key]);
        }
      }
    });

    const response = await axios.put(`${API_URL}/api/faculty/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
