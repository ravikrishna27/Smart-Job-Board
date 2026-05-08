import api from './api';

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user and clear HTTP-only cookie
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current authenticated user (reads cookie automatically)
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
