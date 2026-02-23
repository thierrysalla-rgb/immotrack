import React, { useState } from 'react';
import { PlusCircle, ExternalLink, MapPin, Euro, Maximize } from 'lucide-react';
import { storageService } from '../services/storage';

interface AdminPanelProps {
    onListingAdded: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onListingAdded }) => {
    const [formData, setFormData] = useState({
        url: '',
        priceInitial: '',
        location: '',
        surface: '',
        imageUrl: '',
        dateCreated: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        storageService.saveListing({
            url: formData.url,
            priceInitial: Number(formData.priceInitial),
            priceCurrent: Number(formData.priceInitial),
            location: formData.location,
            surface: Number(formData.surface),
            dateCreated: new Date(formData.dateCreated).toISOString(),
            imageUrl: formData.imageUrl || undefined,
        });

        setFormData({ url: '', priceInitial: '', location: '', surface: '', imageUrl: '', dateCreated: new Date().toISOString().split('T')[0] });
        onListingAdded();
    };

    return (
        <section className="glass-card mb-8">
            <h2 className="text-xl flex items-center gap-2 mb-6">
                <PlusCircle className="text-primary" />
                Ajouter un nouveau bien
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-secondary flex items-center gap-1">
                        <ExternalLink size={14} /> Lien de l'annonce
                    </label>
                    <input
                        type="url"
                        required
                        className="input-glass"
                        placeholder="https://example.com/annonce..."
                        value={formData.url}
                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-secondary flex items-center gap-1">
                        <Euro size={14} /> Prix initial (€)
                    </label>
                    <input
                        type="number"
                        required
                        className="input-glass"
                        placeholder="350000"
                        value={formData.priceInitial}
                        onChange={e => setFormData({ ...formData, priceInitial: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-secondary flex items-center gap-1">
                        <MapPin size={14} /> Situation géographique
                    </label>
                    <input
                        type="text"
                        required
                        className="input-glass"
                        placeholder="Paris, 75015"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-secondary flex items-center gap-1">
                        <Maximize size={14} /> Surface (m²)
                    </label>
                    <input
                        type="number"
                        required
                        className="input-glass"
                        placeholder="65"
                        value={formData.surface}
                        onChange={e => setFormData({ ...formData, surface: e.target.value })}
                    />
                </div>
                <div className="md:col-span-1 space-y-2">
                    <label className="text-sm text-secondary flex items-center gap-1">
                        Photo (URL ou Fichier)
                    </label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="url"
                            className="input-glass"
                            placeholder="https://..."
                            value={formData.imageUrl}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                        <div className="flex items-center gap-2">
                            <label className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-glass-border text-xs text-center cursor-pointer transition-colors">
                                {formData.imageUrl && formData.imageUrl.startsWith('data:') ? 'Image chargée ✓' : 'Charger une image locale'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, imageUrl: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                            {formData.imageUrl && formData.imageUrl.startsWith('data:') && (
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                    className="text-red-400 hover:text-red-300 text-xs"
                                >
                                    Effacer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:col-span-1 space-y-2">
                    <label className="text-sm text-secondary flex items-center gap-1">
                        Date de mise en annonce
                    </label>
                    <input
                        type="date"
                        required
                        className="input-glass"
                        value={formData.dateCreated}
                        onChange={e => setFormData({ ...formData, dateCreated: e.target.value })}
                    />
                </div>
                <div className="md:col-span-2 mt-2">
                    <button type="submit" className="btn-primary w-full md:w-auto">
                        Enregistrer le bien
                    </button>
                </div>
            </form>
        </section>
    );
};
