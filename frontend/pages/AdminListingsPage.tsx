import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Plus, Edit2, Trash2, ArrowLeft, Eye, Search } from 'lucide-react';
import { listingService } from '../services/listingService';
import { ListingResponse } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useImageUrl } from '../services/imageUtils';
import toast from 'react-hot-toast';

const AdminListingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [filteredListings, setFilteredListings] = useState<ListingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const getImageUrl = useImageUrl();

    useEffect(() => {
        loadListings();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredListings(listings);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredListings(listings.filter(l =>
                l.title.toLowerCase().includes(term) ||
                l.city?.toLowerCase().includes(term) ||
                l.user?.email?.toLowerCase().includes(term)
            ));
        }
    }, [searchTerm, listings]);

    const loadListings = async () => {
        try {
            const data = await listingService.fetchListings();
            setListings(data);
            setFilteredListings(data);
        } catch (error) {
            toast.error('Błąd podczas ładowania ogłoszeń');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;

        try {
            await listingService.deleteListing(id);
            toast.success('Ogłoszenie usunięte!');
            loadListings();
        } catch (error) {
            toast.error('Błąd podczas usuwania ogłoszenia');
            console.error(error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700';
            case 'RESERVED':
                return 'bg-yellow-100 text-yellow-700';
            case 'SOLD':
                return 'bg-blue-100 text-blue-700';
            case 'EXPIRED':
                return 'bg-slate-100 text-slate-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getTypeBadge = (type: string) => {
        return type === 'SALE' ? 'bg-primary/10 text-primary' : 'bg-purple-100 text-purple-700';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Powrót do dashboardu
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Zarządzanie Ogłoszeniami</h1>
                            <p className="text-slate-500">Przeglądaj, edytuj i usuwaj wszystkie ogłoszenia</p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Szukaj..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <Link to="/add-listing">
                            <Button variant="primary">
                                <Plus size={16} className="mr-2" /> Dodaj
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-12 text-slate-500">Ładowanie...</div>
                ) : filteredListings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Tytuł</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Miasto</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Cena</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Typ</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Właściciel</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredListings.map((listing) => (
                                    <tr key={listing.id} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-slate-500 text-sm">#{listing.id}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                {listing.primaryImage && (
                                                    <img
                                                        src={getImageUrl(listing.primaryImage) || listing.primaryImage}
                                                        alt=""
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                )}
                                                <span className="font-medium text-slate-800 max-w-[200px] truncate">
                                                    {listing.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">{listing.city || '-'}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800">
                                            {listing.price.toLocaleString('pl-PL')} zł
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(listing.type)}`}>
                                                {listing.type === 'SALE' ? 'Sprzedaż' : 'Wynajem'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(listing.status)}`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 text-sm">
                                            {listing.user?.email || '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/listings/${listing.id}`}
                                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Zobacz"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => navigate(`/edit-listing/${listing.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edytuj"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(listing.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Usuń"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-500">
                        <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>{searchTerm ? 'Nie znaleziono ogłoszeń' : 'Brak ogłoszeń w systemie'}</p>
                    </div>
                )}
            </div>

            <div className="mt-4 text-sm text-slate-500">
                Wyświetlono {filteredListings.length} z {listings.length} ogłoszeń
            </div>
        </div>
    );
};

export default AdminListingsPage;
