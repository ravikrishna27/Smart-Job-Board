import api from './api';

export const userService = {
  /**
   * Get user profile details
   */
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile details
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  /**
   * Upload profile resume
   */
  uploadResume: async (formData) => {
    const response = await api.post('/users/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get saved jobs
   */
  getSavedJobs: async () => {
    const response = await api.get('/users/saved-jobs');
    return response.data;
  },

  /**
   * Save a job
   */
  saveJob: async (jobId) => {
    const response = await api.post(`/users/saved-jobs/${jobId}`);
    return response.data;
  },

  /**
   * Unsave a job
   */
  unsaveJob: async (jobId) => {
    const response = await api.delete(`/users/saved-jobs/${jobId}`);
    return response.data;
  },

  /**
   * Get recruiter dashboard analytics
   */
  getAnalytics: async () => {
    const response = await api.get('/users/analytics');
    return response.data;
  }
};
