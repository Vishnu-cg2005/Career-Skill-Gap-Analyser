import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import Button from '../components/Button';
import ResumeUpload from '../components/ResumeUpload';
import SkillTest from '../components/SkillTest';
import { api } from '../services/api';
import './AnalyzePage.css';
import { GLOBAL_ROLES } from '../data/roles';
import { Search } from 'lucide-react';
import { getSafeLink } from '../utils/skillUtils';

export default function AnalyzePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [step, setStep] = useState('upload'); // upload, review, test
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [extractedSkills, setExtractedSkills] = useState([]);
    const [missingSkills, setMissingSkills] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);

    React.useEffect(() => {
        const key = api.getApiKey();
        if (!key) {
            setApiKeyMissing(true);
        }
    }, []);


    // Derived State for Filtering
    const filteredRoles = searchQuery
        ? GLOBAL_ROLES.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : GLOBAL_ROLES.slice(0, 8); // Show popular 8 by default

    const isCustomRole = searchQuery && filteredRoles.length === 0;

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        // smooth scroll to upload if needed, or just highlight
    };

    const handleCustomRole = () => {
        const custom = { id: 'custom', name: searchQuery, icon: '✨', category: 'Custom' };
        setSelectedRole(custom);
    };

    const [readiness, setReadiness] = useState(null);
    const [resumeAnalysis, setResumeAnalysis] = useState(null); // Store full analysis including resumeFeedback

    const handleUploadComplete = async (file) => {
        if (!selectedRole) {
            alert("Please select a target role first!");
            return;
        }
        setLoading(true);
        try {
            // Capture FULL response including resumeFeedback, extracted, missing, etc.
            // CAUTION: We now send selectedRole.name (Full description) instead of ID to give AI better context.
            const fullAnalysis = await api.uploadResume(file, selectedRole.name);
            setResumeAnalysis(fullAnalysis);

            setResumeAnalysis(fullAnalysis);

            setExtractedSkills(fullAnalysis.extracted || []);
            setMissingSkills(fullAnalysis.missing || []);
            setReadiness({ level: fullAnalysis.readinessLevel || "Unknown", summary: fullAnalysis.gapSummary || "Analysis completed." });
            setStep('review');
        } catch (error) {
            console.error('Upload failed', error);
            alert("Analysis failed. Please try again. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of code) ...

    {/* Review Step */ }


    const startTest = async () => {
        setLoading(true);
        try {
            const quiz = await api.getQuestions(extractedSkills, selectedRole?.name);
            setQuestions(quiz);
            setStep('test');
        } catch (error) {
            console.error('Failed to get questions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestComplete = async (answers) => {
        setLoading(true);
        try {
            const testResults = await api.submitTest(answers, extractedSkills, selectedRole.name, questions);
            // Merge the initial Resume Feedback into the final Test Results
            const finalResults = {
                ...testResults,
                missing: missingSkills, // Persist from analysis step
                extracted: extractedSkills, // Persist from analysis step
                resumeFeedback: resumeAnalysis?.resumeFeedback || testResults.resumeFeedback
            };
            navigate('/results', { state: { results: finalResults, role: selectedRole.name } });
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analyze-page-wrapper">
            {step === 'upload' && (
                <>
                    <div className="analyze-header">
                        <h1 className="analyze-title">{t('find_your_missing_skills')}</h1>
                        <p className="analyze-subtitle">{t('analyze_subtitle')}</p>
                    </div>

                    <div className="role-search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            className="role-search-input"
                            placeholder={t('search_your_dream_role')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="section-label">
                        {searchQuery ? t('search_results') : t('popular_roles')}
                    </div>

                    <div className="role-grid-dynamic">
                        {filteredRoles.map((r, idx) => (
                            <div
                                key={r.id}
                                className={`role-card-compact ${selectedRole?.id === r.id ? 'selected' : ''}`}
                                onClick={() => handleRoleSelect(r)}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <span className="role-icon-small">{r.icon}</span>
                                <div className="role-info">
                                    <span className="role-name-small">{r.name}</span>
                                    <span className="role-category">{r.category}</span>
                                </div>
                            </div>
                        ))}

                        {isCustomRole && (
                            <div
                                className={`custom-role-prompt ${selectedRole?.name === searchQuery ? 'border-blue-500 bg-blue-50' : ''}`}
                                onClick={handleCustomRole}
                            >
                                <p className="font-semibold text-blue-600">
                                    {t('use_custom_role', { role: searchQuery })}
                                </p>
                                <p className="text-xs text-muted">{t('set_custom_role')}</p>
                            </div>
                        )}
                    </div>

                    <div className={`transition-all duration-500 ${selectedRole ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                        <div className="section-label">{t('upload_resume_step')}</div>
                        <div className="resume-section">
                            <ResumeUpload onUploadComplete={handleUploadComplete} />
                        </div>
                    </div>
                </>
            )}

            {/* Review and Test steps remain visually similar but using new styles */}
            {step === 'review' && (
                <div className="review-card fade-in-up">
                    {/* AI ERROR WARNING */}
                    {(resumeAnalysis?.aiError || apiKeyMissing) && (
                        <div className="bg-amber-900/40 border border-amber-500/50 text-amber-200 px-4 py-3 rounded-lg mb-6 flex items-start animate-fade-in-up">
                            <span className="text-xl mr-3">⚠️</span>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">
                                    {apiKeyMissing ? "Missing API Key" : "AI Engine Offline"}
                                </h4>
                                <p className="text-sm opacity-90">
                                    {apiKeyMissing ? "Please add your Gemini API Key in Settings to enable AI analysis." : resumeAnalysis.aiError}. <br />
                                    <span className="text-xs opacity-75">Analysis was completed using basic keyword matching.</span>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="text-green-400">✅</span> Analysis: {readiness?.level || "Completed"}
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {readiness?.summary || `Deep analysis against ${selectedRole?.name}.`}
                            </p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">{t('match_confidence')}</span>
                            <span className="text-2xl font-bold text-blue-400">{t('high')}</span>
                        </div>
                    </div>

                    <p className="text-gray-300 mb-6 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-sm">
                        ℹ️ <Trans i18nKey="insight_text" values={{ count: extractedSkills.length, gapCount: missingSkills.length, category: selectedRole?.category }} components={{ 1: <strong className="text-white" />, 3: <strong className="text-orange-300" /> }} />
                    </p>

                    <div className="skills-breakdown-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Technical */}
                        <div className="skill-category-card tech-card">
                            <h3 className="category-title text-blue-400">{t('tech_skills')}</h3>
                            <div className="skill-list">
                                {extractedSkills.filter(s => s.type === 'technical').map(skill => {
                                    const link = getSafeLink(skill.name);
                                    return (
                                        <a href={link.url} target="_blank" rel="noreferrer" key={skill.id} className="skill-badge tech-badge hover:opacity-80 transition-opacity" title={`Learn ${skill.name}`}>{skill.name}</a>
                                    );
                                })}
                                {extractedSkills.filter(s => s.type === 'technical').length === 0 && <span className="text-xs text-gray-500">{t('none_detected')}</span>}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        <div className="skill-category-card soft-card">
                            <h3 className="category-title text-purple-400">{t('soft_skills')}</h3>
                            <div className="skill-list">
                                {extractedSkills.filter(s => s.type === 'soft').map(skill => {
                                    const link = getSafeLink(skill.name);
                                    return (
                                        <a href={link.url} target="_blank" rel="noreferrer" key={skill.id} className="skill-badge soft-badge hover:opacity-80 transition-opacity" title={`Learn ${skill.name}`}>{skill.name}</a>
                                    );
                                })}
                                {extractedSkills.filter(s => s.type === 'soft').length === 0 && <span className="text-xs text-gray-500">{t('none_detected')}</span>}
                            </div>
                        </div>

                        {/* Professional Skills - NEW */}
                        <div className="skill-category-card professional-card bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                            <h3 className="category-title text-emerald-400 font-bold mb-3 text-sm uppercase tracking-wide">
                                {t('prof_skills')}
                            </h3>
                            <div className="skill-list flex flex-wrap gap-2">
                                {extractedSkills.filter(s => s.type === 'professional').length > 0 ? (
                                    extractedSkills.filter(s => s.type === 'professional').map(skill => {
                                        const link = getSafeLink(skill.name);
                                        return (
                                            <a href={link.url} target="_blank" rel="noreferrer" key={skill.id} className="skill-badge border border-emerald-500/30 text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded text-xs hover:bg-emerald-500/20 transition-colors" title={`Learn ${skill.name}`}>
                                                {skill.name}
                                            </a>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-gray-500 italic">{t('no_prof_skills')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Missing Skills Section - REVIEW STEP (Always Visible) */}
                    <div className="missing-skills-section mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold mb-4 text-orange-400 flex items-center justify-center gap-2">
                            {(!missingSkills || missingSkills.length === 0) ? '✅ No Major Gaps Detected' : `⚠️ ${t('recommended_additions')}`}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Missing Tech */}
                            <div className="missing-card bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-red-300 mb-2 uppercase tracking-wide text-center">{t('missing_tech')}</h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {missingSkills.filter(s => s.type === 'technical').length > 0 ? (
                                        missingSkills.filter(s => s.type === 'technical').map(skill => {
                                            const link = getSafeLink(skill.name);
                                            return (
                                                <a href={link.url} target="_blank" rel="noreferrer" key={skill.id} className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 transition-colors cursor-pointer" title={`Learn ${skill.name}`}>
                                                    + {skill.name}
                                                </a>
                                            );
                                        })
                                    ) : <span className="text-xs text-gray-500 italic">{t('none_missing')}</span>}
                                </div>
                            </div>
                            {/* Missing Soft */}
                            <div className="missing-card bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-amber-300 mb-2 uppercase tracking-wide text-center">{t('missing_soft')}</h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {missingSkills.filter(s => s.type === 'soft').length > 0 ? (
                                        missingSkills.filter(s => s.type === 'soft').map(skill => {
                                            const link = getSafeLink(skill.name);
                                            return (
                                                <a href={link.url} target="_blank" rel="noreferrer" key={skill.id} className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-pointer" title={`Learn ${skill.name}`}>
                                                    + {skill.name}
                                                </a>
                                            );
                                        })
                                    ) : <span className="text-xs text-gray-500 italic">{t('none_missing')}</span>}
                                </div>
                            </div>
                            {/* Missing Professional (New) */}
                            <div className="missing-card bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wide text-center">{t('professional_missing')}</h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {missingSkills.filter(s => s.type === 'professional').length > 0 ? (
                                        missingSkills.filter(s => s.type === 'professional').map(skill => {
                                            const link = getSafeLink(skill.name);
                                            return (
                                                <a href={link.url} target="_blank" rel="noreferrer" key={skill.id} className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-200 border border-blue-500/30 hover:bg-blue-500/30 transition-colors cursor-pointer" title={`Learn ${skill.name}`}>
                                                    + {skill.name}
                                                </a>
                                            );
                                        })
                                    ) : <span className="text-xs text-gray-500 italic">{t('none_missing')}</span>}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="assessment-prompt-section mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold mb-3 text-white">
                            {t('verify_skills_title')}
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                            <Trans i18nKey="verify_skills_desc" components={{ 1: <strong /> }} />
                        </p>

                        <div className="flex gap-4 justify-center">


                            <Button
                                onClick={startTest}
                                size="large"
                                className="shadow-lg transition-all hover:shadow-xl hover:scale-105"
                                isLoading={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-pulse">✨</span> {t('generating_questions')}
                                    </span>
                                ) : (
                                    t('start_skill_assessment')
                                )}
                            </Button>
                        </div>

                        {loading && (
                            <p className="text-sm text-center text-purple-400 mt-4 animate-pulse font-medium">
                                {t('gemini_crafting')}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {step === 'test' && (
                <div className="w-full max-w-3xl mx-auto">
                    <SkillTest
                        questions={questions}
                        onComplete={handleTestComplete}
                    />
                </div>
            )}
        </div>
    );
}
