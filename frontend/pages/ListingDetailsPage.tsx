import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Bed, Maximize, User, Phone, Mail, Heart, Share2, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ListingResponse } from '../types';
import api from '../services/api';
import { favoriteService } from '../services/favoriteService';
import { useAuthStore } from '../stores/authStore';
import { useImageUrl } from '../services/imageUtils';
import toast from 'react-hot-toast';

const ListingDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { token } = useAuthStore();
  const getImageUrl = useImageUrl();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (e) {
        // Mock fallback
        setListing({
          id: Number(id),
          title: 'Luksusowy apartament z widokiem na morze',
          description: 'Przestronny apartament wykończony w wysokim standardzie. Znajduje się w prestiżowej lokalizacji...',
          price: 2500000,
          area: 120,
          rooms: 4,
          floor: '3/4',
          type: 'SALE',
          status: 'ACTIVE',
          category: 'Apartament',
          city: 'Gdynia',
          district: 'Orłowo',
          images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ],
          createdAt: '2023-10-15',
          user: { id: 1, email: 'agent@dreamhome.com', firstName: 'Jan', lastName: 'Kowalski', role: 'AGENT' }
        });
      }
    };
    fetchListing();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!token) {
      toast.error('Zaloguj się, aby dodać do ulubionych');
      return;
    }

    try {
      await favoriteService.toggleFavorite(Number(id), isFavorite);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Usunięto z ulubionych' : 'Dodano do ulubionych');
    } catch (error) {
      toast.error('Nie udało się zapisać zmiany');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link skopiowany do schowka');
    } catch (error) {
      toast.error('Nie udało się skopiować linku');
    }
  };

  const renderImageGallery = () => {
    const rawImages = listing?.images || [];
    const images = rawImages.map(img => getImageUrl(img) || img);
    const imageCount = images.length;

    // Fallback - brak zdjęć
    if (imageCount === 0) {
      return (
        <div className="w-full h-[400px] md:h-[500px] rounded-2xl bg-slate-100 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Building2 size={64} className="mx-auto mb-2" />
            <p>Brak zdjęć</p>
          </div>
        </div>
      );
    }

    // 1 zdjęcie - pełna szerokość
    if (imageCount === 1) {
      return (
        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <img src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie główne" className="w-full h-full object-cover" />
        </div>
      );
    }

    // 2 zdjęcia - grid 2 kolumny
    if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <img src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie 1" className="w-full h-full object-cover" />
          <img src={images[1]} alt="Zdjęcie 2" className="w-full h-full object-cover" />
        </div>
      );
    }

    // 3-4 zdjęcia - grid 2x2
    if (imageCount >= 3 && imageCount <= 4) {
      return (
        <div className="grid grid-cols-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <img src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie 1" className="w-full h-full object-cover" />
          <img src={images[1]} alt="Zdjęcie 2" className="w-full h-full object-cover" />
          <img src={images[2]} alt="Zdjęcie 3" className="w-full h-full object-cover" />
          {imageCount === 4 && <img src={images[3]} alt="Zdjęcie 4" className="w-full h-full object-cover" />}
        </div>
      );
    }

    // 5+ zdjęć - oryginalny layout z "+N zdjęć"
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        <img src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie główne" className="w-full h-full object-cover" />
        <div className="grid grid-cols-2 gap-4">
          <img src={images[1]} alt="Zdjęcie 2" className="w-full h-full object-cover" />
          <img src={images[2]} alt="Zdjęcie 3" className="w-full h-full object-cover" />
          <img src={images[3] || images[1]} alt="Zdjęcie 4" className="w-full h-full object-cover" />
          <div className="relative">
            <img src={images[4] || images[2]} alt="Zdjęcie 5" className="w-full h-full object-cover" />
            {imageCount > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-black/50 transition-colors">
                +{imageCount - 5} zdjęć
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!listing) return <div className="h-screen flex items-center justify-center">Ładowanie...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Gallery */}
      <div className="mb-8">
        {renderImageGallery()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {listing.type === 'SALE' ? 'Sprzedaż' : 'Wynajem'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-secondary/10 text-secondary">
                {listing.category}
              </span>
            </div>

            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-secondary">{listing.title}</h1>
              <div className="text-3xl font-bold text-primary whitespace-nowrap ml-4">
                {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(listing.price)}
              </div>
            </div>

            <div className="flex items-center text-slate-500 mb-6">
              <MapPin size={20} className="mr-2 text-primary" />
              <span className="text-lg">{listing.city}{listing.district ? `, ${listing.district}` : ''}</span>
            </div>

            <div className="flex flex-wrap gap-8 py-6 border-y border-slate-100">
              <div className="flex items-center gap-2">
                <Maximize size={24} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Powierzchnia</p>
                  <p className="font-bold text-secondary">{listing.area} m²</p>
                </div>
              </div>

              {listing.rooms && (
                <div className="flex items-center gap-2">
                  <Bed size={24} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Pokoje</p>
                    <p className="font-bold text-secondary">{listing.rooms}</p>
                  </div>
                </div>
              )}

              {listing.floor && (
                <div className="flex items-center gap-2">
                  <Building2 size={24} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Piętro</p>
                    <p className="font-bold text-secondary">{listing.floor}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-secondary mb-4">Opis nieruchomości</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>
        </div>

        {/* Sidebar Agent */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 sticky top-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User size={32} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Opiekun oferty</p>
                <h4 className="font-bold text-lg text-secondary">{listing.user?.firstName} {listing.user?.lastName}</h4>
                <p className="text-xs text-primary font-bold uppercase">DreamHome Agent</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button fullWidth className="flex items-center justify-center gap-2">
                <Phone size={18} /> Zadzwoń
              </Button>
              <Button fullWidth variant="outline" className="flex items-center justify-center gap-2">
                <Mail size={18} /> Wyślij wiadomość
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button
                onClick={handleSaveToggle}
                className={`flex items-center justify-center gap-2 transition-colors py-2 ${isFavorite ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                  }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} /> Zapisz
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-primary transition-colors py-2"
              >
                <Share2 size={20} /> Udostępnij
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;