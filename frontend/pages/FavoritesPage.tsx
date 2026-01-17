import React, { useEffect, useState } from 'react';
import { Heart, Loader } from 'lucide-react';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingResponse } from '../types';
import { favoriteService } from '../services/favoriteService';
import { useListingStore } from '../stores/listingStore';
import toast from 'react-hot-toast';

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<ListingResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const setFavoritesInStore = useListingStore((state) => state.setFavorites);

    useEffect(() => {
        const fetchFavorites = async () => {
            setIsLoading(true);
            try {
                const data = await favoriteService.getFavorites();
                setFavorites(data);
                setFavoritesInStore(data);
            } catch (error) {
                console.error('Failed to fetch favorites', error);
                toast.error('Nie udało się wczytać ulubionych');
                // Mock fallback for demo
                setFavorites([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFavorites();
    }, [setFavoritesInStore]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
                    <Heart className="text-red-500" size={32} />
                    Ulubione oferty
                </h1>
                <p className="text-slate-500 mt-2">
                    Zapisane przez Ciebie nieruchomości w jednym miejscu
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-12 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Heart size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">
                        Brak ulubionych ofert
                    </h3>
                    <p className="text-slate-500 mb-6">
                        Kliknij serduszko na karcie ogłoszenia, aby dodać je do ulubionych
                    </p>
                    <a
                        href="/#/listings"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                        Przeglądaj oferty
                    </a>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-slate-600">
                        Znaleziono: <span className="font-semibold">{favorites.length}</span> {favorites.length === 1 ? 'oferta' : 'oferty'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favorites.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FavoritesPage;
