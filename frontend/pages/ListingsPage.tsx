import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingResponse } from '../types';
import { Button } from '../components/ui/Button';
import api from '../services/api';

const ListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Read filters from URL
  const type = searchParams.get('type') === 'RENT' ? 'RENT' : 'SALE';
  const city = searchParams.get('city') || '';  // Changed from 'location' to 'city'
  const category = searchParams.get('category') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Build params object from URL search params
        const params: any = { type };
        if (city) params.city = city;  // Changed from location to city
        if (category) params.category = category;
        if (priceMin) params.priceMin = priceMin;
        if (priceMax) params.priceMax = priceMax;

        const response = await api.get('/listings', { params });
        setListings(response.data);
      } catch (e) {
        console.error("Using fallback data", e);
        // Fallback mock
        setListings(Array(8).fill(null).map((_, i) => ({
          id: i,
          title: `Przykładowa oferta ${i + 1}`,
          description: 'Opis...',
          price: 500000 + (i * 50000),
          area: 50 + i * 10,
          rooms: 2 + (i % 3),
          type: type,
          status: 'ACTIVE',
          category: 'Mieszkanie',
          city: 'Gdańsk',
          createdAt: '2023-01-01',
          images: []
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [type, city, category, priceMin, priceMax]); // Changed location to city

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-card border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-secondary font-bold text-lg">
              <Filter size={20} />
              Filtry
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lokalizacja</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input type="text" placeholder="Miasto, dzielnica" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cena (PLN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Od" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" />
                  <input type="number" placeholder="Do" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Powierzchnia (m²)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Od" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" />
                  <input type="number" placeholder="Do" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pokoje</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, '5+'].map(r => (
                    <button key={r} className="flex-1 py-2 text-sm border border-slate-200 rounded-lg hover:border-primary hover:text-primary bg-slate-50">{r}</button>
                  ))}
                </div>
              </div>

              <Button fullWidth>Zastosuj filtry</Button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-secondary">
              {type === 'SALE' ? 'Nieruchomości na sprzedaż' : 'Nieruchomości na wynajem'}
            </h1>
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              <option>Najnowsze</option>
              <option>Cena: rosnąco</option>
              <option>Cena: malejąco</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white h-96 rounded-xl animate-pulse shadow-card"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;