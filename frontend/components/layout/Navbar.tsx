import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Heart, User, Home, Plus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { BackendSwitcher } from '../ui/BackendSwitcher';
import { Button } from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg text-white">
              <Home size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-secondary">DreamHome</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/listings?type=SALE" className="text-slate-600 hover:text-primary font-medium transition-colors">Kupno</Link>
            <Link to="/listings?type=RENT" className="text-slate-600 hover:text-primary font-medium transition-colors">Wynajem</Link>
            <Link to="/add-listing" className="text-slate-600 hover:text-primary font-medium transition-colors">Sprzedaż</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary font-medium transition-colors">O nas</Link>
            <Link to="/contact" className="text-slate-600 hover:text-primary font-medium transition-colors">Kontakt</Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <BackendSwitcher />

            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                </Link>
                <div className="relative group">
                  <Link to="/profile" className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                      {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" /> : <User size={16} />}
                    </div>
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Dashboard</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Mój Profil</Link>
                    <button onClick={() => { logout(); navigate('/login'); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Wyloguj</button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="p-2 text-slate-400 hover:text-primary transition-colors">
                <User size={20} />
              </Link>
            )}

            <Link to={isAuthenticated ? "/add-listing" : "/login"}>
              <Button variant="primary" size="sm" className="shadow-lg shadow-primary/20">
                <Plus size={16} className="mr-1" />
                Dodaj ogłoszenie
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <BackendSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 pb-4">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/listings?type=SALE" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Kupno</Link>
            <Link to="/listings?type=RENT" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Wynajem</Link>
            <Link to="/add-listing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Sprzedaż</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">O nas</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Kontakt</Link>
            <div className="border-t border-slate-100 my-2"></div>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Dashboard</Link>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Mój Profil</Link>
                <button onClick={() => logout()} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Wyloguj</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Logowanie / Rejestracja</Link>
            )}
            <Link to="/add-listing" className="block px-3 py-2 mt-2 rounded-md text-base font-medium bg-primary text-white text-center">Dodaj ogłoszenie</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;