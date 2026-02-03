import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AICopilot from './AICopilot';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import SettingsModal from './SettingsModal';
import { Globe, Key } from 'lucide-react';
import './Layout.css';

export default function Layout() {
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const { currentLanguage } = useLanguage();
    const { t } = useTranslation();

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="container header-content">
                    <Link to="/" className="brand-logo">
                        <span style={{ fontSize: '1.5rem' }}>🚀</span>
                        SkillGap
                    </Link>
                    <nav className="main-nav">
                        <Link to="/" className="nav-link">{t('Home')}</Link>
                        <Link to="/about" className="nav-link">{t('About')}</Link>
                        <Link to="/login" className="nav-link">{t('Login')}</Link>
                        <Link to="/signup" className="nav-link">{t('Sign Up')}</Link>
                        <button
                            className="nav-link settings-btn flex items-center gap-1"
                            onClick={() => setShowLanguageModal(true)}
                            title={t('Language')}
                        >
                            <Globe size={18} />
                            <span className="uppercase text-xs font-bold">{currentLanguage}</span>
                        </button>
                        <button
                            className="nav-link settings-btn flex items-center gap-1 ml-2"
                            onClick={() => setShowSettingsModal(true)}
                            title={t('Settings')}
                        >
                            <Key size={18} />
                        </button>
                    </nav>
                </div>
            </header>

            {showLanguageModal && (
                <LanguageSwitcher onClose={() => setShowLanguageModal(false)} />
            )}

            {showSettingsModal && (
                <SettingsModal onClose={() => setShowSettingsModal(false)} />
            )}

            <main className="app-main container">
                <Outlet />
            </main>
            <AICopilot />
            <footer className="app-footer">
                <div className="container text-center">
                    <p className="text-muted">{t('footer_text')}</p>
                </div>
            </footer>
        </div>
    );
}
