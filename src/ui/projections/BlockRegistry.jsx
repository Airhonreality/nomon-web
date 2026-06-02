import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { BookOpen, ArrowRight, Info, Minus } from 'lucide-react';
import { MateriaRelations } from '../components/MateriaRelations.jsx';
import { RadialMindMap } from './RadialMindMap.jsx';
import { DataCard } from '../components/DataCard.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

/**
 * 🛰️ INTERNAL ACTOR: DYNAMIC GRID
 */
const DynamicGrid = ({ content }) => {
    const { remoteData: entries, loading } = useIndraResonance('NOMON_ENTRIES');
    const { classes = [], limit = 99 } = content || {};

    if (loading) return <div className="grid-loading">Sincronizando flujos de materia...</div>;
    
    const items = (entries || [])
        .filter(item => classes.includes(item.meta?.component_type || ''))
        .slice(0, limit);

    if (items.length === 0) return null;

    return (
        <div className="dynamic-grid-layout">
            {items.map((item, idx) => (
                <DataCard key={item.slug || idx} definition={item} />
            ))}
        </div>
    );
};

const safeStr = (val) => {
    if (typeof val === 'object' && val !== null) return val.es || val.en || '';
    return val || '';
};

/**
 * 🏛️ BLOCK PROJECTION REGISTRY
 * Centraliza la lógica de renderizado de bloques de materia.
 */
export const BLOCK_REGISTRY = {
    'TITLE': ({ block }) => <h2 className="comp-title">{safeStr(block.content)}</h2>,
    
    'MARKDOWN': ({ block }) => (
        <div className="comp-markdown">
            <MDEditor.Markdown source={safeStr(block.content)} style={{ background: 'transparent', color: 'inherit' }} />
        </div>
    ),

    'IMAGE': ({ block }) => (
        <div className="comp-gallery">
            {block.images?.map((img, idx) => (
                img && <img key={idx} src={img} alt={`Materia ${idx}`} className="comp-img" />
            ))}
        </div>
    ),

    'RESONANCE': ({ block }) => <MateriaRelations relations={[block.content]} />,

    'DYNAMIC_GRID': ({ block }) => (
        <div className="comp-dynamic-grid">
            {block.content?.title && <h3 className="grid-block-title">{block.content.title}</h3>}
            <DynamicGrid content={block.content} />
        </div>
    ),

    'GALLERY': ({ block }) => (
        <div className="comp-gallery-grid">
            {block.images?.map((img, idx) => (
                <div key={idx} className="gallery-item animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <img src={img} alt={`Gallery ${idx}`} />
                </div>
            ))}
        </div>
    ),

    'RADIAL_MAP': ({ block }) => <RadialMindMap centerTitle={block.content?.title || "Núcleo"} relations={block.content?.relations || []} />,

    'SOVEREIGN_TRIGGER': ({ block, state }) => (
        <div className="comp-trigger-wrapper">
            <button 
                className="sovereign-action-btn"
                onClick={async () => {
                    try {
                        const { bridge } = state; 
                        await bridge.executeWorkflow(block.content.workflow_id, { entityData: block });
                        alert("Protocolo ejecutado con éxito.");
                    } catch (err) {
                        alert(`Fallo en protocolo: ${err.message}`);
                    }
                }}
            >
                {block.content?.label || 'EJECUTAR'}
            </button>
        </div>
    ),

    'LIBRARY_RESOURCE': ({ block, slug, expanded, onToggle }) => {
        const hasMetadata = block.rationale || block.curator;
        return (
            <div className="comp-library-resource">
                <div className="lib-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={12} /> {block.resType}
                </div>
                <h3 className="lib-title">{safeStr(block.desc) || 'Recurso de Biblioteca'}</h3>
                
                {hasMetadata && (
                    <div className="materia-disclosure" onClick={onToggle}>
                        <div className={`disclosure-line ${expanded ? 'active' : ''}`}></div>
                        <span className="disclosure-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {expanded ? <Minus size={12} /> : <Info size={14} />}
                            {expanded ? 'MENOS' : 'INFO'}
                        </span>
                    </div>
                )}

                {expanded && hasMetadata && (
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
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                >
                    ACCEDER AL CONOCIMIENTO DIGITAL <ArrowRight size={16} strokeWidth={2} />
                </button>
            </div>
        );
    },

    'HERO_LOGO': ({ block }) => (
        <div className="comp-hero-logo">
            <h1 className="hero-logo-text">{safeStr(block.content)}</h1>
            <div className="hero-logo-line"></div>
        </div>
    )
};
