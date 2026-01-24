import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, MapPin, Layers, Shield, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { userService } from '../../services/userService';
import { listingService } from '../../services/listingService';
import { categoryService } from '../../services/categoryService';
import { locationService } from '../../services/locationService';
import { UserResponse, ListingResponse, Role } from '../../types';
import { Category } from '../../services/categoryService';
import { Location } from '../../services/locationService';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);

    const loadUsers = async () => {
        try {
            const usersData = await userService.getAllUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const handleRoleChange = async (userId: number, newRole: Role) => {
        try {
            await userService.updateUserRole(userId, newRole);
            toast.success('Rola użytkownika została zmieniona');
            loadUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Błąd podczas zmiany roli');
        }
    };

    const handleDeleteUser = async (userId: number, email: string) => {
        if (!confirm(`Czy na pewno chcesz usunąć użytkownika ${email}?`)) return;

        try {
            await userService.deleteUser(userId);
            toast.success('Użytkownik został usunięty');
            loadUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Błąd podczas usuwania użytkownika');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const errorList: string[] = [];

            await loadUsers().catch(() => {
                errorList.push('Nie udało się załadować użytkowników');
            });

            try {
                const listingsData = await listingService.fetchListings();
                setListings(listingsData);
            } catch (err) {
                console.error('Failed to load listings:', err);
                errorList.push('Nie udało się załadować ogłoszeń');
            }

            try {
                const categoriesData = await categoryService.getCategories();
                setCategories(categoriesData);
            } catch (err) {
                console.error('Failed to load categories:', err);
                errorList.push('Nie udało się załadować kategorii');
            }

            try {
                const locationsData = await locationService.getAllLocations();
                setLocations(locationsData);
            } catch (err) {
                console.error('Failed to load locations:', err);
                errorList.push('Nie udało się załadować lokalizacji');
            }

            setErrors(errorList);
            setLoading(false);
        };

        loadData();
    }, []);

    const userStats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        agents: users.filter(u => u.role === 'AGENT').length,
        regular: users.filter(u => u.role === 'USER').length,
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-700';
            case 'AGENT':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-8">
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 font-medium mb-2">Wystąpiły błędy podczas ładowania danych:</p>
                    <ul className="list-disc list-inside text-red-600 text-sm">
                        {errors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            )}

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <Users className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{userStats.total}</p>
                            <p className="text-sm text-slate-500">Wszystkich</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <Shield className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{userStats.admins}</p>
                            <p className="text-sm text-slate-500">Adminów</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Building2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{userStats.agents}</p>
                            <p className="text-sm text-slate-500">Agentów</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <Users className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{userStats.regular}</p>
                            <p className="text-sm text-slate-500">Zwykłych</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Notice */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                        <h3 className="text-xl font-bold">Panel Administratora</h3>
                        <p className="text-slate-300">Zarządzaj użytkownikami, kategoriami i lokalizacjami systemu</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Lista użytkowników</h3>
                    <Button variant="ghost" size="sm">
                        Eksportuj <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-500">Ładowanie...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Email</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Imię i Nazwisko</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Rola</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Telefon</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Data rejestracji</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500">
                                            Brak użytkowników do wyświetlenia
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="py-3 px-4 text-slate-500">#{user.id}</td>
                                            <td className="py-3 px-4 font-medium text-slate-800">{user.email}</td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td className="py-3 px-4">
                                                {currentUser?.id === user.id ? (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                                        className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${getRoleBadge(user.role)}`}
                                                    >
                                                        <option value="USER">USER</option>
                                                        <option value="AGENT">AGENT</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">{user.phone || '-'}</td>
                                            <td className="py-3 px-4 text-slate-500">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {currentUser?.id !== user.id && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.email)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Usuń użytkownika"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => navigate('/admin/categories')}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Layers className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Kategorie</h4>
                            <p className="text-sm text-slate-500">Zarządzaj kategoriami nieruchomości</p>
                            <p className="text-lg font-bold text-primary mt-1">{categories.length}</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/admin/locations')}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <MapPin className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Lokalizacje</h4>
                            <p className="text-sm text-slate-500">Zarządzaj miastami i dzielnicami</p>
                            <p className="text-lg font-bold text-emerald-500 mt-1">{locations.length}</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/admin/listings')}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Building2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Ogłoszenia</h4>
                            <p className="text-sm text-slate-500">Przeglądaj wszystkie ogłoszenia</p>
                            <p className="text-lg font-bold text-blue-500 mt-1">{listings.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
