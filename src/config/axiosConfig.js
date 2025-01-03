// config/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-final-1-khd1.onrender.com', // Replace with your backend's Vercel URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
