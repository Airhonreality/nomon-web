import React from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { BookOpen, ArrowRight, Info, Minus, Lock } from 'lucide-react';


/**
 * 🕸️ MATERIA RELATIONS ACTOR
 * Proyecta la red de conocimiento vinculada a una entidad.
 */
export const MateriaRelations = ({ relations }) => {
    const { state } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    const [userHash, setUserHash] = React.useState(state.identity?.user?.payload?.email_hash || '');
    const [expandedBlocks, setExpandedBlocks] = React.useState({});

    const toggleBlock = (id) => {
        setExpandedBlocks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Helper de SHA-256 nativo
    const calcSha256 = async (message) => {
        const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Sincronizar el hash del usuario si no está en el payload
    React.useEffect(() => {
        const syncHash = async () => {
            if (state.identity?.isLoggedIn && state.identity?.user?.payload?.email && !userHash) {
                const hash = await calcSha256(state.identity.user.payload.email);
                setUserHash(hash);
            }
        };
        syncHash();
    }, [state.identity?.isLoggedIn, state.identity?.user?.payload?.email]);

    if (!relations || relations.length === 0) return null;

    // Resolvemos los datos de las resonancias buscando en el inventario remoto
    const linkedMatter = relations.map(slug => {
        return entries?.find(m => m.slug === slug);
    }).filter(m => !!m);

    if (linkedMatter.length === 0) return null;

    return (
        <section className="materia-relations">
            {linkedMatter.length > 1 && <h4 className="relations-label">RESONANCIAS VINCULADAS</h4>}
            <div className="relations-grid">
                {linkedMatter.map((m, i) => {
                    const isLibrary = m.meta?.component_type === 'LIBRARY_RESOURCE';
                    const access = m.data?.access_control || { strategy: 'PUBLIC' };
                    
                    // Verificación de acceso para la tarjeta
                    const checkAccess = () => {
                        if (access.strategy === 'PUBLIC') return true;
                        if (!state.identity?.isLoggedIn) return false;
                        if (access.strategy === 'REGISTERED_ONLY') return true;
                        if (access.strategy === 'REFERENCE_WHITELIST') {
                            const currentHash = state.identity?.user?.payload?.email_hash || userHash;
                            const whitelistNode = (entries || []).find(w => w.slug === access.whitelist_slug);
                            return whitelistNode?.data?.whitelist?.includes(currentHash);
                        }
                        return false;
                    };

                    const hasAccess = checkAccess();

                    if (isLibrary) {
                        const content = m.data?.content || {};
                        const meta = m.metadata || {};
                        const isExpanded = expandedBlocks[m.slug || i];

                        return (
                            <div key={i} className={`comp-library-resource premium-resonance ${!hasAccess ? 'locked-node' : ''}`} style={{ position: 'relative', opacity: hasAccess ? 1 : 0.7 }}>
                                <div className="lib-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {hasAccess ? <BookOpen size={12} /> : <Lock size={12} />} 
                                    {hasAccess ? 'BIBLIOTECA' : 'NODO RESTRINGIDO'}
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                                    <h3 className="lib-title" style={{ opacity: hasAccess ? 1 : 0.5 }}>{content.title?.es || m.slug}</h3>
                                    {hasAccess && (
                                        <button 
                                            type="button"
                                            onClick={() => toggleBlock(m.slug || i)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isExpanded ? '#000' : '#ccc', padding: '0.5rem', transition: 'all 0.3s ease' }}
                                        >
                                            {isExpanded ? <Minus size={18} strokeWidth={2.5} /> : <Info size={18} strokeWidth={2.5} />}
                                        </button>
                                    )}
                                </div>
                                
                                {isExpanded && hasAccess && (
                                    <div className="lib-curation animate-fade-in" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#555', borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {meta.author && <p style={{ margin: 0 }}><b>Autor:</b> {meta.author}</p>}
                                        {meta.year && <p style={{ margin: 0 }}><b>Año:</b> {meta.year}</p>}
                                        {meta.editorial && <p style={{ margin: 0 }}><b>Origen:</b> {meta.editorial}</p>}
                                        {meta.license && <p style={{ margin: 0 }}><b>Licencia:</b> {meta.license}</p>}
                                        {meta.rationale && <p style={{ gridColumn: 'span 2', marginTop: '0.5rem', fontStyle: 'italic', borderLeft: '2px solid #eee', paddingLeft: '1rem' }}>"{meta.rationale}"</p>}
                                    </div>
                                )}

                                {hasAccess ? (
                                    <button 
                                        className="lib-read-btn" 
                                        onClick={() => window.location.hash = `/biblioteca/${m.slug}?url=${encodeURIComponent(content.pdf_url || "")}`}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                                    >
                                        ACCEDER AL CONOCIMIENTO DIGITAL <ArrowRight size={16} strokeWidth={2} />
                                    </button>
                                ) : (
                                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.05)', textAlign: 'center', fontSize: '0.7rem', fontWeight: 900, color: '#888', letterSpacing: '0.1em' }}>
                                        ACCESO RESTRINGIDO POR SOBERANÍA
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div key={i} className="mini-resonance-card" 
                             onClick={() => window.location.hash = `/materia/${m.slug}`}>
                            <div className="mini-card-info">
                                <span className="mini-type">{m.meta?.component_type}</span>
                                <span className="mini-title">{m.data?.content?.title?.es || m.slug}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .materia-relations { margin-top: 5rem; padding-top: 3rem; }
                .premium-resonance { grid-column: 1 / -1; margin-bottom: 2rem; }
                
                .comp-library-resource {
                    padding: 3rem;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    border-left: 0.5rem solid #000;
                }
                .lib-badge { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.2em; color: #999; text-transform: uppercase; }
                .lib-title { font-size: 1.8rem; font-weight: 500; margin: 0; }
                .lib-curation { font-size: 0.9rem; line-height: 1.6; color: #555; border-top: 1px solid #eee; padding-top: 1.5rem; }
                .lib-read-btn {
                    margin-top: 1rem; padding: 1.2rem; background: #000; color: #fff; border: none;
                    font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; cursor: pointer;
                    transition: all 0.3s ease;
                }
                .lib-read-btn:hover { letter-spacing: 0.2em; background: #333; }

                .relations-label { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.3em; color: #bbb; margin-bottom: 2.5rem; text-transform: uppercase; text-align: center; }
                .relations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: 1.5rem; }
                .mini-resonance-card { padding: 2rem; background: #fff; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; transition: all 0.5s ease; }
                .mini-resonance-card:hover { border-color: #000; transform: translateY(-0.3rem); }
                .mini-type { display: block; font-size: 0.55rem; font-weight: 900; letter-spacing: 0.15em; margin-bottom: 0.8rem; color: #999; text-transform: uppercase; }
                .mini-title { font-size: 1.1rem; font-weight: 500; color: #222; }
            `}} />
        </section>
    );
};
