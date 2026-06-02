import React from 'react';

export const FieldGrid = ({ value, onChange, arquetypes }) => {
    const config = value || { title: '', classes: [], limit: 6 };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>TÍTULO DE LA REJILLA</label>
                <input 
                    type="text" 
                    placeholder="Ej: Proyectos Recientes" 
                    value={config.title || ''} 
                    onChange={e => onChange({ ...config, title: e.target.value })} 
                    style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} 
                />
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900 }}>CLASES A PROYECTAR:</label>
                {Object.keys(arquetypes).map(key => (
                    <label key={key} style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={config.classes?.includes(key)} 
                            onChange={e => {
                                const nextClasses = e.target.checked 
                                    ? [...(config.classes || []), key] 
                                    : (config.classes || []).filter(k => k !== key);
                                onChange({ ...config, classes: nextClasses });
                            }}
                        /> 
                        {key.replace('ENTITY_', '').replace('BANNER_', '')}
                    </label>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontSize: '0.6rem', fontWeight: 900 }}>LÍMITE DE ENTRADAS:</label>
                <input 
                    type="number" 
                    value={config.limit || 6} 
                    onChange={e => onChange({ ...config, limit: parseInt(e.target.value) })} 
                    style={{ width: '4rem', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} 
                />
            </div>
        </div>
    );
};
