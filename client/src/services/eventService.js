import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const clubService = {
  getAll: () => api.get('/clubs'),
  getOne: (id) => api.get(`/clubs/${id}`),
  create: (data) => api.post('/clubs', data),
  join: (id, userData) => api.post(`/clubs/${id}/join`, userData)
};

export const eventService = {
  getAll: () => api.get('/events'),
  getOne: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  rsvp: (id, userData) => api.post(`/events/${id}/rsvp`, userData)
};

export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data)
};