import React from 'react';
import { Plus, X } from 'lucide-react';

export const FieldRadial = ({ value, onChange, inventory }) => {
    const config = value || { title: '', relations: [] };

    const addRelation = () => {
        onChange({ ...config, relations: [...(config.relations || []), ''] });
    };

    const updateRelation = (idx, val) => {
        const next = [...(config.relations || [])];
        next[idx] = val;
        onChange({ ...config, relations: next });
    };

    const removeRelation = (idx) => {
        onChange({ ...config, relations: config.relations.filter((_, i) => i !== idx) });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>TÍTULO DEL NÚCLEO</label>
                <input 
                    type="text" 
                    placeholder="Ej: Mi Proyecto" 
                    value={config.title || ''} 
                    onChange={e => onChange({ ...config, title: e.target.value })} 
                    style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} 
                />
            </div>

            <div>
                <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5, display: 'block', marginBottom: '1rem' }}>SATÉLITES (RESONANCIAS)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {(config.relations || []).map((rel, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                            <select 
                                value={rel} 
                                onChange={e => updateRelation(idx, e.target.value)}
                                style={{ flex: 1, padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontWeight: 800 }}
                            >
                                <option value="">Selecciona materia...</option>
                                {inventory?.map(item => <option key={item.slug} value={item.slug}>{item.data?.content?.title?.es || item.slug}</option>)}
                            </select>
                            <button type="button" onClick={() => removeRelation(idx)} style={{ background: 'none', border: 'none', color: '#d32f2f' }}><X size={16}/></button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={addRelation}
                        style={{ padding: '0.8rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', fontSize: '0.6rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={14}/> AÑADIR SATÉLITE
                    </button>
                </div>
            </div>
        </div>
    );
};
