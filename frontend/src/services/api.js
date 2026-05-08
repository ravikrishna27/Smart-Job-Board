import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // IMPORTANT: Allows sending/receiving HTTP-Only cookies
  timeout: 10000, // Abort requests that take longer than 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for global error handling (optional, but good for catching 401s globally later)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can add global 401 Unauthorized handling here later (e.g., redirect to login)
    return Promise.reject(error);
  }
);

export default api;
