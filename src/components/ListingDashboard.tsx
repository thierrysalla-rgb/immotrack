import React, { useState } from 'react';
import type { PropertyListing } from '../types';
import { ExternalLink, TrendingDown, Calendar, MapPin, Trash2, Edit2, CheckCircle, Clock } from 'lucide-react';
import { storageService } from '../services/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface ListingDashboardProps {
    listings: PropertyListing[];
    onUpdate: () => void;
    showAdminActions?: boolean;
}

export const ListingDashboard: React.FC<ListingDashboardProps> = ({ listings, onUpdate, showAdminActions }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newPrice, setNewPrice] = useState<string>('');
    const [newDate, setNewDate] = useState<string>('');
    const [newImageUrl, setNewImageUrl] = useState<string>('');

    const handleUpdatePrice = async (id: string) => {
        if (!newPrice) return;
        await storageService.updatePrice(id, Number(newPrice));
        setEditingId(null);
        setNewPrice('');
        onUpdate();
    };

    const handleToggleStatus = async (id: string) => {
        await storageService.toggleStatus(id);
        onUpdate();
    };

    const handleUpdateDate = async (id: string) => {
        if (!newDate) return;
        await storageService.updateDate(id, new Date(newDate).toISOString());
        setEditingId(null);
        setNewDate('');
        onUpdate();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
            await storageService.deleteListing(id);
            onUpdate();
        }
    };

    const handleUpdateImageUrl = async (id: string) => {
        await storageService.updateImageUrl(id, newImageUrl);
        setEditingId(null);
        setNewImageUrl('');
        onUpdate();
    };

    return (
        <div className="listings-grid">
            <AnimatePresence mode="popLayout">
                {listings.map((listing) => (
                    <motion.div
                        key={listing.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`glass-card overflow-hidden flex-row gap-0 p-0 ${listing.status === 'sold' ? 'opacity-75 grayscale-[0.5]' : ''}`}
                    >
                        {/* Image Section */}
                        <div className="listing-thumbnail group relative">
                            {editingId === `image-${listing.id}` ? (
                                <div className="absolute inset-0 bg-black/80 z-10 p-2 flex flex-col gap-1 justify-center items-center">
                                    <input
                                        type="url"
                                        autoFocus
                                        className="input-glass py-1 px-2 text-[10px] w-full"
                                        placeholder="URL de l'image"
                                        value={newImageUrl}
                                        onChange={e => setNewImageUrl(e.target.value)}
                                    />
                                    <label className="w-full px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-glass-border text-[9px] text-white text-center cursor-pointer transition-colors">
                                        {newImageUrl && newImageUrl.startsWith('data:') ? 'Fichier prêt ✓' : 'Charger fichier'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setNewImageUrl(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                    <div className="flex gap-1 w-full">
                                        <button onClick={() => handleUpdateImageUrl(listing.id)} className="flex-1 bg-accent-success hover:bg-accent-success/80 text-white py-1 rounded text-[10px] font-bold">
                                            OK
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1 rounded text-[10px] font-bold">
                                            X
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`relative w-full h-full ${showAdminActions ? 'cursor-pointer' : ''}`}
                                    onClick={() => {
                                        if (showAdminActions) {
                                            setEditingId(`image-${listing.id}`);
                                            setNewImageUrl(listing.imageUrl || '');
                                        }
                                    }}
                                >
                                    {listing.imageUrl ? (
                                        <img
                                            src={listing.imageUrl}
                                            alt={listing.location}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                                            <MapPin className="text-primary/30" size={24} />
                                        </div>
                                    )}
                                    {showAdminActions && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Edit2 size={16} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            )}
                            {listing.status === 'sold' && editingId !== `image-${listing.id}` && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none" style={{ position: 'absolute', inset: 0 }}>
                                    <span className="px-2 py-1 border border-red-500 text-red-500 font-black rotate-[-15deg] uppercase tracking-widest text-[10px]">
                                        Vendu
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="listing-content space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        {listing.location}
                                        {listing.status === 'active' ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-accent-success/10 text-accent-success flex items-center gap-1">
                                                <Clock size={10} /> En vente
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500 flex items-center gap-1">
                                                <CheckCircle size={10} /> Vendu
                                            </span>
                                        )}
                                    </h3>
                                </div>
                                <a
                                    href={listing.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-secondary text-xs uppercase tracking-wider mb-1">Prix Actuel</p>
                                    <p className="text-2xl font-bold text-gradient">
                                        {listing.priceCurrent.toLocaleString()} €
                                    </p>
                                    <p className="text-xs text-secondary mt-1 font-medium">
                                        {(listing.priceCurrent / listing.surface).toFixed(0)} € / m²
                                    </p>
                                </div>
                                <div>
                                    <p className="text-secondary text-xs uppercase tracking-wider mb-1">Prix Initial</p>
                                    {editingId === `initial-${listing.id}` ? (
                                        <div className="flex gap-1 items-center">
                                            <input
                                                type="number"
                                                autoFocus
                                                className="input-glass py-0.5 px-2 text-sm w-24"
                                                value={newPrice}
                                                onChange={e => setNewPrice(e.target.value)}
                                            />
                                            <button
                                                onClick={async () => {
                                                    await storageService.updateInitialPrice(listing.id, Number(newPrice));
                                                    setEditingId(null);
                                                    setNewPrice('');
                                                    onUpdate();
                                                }}
                                                className="bg-accent-success hover:bg-accent-success/80 text-white px-2 py-0.5 rounded text-[10px] font-bold transition-all shadow-sm"
                                            >
                                                SAUVER
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-white/10 hover:bg-white/20 text-secondary hover:text-white px-2 py-0.5 rounded text-[10px] font-bold transition-all"
                                            >
                                                FERMER
                                            </button>
                                        </div>
                                    ) : (
                                        <p
                                            className={`text-lg text-secondary line-through ${showAdminActions ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
                                            onClick={() => {
                                                if (showAdminActions) {
                                                    setEditingId(`initial-${listing.id}`);
                                                    setNewPrice(listing.priceInitial.toString());
                                                }
                                            }}
                                        >
                                            {listing.priceInitial.toLocaleString()} €
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-secondary text-xs uppercase tracking-wider mb-1">Surface</p>
                                    <p className="text-lg font-semibold">{listing.surface} m²</p>
                                </div>
                                <div>
                                    <p className="text-secondary text-xs uppercase tracking-wider mb-1">Baisses</p>
                                    <p className={`text-lg font-bold flex items-center gap-1 ${listing.priceDrops > 0 ? 'text-accent-warning' : 'text-secondary'}`}>
                                        <TrendingDown size={18} />
                                        {listing.priceDrops}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-secondary pt-2 border-t border-white/5">
                                {editingId === `date-${listing.id}` ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="date"
                                            autoFocus
                                            className="input-glass py-1 px-2 text-xs w-32"
                                            value={newDate}
                                            onChange={e => setNewDate(e.target.value)}
                                        />
                                        <button onClick={() => handleUpdateDate(listing.id)} className="bg-accent-success hover:bg-accent-success/80 text-white px-2 py-0.5 rounded text-[10px] font-bold transition-all shadow-sm">
                                            SAUVER
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="bg-white/10 hover:bg-white/20 text-secondary hover:text-white px-2 py-0.5 rounded text-[10px] font-bold transition-all">
                                            FERMER
                                        </button>
                                    </div>
                                ) : (
                                    <span
                                        className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => {
                                            if (showAdminActions) {
                                                setEditingId(`date-${listing.id}`);
                                                setNewDate(new Date(listing.dateCreated).toISOString().split('T')[0]);
                                            }
                                        }}
                                    >
                                        <Calendar size={14} />
                                        Ajouté le {new Date(listing.dateCreated).toLocaleDateString()}
                                    </span>
                                )}
                                <button
                                    onClick={() => setEditingId(editingId === `history-${listing.id}` ? null : `history-${listing.id}`)}
                                    className="ml-auto text-primary hover:underline flex items-center gap-1"
                                >
                                    Historique ({listing.history.length})
                                </button>
                            </div>

                            <AnimatePresence>
                                {editingId === `history-${listing.id}` && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-black/20 rounded-lg p-3 mt-2"
                                    >
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="text-secondary border-b border-white/10">
                                                    <th className="text-left py-1">Date</th>
                                                    <th className="text-right py-1">Prix</th>
                                                    <th className="text-right py-1">Évolution</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listing.history.map((entry, i) => {
                                                    const prevPrice = i > 0 ? listing.history[i - 1].price : entry.price;
                                                    const diff = entry.price - prevPrice;
                                                    return (
                                                        <tr key={i} className="border-b border-white/5 last:border-0">
                                                            <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                                                            <td className="text-right py-2 font-medium">{entry.price.toLocaleString()} €</td>
                                                            <td className={`text-right py-2 ${diff < 0 ? 'text-accent-success' : diff > 0 ? 'text-red-400' : 'text-secondary'}`}>
                                                                {diff === 0 ? '-' : `${diff > 0 ? '+' : ''}${diff.toLocaleString()} €`}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Admin Actions */}
                        {showAdminActions && (
                            <div className="p-6 bg-white/[0.02] border-l border-white/5 flex flex-row md:flex-col gap-3 justify-center">
                                {editingId === listing.id ? (
                                    <div className="flex gap-2 w-full md:w-auto p-2 bg-white/5 rounded-xl border border-glass-border">
                                        <input
                                            type="number"
                                            autoFocus
                                            className="input-glass w-24 py-1 text-sm"
                                            placeholder="Prix"
                                            value={newPrice}
                                            onChange={e => setNewPrice(e.target.value)}
                                        />
                                        <button onClick={() => handleUpdatePrice(listing.id)} className="btn-primary py-1 px-3 text-xs">OK</button>
                                        <button onClick={() => setEditingId(null)} className="p-1 px-2 bg-white/5 rounded-lg border border-glass-border text-xs">Annul.</button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingId(listing.id);
                                                setNewPrice(listing.priceCurrent.toString());
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all border border-primary/20 text-sm font-semibold shadow-sm"
                                        >
                                            <Edit2 size={14} /> Prix
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(listing.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border text-sm font-semibold shadow-sm ${listing.status === 'active'
                                                ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20'
                                                : 'bg-accent-success/10 hover:bg-accent-success/20 text-accent-success border-accent-success/20'
                                                }`}
                                        >
                                            <CheckCircle size={14} />
                                            {listing.status === 'active' ? 'Vendu' : 'Réactiver'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(listing.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20 text-sm font-semibold shadow-sm"
                                        >
                                            <Trash2 size={14} /> Supprimer
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>

            {listings.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-glass-border">
                    <p className="text-secondary mb-4">Aucun bien trouvé pour ce filtre.</p>
                </div>
            )}
        </div>
    );
};
