import api from './api';

export const applicationService = {
  /**
   * Apply to a job (handles multipart/form-data)
   */
  applyToJob: async (formData) => {
    const response = await api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get applications for the logged-in student
   */
  getMyApplications: async () => {
    const response = await api.get('/applications/me');
    return response.data;
  },

  /**
   * Get applicants for a specific job (Recruiter)
   */
  getJobApplicants: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  /**
   * Get all applicants across all jobs (Recruiter)
   */
  getAllRecruiterApplicants: async () => {
    const response = await api.get('/applications/recruiter/all');
    return response.data;
  },

  /**
   * Update the status of an application (Recruiter)
   */
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  }
};
