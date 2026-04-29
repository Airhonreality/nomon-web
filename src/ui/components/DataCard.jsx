import React from 'react';

/**
 * 🗃️ DATA CARD (Agnostic Projection)
 */
export const DataCard = ({ definition }) => {
    // Normalización de Metadatos
    const meta = definition.meta || definition.metadata || {};
    const content = definition.data?.content || {};
    
    const type = meta.component_type || meta.type || 'MATERIA';
    const title = content.title?.es || content.title || 'Sin Título';
    const summary = content.summary?.es || content.summary || content.subtitle?.es || '';
    const image = content.image || meta.image;

    const handleNavigate = () => {
        if (window.Router && definition.slug) {
            window.Router.navigate(`/proyectos/${definition.slug}`);
        }
    };

    return (
        <article className="data-card" onClick={handleNavigate}>
            {image ? (
                <img src={image} className="card-image-placeholder" alt={title} />
            ) : (
                <div className="card-image-placeholder"></div>
            )}
            <div className="card-label">{type}</div>
            <h3 className="card-title">{title}</h3>
            {summary && <p className="card-summary">{summary}</p>}
        </article>
    );
};
