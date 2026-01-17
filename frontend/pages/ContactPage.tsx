import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    toast.success('Wiadomość została wysłana! Odpowiemy wkrótce.');
    reset();
  };

  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h1 className="text-4xl font-bold text-secondary mb-4">Skontaktuj się z nami</h1>
           <p className="text-slate-500 max-w-2xl mx-auto">Masz pytania dotyczące oferty? Chcesz sprzedać nieruchomość? Jesteśmy tutaj, aby Ci pomóc.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-100 h-full">
                <h3 className="text-xl font-bold text-secondary mb-6">Dane kontaktowe</h3>
                
                <div className="space-y-6">
                   <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                         <Phone size={20} />
                      </div>
                      <div className="ml-4">
                         <p className="text-sm text-slate-500 mb-1">Telefon</p>
                         <p className="font-semibold text-secondary">+48 500 600 700</p>
                         <p className="text-sm text-slate-400">Pon-Pt, 8:00 - 18:00</p>
                      </div>
                   </div>

                   <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                         <Mail size={20} />
                      </div>
                      <div className="ml-4">
                         <p className="text-sm text-slate-500 mb-1">Email</p>
                         <p className="font-semibold text-secondary">kontakt@dreamhome.pl</p>
                         <p className="text-sm text-slate-400">Odpowiadamy w ciągu 24h</p>
                      </div>
                   </div>

                   <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                         <MapPin size={20} />
                      </div>
                      <div className="ml-4">
                         <p className="text-sm text-slate-500 mb-1">Siedziba</p>
                         <p className="font-semibold text-secondary">ul. Morska 81-87</p>
                         <p className="text-sm text-slate-400">81-225 Gdynia</p>
                      </div>
                   </div>
                   
                   <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                         <Clock size={20} />
                      </div>
                      <div className="ml-4">
                         <p className="text-sm text-slate-500 mb-1">Godziny otwarcia</p>
                         <p className="font-semibold text-secondary">Pon - Pt: 9:00 - 17:00</p>
                         <p className="text-sm text-slate-400">Sob: 10:00 - 14:00</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-100">
               <h3 className="text-xl font-bold text-secondary mb-6">Wyślij wiadomość</h3>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Imię i nazwisko</label>
                        <input {...register("name", { required: true })} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Jan Kowalski" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input {...register("email", { required: true })} type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="jan@przyklad.pl" />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Temat</label>
                     <select {...register("subject")} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary outline-none bg-white">
                        <option>Zapytanie o ofertę</option>
                        <option>Chcę sprzedać nieruchomość</option>
                        <option>Współpraca</option>
                        <option>Inne</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Wiadomość</label>
                     <textarea {...register("message", { required: true })} rows={6} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="W czym możemy pomóc?" />
                  </div>

                  <Button type="submit" size="lg">Wyślij wiadomość</Button>
               </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 rounded-2xl overflow-hidden h-96 shadow-card border border-slate-100">
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2315.659972033045!2d18.514036915886915!3d54.52188408024227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fda71802951717%3A0xc07a82772522e84!2sUniwersytet%20Morski%20w%20Gdyni!5e0!3m2!1spl!2spl!4v1677685023058!5m2!1spl!2spl" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
           ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;