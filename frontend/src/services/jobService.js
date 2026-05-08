import api from './api';

export const jobService = {
  /**
   * Fetch all jobs with optional filtering/pagination
   */
  getJobs: async (params = {}) => {
    // Axios will automatically stringify the params object into query strings
    // e.g. { keyword: 'engineer', limit: 10 } -> ?keyword=engineer&limit=10
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  /**
   * Fetch a single job by ID
   */
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  }
};
