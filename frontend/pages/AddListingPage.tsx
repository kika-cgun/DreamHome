import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, MapPin, Home, DollarSign, Maximize2, Bed, Building, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { categoryService, Category } from '../services/categoryService';
import { locationService, Location } from '../services/locationService';
import toast from 'react-hot-toast';
import api from '../services/api';

const AddListingPage: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      type: 'SALE',
      categoryId: '',
      floor: '',
    }
  });
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // City autocomplete state
  const [locations, setLocations] = useState<Location[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const listingType = watch('type');

  useEffect(() => {
    // Load categories and locations
    const loadData = async () => {
      try {
        const [cats, locs] = await Promise.all([
          categoryService.getCategories(),
          locationService.getAllLocations()
        ]);
        setCategories(cats);
        setLocations(locs);
      } catch (error) {
        console.error('Failed to load data', error);
        // Fallback mock data
        setCategories([
          { id: 1, name: 'Mieszkanie' },
          { id: 2, name: 'Dom' },
          { id: 3, name: 'Działka' },
          { id: 4, name: 'Lokal użytkowy' },
        ]);
      }
    };
    loadData();
  }, []);

  // Filter cities based on search input
  useEffect(() => {
    if (citySearch) {
      const uniqueCities = [...new Set(locations.map(l => l.city))];
      const filtered = uniqueCities
        .filter(city => city.toLowerCase().includes(citySearch.toLowerCase()))
        .slice(0, 5);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [citySearch, locations]);

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

    Array.from(files).forEach(file => {
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

    // Reset the input
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

      await api.post('/listings', {
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
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
        imageUrls: allImageUrls,
      });
      toast.success('Ogłoszenie zostało dodane!');
      navigate('/my-listings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Błąd podczas dodawania ogłoszenia');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Home className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-3">Dodaj ogłoszenie</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Wypełnij formularz poniżej, aby dodać swoją nieruchomość.
            Upewnij się, że wszystkie informacje są dokładne i kompletne.
          </p>
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

              <div className="space-y-1 relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">Miasto</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400 z-10" size={18} />
                  <input
                    type="text"
                    placeholder="np. Gdańsk, Warszawa, Kraków"
                    value={citySearch}
                    {...register("city", { required: "Miasto jest wymagane" })}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-sm ${errors.city ? 'border-red-500' : 'border-slate-200'
                      }`}
                  />
                  {/* City Suggestions Dropdown */}
                  {showCitySuggestions && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {filteredCities.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => {
                            setCitySearch(city);
                            setShowCitySuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-sm"
                        >
                          <MapPin size={14} className="inline mr-2 text-slate-400" />
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message as string}</p>}
              </div>

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
                placeholder="Opisz szczegółowo swoją nieruchomość: stan, wyposażenie, lokalizacja, otoczenie..."
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

              <Input
                label="Rok budowy"
                type="number"
                placeholder="np. 2015"
                {...register("yearBuilt")}
              />

              <Input
                label="Liczba łazienek"
                type="number"
                placeholder="np. 1"
                {...register("bathrooms")}
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
                  Wybierz zdjęcia z komputera
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
                    {selectedFiles.length > 0 && `Wybrano: ${selectedFiles.length} plik(ów)`}
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
                    placeholder="Wklej URL zdjęcia (np. https://example.com/image.jpg)"
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
                  <p className="text-sm font-medium text-slate-700 mb-2">Pliki lokalne:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={`file-${index}`} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-green-300">
                        <img
                          src={url}
                          alt={`Zdjęcie ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {imageUrls.length === 0 && index === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                            Główne
                          </div>
                        )}
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

              {/* Preview Grid - URL Images */}
              {imageUrls.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Zdjęcia z URL:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={`url-${index}`} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-blue-300">
                        <img
                          src={url}
                          alt={`Zdjęcie ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Błąd+ładowania';
                          }}
                        />
                        {previewUrls.length === 0 && index === 0 && (
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Wskazówka:</strong> Pierwsze zdjęcie będzie zdjęciem głównym ogłoszenia.
                  Dodaj profesjonalne zdjęcia z różnych perspektyw, aby przyciągnąć więcej zainteresowanych.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || isUploading}
              className="min-w-[200px]"
            >
              {isUploading ? 'Przesyłanie zdjęć...' : isSubmitting ? 'Dodawanie...' : 'Opublikuj ogłoszenie'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListingPage;