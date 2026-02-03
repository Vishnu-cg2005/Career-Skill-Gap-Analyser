import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, X, Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ onClose }) {
    const { t } = useTranslation();
    const { allLanguages, currentLanguage, changeLanguage } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCode, setSelectedCode] = useState(currentLanguage);

    const filteredLanguages = allLanguages.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Supported languages whitelist
    const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ta', 'zh'];

    const handleConfirm = () => {
        if (SUPPORTED_LANGUAGES.includes(selectedCode)) {
            changeLanguage(selectedCode);
        } else {
            alert(t("Sorry, this language will be updated later."));
            changeLanguage('en');
        }
        if (onClose) onClose();
    };

    return (
        <div className="language-modal-overlay" onClick={onClose}>
            <div className="language-modal" onClick={e => e.stopPropagation()}>
                <div className="language-header">
                    <div className="flex items-center gap-2">
                        <Globe size={20} className="text-blue-400" />
                        <h2>{t('Select Language')}</h2>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="language-search">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('Search 7,000+ languages...')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="language-list">
                    {filteredLanguages.map(lang => (
                        <button
                            key={lang.code}
                            className={`language-item ${selectedCode === lang.code ? 'active' : ''}`}
                            onClick={() => setSelectedCode(lang.code)}
                        >
                            <span className="lang-name">{lang.name}</span>
                            <span className="lang-native">{lang.nativeName}</span>
                            {selectedCode === lang.code && <span className="check-mark"><Check size={16} /></span>}
                        </button>
                    ))}
                    {filteredLanguages.length === 0 && (
                        <div className="no-results">{t('No languages found')}</div>
                    )}
                </div>

                <div className="language-footer flex justify-between items-center">
                    <div className="text-sm">
                        {t('Selected')}: <strong className="text-white">{allLanguages.find(l => l.code === selectedCode)?.name}</strong>
                    </div>
                    <button
                        onClick={handleConfirm}
                        className="confirm-btn bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                        {t('Apply Changes')}
                    </button>
                </div>
            </div>
        </div>
    );
}
