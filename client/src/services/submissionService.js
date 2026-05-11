import api from './api';

export const submissionService = {
  submitEntry: async (content) => {
    try {
      const response = await api.post('/submission/', {
        content,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Submission failed';
      const err = new Error(message);
      throw err;
    }
  },

  getMySubmissions: async () => {
    try {
      const response = await api.get('/submission/my');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch submissions';
      const err = new Error(message);
      throw err;
    }
  },

  getAllSubmissions: async () => {
    try {
      const response = await api.get('/admin/submissions');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch submissions';
      const err = new Error(message);
      throw err;
    }
  },

  setDeadline: async (deadline) => {
    try {
      const response = await api.post('/admin/deadline', {
        deadline,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to set deadline';
      const err = new Error(message);
      throw err;
    }
  },

  getDeadline: async () => {
    try {
      // Try to get deadline from a new endpoint (you may need to create this)
      // For now, we'll fetch all submissions to check the deadline
      const response = await api.get('/admin/deadline');
      return response.data;
    } catch (error) {
      // Silently fail if deadline endpoint doesn't exist
      return null;
    }
  },
};

export default submissionService;
