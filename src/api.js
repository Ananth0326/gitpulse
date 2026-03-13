/* GitPulse Component */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const fetchProfile = async (username) => {
  try {
    const response = await api.get(`/api/profile/${username}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.status : 500;
  }
};

export const fetchRepos = async (username) => {
  try {
    const response = await api.get(`/api/repos/${username}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.status : 500;
  }
};

export const fetchStats = async (username) => {
  try {
    const response = await api.get(`/api/stats/${username}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.status : 500;
  }
};

export default api;
