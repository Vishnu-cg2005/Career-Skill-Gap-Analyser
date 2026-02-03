import React from 'react';
import './Card.css';

export default function Card({ children, className = '', title }) {
    return (
        <div className={`card ${className}`}>
            {title && <div className="card-header">{title}</div>}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}
