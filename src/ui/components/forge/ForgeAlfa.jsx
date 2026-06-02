import React from 'react';
import { Eye } from 'lucide-react';
import { MateriaLinker } from '../MateriaLinker.jsx';

/**
 * 🧊 FORGE ALFA: IDENTIDAD VISUAL
 */
export const ForgeAlfa = ({ formData, setFormData, currentArquetype, onSlugChange }) => {
    return (
        <div className="zone-alfa" style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', opacity: 0.3 }}>
                <Eye size={16}/><span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em' }}>ZONA ALFA: IDENTIDAD VISUAL</span>
            </div>
            
            {currentArquetype.capabilities.includes('TITLE') && (
                <input 
                    type="text" 
                    placeholder="Título de la entidad..." 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    style={{ 
                        fontSize: '3rem', fontWeight: 900, width: '100%', border: 'none', 
                        borderBottom: '2px solid var(--border-primary)', padding: '1rem 0', 
                        background: 'transparent', color: 'var(--text-primary)', marginBottom: '2rem',
                        outline: 'none'
                    }} 
                />
            )}

            {currentArquetype.capabilities.includes('SUMMARY') && (
                <textarea 
                    placeholder="Resumen ejecutivo..." 
                    maxLength={280} 
                    value={formData.summary} 
                    onChange={e => setFormData({...formData, summary: e.target.value})} 
                    style={{ 
                        fontSize: '1.2rem', width: '100%', border: 'none', 
                        borderBottom: '1px solid var(--border-primary)', padding: '1rem 0', 
                        minHeight: '3rem', background: 'transparent', color: 'var(--text-primary)', 
                        marginBottom: '2rem', outline: 'none', resize: 'none'
                    }} 
                />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {currentArquetype.capabilities.includes('SLUG') && (
                    <div>
                        <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>IDENTIFICADOR ÚNICO (SLUG)</label>
                        <input 
                            type="text" 
                            value={formData.slug} 
                            onChange={e => onSlugChange(e.target.value)} 
                            style={{ 
                                width: '100%', padding: '0.8rem', border: '1px solid var(--border-primary)', 
                                background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                                fontSize: '0.8rem'
                            }} 
                        />
                    </div>
                )}
                {currentArquetype.capabilities.includes('IMAGE') && (
                    <MateriaLinker 
                        value={formData.image} 
                        label="IMAGEN DE PORTADA" 
                        onChange={val => setFormData({...formData, image: val})} 
                    />
                )}
            </div>
        </div>
    );
};
