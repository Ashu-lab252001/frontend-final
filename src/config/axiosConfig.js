// config/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-final-delta-lyart.vercel.app/', // Replace with your backend's Vercel URL
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
