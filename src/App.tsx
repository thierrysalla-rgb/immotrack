import { useState, useEffect } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { ListingDashboard } from './components/ListingDashboard';
import { AdminLogin } from './components/AdminLogin';
import { storageService } from './services/storage';
import type { PropertyListing } from './types';
import { Home, LayoutDashboard, Settings, Filter, LogOut } from 'lucide-react';

function App() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold'>('all');

  const [isLoading, setIsLoading] = useState(true);

  const refreshListings = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getListings();
      setListings(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveTab('public');
  };

  useEffect(() => {
    refreshListings();
  }, []);

  const filteredListings = listings.filter(l =>
    filterStatus === 'all' || l.status === filterStatus
  );

  return (
    <div className="container">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 py-6 border-b border-glass-border">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Home className="text-primary" size={40} />
              <span className="text-gradient">ImmoTrack</span>
            </h1>
            <p className="text-secondary mt-1">Suivi intelligent de vos recherches immobilières</p>
          </div>
          {isAdminAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20 text-xs font-semibold"
              title="Se déconnecter"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          )}
        </div>

        <nav className="flex gap-2 p-1 bg-white/5 rounded-xl border border-glass-border">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'public'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'admin'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
          >
            <Settings size={18} />
            Admin
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'admin' ? (
          isAdminAuthenticated ? (
            <AdminPanel onListingAdded={refreshListings} />
          ) : (
            <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
          )
        ) : null}

        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold">
            {activeTab === 'admin' ? 'Gérer les annonces' : 'Annonces en ligne'}
          </h2>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-glass-border">
            <Filter size={16} className="text-secondary ml-2" />
            {(['all', 'active', 'sold'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-md text-sm transition-all ${filterStatus === status ? 'bg-white/10 text-white' : 'text-secondary'
                  }`}
              >
                {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : 'Vendus'}
              </button>
            ))}
          </div>

          <div className="text-sm text-secondary">
            {filteredListings.length} bien{filteredListings.length > 1 ? 's' : ''} {filterStatus !== 'all' ? (filterStatus === 'active' ? 'actifs' : 'vendus') : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-secondary animate-pulse">Chargement des annonces...</p>
          </div>
        ) : (
          <ListingDashboard
            listings={filteredListings}
            onUpdate={refreshListings}
            showAdminActions={activeTab === 'admin' && isAdminAuthenticated}
          />
        )}
      </main>

      <footer className="mt-20 py-10 text-center border-t border-glass-border">
        <p className="text-secondary text-sm">
          &copy; {new Date().getFullYear()} ImmoTrack Premium. Propulsé par React + Vite.
        </p>
      </footer>
    </div>
  );
}

export default App;
