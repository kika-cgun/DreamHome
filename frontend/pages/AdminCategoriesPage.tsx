import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus, Edit2, Trash2, ArrowLeft, X } from 'lucide-react';
import { categoryService, Category } from '../services/categoryService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

const AdminCategoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Błąd podczas ładowania kategorii');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
                toast.success('Kategoria zaktualizowana!');
            } else {
                await categoryService.createCategory(formData);
                toast.success('Kategoria dodana!');
            }
            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            setEditingCategory(null);
            loadCategories();
        } catch (error) {
            toast.error('Błąd podczas zapisywania kategorii');
            console.error(error);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Czy na pewno chcesz usunąć tę kategorię?')) return;

        try {
            await categoryService.deleteCategory(id);
            toast.success('Kategoria usunięta!');
            loadCategories();
        } catch (error) {
            toast.error('Błąd podczas usuwania kategorii');
            console.error(error);
        }
    };

    const openNewModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
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
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Layers className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Zarządzanie Kategoriami</h1>
                            <p className="text-slate-500">Dodawaj, edytuj i usuwaj kategorie nieruchomości</p>
                        </div>
                    </div>
                    <Button variant="primary" onClick={openNewModal}>
                        <Plus size={16} className="mr-2" /> Dodaj kategorię
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Ładowanie...</div>
                ) : categories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Nazwa</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Opis</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-slate-500">#{category.id}</td>
                                        <td className="py-3 px-4 font-medium text-slate-800">{category.name}</td>
                                        <td className="py-3 px-4 text-slate-600">{category.description || '-'}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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
                        <Layers className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Brak kategorii. Dodaj pierwszą kategorię!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingCategory ? 'Edytuj kategorię' : 'Nowa kategoria'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nazwa"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="np. Mieszkanie"
                            />
                            <Input
                                label="Opis (opcjonalny)"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Krótki opis kategorii"
                            />
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" variant="primary" className="flex-1">
                                    {editingCategory ? 'Zapisz zmiany' : 'Dodaj kategorię'}
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

export default AdminCategoriesPage;
