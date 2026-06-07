import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create Axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (optional - for logging)
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional - for error handling)
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.data);
    return response.data; // Return just the data
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Fetch all expenses
 * @returns {Promise} Array of expenses
 */
export const fetchExpenses = () => api.get('/expenses');

/**
 * Create new expense
 * @param {Object} expense - { amount, category, date, note }
 * @returns {Promise} Created expense
 */
export const createExpense = (expense) => api.post('/expenses', expense);

/**
 * Update existing expense
 * @param {string} id - Expense ID
 * @param {Object} expense - Updated fields
 * @returns {Promise} Updated expense
 */
export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense);

/**
 * Delete expense
 * @param {string} id - Expense ID
 * @returns {Promise} Response
 */
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export default api;
