import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
    onLogin: (password: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') { // Simple password for now
            onLogin(password);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="glass-card w-full max-w-md text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
                    <Lock className="text-primary" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Accès Sécurisé</h2>
                <p className="text-secondary mb-8">Veuillez saisir le mot de passe administrateur pour continuer.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        autoFocus
                        required
                        className={`input-glass text-center text-lg tracking-widest ${error ? 'border-red-500 animate-shake' : ''}`}
                        placeholder="········"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                        <ShieldCheck size={18} />
                        Se connecter
                    </button>
                </form>

                {error && <p className="text-red-400 text-sm mt-4">Mot de passe incorrect</p>}
            </div>
        </div>
    );
};
