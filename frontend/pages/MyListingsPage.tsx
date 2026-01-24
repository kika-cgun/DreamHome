import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingCard } from '../components/listings/ListingCard';
import { Button } from '../components/ui/Button';
import { ListingResponse } from '../types';
import { listingService } from '../services/listingService';
import { useAuthStore } from '../stores/authStore';
import { useImageUrl } from '../services/imageUtils';
import toast from 'react-hot-toast';

const MyListingsPage: React.FC = () => {
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const getImageUrl = useImageUrl();

    useEffect(() => {
        const fetchMyListings = async () => {
            setIsLoading(true);
            try {
                // Fetch all listings and filter by current user
                // Ideally there would be a /listings?userId=X endpoint
                const allListings = await listingService.fetchListings();
                const myListings = allListings.filter(l => l.user?.id === user?.id);
                setListings(myListings);
            } catch (error) {
                console.error('Failed to fetch my listings', error);
                // Mock fallback
                setListings([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyListings();
    }, [user]);

    const handleDelete = async (id: number) => {
        if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;

        try {
            await listingService.deleteListing(id);
            setListings(listings.filter(l => l.id !== id));
            toast.success('Ogłoszenie zostało usunięte');
        } catch (error) {
            toast.error('Nie udało się usunąć ogłoszenia');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">Moje ogłoszenia</h1>
                    <p className="text-slate-500 mt-2">
                        Zarządzaj swoimi ofertami nieruchomości
                    </p>
                </div>
                <Link to="/add-listing">
                    <Button className="flex items-center gap-2">
                        <Plus size={20} />
                        Dodaj nowe ogłoszenie
                    </Button>
                </Link>
            </div>

            {listings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-12 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Plus size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">
                        Nie masz jeszcze żadnych ogłoszeń
                    </h3>
                    <p className="text-slate-500 mb-6">
                        Dodaj swoje pierwsze ogłoszenie i zacznij sprzedawać!
                    </p>
                    <Link to="/add-listing">
                        <Button size="lg">
                            <Plus size={20} className="mr-2" />
                            Dodaj ogłoszenie
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-slate-600">
                        Łącznie: <span className="font-semibold">{listings.length}</span> {listings.length === 1 ? 'ogłoszenie' : 'ogłoszeń'}
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {listings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-6 items-center">
                                    {/* Thumbnail */}
                                    <img
                                        src={getImageUrl(listing.primaryImage || listing.images[0]) || `https://picsum.photos/seed/${listing.id}/400/300`}
                                        alt={listing.title}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />

                                    {/* Info */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-secondary">{listing.title}</h3>
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${listing.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                listing.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-700' :
                                                    listing.status === 'SOLD' ? 'bg-red-100 text-red-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {listing.status === 'ACTIVE' ? 'Aktywne' :
                                                    listing.status === 'RESERVED' ? 'Zarezerwowane' :
                                                        listing.status === 'SOLD' ? 'Sprzedane' : 'Wygasłe'}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-2">{listing.city}, {listing.district}</p>
                                        <p className="text-xl font-bold text-primary">
                                            {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(listing.price)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <Link to={`/listings/${listing.id}`}>
                                            <Button variant="outline" size="sm" fullWidth>
                                                Zobacz
                                            </Button>
                                        </Link>
                                        <Link to={`/edit-listing/${listing.id}`}>
                                            <Button variant="outline" size="sm" fullWidth className="flex items-center justify-center gap-1">
                                                <Edit size={14} />
                                                Edytuj
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                            className="flex items-center justify-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() => handleDelete(listing.id)}
                                        >
                                            <Trash2 size={14} />
                                            Usuń
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyListingsPage;
