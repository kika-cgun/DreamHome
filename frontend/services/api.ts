import axios from 'axios';
import { useConfigStore } from '../stores/configStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const api = axios.create();

// Interceptor to dynamically set baseURL and attach token
api.interceptors.request.use((config) => {
  const configStore = useConfigStore.getState();
  const apiUrl = configStore.getApiUrl();
  const isProd = configStore.isProduction();
  const backend = configStore.backend;

  config.baseURL = apiUrl;

  // Enable credentials for cross-origin requests (needed for Basic Auth on FOKA PHP)
  if (isProd && backend === 'php') {
    config.withCredentials = true;
  }

  const token = useAuthStore.getState().token;
  if (token) {
    // For PHP production: use X-JWT-Token to avoid conflict with Apache Basic Auth
    // For Java and local dev: use standard Authorization header
    if (isProd && backend === 'php') {
      config.headers['X-JWT-Token'] = token;
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
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