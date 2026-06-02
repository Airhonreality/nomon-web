import React from 'react';
import { MateriaRelations } from './MateriaRelations.jsx';
import MDEditor from '@uiw/react-md-editor';
import { BookOpen, ArrowRight, Info, Minus, Plus, Grid as GridIcon, Image as ImageIcon } from 'lucide-react';
import { DataCard } from './DataCard.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { RadialMindMap } from '../projections/RadialMindMap.jsx';



import { BLOCK_REGISTRY } from '../projections/BlockRegistry.jsx';

/**
 * MATERIA COMPOSER ACTOR
 * Interpreta y proyecta la secuencia lineal de bloques de una entidad.
 */
export const MateriaComposer = ({ composition, slug }) => {
    const { state } = useSovereign();
    const [expandedBlocks, setExpandedBlocks] = React.useState({});

    const toggleBlock = (id) => {
        setExpandedBlocks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!composition || composition.length === 0) return null;

    return (
        <div className="nomon-composition-area">
            {composition.map((block, i) => {
                const span = block.layout?.span || 12;
                const align = block.layout?.align || 'stretch';
                
                // 📡 AUTO-PROYECCIÓN POR REGISTRO
                const BlockActor = BLOCK_REGISTRY[block.type];

                return (
                    <div 
                        key={block.id || i} 
                        className="nomon-block-vessel" 
                        style={{ '--block-span': span, alignItems: align }}
                    >
                        {BlockActor ? (
                            <BlockActor 
                                block={block} 
                                state={state} 
                                slug={slug} 
                                expanded={expandedBlocks[block.id || i]}
                                onToggle={() => toggleBlock(block.id || i)}
                            />
                        ) : (
                            <div className="unknown-block">Materia Desconocida: {block.type}</div>
                        )}
                    </div>
                );
            })}

            <style dangerouslySetInnerHTML={{ __html: `
                .nomon-composition-area {
                    padding: 4rem 2rem;
                }

                .grid-block-title { 
                    font-size: 0.7rem; 
                    font-weight: 900; 
                    letter-spacing: 0.2em; 
                    text-transform: uppercase; 
                    margin-bottom: 2rem; 
                    opacity: 0.4; 
                    border-bottom: 1px solid var(--border-primary);
                    padding-bottom: 1rem;
                }

                .dynamic-grid-layout {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .comp-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .gallery-item img { 
                    width: 100%; 
                    height: 200px; 
                    object-fit: cover; 
                    display: block; 
                    filter: grayscale(1); 
                    transition: all 0.5s ease; 
                }
                
                .gallery-item:hover img { 
                    filter: grayscale(0); 
                    transform: scale(1.05);
                }

                .grid-loading {
                    padding: 3rem;
                    text-align: center;
                    font-size: 0.7rem;
                    letter-spacing: 0.1em;
                    opacity: 0.5;
                }

                .comp-library-resource {
                    padding: 3rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-primary);
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    border-left: 0.5rem solid var(--text-primary);
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
                    background: var(--text-primary);
                }

                .disclosure-label {
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    color: #888;
                }

                .materia-disclosure:hover .disclosure-label {
                    color: var(--text-primary);
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
                    border-top: 1px solid var(--border-primary);
                    padding-top: 1.5rem;
                }

                .lib-read-btn {
                    margin-top: 1rem;
                    padding: 1.2rem;
                    background: var(--text-primary);
                    color: var(--bg-primary);
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
                    border-left: 0.35rem solid var(--text-primary);
                    padding-left: 2rem;
                    margin: 2rem 0;
                }

                .comp-markdown {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: var(--text-primary);
                    width: 100%;
                }

                .comp-markdown .wmde-markdown {
                    background: transparent !important;
                    color: inherit !important;
                    font-family: inherit !important;
                }

                .comp-markdown .wmde-markdown p {
                    margin-bottom: 1.5rem;
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

                .sovereign-action-btn {
                    width: 100%;
                    padding: 2rem;
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    border: none;
                    font-size: 1.2rem;
                    font-weight: 900;
                    letter-spacing: 0.3em;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    text-transform: uppercase;
                }

                .sovereign-action-btn:hover {
                    transform: scale(1.02);
                    letter-spacing: 0.5em;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }

                .comp-hero-logo {
                    padding: 8rem 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .hero-logo-text {
                    font-family: 'Outfit', sans-serif;
                    font-size: 15vw;
                    line-height: 0.8;
                    font-weight: 400;
                    letter-spacing: -0.05em;
                    text-transform: uppercase;
                    margin: 0;
                    color: var(--text-primary);
                }

                .hero-logo-line {
                    width: 60%;
                    height: 0.4rem;
                    background: #3eb4d4; /* El azul de acento de NOMON */
                    margin-top: 2rem;
                }

                @media (min-width: 768px) {
                    .hero-logo-text { font-size: 10rem; }
                    .hero-logo-line { width: 40%; height: 0.6rem; }
                }

                @media (max-width: 768px) {
                    .comp-title { font-size: 1.8rem; }
                    .comp-markdown { font-size: 1.1rem; }
                }
            `}} />
        </div>
    );
};
