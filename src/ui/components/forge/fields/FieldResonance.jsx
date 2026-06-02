import React from 'react';

export const FieldResonance = ({ value, onChange, inventory }) => {
    return (
        <select 
            value={value || ''} 
            onChange={e => onChange(e.target.value)} 
            style={{ 
                width: '100%', padding: '1rem', background: 'var(--bg-primary)', 
                border: '1px solid var(--border-primary)', color: 'var(--text-primary)',
                fontWeight: 800, fontSize: '0.8rem', outline: 'none'
            }}
        >
            <option value="">Selecciona materia para vincular...</option>
            {inventory?.map(item => (
                <option key={item.slug} value={item.slug}>
                    [{item.meta?.component_type?.replace('ENTITY_', '')}] {item.data?.content?.title?.es || item.slug}
                </option>
            ))}
        </select>
    );
};
