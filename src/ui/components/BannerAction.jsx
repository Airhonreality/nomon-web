import React from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

/**
 * ⚡ BANNER ACTION ACTOR (Landing Style)
 * Proyecta materia de forma expandida con un CTA (Call to Action).
 */
export const BannerAction = ({ definition }) => {
    const targetId = definition?.meta?.materia_id || definition?.slug;
    const { remoteData } = useIndraResonance('NOMON_ENTRIES');

    // Resonancia: Buscamos la materia específica
    const materia = remoteData?.find(item => item.slug === targetId);

    if (!materia) return null; // O un placeholder de carga sutil

    const content = materia.data?.content || {};
    const title = content.title?.es || content.title || materia.name;
    const summary = content.summary?.es || content.summary || "";

    const handleAction = () => {
        window.location.hash = `/materia/${materia.slug}`;
    };

    return (
        <section className="banner-action">
            <div className="banner-action-content">
                <h2 className="banner-action-title">{title}</h2>
                <p className="banner-action-summary">{summary}</p>
                <button className="banner-action-btn" onClick={handleAction}>
                    LEER MÁS <span>→</span>
                </button>
            </div>
        </section>
    );
};
