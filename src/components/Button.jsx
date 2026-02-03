import React from 'react';
import './Button.css';

/**
 * Button Component
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} props.variant
 * @param {string} props.className
 * @param {boolean} props.isLoading
 */
export default function Button({
    children,
    variant = 'primary',
    className = '',
    isLoading,
    disabled,
    ...props
}) {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="spinner"></span> : children}
        </button>
    );
}
