import React from 'react';
import { useConfigStore } from '../../stores/configStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const BackendSwitcher: React.FC = () => {
  const { backend, setBackend } = useConfigStore();
  const { logout } = useAuthStore();

  const handleSwitch = (newBackend: 'java' | 'php') => {
    if (backend !== newBackend) {
      setBackend(newBackend);
      logout(); // Logout on switch for security/consistency
      toast.success(`Przełączono na backend: ${newBackend === 'java' ? 'Java Spring' : 'PHP Laravel'}`);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full p-1 shadow-inner">
      <button
        onClick={() => handleSwitch('java')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
          backend === 'java' 
            ? 'bg-orange-600 text-white shadow-sm' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
        }`}
      >
        <span>☕</span> Java
      </button>
      <button
        onClick={() => handleSwitch('php')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
          backend === 'php' 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
        }`}
      >
        <span>🐘</span> PHP
      </button>
    </div>
  );
};