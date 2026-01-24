import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Search, ArrowRight, Building2, Plus } from 'lucide-react';
import { useListingStore } from '../../stores/listingStore';
import { listingService } from '../../services/listingService';
import { ListingResponse } from '../../types';
import { Button } from '../ui/Button';
import { useImageUrl } from '../../services/imageUtils';

const UserDashboard: React.FC = () => {
    const favorites = useListingStore((state) => state.favorites);
    const [myListings, setMyListings] = useState<ListingResponse[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);
    const getImageUrl = useImageUrl();

    useEffect(() => {
        listingService.getMyListings()
            .then(setMyListings)
            .catch(console.error)
            .finally(() => setLoadingListings(false));
    }, []);

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <Building2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{myListings.length}</p>
                            <p className="text-sm text-slate-500">Moje ogłoszenia</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <Heart className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{favorites.length}</p>
                            <p className="text-sm text-slate-500">Ulubionych</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">0</p>
                            <p className="text-sm text-slate-500">Ostatnio przeglądanych</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <Search className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">0</p>
                            <p className="text-sm text-slate-500">Zapisanych wyszukiwań</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Favorites Preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Ulubione nieruchomości</h3>
                    <Link to="/favorites">
                        <Button variant="ghost" size="sm">
                            Zobacz wszystkie <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.slice(0, 3).map((listing) => (
                            <Link
                                key={listing.id}
                                to={`/listings/${listing.id}`}
                                className="group block bg-slate-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-video bg-slate-200 relative">
                                    {listing.primaryImage && (
                                        <img
                                            src={getImageUrl(listing.primaryImage) || listing.primaryImage}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                                        {listing.title}
                                    </p>
                                    <p className="text-sm text-slate-500">{listing.city}</p>
                                    <p className="text-lg font-bold text-primary mt-2">
                                        {listing.price.toLocaleString('pl-PL')} zł
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <Heart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Nie masz jeszcze ulubionych nieruchomości</p>
                        <Link to="/listings">
                            <Button variant="primary" size="sm" className="mt-4">
                                Przeglądaj oferty
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* My Listings Preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Moje ogłoszenia</h3>
                    <Link to="/my-listings">
                        <Button variant="ghost" size="sm">
                            Zobacz wszystkie <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                {loadingListings ? (
                    <div className="text-center py-8 text-slate-500">Ładowanie...</div>
                ) : myListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myListings.slice(0, 3).map((listing) => (
                            <Link
                                key={listing.id}
                                to={`/listings/${listing.id}`}
                                className="group block bg-slate-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-video bg-slate-200 relative">
                                    {listing.primaryImage && (
                                        <img
                                            src={getImageUrl(listing.primaryImage) || listing.primaryImage}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${listing.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        listing.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                        {listing.status}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <p className="font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                                        {listing.title}
                                    </p>
                                    <p className="text-sm text-slate-500">{listing.city}</p>
                                    <p className="text-lg font-bold text-primary mt-2">
                                        {listing.price.toLocaleString('pl-PL')} zł
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Nie masz jeszcze żadnych ogłoszeń</p>
                        <Link to="/add-listing">
                            <Button variant="primary" size="sm" className="mt-4">
                                <Plus size={16} className="mr-1" />
                                Dodaj ogłoszenie
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Szybkie akcje</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/add-listing"
                        className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center hover:bg-primary/10 transition-colors"
                    >
                        <Plus className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="font-medium text-primary">Dodaj ogłoszenie</p>
                    </Link>
                    <Link
                        to="/listings?type=SALE"
                        className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors"
                    >
                        <p className="font-medium text-slate-700">Na sprzedaż</p>
                    </Link>
                    <Link
                        to="/listings?type=RENT"
                        className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors"
                    >
                        <p className="font-medium text-slate-700">Na wynajem</p>
                    </Link>
                    <Link
                        to="/favorites"
                        className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors"
                    >
                        <p className="font-medium text-slate-700">Ulubione</p>
                    </Link>
                    <Link
                        to="/contact"
                        className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors"
                    >
                        <p className="font-medium text-slate-700">Kontakt</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
