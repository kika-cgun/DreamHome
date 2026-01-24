import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Maximize, User, Phone, Mail, Heart, Share2, Building2, Calendar, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ListingResponse } from '../types';
import api from '../services/api';
import { favoriteService } from '../services/favoriteService';
import { messageService } from '../services/messageService';
import { useAuthStore } from '../stores/authStore';
import { useConfigStore } from '../stores/configStore';
import { useListingStore } from '../stores/listingStore';
import { useImageUrl } from '../services/imageUtils';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { Shimmer } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const ListingDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { token, isAuthenticated } = useAuthStore();
  const getImageUrl = useImageUrl();
  const backend = useConfigStore((state) => state.backend);
  const isJavaBackend = backend === 'java';
  const { isFavorite: checkIsFavorite, addFavorite, removeFavorite } = useListingStore();
  const isFavorite = checkIsFavorite(Number(id));

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
      const listingId = Number(id);
      await favoriteService.toggleFavorite(listingId, isFavorite);
      if (isFavorite) {
        removeFavorite(listingId);
      } else {
        addFavorite(listingId);
      }
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

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 1) return 'teraz';
    if (diffMinutes < 60) return `${diffMinutes} min temu`;
    if (diffHours < 24) return `${diffHours} godz. temu`;
    if (diffDays === 1) return 'wczoraj';
    if (diffDays < 7) return `${diffDays} dni temu`;
    if (diffWeeks === 1) return 'tydzień temu';
    if (diffWeeks < 4) return `${diffWeeks} tyg. temu`;
    if (diffMonths === 1) return 'miesiąc temu';
    if (diffMonths < 12) return `${diffMonths} mies. temu`;
    return 'ponad rok temu';
  };

  const handleCallClick = () => {
    setShowPhoneModal(true);
  };

  const handleMessageClick = () => {
    if (!isAuthenticated) {
      toast.error('Zaloguj się, aby wysłać wiadomość');
      navigate('/login');
      return;
    }
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error('Wpisz treść wiadomości');
      return;
    }

    setIsSendingMessage(true);
    try {
      await messageService.startConversation(Number(id), messageContent);
      toast.success('Wiadomość wysłana!');
      setShowMessageModal(false);
      setMessageContent('');
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Nie udało się wysłać wiadomości');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const renderImageGallery = () => {
    const rawImages = listing?.images || [];
    const images = rawImages.map(img => getImageUrl(img) || img);
    const imageCount = images.length;

    const ImageWithShimmer: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
      const [loaded, setLoaded] = useState(false);
      return (
        <div className={`relative h-full w-full bg-slate-100 overflow-hidden ${className}`}>
          <div className={`absolute inset-0 transition-opacity duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`}>
            <Shimmer className="w-full h-full" />
          </div>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      );
    }

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
          <ImageWithShimmer src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie główne" />
        </div>
      );
    }

    // 2 zdjęcia - grid 2 kolumny
    if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <ImageWithShimmer src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie 1" />
          <ImageWithShimmer src={images[1]} alt="Zdjęcie 2" />
        </div>
      );
    }

    // 3 zdjęcia - 1 główne duże + 2 mniejsze po prawej
    if (imageCount === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <button onClick={() => setLightboxIndex(0)} className="relative overflow-hidden group row-span-2 w-full h-full">
            <ImageWithShimmer src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie 1" className="group-hover:scale-105" />
          </button>
          <button onClick={() => setLightboxIndex(1)} className="relative overflow-hidden group w-full h-full">
            <ImageWithShimmer src={images[1]} alt="Zdjęcie 2" className="group-hover:scale-105" />
          </button>
          <button onClick={() => setLightboxIndex(2)} className="relative overflow-hidden group w-full h-full">
            <ImageWithShimmer src={images[2]} alt="Zdjęcie 3" className="group-hover:scale-105" />
          </button>
        </div>
      );
    }

    // 4 zdjęcia - grid 2x2
    if (imageCount === 4) {
      return (
        <div className="grid grid-cols-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => setLightboxIndex(idx)} className="relative overflow-hidden group w-full h-full">
              <ImageWithShimmer src={img} alt={`Zdjęcie ${idx + 1}`} className="group-hover:scale-105" />
            </button>
          ))}
        </div>
      );
    }

    // 5+ zdjęć - oryginalny layout z "+N zdjęć" i clickable
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        <button onClick={() => setLightboxIndex(0)} className="relative overflow-hidden group w-full h-full">
          <ImageWithShimmer src={getImageUrl(listing.primaryImage) || images[0]} alt="Zdjęcie główne" className="group-hover:scale-105" />
        </button>
        <div className="grid grid-cols-2 gap-4 w-full h-full">
          <button onClick={() => setLightboxIndex(1)} className="relative overflow-hidden group w-full h-full">
            <ImageWithShimmer src={images[1]} alt="Zdjęcie 2" className="group-hover:scale-105" />
          </button>
          <button onClick={() => setLightboxIndex(2)} className="relative overflow-hidden group w-full h-full">
            <ImageWithShimmer src={images[2]} alt="Zdjęcie 3" className="group-hover:scale-105" />
          </button>
          <button onClick={() => setLightboxIndex(3)} className="relative overflow-hidden group w-full h-full">
            <ImageWithShimmer src={images[3] || images[1]} alt="Zdjęcie 4" className="group-hover:scale-105" />
          </button>
          <button onClick={() => setLightboxIndex(4)} className="relative overflow-hidden group w-full h-full">
            <ImageWithShimmer src={images[4] || images[2]} alt="Zdjęcie 5" className="group-hover:scale-105" />
            {imageCount > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-black/50 transition-colors z-10">
                +{imageCount - 5} zdjęć
              </div>
            )}
          </button>
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

            <div className="flex items-center justify-between text-slate-500 mb-6">
              <div className="flex items-center">
                <MapPin size={20} className="mr-2 text-primary" />
                <span className="text-lg">{listing.city}{listing.district ? `, ${listing.district}` : ''}</span>
              </div>
              <div className="flex items-center text-sm text-slate-400">
                <Calendar size={16} className="mr-1" />
                <span>{formatRelativeTime(listing.createdAt)}</span>
              </div>
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
              <Button onClick={handleCallClick} fullWidth className="flex items-center justify-center gap-2">
                <Phone size={18} /> Zadzwoń
              </Button>
              <Button onClick={handleMessageClick} fullWidth variant="outline" className="flex items-center justify-center gap-2">
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

      {/* Lightbox */}
      {lightboxIndex !== null && listing && (
        <ImageLightbox
          images={listing.images.map(img => getImageUrl(img) || img)}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % listing.images.length)}
          onPrevious={() => setLightboxIndex((lightboxIndex - 1 + listing.images.length) % listing.images.length)}
        />
      )}

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowPhoneModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-secondary">Numer telefonu</h3>
              <button onClick={() => setShowPhoneModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="text-center py-4">
              <Phone size={48} className="mx-auto mb-4 text-primary" />
              <p className="text-3xl font-bold text-secondary mb-2">
                {listing?.user?.phone || '+48 123 456 789'}
              </p>
              <p className="text-sm text-slate-500">
                {listing?.user?.firstName} {listing?.user?.lastName}
              </p>
            </div>
            <a
              href={`tel:${listing?.user?.phone || '+48123456789'}`}
              className="block w-full bg-primary text-white py-3 rounded-lg text-center font-semibold hover:bg-primary/90 transition-colors"
            >
              Zadzwoń teraz
            </a>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-secondary">Wyślij wiadomość</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            {isJavaBackend ? (
              <>
                <p className="text-sm text-slate-600 mb-4">
                  Wyślij wiadomość do {listing?.user?.firstName} {listing?.user?.lastName} w sprawie ogłoszenia.
                </p>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Wpisz treść wiadomości..."
                  rows={5}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowMessageModal(false)}
                  >
                    Anuluj
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !messageContent.trim()}
                  >
                    {isSendingMessage ? 'Wysyłanie...' : 'Wyślij'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-4">
                  Funkcja wiadomości jest dostępna tylko dla Java backend. Skontaktuj się z agentem mailowo:
                </p>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Mail size={32} className="mx-auto mb-2 text-primary" />
                  <a
                    href={`mailto:${listing?.user?.email}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {listing?.user?.email}
                  </a>
                </div>
                <Button
                  fullWidth
                  onClick={() => setShowMessageModal(false)}
                  className="mt-4"
                >
                  Zamknij
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailsPage;