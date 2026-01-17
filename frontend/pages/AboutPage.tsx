import React from 'react';
import { CheckCircle, Users, Award, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-20 bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tworzymy przyszłość rynku nieruchomości</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            DreamHome to więcej niż platforma ogłoszeniowa. To miejsce, gdzie marzenia o idealnym domu stają się rzeczywistością.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">15k+</p>
                <p className="text-slate-500">Aktywnych ofert</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">8k+</p>
                <p className="text-slate-500">Zadowolonych klientów</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">120</p>
                <p className="text-slate-500">Doświadczonych agentów</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">15</p>
                <p className="text-slate-500">Lat na rynku</p>
              </div>
           </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl font-bold text-secondary mb-6">Nasza Misja</h2>
               <p className="text-slate-600 leading-relaxed mb-6">
                 Wierzymy, że znalezienie idealnego miejsca do życia powinno być ekscytującą przygodą, a nie stresującym obowiązkiem. Naszą misją jest dostarczenie narzędzi i wsparcia, które sprawią, że proces zakupu, sprzedaży czy wynajmu nieruchomości będzie prosty, przejrzysty i bezpieczny.
               </p>
               <ul className="space-y-4">
                 <li className="flex items-start">
                   <CheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                   <span className="text-slate-700">Innowacyjne technologie ułatwiające wyszukiwanie</span>
                 </li>
                 <li className="flex items-start">
                   <CheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                   <span className="text-slate-700">Pełna weryfikacja prawna każdej oferty</span>
                 </li>
                 <li className="flex items-start">
                   <CheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                   <span className="text-slate-700">Wsparcie dedykowanego opiekuna na każdym etapie</span>
                 </li>
               </ul>
            </div>
            <div className="relative">
               <img 
                 src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Meeting" 
                 className="rounded-2xl shadow-xl z-10 relative"
               />
               <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary rounded-2xl -z-0"></div>
               <div className="absolute -top-6 -right-6 w-24 h-24 bg-slate-100 rounded-full -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-secondary">Wartości, którymi się kierujemy</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-secondary mb-3">Relacje</h3>
                 <p className="text-slate-500">Budujemy długotrwałe relacje oparte na zaufaniu i wzajemnym szacunku.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                 <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-secondary mb-3">Jakość</h3>
                 <p className="text-slate-500">Nie uznajemy kompromisów. Dostarczamy usługi najwyższej jakości.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                 <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-secondary mb-3">Rozwój</h3>
                 <p className="text-slate-500">Stale się rozwijamy i szukamy nowych, lepszych rozwiązań dla naszych klientów.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;