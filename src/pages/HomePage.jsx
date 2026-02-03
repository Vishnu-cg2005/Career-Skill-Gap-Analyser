import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import Button from '../components/Button';
import Card from '../components/Card';

import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="home-content-wrapper">
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <Trans i18nKey="hero_title">
                            Accelerate Your <span className="highlight">Tech Career</span> with AI
                        </Trans>
                    </h1>
                    <p className="hero-subtitle">
                        {t('hero_subtitle')}
                    </p>
                    <div className="hero-tags">
                        <span>{t('hero_tag_ai')}</span>
                        <span>{t('hero_tag_match')}</span>
                        <span>{t('hero_tag_roadmap')}</span>
                    </div>
                    <div className="hero-actions">
                        <Link to="/analyze">
                            <Button size="large" className="btn-primary shadow-lg hover:shadow-xl transition-all">
                                {t('start_free_analysis')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>



            {/* 3. Skill Analysis Feature */}
            <section className="feature-section staggered-reveal">
                <div className="container">
                    <div className="feature-row">
                        <div className="feature-text">
                            <h3>{t('feature_analysis_title')}</h3>
                            <p>{t('feature_analysis_desc')}</p>
                            <ul className="feature-list">
                                <li>Real-time parsing & scoring</li>
                                <li>Industry standard benchmarking</li>
                                <li>Detailed strength & weakness report</li>
                            </ul>
                        </div>
                        <div className="feature-visual glass-card-visual">
                            {/* Visual Representation of Analysis */}
                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Report</span>
                            </div>
                            <div className="mock-progress-bar">
                                <div className="mock-label">
                                    <span>Top Skill Match</span>
                                    <span>85%</span>
                                </div>
                                <div className="mock-track"><div className="mock-fill w-85" style={{ boxShadow: '0 0 10px rgba(108, 99, 255, 0.5)' }}></div></div>
                            </div>
                            <div className="mock-progress-bar">
                                <div className="mock-label">
                                    <span>Critical Gap Detected</span>
                                    <span>40%</span>
                                </div>
                                <div className="mock-track"><div className="mock-fill w-40 warning" style={{ boxShadow: '0 0 10px rgba(234, 179, 8, 0.4)' }}></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. AI Assistant Feature */}
            <section className="feature-section staggered-reveal alt-bg">
                <div className="container">
                    <div className="feature-row reverse">
                        <div className="feature-text">
                            <h3>{t('feature_ai_title')}</h3>
                            <p>{t('feature_ai_desc')}</p>
                            <ul className="feature-list">
                                <li>Instant answers to technical queries</li>
                                <li>Mock interview practice</li>
                                <li>Resume improvement suggestions</li>
                            </ul>
                        </div>
                        <div className="feature-visual glass-card-visual centered">
                            <div className="mock-chat-bubble user">How do I learn Docker?</div>
                            <div className="mock-chat-bubble bot">I've created a custom learning path for you covering Containers, Images, and Compose...</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Learning Roadmap Feature */}
            <section className="feature-section staggered-reveal">
                <div className="container">
                    <div className="feature-row">
                        <div className="feature-text">
                            <h3>{t('feature_roadmap_title')}</h3>
                            <p>{t('feature_roadmap_desc')}</p>
                            <Button variant="secondary" onClick={() => navigate('/signup')}>{t('generate_roadmap')}</Button>
                        </div>
                        <div className="feature-visual glass-card-visual">
                            <div className="mock-timeline">
                                <div className="mock-step">
                                    <div className="mock-dot done"></div>
                                    <div className="mock-line"></div>
                                    <div className="mock-card-content">
                                        <div className="mock-card-title">Completed: Fundamentals</div>
                                        <div className="mock-card-subtitle">Verified by AI Analysis</div>
                                    </div>
                                </div>
                                <div className="mock-step">
                                    <div className="mock-dot active"></div>
                                    <div className="mock-line dashed"></div>
                                    <div className="mock-card-content">
                                        <div className="mock-card-title" style={{ color: 'var(--color-primary)' }}>Current Goal: Advanced Concepts</div>
                                        <div className="mock-card-subtitle">Recommended: 4 Modules</div>
                                    </div>
                                </div>
                                <div className="mock-step">
                                    <div className="mock-dot"></div>
                                    <div className="mock-card-content">
                                        <div className="mock-card-title">Next Step: Project Work</div>
                                        <div className="mock-card-subtitle">Build 2 Portfolio Projects</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
