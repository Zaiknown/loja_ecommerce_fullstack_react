// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Funções de Produtos ---
export const getProducts = (pageNumber = '') => apiClient.get(`/products?pageNumber=${pageNumber}`);
export const getAllProductsForAdmin = () => apiClient.get('/products/all'); // NOVA FUNÇÃO
export const getProductById = (id) => apiClient.get(`/products/${id}`);
export const createProduct = (productData) => apiClient.post('/products', productData);
export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

// --- Funções de Autenticação ---
export const register = (userData) => apiClient.post('/users/register', userData);
export const login = (credentials) => apiClient.post('/users/login', credentials);

// --- Funções de Pedidos ---
export const createOrder = (orderData) => apiClient.post('/orders', orderData);
export const getMyOrders = () => apiClient.get('/orders/myorders');
export const getAllOrders = () => apiClient.get('/orders');
