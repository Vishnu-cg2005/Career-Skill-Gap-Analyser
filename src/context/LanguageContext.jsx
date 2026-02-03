import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ALL_LANGUAGES } from '../data/languages';
import '../components/LanguageLoader.css';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [pendingLanguage, setPendingLanguage] = useState(null);

    // Sync document language
    const currentLanguage = i18n.language || 'en';

    useEffect(() => {
        document.documentElement.lang = currentLanguage;
    }, [currentLanguage]);

    // Initial Sync with Backend
    useEffect(() => {
        const fetchBackendLanguage = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/user/language');
                if (res.ok) {
                    const data = await res.json();
                    if (data.language && data.language !== currentLanguage) {
                        console.log("Syncing language from backend:", data.language);
                        i18n.changeLanguage(data.language);
                    }
                }
            } catch (err) {
                console.warn("Backend language sync failed (possibly offline):", err);
            }
        };

        fetchBackendLanguage();
    }, []); // Run once on mount

    const changeLanguage = async (langCode) => {
        if (langCode === currentLanguage) return;

        setPendingLanguage(langCode);
        setIsLoading(true);

        try {
            // 1. Artificial delay for UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 2. Change Frontend Language
            await i18n.changeLanguage(langCode);

            // 3. Persist to Backend
            try {
                await fetch('http://localhost:8080/api/user/language', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ language: langCode }),
                });
            } catch (backendErr) {
                console.warn("Failed to persist language to backend:", backendErr);
            }

        } catch (error) {
            console.error(`Error loading language ${langCode}:`, error);
        } finally {
            setIsLoading(false);
            setPendingLanguage(null);
        }
    };

    const value = {
        currentLanguage,
        changeLanguage,
        allLanguages: ALL_LANGUAGES,
        t,
        isLoading
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
            {isLoading && pendingLanguage && (
                <div className="language-loader-overlay">
                    <div className="loader-content">
                        <div className="globe-spinner">🌍</div>
                        <h2 className="loader-text">
                            Applying {ALL_LANGUAGES.find(l => l.code === pendingLanguage)?.name || 'Language'} Settings...
                        </h2>
                        <p className="loader-subtext">Translating interface and checking resume compatibility...</p>
                    </div>
                </div>
            )}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
