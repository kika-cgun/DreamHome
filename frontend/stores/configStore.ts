import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Check if running in production (on FOKA server)
const isProduction = () => {
  return window.location.hostname.includes('foka.wi.local') ||
    window.location.hostname.includes('foka');
};

interface ConfigState {
  backend: 'java' | 'php';
  setBackend: (backend: 'java' | 'php') => void;
  getApiUrl: () => string;
  isProduction: () => boolean;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      backend: 'java',
      setBackend: (backend) => set({ backend }),
      getApiUrl: () => {
        if (isProduction()) {
          const urls = {
            java: 'https://foka.wi.local:51706/dreamhome/api',
            php: 'https://foka.wi.local/~s51706/dreamhome-backend/api'
          };
          return urls[get().backend];
        }
        // Local development URLs
        const urls = {
          java: 'http://localhost:8080/api',
          php: 'http://localhost:8000/api'
        };
        return urls[get().backend];
      },
      isProduction
    }),
    { name: 'dreamhome-config' }
  )
);