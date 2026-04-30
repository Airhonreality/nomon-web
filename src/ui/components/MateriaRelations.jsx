import React from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 🕸️ MATERIA RELATIONS ACTOR
 * Proyecta la red de conocimiento vinculada a una entidad.
 */
export const MateriaRelations = ({ relations }) => {
    const { state } = useSovereign();
    
    if (!relations || relations.length === 0) return null;

    // Resolvemos los datos de las resonancias
    const linkedMatter = relations.map(slug => {
        return state.inventory?.find(m => m.slug === slug) || 
               state.NOMON_ENTRIES?.find(m => m.slug === slug);
    }).filter(m => !!m);

    if (linkedMatter.length === 0) return null;

    return (
        <section className="materia-relations">
            <h4 className="relations-label">RESONANCIAS VINCULADAS</h4>
            <div className="relations-grid">
                {linkedMatter.map((m, i) => {
                    const isLibrary = m.meta?.component_type === 'LIBRARY_RESOURCE';
                    return (
                        <div key={i} className={`mini-resonance-card ${isLibrary ? 'res-library' : ''}`} 
                             onClick={() => window.location.hash = isLibrary ? `/biblioteca/${m.slug}` : `/materia/${m.slug}`}>
                            <div className="mini-card-info">
                                <span className="mini-type">{isLibrary ? '📖 BIBLIOTECA' : m.meta?.component_type}</span>
                                <span className="mini-title">{m.data?.content?.title?.es || m.slug}</span>
                                {isLibrary && <span className="mini-action">LEER AHORA →</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .materia-relations {
                    margin-top: 5rem;
                    padding-top: 3rem;
                    border-top: 1px solid rgba(0,0,0,0.05);
                }
                .relations-label {
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.3em;
                    color: #bbb;
                    margin-bottom: 2.5rem;
                    text-transform: uppercase;
                    text-align: center;
                }
                .relations-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
                    gap: 1.5rem;
                }
                .mini-resonance-card {
                    padding: 2rem;
                    background: #fff;
                    border: 0.05rem solid rgba(0,0,0,0.1);
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                    position: relative;
                    overflow: hidden;
                }
                .mini-resonance-card:hover {
                    border-color: #000;
                    transform: translateY(-0.5rem);
                    box-shadow: 0 1rem 2rem rgba(0,0,0,0.08);
                }
                .res-library {
                    border-left: 0.25rem solid #000;
                }
                .mini-type {
                    display: block;
                    font-size: 0.55rem;
                    font-weight: 900;
                    letter-spacing: 0.15em;
                    margin-bottom: 0.8rem;
                    color: #999;
                    text-transform: uppercase;
                }
                .mini-title {
                    font-size: 1.1rem;
                    font-weight: 500;
                    line-height: 1.2;
                    color: #222;
                    display: block;
                }
                .mini-action {
                    display: block;
                    margin-top: 1.2rem;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.05em;
                    color: #000;
                }
            `}} />
        </section>
    );
};
