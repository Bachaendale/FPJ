import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customers API
export const customersAPI = {
  getAll: () => api.get('/api/customers/'),
  getById: (id) => api.get(`/api/customers/${id}/`),
  create: (data) => api.post('/api/customers/', data),
  update: (id, data) => api.put(`/api/customers/${id}/`, data),
  delete: (id) => api.delete(`/api/customers/${id}/`),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/api/products/'),
  getById: (id) => api.get(`/api/products/${id}/`),
  create: (data) => api.post('/api/products/', data),
  update: (id, data) => api.put(`/api/products/${id}/`, data),
  delete: (id) => api.delete(`/api/products/${id}/`),
  getLowStock: () => api.get('/api/products/low_stock/'),
};

// Sales API
export const salesAPI = {
  getAll: () => api.get('/api/sales/'),
  getById: (id) => api.get(`/api/sales/${id}/`),
  create: (data) => api.post('/api/sales/', data),
  update: (id, data) => api.put(`/api/sales/${id}/`, data),
  delete: (id) => api.delete(`/api/sales/${id}/`),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => api.get('/api/inventory/'),
  getById: (id) => api.get(`/api/inventory/${id}/`),
  create: (data) => api.post('/api/inventory/', data),
  update: (id, data) => api.put(`/api/inventory/${id}/`, data),
  delete: (id) => api.delete(`/api/inventory/${id}/`),
};

// Forecasts API
export const forecastsAPI = {
  getAll: () => api.get('/api/forecasts/'),
  getById: (id) => api.get(`/api/forecasts/${id}/`),
  create: (data) => api.post('/api/forecasts/', data),
  update: (id, data) => api.put(`/api/forecasts/${id}/`, data),
  delete: (id) => api.delete(`/api/forecasts/${id}/`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/'),
};

export default api;
