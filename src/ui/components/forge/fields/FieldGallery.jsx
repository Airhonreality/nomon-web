import React from 'react';
import { X, Plus } from 'lucide-react';
import { MateriaLinker } from '../../MateriaLinker.jsx';

export const FieldGallery = ({ images, onChange }) => {
    const list = images || [];

    const updateImage = (idx, val) => {
        const next = [...list];
        next[idx] = val;
        onChange(next);
    };

    const removeImage = (idx) => {
        onChange(list.filter((_, i) => i !== idx));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {list.map((img, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end', background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-primary)' }}>
                    <div style={{ flex: 1 }}>
                        <MateriaLinker value={img} label={`Imagen ${i+1}`} onChange={val => updateImage(i, val)} />
                    </div>
                    <button 
                        type="button" 
                        onClick={() => removeImage(i)} 
                        style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', padding: '0.5rem' }}
                    >
                        <X size={16}/>
                    </button>
                </div>
            ))}
            <button 
                type="button" 
                onClick={() => onChange([...list, ''])} 
                style={{ 
                    padding: '1rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', 
                    border: 'none', fontSize: '0.6rem', fontWeight: 900, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
            >
                <Plus size={14}/> AÑADIR IMAGEN A LA GALERÍA
            </button>
        </div>
    );
};
