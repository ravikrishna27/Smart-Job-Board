import api from './api';

export const jobService = {
  /**
   * Fetch all jobs with optional filtering/pagination
   */
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  /**
   * Fetch jobs posted by the logged-in recruiter
   */
  getMyJobs: async () => {
    const response = await api.get('/jobs/my-jobs');
    return response.data;
  },

  /**
   * Fetch a single job by ID or slug
   */
  getJobById: async (idOrSlug) => {
    const response = await api.get(`/jobs/${idOrSlug}`);
    return response.data;
  },

  /**
   * Create a new job
   */
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  /**
   * Update a job
   */
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  /**
   * Update job status only
   */
  updateJobStatus: async (id, status) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a job
   */
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};
