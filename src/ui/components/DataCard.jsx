import React from 'react';

/**
 * 🗃️ DATA CARD (Agnostic Projection)
 */
export const DataCard = ({ definition }) => {
    // Normalización de Metadatos
    const meta = definition.meta || definition.metadata || {};
    const content = definition.data?.content || {};
    
    // Identidad Técnica
    const type = meta.component_type || meta.type || 'MATERIA';
    
    // 🌍 Traducción de Identidad Universal (Labels en Español)
    const typeMap = {
        'ENTITY_NEWS': 'Noticia',
        'ENTITY_PROJECT': 'Proyecto',
        'ENTITY_ALLY': 'Aliado',
        'DATA_CARD': 'Noticia',
        'BANNER_INFO': 'Sección'
    };

    const label = typeMap[type] || 'Materia';

    // 🛡️ BLINDAJE DE RENDERIZADO (Prevenir [object Object])
    const resolveText = (val) => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') return val.es || val.en || Object.values(val)[0] || '';
        return String(val);
    };

    const title = resolveText(content.title) || resolveText(meta.title) || 'Sin Título';
    const summary = resolveText(content.summary) || resolveText(meta.summary) || '';
    const image = content.image || meta.image;

    const handleNavigate = () => {
        if (definition.slug) {
            window.location.hash = `/materia/${definition.slug}`;
        }
    };

    return (
        <article className="data-card" onClick={handleNavigate}>
            {image ? (
                <img src={image} className="card-image-placeholder" alt={title} />
            ) : (
                <div className="card-image-placeholder"></div>
            )}
            <div className="card-label">{label}</div>
            <h3 className="card-title">{title}</h3>
            {summary && <p className="card-summary">{summary}</p>}
        </article>
    );
};
