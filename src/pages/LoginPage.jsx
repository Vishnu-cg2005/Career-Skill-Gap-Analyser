import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import './AuthLayout.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            await api.login(formData.email, formData.password);
            navigate('/analyze');
        } catch (err) {
            setNotification({ msg: 'Invalid credentials. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-glass-card">
                <div className="auth-header">
                    <div className="auth-logo">👋</div>
                    <h1 className="auth-title">{t('auth_welcome_back')}</h1>
                    <p className="auth-subtitle">{t('auth_sign_in_subtitle')}</p>
                </div>

                {/* Notification Area */}
                {notification && (
                    <div className={`auth-toast ${notification.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}`}>
                        {notification.type === 'error' ? '⚠️' : '✅'} {notification.msg}
                    </div>
                )}

                <form className="auth-form-content" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <input
                            className="auth-input"
                            type="email"
                            placeholder=" "
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <label className="auth-label">{t('auth_email')}</label>
                    </div>

                    <div className="auth-input-group">
                        <input
                            className="auth-input"
                            type="password"
                            placeholder=" "
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <label className="auth-label">{t('auth_password')}</label>
                    </div>

                    <button className="auth-btn auth-btn-primary" type="submit" disabled={loading}>
                        {loading ? t('auth_signing_in') : t('auth_sign_in_btn')}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-slate-400 text-sm">
                            {t('auth_no_account')} <Link to="/signup" className="text-blue-400 font-bold hover:text-blue-300 no-underline">{t('auth_create_account')}</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
