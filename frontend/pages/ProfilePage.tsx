import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { userService } from '../services/userService';
import { User, Settings, LogOut, Edit2, Save, X, Phone, Building2, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, logout, login } = useAuthStore();
  const token = useAuthStore((state) => state.token);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || '',
    agencyName: user?.agencyName || '',
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Ładowanie profilu...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateCurrentUser(formData);
      // Update auth store with new user data
      if (token) {
        login({ token, user: updatedUser });
      }
      toast.success('Profil zaktualizowany!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Błąd podczas aktualizacji profilu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || '',
      agencyName: user.agencyName || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary to-amber-500 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-slate-500">{user.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                  user.role === 'AGENT' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                  {user.role}
                </span>
                {user.createdAt && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar size={12} />
                    Od {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} className="mr-2" /> Edytuj
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut size={16} className="mr-2" /> Wyloguj
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className="border border-slate-200 rounded-xl p-6 mb-8 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Edit2 size={20} /> Edytuj profil
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Imię"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Twoje imię"
                />
                <Input
                  label="Nazwisko"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Twoje nazwisko"
                />
                <Input
                  label="Telefon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="123456789"
                />
                <Input
                  label="URL Avatara"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                {(user.role === 'AGENT' || user.role === 'ADMIN') && (
                  <div className="md:col-span-2">
                    <Input
                      label="Nazwa agencji"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      placeholder="Nazwa Twojej agencji"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  <X size={16} className="mr-2" /> Anuluj
                </Button>
              </div>
            </div>
          ) : (
            /* Profile Info Display */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {user.phone && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-slate-500">Telefon</p>
                    <p className="font-medium text-slate-800">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.agencyName && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-slate-500">Agencja</p>
                    <p className="font-medium text-slate-800">{user.agencyName}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Settings size={20} /> Szybkie akcje
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/dashboard"
                className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-slate-800 group-hover:text-primary">Dashboard</h3>
                <p className="text-sm text-slate-500 mt-1">Przejdź do panelu głównego</p>
              </Link>

              <Link
                to="/my-listings"
                className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-slate-800 group-hover:text-primary">Moje ogłoszenia</h3>
                <p className="text-sm text-slate-500 mt-1">Zarządzaj swoimi ofertami</p>
              </Link>

              <Link
                to="/add-listing"
                className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-slate-800 group-hover:text-primary">Dodaj ogłoszenie</h3>
                <p className="text-sm text-slate-500 mt-1">Stwórz nową ofertę</p>
              </Link>

              <Link
                to="/favorites"
                className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-slate-800 group-hover:text-primary">Ulubione</h3>
                <p className="text-sm text-slate-500 mt-1">Przeglądaj zapisane oferty</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;