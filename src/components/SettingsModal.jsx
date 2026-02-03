import React, { useState, useEffect } from 'react';
import { X, Save, Key } from 'lucide-react';
import Button from './Button';
import { useTranslation } from 'react-i18next';

export default function SettingsModal({ onClose }) {
    const { t } = useTranslation();
    const [apiKey, setApiKey] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const key = localStorage.getItem('gemini_api_key');
        if (key) setApiKey(key);
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
                window.location.reload(); // Reload to apply key everywhere
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1f2e] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Key size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">{t('settings_title') || "Settings"}</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Required for AI analysis. Get one for free at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>.
                        </p>
                    </div>

                    <Button
                        onClick={handleSave}
                        className="w-full mt-4 flex items-center justify-center gap-2"
                        variant="primary"
                    >
                        {saved ? (
                            <>
                                <span className="animate-bounce">✅</span> Saved!
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Save Configuration
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
