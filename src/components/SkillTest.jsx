import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import './SkillTest.css';

export default function SkillTest({ questions, onComplete }) {
    const { t } = useTranslation();
    // Flatten questions into a single array
    const allQuestions = useMemo(() => {
        const flat = [];
        Object.entries(questions).forEach(([skill, skillQuestions]) => {
            skillQuestions.forEach(q => {
                flat.push({ ...q, skill });
            });
        });
        return flat;
    }, [questions]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const currentQuestion = allQuestions[currentIndex];
    const progress = ((currentIndex + 1) / allQuestions.length) * 100;

    const handleAnswer = (optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.skill]: {
                ...(prev[currentQuestion.skill] || {}),
                [currentQuestion.id]: optionIndex
            }
        }));
    };

    const handleNext = () => {
        if (currentIndex < allQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(answers);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const isCurrentAnswered = answers[currentQuestion?.skill]?.[currentQuestion?.id] !== undefined;

    if (!currentQuestion) return <div>{t('loading_questions')}</div>;

    return (
        <div className="skill-test-container">
            <div className="test-progress">
                <span>{t('question_progress', { current: currentIndex + 1, total: allQuestions.length })}</span>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span>{Math.round(progress)}%</span>
            </div>

            <div className="question-card">
                <div className="question-header">
                    <div className="question-tags">
                        <span className="skill-tag">{currentQuestion.skill}</span>
                    </div>
                    <div className="ai-badge">
                        {t('collaborating_gemini')}
                    </div>
                </div>

                <h3 className="question-text">{currentQuestion.text}</h3>

                {currentQuestion.codeSnippet && (
                    <div className="code-snippet-container">
                        <pre><code>{currentQuestion.codeSnippet}</code></pre>
                    </div>
                )}

                <div className="options-grid">
                    {currentQuestion.options.map((opt, idx) => {
                        const isSelected = answers[currentQuestion.skill]?.[currentQuestion.id] === idx;
                        return (
                            <button
                                key={idx}
                                className={`option-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleAnswer(idx)}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="nav-buttons">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    {t('prev_btn')}
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!isCurrentAnswered}
                >
                    {currentIndex === allQuestions.length - 1 ? t('submit_test_btn') : t('next_btn')}
                </Button>
            </div>
        </div>
    );
}
