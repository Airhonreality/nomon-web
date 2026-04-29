import React from 'react';

/**
 * 🦴 SKELETON (React Version)
 * Proyección de baja fidelidad para estados de transición.
 */
export const Skeleton = ({ type = 'card' }) => {
    return (
        <div className={`skeleton skeleton-${type}`}>
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line subtitle"></div>
            </div>
        </div>
    );
};
