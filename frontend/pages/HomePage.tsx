import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, ArrowRight, CheckCircle, Lightbulb, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingResponse } from '../types';
import api from '../services/api';
import { Link } from 'react-router-dom';

// Default city images for fallback
const CITY_IMAGES: Record<string, string> = {
  'Warszawa': 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400',
  'Kraków': 'https://images.unsplash.com/photo-1562932831-afcfe48b5786?w=400',
  'Gdańsk': 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
  'Wrocław': 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=400',
  'Poznań': 'https://images.unsplash.com/photo-1565427656401-02a47c6657c3?w=400',
  'Gdynia': 'https://images.unsplash.com/photo-1564594834774-7f4d32781d7d?w=400',
  'Sopot': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'Krakow': 'https://images.unsplash.com/photo-1562932831-afcfe48b5786?w=400',
  'Warsaw': 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400',
};

interface CityCount {
  name: string;
  count: number;
  img?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'BUY' | 'RENT'>('BUY');
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [rentalListings, setRentalListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [cityCounts, setCityCounts] = useState<CityCount[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Search form state
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchPriceMin, setSearchPriceMin] = useState('');
  const [searchPriceMax, setSearchPriceMax] = useState('');

  // Advanced filters
  const [searchRoomsMin, setSearchRoomsMin] = useState('');
  const [searchRoomsMax, setSearchRoomsMax] = useState('');
  const [searchAreaMin, setSearchAreaMin] = useState('');
  const [searchAreaMax, setSearchAreaMax] = useState('');

  // City autocomplete
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [saleResponse, rentResponse, cityCountsResponse] = await Promise.all([
          api.get('/listings?type=SALE&limit=4'),
          api.get('/listings?type=RENT&limit=4'),
          api.get('/listings/city-counts')
        ]);
        // Only show real listings, no mock data
        setListings(saleResponse.data.slice(0, 4));
        setRentalListings(rentResponse.data.slice(0, 4));

        // Set city counts with images - prefer API image, then static fallback
        const countsWithImages = cityCountsResponse.data.map((city: CityCount) => ({
          ...city,
          img: city.img || CITY_IMAGES[city.name] || 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400'
        }));
        setCityCounts(countsWithImages.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch listings", error);
        setListings([]);
        setRentalListings([]);
        setCityCounts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Load cities from locations API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get('/locations');
        const uniqueCities = [...new Set(response.data.map((loc: any) => loc.city))];
        setCities(uniqueCities);
      } catch (error) {
        // Fallback cities
        setCities(['Warszawa', 'Kraków', 'Gdańsk', 'Gdynia', 'Sopot', 'Wrocław', 'Poznań', 'Łódź']);
      }
    };
    fetchCities();
  }, []);

  // Filter cities based on input
  useEffect(() => {
    if (searchLocation) {
      const filtered = cities
        .filter(city => city.toLowerCase().includes(searchLocation.toLowerCase()))
        .slice(0, 5);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [searchLocation, cities]);

  const handleSearch = () => {
    // Build query params
    const params = new URLSearchParams();
    params.append('type', activeTab === 'BUY' ? 'SALE' : 'RENT');

    if (searchLocation) params.append('city', searchLocation);
    if (searchCategory) params.append('category', searchCategory);
    if (searchPriceMin) params.append('priceMin', searchPriceMin);
    if (searchPriceMax) params.append('priceMax', searchPriceMax);
    if (searchRoomsMin) params.append('minRooms', searchRoomsMin);
    if (searchRoomsMax) params.append('maxRooms', searchRoomsMax);
    if (searchAreaMin) params.append('minArea', searchAreaMin);
    if (searchAreaMax) params.append('maxArea', searchAreaMax);

    navigate(`/listings?${params.toString()}`);
  };

  const handleCitySelect = (city: string) => {
    setSearchLocation(city);
    setShowCitySuggestions(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80"
            alt="Modern House"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg leading-tight">
            Znajdź swoje <br /> miejsce na Ziemi.
          </h1>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto md:mx-0 animate-fade-in-up">
            {/* Tabs */}
            <div className="flex space-x-8 mb-6 border-b border-slate-100">
              <button
                onClick={() => setActiveTab('BUY')}
                className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'BUY' ? 'text-secondary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                KUP
                {activeTab === 'BUY' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
              <button
                onClick={() => setActiveTab('RENT')}
                className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'RENT' ? 'text-secondary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                WYNAJMIJ
                {activeTab === 'RENT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
            </div>

            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-1 relative">
                <label className="text-xs font-semibold text-slate-500 uppercase">Lokalizacja</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400 z-10" size={18} />
                  <input
                    type="text"
                    placeholder="Lokalizacja, dzielnica..."
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-sm"
                  />
                  {/* City Suggestions Dropdown */}
                  {showCitySuggestions && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {filteredCities.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-sm"
                        >
                          <MapPin size={14} className="inline mr-2 text-slate-400" />
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Typ nieruchomości</label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-600 text-sm appearance-none"
                >
                  <option value="">Wszystkie</option>
                  <option value="dom">Dom wolnostojący</option>
                  <option value="mieszkanie">Mieszkanie</option>
                  <option value="apartament">Apartament</option>
                  <option value="dzialka">Działka</option>
                  <option value="lokal">Lokal użytkowy</option>
                </select>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Budżet</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Od"
                    value={searchPriceMin}
                    onChange={(e) => setSearchPriceMin(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Do"
                    value={searchPriceMax}
                    onChange={(e) => setSearchPriceMax(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Button onClick={handleSearch} fullWidth className="h-[46px] shadow-lg shadow-primary/30">
                  SZUKAJ
                </Button>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="mt-4">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
              >
                <SlidersHorizontal size={16} />
                <span>{showAdvancedFilters ? 'Ukryj filtry' : 'Więcej filtrów'}</span>
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Liczba pokoi</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={searchRoomsMin}
                      onChange={(e) => setSearchRoomsMin(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={searchRoomsMax}
                      onChange={(e) => setSearchRoomsMax(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Powierzchnia (m²)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={searchAreaMin}
                      onChange={(e) => setSearchAreaMin(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={searchAreaMax}
                      onChange={(e) => setSearchAreaMax(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why DreamHome */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-16">Dlaczego DreamHome?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-primary">
                <CheckCircle size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Zweryfikowane oferty</h3>
              <p className="text-slate-500 max-w-xs leading-relaxed">Każda oferta jest dokładnie sprawdzana przez naszych agentów, aby zapewnić Ci pełne bezpieczeństwo transakcji.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-primary">
                <Lightbulb size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Inteligentne dopasowanie</h3>
              <p className="text-slate-500 max-w-xs leading-relaxed">Nasz algorytm uczy się Twoich preferencji, aby proponować nieruchomości idealnie dopasowane do Twojego stylu życia.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-primary">
                <Smile size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Proces bez stresu</h3>
              <p className="text-slate-500 max-w-xs leading-relaxed">Przeprowadzimy Cię przez cały proces od A do Z. Zajmiemy się formalnościami, Ty zajmij się pakowaniem.</p>
            </div>
          </div>

          <div className="mt-16">
            <Link to="/about" className="inline-flex items-center text-primary font-semibold hover:text-primary-hover transition-colors border border-primary/20 px-6 py-3 rounded-full hover:bg-primary/5">
              Dowiedz się więcej <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Listings - Only show if there are listings */}
      {!isLoading && listings.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-2">Najnowsze oferty sprzedaży</h2>
                <p className="text-slate-500">Odkryj najświeższe perełki na rynku nieruchomości.</p>
              </div>
              <Link to="/listings?type=SALE" className="hidden md:flex items-center text-primary font-medium hover:underline">
                Zobacz wszystkie <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular for Rent - Only show if there are rental listings */}
      {!isLoading && rentalListings.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-2">Popularne na wynajem</h2>
                <p className="text-slate-500">Najczęściej oglądane mieszkania i domy do wynajęcia.</p>
              </div>
              <Link to="/listings?type=RENT" className="hidden md:flex items-center text-primary font-medium hover:underline">
                Zobacz wszystkie <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentalListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* City Search - Only show if there are cities with listings */}
      {!isLoading && cityCounts.length > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-secondary">Szukaj według miasta</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-slate-300 hover:border-primary hover:text-primary transition-colors bg-white">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 rounded-full border border-slate-300 hover:border-primary hover:text-primary transition-colors bg-white">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {cityCounts.map((city, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/listings?city=${city.name}`)}
                  className="min-w-[200px] md:min-w-[240px] snap-start group cursor-pointer relative rounded-xl overflow-hidden aspect-[4/5]"
                >
                  <img src={city.img} alt={city.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bold text-lg">{city.name}</h4>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded-md mt-1 inline-block">{city.count} {city.count === 1 ? 'oferta' : 'ofert'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;