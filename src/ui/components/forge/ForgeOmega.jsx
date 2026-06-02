import React, { useState } from 'react';
import { Database, ArrowUp, ArrowDown, Trash2, X, Plus } from 'lucide-react';
import { MateriaLinker } from '../MateriaLinker.jsx';
import { ForgeFieldFactory } from './ForgeFieldFactory.jsx';

/**
 * 🛰️ COMPONENTE AUXILIAR: Barra de Inserción
 */
const InsertBar = ({ onInsert, blockTypes, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ position: 'relative', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: open ? 1 : 0.2, transition: 'opacity 0.2s' }}>
            <button 
                type="button" 
                onClick={() => setOpen(!open)}
                style={{ 
                    background: 'var(--accent-color)', color: 'var(--bg-primary)', border: 'none', 
                    borderRadius: '50%', width: '1.5rem', height: '1.5rem', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 
                }}
            >
                {open ? <X size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
            </button>

            {open && (
                <div style={{ 
                    position: 'absolute', top: '2rem', zIndex: 100, 
                    background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', padding: '0.5rem', 
                    display: 'flex', gap: '0.5rem', boxShadow: '0 1rem 3rem rgba(0,0,0,0.2)' 
                }}>
                    {Object.keys(blockTypes).map(t => (
                        <button 
                            key={t} type="button" 
                            onClick={() => { onInsert(t, index); setOpen(false); }}
                            style={{ 
                                fontSize: '0.65rem', padding: '0.6rem', textAlign: 'left', 
                                background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', 
                                fontWeight: 'bold', textTransform: 'uppercase' 
                            }}
                        >
                            + {blockTypes[t]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * 🔮 FORGE OMEGA: MATERIA Y CONTENIDO
 */
export const ForgeOmega = ({ formData, setFormData, currentArquetype, inventory, arquetypes, blockTypes, addBlock, updateBlock, deleteBlock, moveBlock }) => {
    
    return (
        <div className="zone-omega">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', opacity: 0.3 }}>
                <Database size={16}/><span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em' }}>ZONA OMEGA: PROFUNDIDAD DE MATERIA</span>
            </div>
            
            {currentArquetype.capabilities.includes('METADATA_LIB') && (
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-primary)', marginBottom: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {[{ id: 'author', label: 'Autor' }, { id: 'editorial', label: 'Editorial' }, { id: 'year', label: 'Año' }, { id: 'id_universal', label: 'DOI/ISBN' }, { id: 'license', label: 'Licencia' }, { id: 'language', label: 'Idioma' }].map(f => (
                            <div key={f.id}><label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>{f.label}</label>
                            <input type="text" value={formData.metadata[f.id]} onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata, [f.id]: e.target.value } })} style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }} /></div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem' }}><label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>RAZÓN NOMON</label><textarea value={formData.metadata.rationale} onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata, rationale: e.target.value } })} style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', minHeight: '4rem' }} /></div>
                </div>
            )}

            {currentArquetype.capabilities.includes('FILE_LINK') && (
                <div style={{ marginBottom: '3rem' }}><MateriaLinker value={formData.pdf_url} label="RECURSO DIGITAL (PDF)" onChange={val => setFormData({...formData, pdf_url: val})} /></div>
            )}

            {currentArquetype.capabilities.includes('COMPOSITION') && (
                <div>
                    <label style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '2rem', display: 'block', opacity: 0.5 }}>COMPOSICIÓN DE MATERIA</label>
                    <InsertBar onInsert={addBlock} blockTypes={blockTypes} index={0} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {formData.composition.map((b, idx) => (
                            <div key={b.id} style={{ border: '1px solid var(--border-primary)', padding: '1.5rem', background: 'var(--bg-secondary)' }}>
                                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 900, opacity: 0.5 }}>{blockTypes[b.type]}</span>
                                        {/* 📐 GEOMETRY CONTROL */}
                                        <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-primary)', padding: '0.2rem', border: '1px solid var(--border-primary)' }}>
                                            {[3, 4, 6, 8, 12].map(s => (
                                                <button 
                                                    key={s} type="button" 
                                                    onClick={() => updateBlock(b.id, 'layout', { ...b.layout, span: s })}
                                                    style={{ 
                                                        fontSize: '0.5rem', padding: '0.3rem 0.5rem', border: 'none', 
                                                        background: (b.layout?.span || 12) === s ? 'var(--accent-color)' : 'transparent',
                                                        color: (b.layout?.span || 12) === s ? 'var(--bg-primary)' : 'var(--text-primary)',
                                                        fontWeight: 900, cursor: 'pointer'
                                                    }}
                                                >
                                                    {s}/12
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}><button type="button" onClick={() => moveBlock(idx, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}><ArrowUp size={14}/></button><button type="button" onClick={() => moveBlock(idx, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}><ArrowDown size={14}/></button><button type="button" onClick={() => deleteBlock(b.id)} style={{ background: 'none', border: 'none', color: '#d32f2f' }}><Trash2 size={14}/></button></div>
                                </header>
                                
                                <ForgeFieldFactory 
                                    type={b.type}
                                    block={b}
                                    value={b.content}
                                    inventory={inventory}
                                    arquetypes={arquetypes}
                                    onChange={(val, field = 'content') => updateBlock(b.id, field, val)}
                                />
                                
                                <InsertBar onInsert={addBlock} blockTypes={blockTypes} index={idx + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
