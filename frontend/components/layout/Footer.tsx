import React, { useEffect, useState } from 'react';
import { Home, Facebook, Instagram, Linkedin, Twitter, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkBothBackends, HealthStatus } from '../../services/healthService';
import { useConfigStore } from '../../stores/configStore';

const Footer: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<{ java: HealthStatus | null; php: HealthStatus | null }>({
    java: null,
    php: null,
  });
  const { backend } = useConfigStore();

  useEffect(() => {
    const fetchHealth = async () => {
      const result = await checkBothBackends();
      setHealthStatus(result);
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: HealthStatus | null) => {
    if (!status) return 'text-slate-500';
    return status.status === 'UP' ? 'text-green-400' : 'text-red-400';
  };

  const getStatusText = (status: HealthStatus | null) => {
    if (!status) return 'Sprawdzanie...';
    return status.status === 'UP' ? 'Online' : 'Offline';
  };

  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home size={24} className="text-primary" />
              <span className="font-bold text-xl tracking-tight">DreamHome</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Twój zaufany partner w poszukiwaniu idealnego miejsca na ziemi. Oferujemy najlepsze nieruchomości i profesjonalne doradztwo.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Oferta</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><Link to="/listings?type=SALE" className="hover:text-primary transition-colors">Domy na sprzedaż</Link></li>
              <li><Link to="/listings?type=RENT" className="hover:text-primary transition-colors">Mieszkania na wynajem</Link></li>
              <li><Link to="/commercial" className="hover:text-primary transition-colors">Lokale użytkowe</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Firma</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">O nas</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Kontakt</Link></li>
              <li><span className="text-slate-300">Kariera</span></li>
              <li><span className="text-slate-300">Blog</span></li>
            </ul>
          </div>

          {/* Socials & Actions */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Obserwuj nas</h4>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
            <Link to="/add-listing" className="text-primary hover:text-white transition-colors text-sm font-medium">
              Dodaj ogłoszenie →
            </Link>
          </div>
        </div>

        {/* Backend Status Section */}
        <div className="border-t border-white/10 pt-6 pb-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${backend === 'java' ? 'bg-white/10 ring-1 ring-primary' : 'bg-white/5'}`}>
              <Circle size={8} className={`${getStatusColor(healthStatus.java)} fill-current`} />
              <span className="text-slate-300">Java Backend:</span>
              <span className={getStatusColor(healthStatus.java)}>{getStatusText(healthStatus.java)}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${backend === 'php' ? 'bg-white/10 ring-1 ring-primary' : 'bg-white/5'}`}>
              <Circle size={8} className={`${getStatusColor(healthStatus.php)} fill-current`} />
              <span className="text-slate-300">PHP Backend:</span>
              <span className={getStatusColor(healthStatus.php)}>{getStatusText(healthStatus.php)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2026 DreamHome. Wszelkie prawa zastrzeżone.</p>
          <p className="mt-2 md:mt-0">Projekt uczelniany - Uniwersytet Morski w Gdyni</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;