import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Konto utworzone! Możesz się zalogować.');
      navigate('/login');
    } catch (error) {
      toast.error('Błąd rejestracji.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-card border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary">Utwórz konto</h2>
          <p className="mt-2 text-sm text-slate-500">Dołącz do DreamHome już dziś.</p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium text-slate-700 block mb-1">Imię</label>
               <input {...register("firstName")} type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary outline-none" />
             </div>
             <div>
               <label className="text-sm font-medium text-slate-700 block mb-1">Nazwisko</label>
               <input {...register("lastName")} type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary outline-none" />
             </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input {...register("email")} type="email" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary outline-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Hasło</label>
            <input {...register("password")} type="password" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary outline-none" />
          </div>

           <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Typ konta</label>
            <select {...register("role")} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary outline-none bg-white">
               <option value="USER">Szukam nieruchomości (Użytkownik)</option>
               <option value="AGENT">Sprzedaję nieruchomości (Agent)</option>
            </select>
          </div>

          <Button type="submit" fullWidth size="lg">Zarejestruj się</Button>
        </form>
        
        <div className="text-center text-sm">
            <span className="text-slate-500">Masz już konto? </span>
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover">Zaloguj się</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;