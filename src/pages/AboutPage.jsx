import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutPage.css';

export default function AboutPage() {
    const { t } = useTranslation();
    return (
        <div className="about-page-wrapper">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <h1 className="about-headline">{t('about_headline')}</h1>
                    <p className="about-subheadline">
                        {t('about_subheadline')}
                    </p>
                </div>
            </section>

            <div className="about-container">
                {/* Mission Grid */}
                <section className="about-grid-section">
                    <h2 className="section-title">{t('our_core_values')}</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <span className="value-icon">🎯</span>
                            <h3 className="value-title">{t('precision_analysis')}</h3>
                            <p className="value-desc">
                                {t('precision_analysis_desc')}
                            </p>
                        </div>
                        <div className="value-card">
                            <span className="value-icon">🚀</span>
                            <h3 className="value-title">{t('accelerated_growth')}</h3>
                            <p className="value-desc">
                                {t('accelerated_growth_desc')}
                            </p>
                        </div>
                        <div className="value-card">
                            <span className="value-icon">🛡️</span>
                            <h3 className="value-title">{t('unbiased_feedback')}</h3>
                            <p className="value-desc">
                                {t('unbiased_feedback_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story / How it works */}
                <section className="story-section">
                    <div className="story-content">
                        <h2 className="section-title" style={{ textAlign: 'center', border: 'none' }}>{t('how_it_works_title')}</h2>
                        <p className="story-text">
                            {t('how_it_works_desc')}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
