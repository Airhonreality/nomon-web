import React from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

/**
 * 🏛️ MATERIA DETAIL (Expanded View)
 * Proyecta la profundidad total de una entidad.
 */
export const MateriaDetail = ({ params }) => {
    const { slug } = params;
    const { remoteData } = useIndraResonance('NOMON_ENTRIES');

    const materia = remoteData?.find(item => item.slug === slug);

    if (!materia) {
        return (
            <section className="materia-detail-loading">
                <div className="status-message">Buscando materia en el Silo... {slug}</div>
            </section>
        );
    }

    const content = materia.data?.content || {};
    const title = content.title?.es || content.title || materia.name;
    const body = content.body || "";
    const image = content.image || materia.metadata?.image;

    return (
        <article className="materia-detail">
            {image && (
                <div className="detail-hero">
                    <img src={image} alt={title} className="detail-image" />
                </div>
            )}
            
            <div className="detail-container">
                <header className="detail-header">
                    <span className="detail-label">{materia.meta?.component_type || 'Materia'}</span>
                    <h1 className="detail-title">{title}</h1>
                </header>

                <div className="detail-body" dangerouslySetInnerHTML={{ __html: body }}>
                    {/* El cuerpo se renderiza como HTML/Markdown para máxima versatilidad */}
                </div>
            </div>
        </article>
    );
};
