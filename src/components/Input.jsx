import React from 'react';
import './Input.css';

export default function Input({ label, error, id, className = '', ...props }) {
    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                id={id}
                className={`input-field ${error ? 'has-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
}
