
import axios from 'axios';
import { Task, TaskFormData } from '@/types/task';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const TaskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/todos');
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  create: async (task: TaskFormData): Promise<Task> => {
    const response = await api.post('/todos', task);
    return response.data;
  },

  update: async (id: number, task: TaskFormData): Promise<Task> => {
    const response = await api.put(`/todos/${id}`, task);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  }
};
