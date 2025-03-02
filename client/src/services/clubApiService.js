import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

const clubService = axios.create({
  baseURL: `${API_URL}/clubs`,
  headers: {
    'Content-Type': 'application/json'
  }
});



export const getCategories = async () => {
  try {
    const response = await clubService.get('/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getClubById = async (id) => {
  try {
    const response = await clubService.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createClub = async (clubData) => {
  try {
    const response = await clubService.post('/', clubData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const joinClub = async (clubId, userData) => {
  try {
    const response = await clubService.post(`/${clubId}/join`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add or update these functions
export const getClubs = async (category = '', search = '') => {
  
    let url = '/api/clubs';
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch clubs');
    return await response.json();

  
};