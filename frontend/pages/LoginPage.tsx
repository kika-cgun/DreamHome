import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post('/auth/login', data);
      login(response.data);
      toast.success('Zalogowano pomyślnie!');
      navigate('/');
    } catch (error) {
      toast.error('Błąd logowania. Sprawdź dane.');
      // Fallback for demo if backend not running
      if(data.email === 'demo@demo.com') {
         login({
            token: 'fake-jwt',
            user: { id: 1, email: 'demo@demo.com', firstName: 'Demo', lastName: 'User', role: 'AGENT' }
         });
         navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-card border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary">Witaj ponownie!</h2>
          <p className="mt-2 text-sm text-slate-500">Zaloguj się, aby uzyskać dostęp do konta.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="jan@kowalski.pl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Hasło</label>
              <input
                {...register("password", { required: true })}
                type="password"
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Zapamiętaj mnie</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-hover">Zapomniałeś hasła?</a>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg">Zaloguj się</Button>
        </form>
        
        <div className="text-center text-sm">
            <span className="text-slate-500">Nie masz konta? </span>
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover">Zarejestruj się</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;