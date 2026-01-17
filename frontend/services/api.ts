import axios from 'axios';
import { useConfigStore } from '../stores/configStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const api = axios.create();

// Interceptor to dynamically set baseURL and attach token
api.interceptors.request.use((config) => {
  const apiUrl = useConfigStore.getState().getApiUrl();
  config.baseURL = apiUrl;
  
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor for handling errors (401, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Sesja wygasła. Zaloguj się ponownie.');
    }
    // Network error or backend down
    if (error.code === 'ERR_NETWORK') {
       console.error("Backend unreachable:", useConfigStore.getState().getApiUrl());
    }
    return Promise.reject(error);
  }
);

export default api;