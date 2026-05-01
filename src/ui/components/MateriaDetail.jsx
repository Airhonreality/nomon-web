import React from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { MateriaRelations } from './MateriaRelations.jsx';
import { MateriaComposer } from './MateriaComposer.jsx';
import { Lock } from 'lucide-react';


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
    const access = materia.data?.access_control || { strategy: 'PUBLIC' };
    const { state } = useSovereign();

    const title = content.title?.es || content.title || materia.name;
    const image = content.image || materia.metadata?.image;

    // 🛡️ VALIDACIÓN DE SOBERANÍA (ACCESO PROFUNDO)
    const isAuthorized = () => {
        if (access.strategy === 'PUBLIC') return true;
        if (!state.identity?.isLoggedIn) return false;
        if (access.strategy === 'REGISTERED_ONLY') return true;
        
        if (access.strategy === 'REFERENCE_WHITELIST') {
            const userHash = state.identity?.user?.payload?.email_hash || '';
            const whitelistNode = remoteData?.find(item => item.slug === access.whitelist_slug);
            
            if (!whitelistNode || !whitelistNode.whitelist) return false;
            
            // Verificamos si el hash del usuario está en la lista soberana
            return whitelistNode.whitelist.includes(userHash);
        }
        return false;
    };

    if (!isAuthorized()) {
        return (
            <section style={{ padding: '5rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                <Lock size={64} strokeWidth={1} style={{ marginBottom: '2rem', opacity: 0.2 }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.1em' }}>{access.restricted_title || 'CONTENIDO RESERVADO'}</h2>

                <div style={{ maxWidth: '30rem', opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.6, margin: '1.5rem 0' }}>
                    {access.restricted_message || 'Esta materia contiene recursos de alta sensibilidad o profundidad técnica. Para proyectarlos, es necesario validar tu identidad soberana.'}
                </div>
                {!state.identity?.isLoggedIn ? (
                    <div id="google-signin-btn-detail"></div>
                ) : (
                    <div style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {access.denied_message || 'Tu identidad no cuenta con los permisos necesarios para este nodo.'}
                    </div>
                )}
            </section>
        );
    }


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

                {/* 🏗️ PROYECTOR DE MATERIA (Tejido Agnóstico Puro) */}
                <div className="materia-content-flow">
                    {/* Visualización de Metadatos de Biblioteca si aplica */}
                    {materia.meta?.component_type === 'LIBRARY_RESOURCE' && (
                        <div className="library-thesaurus-grid">
                            <div className="thesaurus-main">
                                {materia.metadata?.author && <div className="thesaurus-item"><label>AUTOR/A</label><span>{materia.metadata.author}</span></div>}
                                {materia.metadata?.editorial && <div className="thesaurus-item"><label>EDITORIAL</label><span>{materia.metadata.editorial}</span></div>}
                                {materia.metadata?.year && <div className="thesaurus-item"><label>AÑO</label><span>{materia.metadata.year}</span></div>}
                                {materia.metadata?.id_universal && <div className="thesaurus-item"><label>DOI / ISBN</label><span>{materia.metadata.id_universal}</span></div>}
                                {materia.metadata?.license && <div className="thesaurus-item"><label>LICENCIA</label><span>{materia.metadata.license}</span></div>}
                                {materia.metadata?.language && <div className="thesaurus-item"><label>IDIOMA</label><span>{materia.metadata.language}</span></div>}
                            </div>
                            
                            {(materia.metadata?.curator || materia.metadata?.rationale) && (
                                <div className="thesaurus-curation">
                                    {materia.metadata.curator && <p><b>CURADO POR:</b> {materia.metadata.curator}</p>}
                                    {materia.metadata.rationale && <p><b>RAZÓN NOMON:</b> {materia.metadata.rationale}</p>}
                                </div>
                            )}

                            {content.pdf_url && (
                                <button 
                                    className="library-access-btn"
                                    onClick={() => window.location.hash = `/biblioteca/${slug}?url=${encodeURIComponent(content.pdf_url)}`}
                                >
                                    ACCEDER AL CONOCIMIENTO DIGITAL
                                </button>
                            )}
                        </div>
                    )}

                    {content.composition?.length > 0 && (
                        <MateriaComposer 
                            composition={content.composition} 
                            slug={slug} 
                        />
                    )}
                </div>

                {/* 🕸️ PROYECTOR DE RESONANCIAS */}
                <MateriaRelations relations={materia.data?.relations} />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .detail-library { margin-top: 4rem; }
                .library-thesaurus-grid { 
                    margin: 2rem 0 4rem 0; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 2rem; 
                    background: var(--bg-secondary);
                    padding: 3rem;
                    border: 1px solid var(--border-primary);
                }
                .thesaurus-main { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
                    gap: 2rem; 
                }
                .thesaurus-item { display: flex; flexDirection: column; gap: 0.4rem; }
                .thesaurus-item label { font-size: 0.55rem; font-weight: 900; opacity: 0.5; letter-spacing: 0.1em; }
                .thesaurus-item span { font-size: 0.9rem; font-weight: 600; }
                .thesaurus-curation { 
                    padding-top: 2rem; 
                    border-top: 1px solid var(--border-primary); 
                    font-size: 0.9rem; 
                    line-height: 1.6; 
                    color: var(--text-primary);
                }
                .library-access-btn {
                    margin-top: 1rem;
                    padding: 1.5rem;
                    background: var(--accent-color);
                    color: var(--bg-primary);
                    border: none;
                    font-size: 0.75rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .library-access-btn:hover {
                    opacity: 0.8;
                    letter-spacing: 0.2em;
                }
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
