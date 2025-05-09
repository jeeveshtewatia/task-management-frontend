import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export const tasks = {
  getAll: async (queryString?: string) => {
    const url = queryString ? `/tasks?${queryString}` : '/tasks'
    const response = await api.get(url)
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },
  create: async (data: { 
    title: string; 
    description?: string; 
    dueDate?: Date; 
    priority?: string;
    status?: string;
  }) => {
    const response = await api.post('/tasks', data)
    return response.data
  },
  update: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/tasks/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },
  getAnalytics: async () => {
    const response = await api.get('/tasks/analytics')
    return response.data
  },
} 