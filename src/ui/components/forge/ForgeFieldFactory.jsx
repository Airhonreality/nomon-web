import React from 'react';
import { FieldMarkdown } from './fields/FieldMarkdown.jsx';
import { FieldResonance } from './fields/FieldResonance.jsx';
import { FieldGrid } from './fields/FieldGrid.jsx';
import { FieldGallery } from './fields/FieldGallery.jsx';
import { FieldRadial } from './fields/FieldRadial.jsx';
import { FieldTrigger } from './fields/FieldTrigger.jsx';
import { FieldWorkflow } from './fields/FieldWorkflow.jsx';
import { MateriaLinker } from '../MateriaLinker.jsx';

/**
 * 🏭 FORGE FIELD FACTORY
 * Responsabilidad: Decidir qué componente de edición renderizar basado en el tipo de bloque.
 * Es el corazón de la extensibilidad del sistema.
 */
export const ForgeFieldFactory = ({ type, value, onChange, inventory, arquetypes, block }) => {
    
    switch (type) {
        case 'MARKDOWN':
            return <FieldMarkdown value={value} onChange={onChange} />;
            
        case 'RESONANCE':
            return <FieldResonance value={value} onChange={onChange} inventory={inventory} />;
            
        case 'RADIAL_MAP':
            return <FieldRadial value={value} onChange={onChange} inventory={inventory} />;

        case 'SOVEREIGN_TRIGGER':
            return <FieldTrigger value={value} onChange={onChange} />;

        case 'WORKFLOW_EDITOR':
            return <FieldWorkflow value={value} onChange={onChange} />;

        case 'DYNAMIC_GRID':
            return <FieldGrid value={value} onChange={onChange} arquetypes={arquetypes} />;
            
        case 'GALLERY':
            return <FieldGallery images={block.images} onChange={(val) => onChange(val, 'images')} />;
            
        case 'IMAGE':
            return <MateriaLinker value={value} label="Vínculo de Imagen" onChange={onChange} />;
            
        default:
            return (
                <input 
                    type="text" 
                    value={value || ''} 
                    onChange={e => onChange(e.target.value)} 
                    style={{ 
                        width: '100%', padding: '1rem', background: 'var(--bg-primary)', 
                        border: '1px solid var(--border-primary)', color: 'var(--text-primary)' 
                    }} 
                />
            );
    }
};
