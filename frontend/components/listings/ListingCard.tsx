import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Maximize, Calendar } from 'lucide-react';
import { ListingResponse } from '../../types';
import { favoriteService } from '../../services/favoriteService';
import { useListingStore } from '../../stores/listingStore';
import { useAuthStore } from '../../stores/authStore';
import { useImageUrl } from '../../services/imageUtils';
import toast from 'react-hot-toast';

import { Shimmer } from '../ui/Skeleton';

interface ListingCardProps {
  listing: ListingResponse;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, addFavorite, removeFavorite } = useListingStore();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const getImageUrl = useImageUrl();

  const favorited = isFavorite(listing.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(price);
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
    if (diffMinutes < 60) return `${diffMinutes} min`;
    if (diffHours < 24) return `${diffHours} godz.`;
    if (diffDays === 1) return '1 dzień';
    if (diffDays < 7) return `${diffDays} dni`;
    if (diffWeeks === 1) return '1 tydzień';
    if (diffWeeks < 4) return `${diffWeeks} tyg.`;
    if (diffMonths === 1) return '1 miesiąc';
    if (diffMonths < 12) return `${diffMonths} mies.`;
    return 'ponad rok';
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Zaloguj się, aby dodać do ulubionych');
      navigate('/login');
      return;
    }

    setIsTogglingFavorite(true);
    try {
      await favoriteService.toggleFavorite(listing.id, favorited);

      if (favorited) {
        removeFavorite(listing.id);
        toast.success('Usunięto z ulubionych');
      } else {
        addFavorite(listing.id);
        toast.success('Dodano do ulubionych');
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      toast.error('Nie udało się zaktualizować ulubionych');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Link to={`/listings/${listing.id}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 h-full flex flex-col border border-slate-100">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <Shimmer className="w-full h-full" />
          </div>
          <img
            src={getImageUrl(listing.primaryImage || listing.images[0]) || `https://picsum.photos/seed/${listing.id}/400/300`}
            alt={listing.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent opacity-60"></div>

          <button
            onClick={handleFavoriteClick}
            disabled={isTogglingFavorite}
            className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-all shadow-sm ${favorited
              ? 'text-red-500 hover:bg-white'
              : 'text-slate-400 hover:text-red-500'
              } ${isTogglingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-semibold bg-white/90 backdrop-blur-sm ${listing.type === 'SALE' ? 'text-blue-700' : 'text-primary'}`}>
              {listing.type === 'SALE' ? 'Sprzedaż' : 'Wynajem'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-secondary">{formatPrice(listing.price)}</h3>
          </div>

          <div className="flex items-center text-slate-500 text-sm mb-4">
            <MapPin size={14} className="mr-1 text-primary" />
            <span className="truncate">{listing.city}, {listing.district || 'Centrum'}</span>
          </div>

          <h4 className="font-medium text-slate-800 mb-4 line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h4>

          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-slate-500 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center" title="Pokoje">
                <Bed size={16} className="mr-1" />
                <span>{listing.rooms}</span>
              </div>
              <div className="flex items-center" title="Powierzchnia">
                <Maximize size={16} className="mr-1" />
                <span>{listing.area} m²</span>
              </div>
            </div>
            <div className="flex items-center text-xs text-slate-400">
              <Calendar size={12} className="mr-1" />
              <span>{formatRelativeTime(listing.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};