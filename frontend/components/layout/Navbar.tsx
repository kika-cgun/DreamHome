import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Heart, User, Home, Plus, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useListingStore } from '../../stores/listingStore';
import { BackendSwitcher } from '../ui/BackendSwitcher';
import { Button } from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { favoriteIds } = useListingStore();
  const navigate = useNavigate();
  const favoritesCount = favoriteIds.size;

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

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

            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 transition-colors ${isSearchOpen ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
              >
                <Search size={20} />
              </button>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50">
                  <form onSubmit={handleSearch}>
                    <div className="flex gap-2">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Szukaj po tytule, mieście..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </form>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-slate-400">Popularne:</span>
                    {['Warszawa', 'Kraków', 'Gdańsk'].map(city => (
                      <button
                        key={city}
                        onClick={() => {
                          navigate(`/listings?city=${city}`);
                          setIsSearchOpen(false);
                        }}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="relative p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {favoritesCount > 9 ? '9+' : favoritesCount}
                    </span>
                  )}
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
                    <Link to="/messages" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Wiadomości</Link>
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
                <Link to="/messages" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">Wiadomości</Link>
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