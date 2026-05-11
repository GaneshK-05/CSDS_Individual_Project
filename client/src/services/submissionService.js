import api from './api';

export const submissionService = {
  submitTask: async (taskId, submissionData) => {
    try {
      // If file submission, use FormData
      if (submissionData.file) {
        const formData = new FormData();
        formData.append('submissionType', 'File');
        formData.append('file', submissionData.file);
        
        const response = await api.post(`/submission/${taskId}/submit`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Text submission
        const response = await api.post(`/submission/${taskId}/submit`, {
          submissionType: 'Text',
          content: submissionData.content
        });
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Submission failed';
      throw new Error(message);
    }
  },

  getUserSubmissions: async () => {
    try {
      const response = await api.get('/submission/my');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      // Log error but don't throw - allow component to render with empty submissions
      const message = error.response?.data?.message || error.message || 'Failed to fetch submissions';
      console.error('getUserSubmissions error:', message);
      // Return empty array instead of throwing to prevent blank page
      return [];
    }
  },

  getTaskSubmissions: async (taskId) => {
    try {
      const response = await api.get(`/submission/task/${taskId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch submissions';
      throw new Error(message);
    }
  },

  getAllSubmissions: async () => {
    try {
      const response = await api.get('/submission');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch submissions';
      throw new Error(message);
    }
  },

  downloadSubmissionFile: async (submissionId) => {
    try {
      const response = await api.get(`/submission/download/${submissionId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to download file';
      throw new Error(message);
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
      throw new Error(message);
    }
  },

  getDeadline: async () => {
    try {
      const response = await api.get('/admin/deadline');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch analytics';
      throw new Error(message);
    }
  }
};

export default submissionService;
