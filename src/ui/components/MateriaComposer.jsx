import React from 'react';
import { MateriaRelations } from './MateriaRelations.jsx';

/**
 * 🎨 MATERIA COMPOSER ACTOR
 * Interpreta y proyecta la secuencia lineal de bloques de una entidad.
 */
export const MateriaComposer = ({ composition, slug }) => {
    const [expandedBlocks, setExpandedBlocks] = React.useState({});

    const toggleBlock = (id) => {
        setExpandedBlocks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!composition || composition.length === 0) return null;

    const safeStr = (val) => {
        if (typeof val === 'object' && val !== null) return val.es || val.en || '';
        return val || '';
    };

    return (
        <div className="materia-composition-lane">
            {composition.map((block, i) => {
                switch (block.type) {
                    case 'TITLE':
                        return <h2 key={block.id || i} className="comp-title">{safeStr(block.content)}</h2>;
                    
                    case 'MARKDOWN':
                        return (
                            <div key={block.id || i} className="comp-markdown" 
                                 dangerouslySetInnerHTML={{ __html: safeStr(block.content) }} />
                        );

                    case 'IMAGE':
                        return (
                            <div key={block.id || i} className="comp-gallery">
                                {block.images?.map((img, idx) => (
                                    img && <img key={idx} src={img} alt={`Materia ${idx}`} className="comp-img" />
                                ))}
                            </div>
                        );

                    case 'RESONANCE':
                        return <MateriaRelations key={block.id || i} relations={[block.content]} />;

                    case 'LIBRARY_RESOURCE':
                        const isExpanded = expandedBlocks[block.id || i];
                        const hasMetadata = block.rationale || block.curator;
                        return (
                            <div key={block.id || i} className="comp-library-resource">
                                <div className="lib-badge">{block.resType}</div>
                                <h3 className="lib-title">{safeStr(block.desc) || 'Recurso de Biblioteca'}</h3>
                                
                                {hasMetadata && (
                                    <div className="materia-disclosure" onClick={() => toggleBlock(block.id || i)}>
                                        <div className={`disclosure-line ${isExpanded ? 'active' : ''}`}></div>
                                        <span className="disclosure-label">{isExpanded ? 'MENOS' : 'INFO'}</span>
                                    </div>
                                )}

                                {isExpanded && hasMetadata && (
                                    <div className="lib-curation animate-fade-in">
                                        {block.rationale && <p><b>Por qué NOMON:</b> {safeStr(block.rationale)}</p>}
                                        {block.curator && <span><b>Curado por:</b> {safeStr(block.curator)}</span>}
                                    </div>
                                )}

                                <button 
                                    className="lib-read-btn" 
                                    onClick={() => {
                                        const safeUrl = encodeURIComponent(block.url || "");
                                        window.location.hash = `/biblioteca/${slug}?url=${safeUrl}`;
                                    }}
                                >
                                    ACCEDER AL CONOCIMIENTO DIGITAL →
                                </button>
                            </div>
                        );

                    default:
                        return null;
                }
            })}

            <style dangerouslySetInnerHTML={{ __html: `
                .materia-composition-lane {
                    display: flex;
                    flex-direction: column;
                    gap: 5rem;
                    margin: 4rem auto;
                    max-width: 90%;
                }

                .comp-library-resource {
                    padding: 3rem;
                    background: #fdfdfd;
                    border: 0.05rem solid rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    border-left: 0.5rem solid #000;
                }

                .lib-badge {
                    font-size: 0.6rem;
                    font-weight: 900;
                    letter-spacing: 0.2em;
                    color: #999;
                }

                .lib-title {
                    font-size: 1.8rem;
                    font-weight: 500;
                    margin: 0;
                }

                /* ⚖️ PATRÓN CANÓNICO: DISCLOSURE */
                .materia-disclosure {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    margin: 1rem 0;
                    user-select: none;
                }

                .disclosure-line {
                    height: 0.1rem;
                    width: 2rem;
                    background: #ccc;
                    transition: all 0.5s ease;
                }

                .disclosure-line.active {
                    width: 4rem;
                    background: #000;
                }

                .disclosure-label {
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    color: #888;
                }

                .materia-disclosure:hover .disclosure-label {
                    color: #000;
                }

                .animate-fade-in {
                    animation: fadeIn 0.5s ease forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(0.5rem); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .lib-curation {
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: #555;
                    border-top: 0.05rem solid #eee;
                    padding-top: 1.5rem;
                }

                .lib-read-btn {
                    margin-top: 1rem;
                    padding: 1.2rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    font-size: 0.75rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .lib-read-btn:hover {
                    letter-spacing: 0.2em;
                    background: #333;
                }

                .comp-title {
                    font-size: 2.5rem;
                    font-weight: 500;
                    letter-spacing: -0.03em;
                    text-transform: uppercase;
                    border-left: 0.35rem solid #000;
                    padding-left: 2rem;
                    margin: 2rem 0;
                }

                .comp-markdown {
                    font-size: 1.2rem;
                    line-height: 1.7;
                    color: #333;
                    max-width: 90%;
                    margin: 0 auto;
                }

                .comp-gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
                    gap: 1rem;
                    width: 100%;
                }

                .comp-img {
                    width: 100%;
                    height: auto;
                    filter: grayscale(100%);
                    transition: filter 0.5s ease;
                }

                .comp-img:hover {
                    filter: grayscale(0%);
                }

                @media (max-width: 768px) {
                    .comp-title { font-size: 1.8rem; }
                    .comp-markdown { font-size: 1.1rem; }
                }
            `}} />
        </div>
    );
};
