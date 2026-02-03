import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link, Navigate } from 'react-router-dom';
import Button from '../components/Button';
import { api } from '../services/api';
import './ResultsPage.css';

import { getSafeLink } from '../utils/skillUtils';

export default function ResultsPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const [resultsData, setResultsData] = useState(location.state || null);
    const [loading, setLoading] = useState(!location.state);

    // Interactive Resume Audit State
    const [auditVisible, setAuditVisible] = useState(false);
    const [auditLoading, setAuditLoading] = useState(false);

    const handleRunAudit = () => {
        setAuditLoading(true);
        // Simulate "Thinking" time for the interaction feeling
        setTimeout(() => {
            setAuditLoading(false);
            setAuditVisible(true);
        }, 1500);
    };

    useEffect(() => {
        // If we landed here without data (e.g. direct link), Generate a LIVE AI DEMO
        if (!location.state) {
            const generateDemo = async () => {
                try {
                    console.log("No data found, generating Gemini AI Demo...");
                    // Simulate a generic mid-level profile upload
                    const demoAnalysis = await api.uploadResume(null, 'backend');

                    // We need to shape it like the final output of submitTest
                    const demoResults = {
                        overallScore: 75,
                        readinessLevel: demoAnalysis.readinessLevel,
                        skillGapSummary: demoAnalysis.gapSummary || "AI Generated Demo Analysis",
                        // Dynamic Scores from Extracted Skills
                        skillScores: demoAnalysis.extracted.slice(0, 5).reduce((acc, skill) => {
                            acc[skill.name] = 60 + Math.floor(Math.random() * 35);
                            return acc;
                        }, {}),
                        criticalGaps: demoAnalysis.missing.map(m => ({
                            skill: m.name,
                            learningUrl: "https://google.com",
                            sourceName: "AI Recommendation"
                        })),
                        performanceGaps: [],
                        resumeFeedback: demoAnalysis.resumeFeedback, // This comes from AI/Dynamic API now!
                        roadmap: demoAnalysis.roadmap || []
                    };

                    setResultsData({ results: demoResults, role: "Backend Developer (Demo)" });
                } catch (err) {
                    console.error("Demo generation failed", err);
                } finally {
                    setLoading(false);
                }
            };
            generateDemo();
        }
    }, [location.state]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">✨</div>
                <h2 className="loading-title">{t('generating_analysis')}</h2>
                <p className="loading-subtitle">{t('analyzing_skills')}</p>
            </div>
        );
    }

    if (!resultsData) return <div className="error-state">{t('init_failed')}</div>;

    const { results, role } = resultsData;

    // Normalize properties
    const stats = {
        score: results?.overallScore || 0,
        level: results?.readinessLevel || "Assessed",
        gapsCount: (results?.criticalGaps?.length || 0) + (results?.performanceGaps?.length || 0),
        skills: results?.skillScores || {},
        critical: (results?.criticalGaps || []).map(g => typeof g === 'string' ? g : g.skill),
        resumeFeedback: results?.resumeFeedback || { score: 50, strengths: [], improvements: ["AI Analysis Pending"] },
        roadmap: results?.roadmap || [],
        gapSummary: results?.skillGapSummary || "Analysis pending..."
    };

    const getColor = (val) => val >= 80 ? '#4ade80' : val >= 50 ? '#facc15' : '#f87171';

    return (
        <div className="results-content-wrapper fade-in">
            {/* 1. Header Area */}
            <div className="results-header">
                <div className="header-title">
                    <span className="header-label">{t('career_analysis')}</span>
                    <h1 className="header-role">{role || t('candidate_profile')}</h1>
                </div>
                <div>
                    <Link to="/analyze">
                        <Button variant="outline" className="btn-new-assessment">{t('new_assessment_btn')}</Button>
                    </Link>
                </div>
            </div>

            {/* 2. Bento Grid Layout */}
            <div className="bento-grid">

                {/* Row 1: Key Metrics */}
                <div className="bento-card metric-card">
                    <div className="score-ring-large">
                        <svg viewBox="0 0 36 36" className="circular-chart-large">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#334155" strokeWidth="2.5" fill="none" />
                            <path className="circle" strokeDasharray={`${stats.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke={getColor(stats.score)} strokeWidth="2.5" fill="none" />
                        </svg>
                        <div className="score-text-large" style={{ color: getColor(stats.score) }}>
                            {stats.score}%
                        </div>
                    </div>
                    <div className="metric-label mt-2">{t('overall_match')}</div>
                </div>

                <div className="bento-card metric-card">
                    <div className="metric-value" style={{ color: '#60a5fa' }}>
                        {stats.level.split(" ")[0]}
                    </div>
                    <div className="metric-label">{t('current_level')}</div>
                </div>

                <div className="bento-card metric-card">
                    <div className="metric-value" style={{ color: '#f87171' }}>{stats.gapsCount}</div>
                    <div className="metric-label">{t('topics_to_master')}</div>
                </div>

                {/* Row 1.5: Resume Health Check (NEW) */}
                {stats.resumeFeedback && (
                    <div className="bento-card resume-audit-card">
                        {/* 1. SCORE & SUMMARY */}
                        <div className="audit-score-section">
                            <div className="score-ring-container">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#334155" strokeWidth="2.5" fill="none" />
                                    <path className="circle" strokeDasharray={`${stats.resumeFeedback.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke={getColor(stats.resumeFeedback.score)} strokeWidth="2.5" fill="none" />
                                </svg>
                                <div className="score-text">
                                    {stats.resumeFeedback.score}
                                </div>
                            </div>
                            <h3 className="section-title text-center">{t('resume_health')}</h3>
                            <div className="gemini-badge">
                                <span>{t('gemini_powered')}</span>
                            </div>
                        </div>

                        {/* 2. INTERACTIVE REVEAL AREA */}
                        <div className="audit-content-area">

                            {/* STATE A: LOCKED / INITIAL */}
                            {!auditVisible && !auditLoading && (
                                <div className="audit-lock-state">
                                    <h4 className="lock-title">{t('optimize_resume_prompt', { role: role })}</h4>
                                    <Button
                                        onClick={handleRunAudit}
                                        className="btn-audit-run"
                                    >
                                        {t('run_audit_btn')}
                                    </Button>
                                    <p className="lock-subtitle">{t('audit_subtitle')}</p>
                                </div>
                            )}

                            {/* STATE B: LOADING */}
                            {auditLoading && (
                                <div className="audit-loading-state">
                                    <div className="spinner text-2xl mb-2">⚡</div>
                                    <h4 className="text-white font-bold">{t('gemini_auditing')}</h4>
                                    <p className="text-sm text-gray-400">{t('comparing_standards')}</p>
                                </div>
                            )}

                            {/* STATE C: REVEALED RESULTS */}
                            {auditVisible && (
                                <div className="audit-details-grid animate-fade-in-up">
                                    {/* COL A: WHAT TO ADD */}
                                    <div className="audit-column-add">
                                        <h4 className="column-header-red">
                                            <span>{t('what_to_add')}</span>
                                            <span className="pill-red">{t('high_impact')}</span>
                                        </h4>
                                        <div className="tags-container">
                                            {(stats.resumeFeedback.missingKeywords || ["Metrics", "Link to Portfolio"]).map((kw, i) => (
                                                <span key={i} className="tag-red">
                                                    + {kw}
                                                </span>
                                            ))}
                                            {(!stats.resumeFeedback.missingKeywords || stats.resumeFeedback.missingKeywords.length === 0) && (
                                                <span className="text-sm text-gray-500">{t('no_major_keywords_missing')}</span>
                                            )}
                                        </div>

                                        <h4 className="column-header-green mt-6">{t('identified_strengths')}</h4>
                                        <ul className="list-green">
                                            {stats.resumeFeedback.strengths?.slice(0, 3).map((str, i) => (
                                                <li key={i} className="list-item-green">
                                                    <span className="icon-green">✓</span> {str}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* COL B: HOW TO OPTIMIZE */}
                                    <div className="audit-column-update">
                                        <h4 className="column-header-yellow">{t('how_to_optimize')}</h4>
                                        <div className="action-cards-container">
                                            {(stats.resumeFeedback.actionableFeedback || stats.resumeFeedback.improvements || []).map((item, i) => {
                                                const tip = typeof item === 'string' ? item : item.tip;
                                                const type = typeof item === 'string' ? 'general' : item.type;
                                                return (
                                                    <div key={i} className="action-card-mini">
                                                        <div className="action-icon">
                                                            {type === 'content' ? '📝' : type === 'format' ? '🎨' : '💡'}
                                                        </div>
                                                        <div>
                                                            <p className="action-text">{tip}</p>
                                                            <span className="action-badge">
                                                                {type === 'content' ? t('content_quality_badge') : type === 'format' ? t('formatting_badge') : t('suggestion_badge')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Row 2: Main Content */}
                <div className="bento-card focus-card">
                    <div className="bento-card-title">
                        <span>{t('priority_actions')}</span>
                    </div>
                    <div className="focus-list">
                        {stats.critical.map((gap, i) => {
                            // Handle both string gaps (old fallback) and object gaps (new AI)
                            const isObj = typeof gap === 'object';
                            const name = isObj ? gap.skill : gap;
                            const aiUrl = isObj ? gap.learningUrl : null;
                            const aiSource = isObj ? gap.sourceName : null;

                            const resolved = getSafeLink(name, aiUrl);
                            const label = (aiSource && resolved.url === aiUrl) ? aiSource : resolved.label;

                            return (
                                <a
                                    key={i}
                                    href={resolved.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="action-item"
                                >
                                    <div className="action-title">{t('master_skill', { name: name })}</div>
                                    <div className="action-meta">
                                        <span className="action-desc">{t('high_priority_gap')}</span>
                                        <span className="action-pill">
                                            {label} ↗
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                        {stats.critical.length === 0 && (
                            <div className="text-center text-gray-500 py-4">{t('profile_strong')}</div>
                        )}
                    </div>
                </div>

                {/* Row 2: Main Content */}
                <div className="bento-card skill-card">
                    <div className="bento-card-title">
                        <span>{t('competency_breakdown')}</span>
                        <span className="text-xs font-normal normal-case ml-auto text-gray-500">{t('tap_to_learn')}</span>
                    </div>
                    <div className="skill-list-neat">
                        {Object.entries(stats.skills).map(([skill, val]) => {
                            const link = getSafeLink(skill);
                            const barColor = getColor(val);
                            return (
                                <a
                                    key={skill}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="skill-row-link"
                                    title={`Learn ${skill} from ${link.label}`}
                                >
                                    <div className="skill-name-neat">{skill}</div>
                                    <div className="skill-track-neat">
                                        <div
                                            className="skill-fill-neat"
                                            style={{ width: `${val}%`, backgroundColor: barColor, boxShadow: `0 0 10px ${barColor}40` }}
                                        />
                                    </div>
                                    <div className="skill-score-neat" style={{ color: barColor }}>{val}%</div>
                                    <div className="skill-arrow">↗</div>
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Row 2.5: Detailed Missing Skills Breakdown (NEW) */}
                <div className="bento-card missing-skills-card">
                    <div className="bento-card-title">
                        <span>{t('missing_skills_analysis')}</span>
                    </div>
                    <div className="missing-skills-grid">
                        {/* Technical */}
                        <div className="missing-category">
                            <h4 className="category-title text-red-400">{t('technical_missing')}</h4>
                            <div className="missing-tags">
                                {(results?.missing || []).filter(s => s.type === 'technical').length > 0 ? (
                                    (results?.missing || []).filter(s => s.type === 'technical').map((s, i) => {
                                        const link = getSafeLink(s.name);
                                        return (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="missing-tag-pill border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer no-underline"
                                                title={`Learn ${s.name}`}
                                            >
                                                {s.name} ↗
                                            </a>
                                        );
                                    })
                                ) : <span className="text-sm text-gray-500">{t('no_missing_skills')}</span>}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        <div className="missing-category">
                            <h4 className="category-title text-amber-400">{t('soft_missing')}</h4>
                            <div className="missing-tags">
                                {(results?.missing || []).filter(s => s.type === 'soft').length > 0 ? (
                                    (results?.missing || []).filter(s => s.type === 'soft').map((s, i) => {
                                        const link = getSafeLink(s.name);
                                        return (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="missing-tag-pill border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer no-underline"
                                                title={`Learn ${s.name}`}
                                            >
                                                {s.name} ↗
                                            </a>
                                        );
                                    })
                                ) : <span className="text-sm text-gray-500">{t('no_missing_skills')}</span>}
                            </div>
                        </div>

                        {/* Professional / Non-Technical */}
                        <div className="missing-category">
                            <h4 className="category-title text-blue-400">{t('professional_missing')}</h4>
                            <div className="missing-tags">
                                {(results?.missing || []).filter(s => s.type === 'professional').length > 0 ? (
                                    (results?.missing || []).filter(s => s.type === 'professional').map((s, i) => {
                                        const link = getSafeLink(s.name);
                                        return (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="missing-tag-pill border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer no-underline"
                                                title={`Learn ${s.name}`}
                                            >
                                                {s.name} ↗
                                            </a>
                                        );
                                    })
                                ) : <span className="text-sm text-gray-500">{t('no_missing_skills')}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Deep Learn Roadmap */}
                <div className="bento-card roadmap-card-wide">
                    <div className="bento-card-title">
                        <span>{t('personalized_roadmap')}</span>
                    </div>

                    <div className="roadmap-header-advisor">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">{t('gemini_advisor')}</span> {stats.gapSummary}
                    </div>

                    <div className="roadmap-steps-container">
                        {stats.roadmap.map((step, i) => (
                            <div key={i} className="roadmap-step-card-detailed" style={{ animationDelay: `${i * 0.15}s` }}>
                                <span className="step-badge">{t('step_label', { number: i + 1 })}</span>
                                <h3 className="step-main-title">{step.title}</h3>
                                <div className="step-duration-icon">
                                    <span>{t('est_time', { duration: step.duration })}</span>
                                </div>

                                {step.tasks && step.tasks.length > 0 && (
                                    <div className="step-tasks-list">
                                        {step.tasks.slice(0, 3).map((task, k) => (
                                            <div key={k} className="task-item">
                                                <div className="task-bullet"></div>
                                                <span>{task}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
