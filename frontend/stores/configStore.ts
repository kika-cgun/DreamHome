import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
  backend: 'java' | 'php';
  setBackend: (backend: 'java' | 'php') => void;
  getApiUrl: () => string;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      backend: 'java',
      setBackend: (backend) => set({ backend }),
      getApiUrl: () => {
        const urls = {
          java: 'http://localhost:8080/api',
          php: 'http://localhost:8000/api'
        };
        return urls[get().backend];
      }
    }),
    { name: 'dreamhome-config' }
  )
);