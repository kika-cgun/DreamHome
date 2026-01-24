import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, MapPin, Home, DollarSign, Maximize2, Bed, Building, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { categoryService, Category } from '../services/categoryService';
import { listingService } from '../services/listingService';
import toast from 'react-hot-toast';
import api from '../services/api';

const EditListingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [imageInput, setImageInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const listingType = watch('type');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cats, listing] = await Promise.all([
                    categoryService.getCategories(),
                    listingService.fetchListing(parseInt(id!))
                ]);

                setCategories(cats);

                // Populate form fields
                setValue('title', listing.title);
                setValue('description', listing.description || '');
                setValue('type', listing.type);
                setValue('categoryId', cats.find(c => c.name === listing.category)?.id.toString() || '');
                setValue('city', listing.city || '');
                setValue('district', listing.district || '');
                setValue('price', listing.price);
                setValue('area', listing.area);
                setValue('rooms', listing.rooms || '');
                setValue('floor', listing.floor || '');

                // Load existing images
                setImageUrls(listing.images || []);

            } catch (error) {
                console.error('Failed to load listing:', error);
                toast.error('Nie udało się załadować ogłoszenia');
                navigate('/admin/listings');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id, setValue, navigate]);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleAddImageUrl = () => {
        if (imageInput.trim() && getAllImagesCount() < 10) {
            setImageUrls([...imageUrls, imageInput.trim()]);
            setImageInput('');
        } else if (getAllImagesCount() >= 10) {
            toast.error('Maksymalnie 10 zdjęć');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: File[] = [];
        const newPreviews: string[] = [];

        Array.from(files).forEach((file: File) => {
            if (getAllImagesCount() + newFiles.length >= 10) {
                toast.error('Maksymalnie 10 zdjęć');
                return;
            }
            if (file.type.startsWith('image/')) {
                newFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }
        });

        setSelectedFiles([...selectedFiles, ...newFiles]);
        setPreviewUrls([...previewUrls, ...newPreviews]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImageUrl = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const handleRemoveFile = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    };

    const getAllImagesCount = () => imageUrls.length + selectedFiles.length;

    const uploadFiles = async (): Promise<string[]> => {
        if (selectedFiles.length === 0) return [];

        setIsUploading(true);
        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files[]', file);
            });

            const response = await api.post('/uploads/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Failed to upload images', error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (getAllImagesCount() === 0) {
            toast.error('Dodaj przynajmniej jedno zdjęcie');
            return;
        }

        if (!data.city?.trim()) {
            toast.error('Miasto jest wymagane');
            return;
        }

        setIsSubmitting(true);
        try {
            // First upload any local files
            let uploadedUrls: string[] = [];
            if (selectedFiles.length > 0) {
                uploadedUrls = await uploadFiles();
            }

            // Combine URL images with uploaded files
            const allImageUrls = [...imageUrls, ...uploadedUrls];

            await listingService.updateListing(parseInt(id!), {
                title: data.title,
                description: data.description,
                type: data.type,
                categoryId: parseInt(data.categoryId),
                city: data.city,
                district: data.district || undefined,
                price: parseFloat(data.price),
                area: parseFloat(data.area),
                rooms: data.rooms ? parseInt(data.rooms) : undefined,
                floor: data.floor || undefined,
                imageUrls: allImageUrls,
            });

            toast.success('Ogłoszenie zostało zaktualizowane!');
            navigate('/admin/listings');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Błąd podczas aktualizacji ogłoszenia');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 flex items-center justify-center">
                <div className="text-slate-500">Ładowanie...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/listings')} className="mb-4">
                        <ArrowLeft size={16} className="mr-2" /> Powrót do listy
                    </Button>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <Home className="text-primary" size={32} />
                        </div>
                        <h1 className="text-4xl font-bold text-secondary mb-3">Edytuj ogłoszenie</h1>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Zaktualizuj informacje o nieruchomości.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                        <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                            <Building size={24} className="text-primary" />
                            Podstawowe informacje
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Input
                                    label="Tytuł ogłoszenia"
                                    placeholder="np. Słoneczne mieszkanie w centrum"
                                    {...register("title", { required: "Tytuł jest wymagany" })}
                                    error={errors.title?.message as string}
                                />
                            </div>

                            <Select
                                label="Typ transakcji"
                                options={[
                                    { value: 'SALE', label: 'Sprzedaż' },
                                    { value: 'RENT', label: 'Wynajem' },
                                ]}
                                {...register("type")}
                            />

                            <Select
                                label="Kategoria"
                                options={categories.map(c => ({ value: c.id.toString(), label: c.name }))}
                                placeholder="Wybierz kategorię"
                                {...register("categoryId", { required: "Kategoria jest wymagana" })}
                                error={errors.categoryId?.message as string}
                            />

                            <Input
                                label="Miasto"
                                placeholder="np. Gdańsk, Warszawa, Kraków"
                                leftIcon={<MapPin size={18} />}
                                {...register("city", { required: "Miasto jest wymagane" })}
                                error={errors.city?.message as string}
                            />

                            <Input
                                label="Dzielnica / Ulica"
                                placeholder="np. Śródmieście, ul. Główna 123"
                                {...register("district")}
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Opis nieruchomości
                            </label>
                            <textarea
                                {...register("description", { required: "Opis jest wymagany" })}
                                rows={6}
                                placeholder="Opisz szczegółowo swoją nieruchomość..."
                                className={`w-full px-4 py-3 bg-slate-50 border rounded-lg 
                  ${errors.description ? 'border-red-500' : 'border-slate-200'}
                  focus:ring-2 focus:ring-primary focus:border-transparent 
                  outline-none transition-all placeholder:text-slate-400 text-sm resize-none`}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>
                            )}
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                        <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                            <Maximize2 size={24} className="text-primary" />
                            Szczegóły techniczne
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label={listingType === 'SALE' ? 'Cena sprzedaży (PLN)' : 'Czynsz miesięczny (PLN)'}
                                type="number"
                                step="0.01"
                                placeholder="np. 450000"
                                leftIcon={<DollarSign size={18} />}
                                {...register("price", { required: "Cena jest wymagana" })}
                                error={errors.price?.message as string}
                            />

                            <Input
                                label="Powierzchnia (m²)"
                                type="number"
                                step="0.01"
                                placeholder="np. 65"
                                leftIcon={<Maximize2 size={18} />}
                                {...register("area", { required: "Powierzchnia jest wymagana" })}
                                error={errors.area?.message as string}
                            />

                            <Input
                                label="Liczba pokoi"
                                type="number"
                                placeholder="np. 3"
                                leftIcon={<Bed size={18} />}
                                {...register("rooms")}
                            />

                            <Input
                                label="Piętro"
                                placeholder="np. 2/4, parter, poddasze"
                                {...register("floor")}
                            />
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                        <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                            <ImageIcon size={24} className="text-primary" />
                            Zdjęcia ({getAllImagesCount()}/10)
                        </h2>

                        <div className="space-y-6">
                            {/* File Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Dodaj nowe zdjęcia z komputera
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={getAllImagesCount() >= 10}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Wybierz pliki
                                    </Button>
                                    <span className="text-sm text-slate-500 self-center">
                                        {selectedFiles.length > 0 && `Nowe: ${selectedFiles.length} plik(ów)`}
                                    </span>
                                </div>
                            </div>

                            {/* URL Input Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Lub dodaj zdjęcie z URL
                                </label>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Wklej URL zdjęcia"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddImageUrl();
                                            }
                                        }}
                                        leftIcon={<Upload size={18} />}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddImageUrl}
                                        variant="outline"
                                        className="whitespace-nowrap"
                                        disabled={!imageInput.trim() || getAllImagesCount() >= 10}
                                    >
                                        Dodaj
                                    </Button>
                                </div>
                            </div>

                            {/* Preview Grid - Local Files */}
                            {previewUrls.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Nowe pliki lokalne:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {previewUrls.map((url, index) => (
                                            <div key={`file-${index}`} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-green-300">
                                                <img
                                                    src={url}
                                                    alt={`Zdjęcie ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Preview Grid - Existing/URL Images */}
                            {imageUrls.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Aktualne zdjęcia:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imageUrls.map((url, index) => (
                                            <div key={`url-${index}`} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-blue-300">
                                                <img
                                                    src={url}
                                                    alt={`Zdjęcie ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Błąd';
                                                    }}
                                                />
                                                {index === 0 && (
                                                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                                        Główne
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImageUrl(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/admin/listings')}
                        >
                            Anuluj
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting || isUploading}
                            className="min-w-[200px]"
                        >
                            {isUploading ? 'Przesyłanie zdjęć...' : isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListingPage;
