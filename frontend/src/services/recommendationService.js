import api from './api';

export const recommendationService = {
  /**
   * Get personalized explainable job recommendations
   */
  getRecommendations: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  },

  /**
   * Search jobs using hybrid semantic similarity model
   */
  semanticSearch: async (query) => {
    const response = await api.post('/recommendations/search', { query });
    return response.data;
  },

  /**
   * Get student ATS skill gap analysis
   */
  getStudentGap: async () => {
    const response = await api.get('/recommendations/student-gap');
    return response.data;
  },

  /**
   * Get recruiter supply/demand skill shortage report
   */
  getRecruiterTrends: async () => {
    const response = await api.get('/recommendations/recruiter-trends');
    return response.data;
  }
};
