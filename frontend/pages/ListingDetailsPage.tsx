import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Bed, Maximize, Calendar, User, Phone, Mail, Heart, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ListingResponse } from '../types';
import api from '../services/api';

const ListingDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<ListingResponse | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (e) {
        // Mock fallback
        setListing({
          id: Number(id),
          title: 'Luksusowy apartament z widokiem na morze',
          description: 'Przestronny apartament wykończony w wysokim standardzie. Znajduje się w prestiżowej lokalizacji...',
          price: 2500000,
          area: 120,
          rooms: 4,
          floor: '3/4',
          type: 'SALE',
          status: 'ACTIVE',
          category: 'Apartament',
          city: 'Gdynia',
          district: 'Orłowo',
          images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ],
          createdAt: '2023-10-15',
          user: { id: 1, email: 'agent@dreamhome.com', firstName: 'Jan', lastName: 'Kowalski', role: 'AGENT' }
        });
      }
    };
    fetchListing();
  }, [id]);

  if (!listing) return <div className="h-screen flex items-center justify-center">Ładowanie...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
        <img src={listing.primaryImage || listing.images[0]} alt="Main" className="w-full h-full object-cover" />
        <div className="grid grid-cols-2 gap-4">
           <img src={listing.images[1] || listing.images[0]} alt="Sub 1" className="w-full h-full object-cover" />
           <img src={listing.images[2] || listing.images[0]} alt="Sub 2" className="w-full h-full object-cover" />
           <img src={listing.images[1] || listing.images[0]} alt="Sub 3" className="w-full h-full object-cover" />
           <div className="relative">
             <img src={listing.images[2] || listing.images[0]} alt="Sub 4" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-black/50 transition-colors">
               +5 zdjęć
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-secondary">{listing.title}</h1>
              <div className="text-3xl font-bold text-primary whitespace-nowrap">
                {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(listing.price)}
              </div>
            </div>
            
            <div className="flex items-center text-slate-500 mb-6">
               <MapPin size={20} className="mr-2 text-primary" />
               <span className="text-lg">{listing.city}, {listing.district}</span>
            </div>

            <div className="flex gap-8 py-6 border-y border-slate-100">
               <div className="flex items-center gap-2">
                 <Maximize size={24} className="text-slate-400" />
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-semibold">Powierzchnia</p>
                   <p className="font-bold text-secondary">{listing.area} m²</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Bed size={24} className="text-slate-400" />
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-semibold">Pokoje</p>
                   <p className="font-bold text-secondary">{listing.rooms}</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Calendar size={24} className="text-slate-400" />
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-semibold">Rok budowy</p>
                   <p className="font-bold text-secondary">2020</p>
                 </div>
               </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-secondary mb-4">Opis nieruchomości</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>
        </div>

        {/* Sidebar Agent */}
        <div className="lg:col-span-1">
           <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <User size={32} />
                 </div>
                 <div>
                   <p className="text-sm text-slate-500">Opiekun oferty</p>
                   <h4 className="font-bold text-lg text-secondary">{listing.user?.firstName} {listing.user?.lastName}</h4>
                   <p className="text-xs text-primary font-bold uppercase">DreamHome Agent</p>
                 </div>
              </div>

              <div className="space-y-3">
                <Button fullWidth className="flex items-center justify-center gap-2">
                  <Phone size={18} /> Zadzwoń
                </Button>
                <Button fullWidth variant="outline" className="flex items-center justify-center gap-2">
                  <Mail size={18} /> Wyślij wiadomość
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 transition-colors py-2">
                   <Heart size={20} /> Zapisz
                 </button>
                 <button className="flex items-center justify-center gap-2 text-slate-500 hover:text-primary transition-colors py-2">
                   <Share2 size={20} /> Udostępnij
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;