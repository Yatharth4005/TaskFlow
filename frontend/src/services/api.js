import axios from 'axios';

// Vite proxy routes /api to http://localhost:5000 in dev
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for standardized error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    return Promise.reject(new Error(customMessage));
  }
);

export default api;

