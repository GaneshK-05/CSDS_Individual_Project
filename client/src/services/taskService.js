import api from './api';

export const taskService = {
  getAllTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch tasks';
      console.error('getAllTasks error:', message);
      throw new Error(message);
    }
  },

  getTaskById: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch task';
      throw new Error(message);
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create task';
      throw new Error(message);
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update task';
      throw new Error(message);
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete task';
      throw new Error(message);
    }
  }
};

export default taskService;
