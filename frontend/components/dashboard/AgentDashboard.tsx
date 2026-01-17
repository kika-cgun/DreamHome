import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Clock, Plus, Eye, ArrowRight } from 'lucide-react';
import { listingService } from '../../services/listingService';
import { ListingResponse } from '../../types';
import { Button } from '../ui/Button';

const AgentDashboard: React.FC = () => {
    const [myListings, setMyListings] = useState<ListingResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        listingService.getMyListings()
            .then(setMyListings)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        active: myListings.filter(l => l.status === 'ACTIVE').length,
        sold: myListings.filter(l => l.status === 'SOLD').length,
        reserved: myListings.filter(l => l.status === 'RESERVED').length,
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-amber-50 p-6 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-xl">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{myListings.length}</p>
                            <p className="text-sm text-slate-500">Wszystkich ogłoszeń</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
                            <p className="text-sm text-slate-500">Aktywnych</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.reserved}</p>
                            <p className="text-sm text-slate-500">Zarezerwowanych</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Eye className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.sold}</p>
                            <p className="text-sm text-slate-500">Sprzedanych</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Add */}
            <div className="bg-gradient-to-r from-primary to-amber-500 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Dodaj nowe ogłoszenie</h3>
                        <p className="text-white/80">Szybko dodaj nową nieruchomość do swojego portfolio</p>
                    </div>
                    <Link to="/add-listing">
                        <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-slate-50">
                            <Plus className="w-5 h-5 mr-2" /> Dodaj ogłoszenie
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Twoje ogłoszenia</h3>
                    <Link to="/my-listings">
                        <Button variant="ghost" size="sm">
                            Zobacz wszystkie <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-500">Ładowanie...</div>
                ) : myListings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Tytuł</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Miasto</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Cena</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Typ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myListings.slice(0, 5).map((listing) => (
                                    <tr key={listing.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-3 px-4">
                                            <Link to={`/listings/${listing.id}`} className="font-medium text-slate-800 hover:text-primary">
                                                {listing.title}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">{listing.city}</td>
                                        <td className="py-3 px-4 font-semibold text-primary">
                                            {listing.price.toLocaleString('pl-PL')} zł
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                                    listing.status === 'SOLD' ? 'bg-purple-100 text-purple-700' :
                                                        listing.status === 'RESERVED' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-700'
                                                }`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.type === 'SALE' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'
                                                }`}>
                                                {listing.type === 'SALE' ? 'Sprzedaż' : 'Wynajem'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Nie masz jeszcze żadnych ogłoszeń</p>
                        <Link to="/add-listing">
                            <Button variant="primary" size="sm" className="mt-4">
                                <Plus className="w-4 h-4 mr-2" /> Dodaj pierwsze ogłoszenie
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;
