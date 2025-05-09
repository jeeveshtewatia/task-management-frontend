import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL="https://task-management-backend-hb4q.onrender.com/api"
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    register: async (data: { username: string; email: string; password: string }) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    login: async (data: { email: string; password: string }) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
};

export const tasks = {
    getAll: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },
    create: async (data: { title: string; description?: string; dueDate?: Date; priority?: string }) => {
        const response = await api.post('/tasks', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
    getAnalytics: async () => {
        const response = await api.get('/tasks/analytics');
        return response.data;
    },
};

export default api; 