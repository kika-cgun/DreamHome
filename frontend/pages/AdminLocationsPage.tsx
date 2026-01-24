import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit2, Trash2, ArrowLeft, X } from 'lucide-react';
import { locationService, Location } from '../services/locationService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

const AdminLocationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState({ city: '', district: '', postalCode: '', imageUrl: '' });

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        try {
            const data = await locationService.getAllLocations();
            setLocations(data);
        } catch (error) {
            toast.error('Błąd podczas ładowania lokalizacji');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLocation) {
                await locationService.updateLocation(editingLocation.id, formData);
                toast.success('Lokalizacja zaktualizowana!');
            } else {
                await locationService.createLocation(formData);
                toast.success('Lokalizacja dodana!');
            }
            setIsModalOpen(false);
            setFormData({ city: '', district: '', postalCode: '', imageUrl: '' });
            setEditingLocation(null);
            loadLocations();
        } catch (error) {
            toast.error('Błąd podczas zapisywania lokalizacji');
            console.error(error);
        }
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setFormData({
            city: location.city,
            district: location.district || '',
            postalCode: location.postalCode || '',
            imageUrl: location.imageUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Czy na pewno chcesz usunąć tę lokalizację?')) return;

        try {
            await locationService.deleteLocation(id);
            toast.success('Lokalizacja usunięta!');
            loadLocations();
        } catch (error) {
            toast.error('Błąd podczas usuwania lokalizacji');
            console.error(error);
        }
    };

    const openNewModal = () => {
        setEditingLocation(null);
        setFormData({ city: '', district: '', postalCode: '', imageUrl: '' });
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Powrót do dashboardu
                </Button>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <MapPin className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Zarządzanie Lokalizacjami</h1>
                            <p className="text-slate-500">Dodawaj, edytuj i usuwaj miasta i dzielnice</p>
                        </div>
                    </div>
                    <Button variant="primary" onClick={openNewModal}>
                        <Plus size={16} className="mr-2" /> Dodaj lokalizację
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Ładowanie...</div>
                ) : locations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Zdjęcie</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Miasto</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Dzielnica</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map((location) => (
                                    <tr key={location.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-slate-500">#{location.id}</td>
                                        <td className="py-3 px-4">
                                            {location.imageUrl ? (
                                                <img
                                                    src={location.imageUrl}
                                                    alt={location.city}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                    <MapPin size={20} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-slate-800">{location.city}</td>
                                        <td className="py-3 px-4 text-slate-600">{location.district || '-'}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(location)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(location.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    <div className="text-center py-12 text-slate-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Brak lokalizacji. Dodaj pierwszą lokalizację!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingLocation ? 'Edytuj lokalizację' : 'Nowa lokalizacja'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Miasto"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                                placeholder="np. Gdańsk"
                            />
                            <Input
                                label="Dzielnica (opcjonalnie)"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                placeholder="np. Wrzeszcz"
                            />
                            <Input
                                label="Kod pocztowy (opcjonalnie)"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                placeholder="np. 80-000"
                            />
                            <Input
                                label="URL zdjęcia miasta (opcjonalnie)"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                            />
                            {formData.imageUrl && (
                                <div className="mt-2">
                                    <p className="text-sm text-slate-500 mb-1">Podgląd:</p>
                                    <img
                                        src={formData.imageUrl}
                                        alt="Podgląd"
                                        className="w-full h-32 object-cover rounded-lg border"
                                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                    />
                                </div>
                            )}
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" variant="primary" className="flex-1">
                                    {editingLocation ? 'Zapisz zmiany' : 'Dodaj lokalizację'}
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                    Anuluj
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLocationsPage;
