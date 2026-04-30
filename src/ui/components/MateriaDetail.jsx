import React from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { MateriaRelations } from './MateriaRelations.jsx';
import { MateriaComposer } from './MateriaComposer.jsx';

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

                {/* 🏗️ PROYECTOR DE COMPOSICIÓN LINEAL (Prioridad) */}
                {content.composition?.length > 0 ? (
                    <MateriaComposer composition={content.composition} />
                ) : (
                    <div className="detail-body" dangerouslySetInnerHTML={{ __html: body }} />
                )}

                {/* 📖 BIBLIOTECA CURADA (RECURSOS) */}
                {materia.data?.content?.library?.length > 0 && (
                    <section className="detail-library">
                        <h4 className="relations-label">BIBLIOTECA Y RECURSOS CURADOS</h4>
                        <div className="library-grid">
                            {materia.data.content.library.map((res, i) => (
                                <div key={i} className="library-card">
                                    <div className="lib-badge">{res.type}</div>
                                    <h5>{res.desc || 'Recurso sin título'}</h5>
                                    <div className="lib-curation">
                                        <p><b>Por qué:</b> {res.rationale}</p>
                                        <span><b>Curador:</b> {res.curator}</span>
                                    </div>
                                    <button 
                                        className="read-btn" 
                                        onClick={() => window.location.hash = `/biblioteca/${materia.slug}?res=${i}`}
                                    >
                                        ACCEDER AL RECURSO
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 🕸️ PROYECTOR DE RESONANCIAS */}
                <MateriaRelations relations={materia.data?.relations} />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .detail-library { margin-top: 4rem; }
                .library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
                .library-card { 
                    padding: 2rem; 
                    background: #f9f9f9; 
                    border: 1px solid #eee; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 1rem;
                }
                .lib-badge { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.1em; opacity: 0.5; }
                .library-card h5 { font-size: 1.1rem; margin: 0; line-height: 1.2; }
                .lib-curation { font-size: 0.8rem; color: #666; line-height: 1.4; border-left: 2px solid #000; padding-left: 1rem; }
                .read-btn { 
                    margin-top: 1rem;
                    padding: 0.8rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    font-size: 0.7rem;
                    font-weight: 700;
                    cursor: pointer;
                }
            `}} />
        </article>
    );
};
