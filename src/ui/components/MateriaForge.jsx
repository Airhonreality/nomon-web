import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { MateriaEditor } from './MateriaEditor.jsx';
import { MateriaLinker } from './MateriaLinker.jsx';

/**
 * 🖋️ COMPONENTE AUXILIAR: Barra de Inserción
 * (Definido fuera para evitar pérdida de estado en renders)
 */
const InsertBar = ({ index, addBlock, blockTypes }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="insert-bar" style={{ position: 'relative', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
            <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(0,0,0,0.05)' }}></div>
            <button 
                type="button" 
                onClick={() => setOpen(!open)} 
                style={{ 
                    position: 'relative', zIndex: 10, background: '#000', color: '#fff', 
                    border: 'none', borderRadius: '50%', width: '1.8rem', height: '1.8rem', 
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {open ? '×' : '+'}
            </button>
            {open && (
                <div style={{ 
                    position: 'absolute', top: '2.8rem', zIndex: 100, background: '#fff', 
                    border: '1px solid #000', padding: '0.8rem', display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', gap: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    minWidth: '250px'
                }}>
                    {Object.keys(blockTypes).map(t => (
                        <button 
                            key={t} 
                            type="button" 
                            onClick={() => { addBlock(t, index); setOpen(false); }} 
                            style={{ 
                                fontSize: '0.65rem', padding: '0.6rem', textAlign: 'left', 
                                background: '#f9f9f9', border: 'none', cursor: 'pointer', 
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
 * 🛠️ MATERIA CONSTRUCTOR (V3 - Agnostic & Robust)
 */
export const MateriaForge = () => {
    const { bridge } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    
    const [selectedClass, setSelectedClass] = useState('DATA_CARD');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '', summary: '', slug: '', image: '', relations: [], composition: [], pdf_url: ''
    });

    const BLOCK_TYPES = {
        'TITLE': 'Título Destacado',
        'MARKDOWN': 'Bloque de Texto / MD',
        'IMAGE': 'Imagen / Galería',
        'RESONANCE': 'Vínculo (Resonancia)',
        'LIBRARY_RESOURCE': 'Recurso Bibliográfico'
    };

    const addBlock = (type, index = null) => {
        const newBlock = { type, id: Date.now(), content: '' };
        if (type === 'IMAGE') newBlock.images = [''];
        if (type === 'LIBRARY_RESOURCE') {
            newBlock.url = ''; newBlock.resType = 'PDF'; newBlock.desc = ''; newBlock.curator = ''; newBlock.rationale = '';
        }
        
        setFormData(prev => {
            const newComp = [...(prev.composition || [])];
            if (index === null) newComp.push(newBlock);
            else newComp.splice(index, 0, newBlock);
            return { ...prev, composition: newComp };
        });
    };

    const moveBlock = (index, direction) => {
        const newComp = [...formData.composition];
        const target = index + direction;
        if (target < 0 || target >= newComp.length) return;
        const [item] = newComp.splice(index, 1);
        newComp.splice(target, 0, item);
        setFormData({ ...formData, composition: newComp });
    };

    const updateBlock = (id, data) => {
        setFormData(prev => ({
            ...prev,
            composition: (prev.composition || []).map(b => b.id === id ? { ...b, ...data } : b)
        }));
    };

    const removeBlock = (id) => {
        setFormData(prev => ({
            ...prev,
            composition: (prev.composition || []).filter(b => b.id !== id)
        }));
    };

    const generateSlug = (text) => {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    };

    const handleSelectForEdit = (item) => {
        if (!item) return;
        const d = item.data || {};
        const c = d.content || {};
        let comp = [...(c.composition || [])];

        // 🧬 BÚSQUEDA EXHAUSTIVA DE IMAGEN (Honestidad de Datos)
        const foundImage = c.image || c.img || d.image || d.img || item.image || item.thumbnail || '';

        // 🧬 TRANSMUTACIÓN: Cuerpo Legado
        if (c.body && c.body.trim().length > 0) {
            comp = [{ type: 'MARKDOWN', id: 'legacy-body-' + Date.now(), content: c.body }, ...comp];
        }

        // 🧬 TRANSMUTACIÓN: Biblioteca Legada
        if (c.library && Array.isArray(c.library) && c.library.length > 0) {
            const legacyLibraryBlocks = c.library.map((res, idx) => ({
                type: 'LIBRARY_RESOURCE',
                id: `legacy-lib-${idx}-${Date.now()}`,
                url: res.url || '',
                desc: res.desc || '',
                curator: res.curator || '',
                rationale: res.rationale || '',
                resType: res.type || 'PDF'
            }));
            if (!comp.some(b => b.type === 'LIBRARY_RESOURCE')) {
                comp = [...comp, ...legacyLibraryBlocks];
            }
        }

        setFormData({
            title: c.title?.es || c.title || item.name || '',
            summary: c.summary?.es || c.summary || d.summary || '',
            slug: item.slug || '',
            image: foundImage,
            relations: d.relations || [],
            composition: comp,
            pdf_url: c.pdf_url || ''
        });
        setSelectedClass(item.meta?.component_type || 'DATA_CARD');
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ title: '', summary: '', slug: '', image: '', relations: [], composition: [], pdf_url: '' });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas disolver esta materia permanentemente?")) return;
        
        const uqo = {
            protocol: 'DELETE',
            identity: { id: 'indra-core' },
            payload: { context_id: 'NOMON_ENTRIES', slug: formData.slug }
        };

        try {
            await bridge.execute(uqo);
            console.log("🧨 Materia disuelta con éxito.");
            resetForm();
            window.location.reload();
        } catch (err) {
            console.error("❌ Fallo en la disolución:", err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const cleanSlug = generateSlug(formData.slug || formData.title);
        
        const uqo = {
            protocol: 'CREATE',
            context_id: 'NOMON_ENTRIES',
            data: {
                slug: cleanSlug,
                meta: { component_type: selectedClass },
                data: {
                    content: {
                        title: { es: formData.title },
                        summary: { es: formData.summary },
                        image: formData.image,
                        composition: formData.composition,
                        pdf_url: formData.pdf_url
                    },
                    relations: formData.relations
                }
            }
        };
        try {
            await bridge.execute(uqo);
            alert("Materia Cristalizada.");
            if (!isEditing) resetForm();
            window.location.reload();
        } catch (err) { console.error(err); }
    };

    const inventory = entries || [];
    const groupedInventory = inventory.reduce((acc, item) => {
        const t = item.meta?.component_type || 'OTRO';
        if (!acc[t]) acc[t] = []; acc[t].push(item); return acc;
    }, {});

    return (
        <section className="materia-forge-container">
            <div className="forge-main">
                <div className="class-selector-header" style={{ marginBottom: '2rem' }}>
                    <label>ARQUETIPO DE ENTIDAD</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                        <option value="ENTITY_PROJECT">Entidad: Proyecto</option>
                        <option value="ENTITY_NEWS">Entidad: Noticia</option>
                        <option value="ENTITY_ALLY">Entidad: Aliado</option>
                        <option value="LIBRARY_RESOURCE">Recurso de Biblioteca</option>
                        <option value="BANNER_INFO">Estructura: Informativa</option>
                        <option value="BANNER_ACTION">Estructura: Acción</option>
                    </select>
                    <button type="button" className="new-btn" onClick={resetForm}>+ NUEVA ENTIDAD</button>
                </div>

                <form onSubmit={handleSave} className="forge-form">
                    <div className="identity-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="identity-field">
                            <label className="group-label">TÍTULO DE LA ENTIDAD</label>
                            <input 
                                type="text" 
                                placeholder="Nombre de la materia..." 
                                value={typeof formData.title === 'object' ? formData.title?.es : formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                required 
                                style={{ fontSize: '1.8rem', fontWeight: 900, width: '100%', border: 'none', borderBottom: '2px solid #eee', padding: '0.5rem 0' }} 
                            />
                        </div>

                        <div className="identity-field">
                            <label className="group-label">SLUG / URL AMIGABLE</label>
                            <input type="text" placeholder="slug-de-la-materia" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ opacity: 0.5, width: '100%' }} />
                        </div>

                        <div className="identity-field">
                            <MateriaLinker 
                                value={formData.image} 
                                label="IMAGEN PRINCIPAL (MANIFEST)"
                                onChange={(val) => setFormData({...formData, image: val})} 
                            />
                            {formData.image && (
                                <div style={{ marginTop: '1rem', border: '1px solid #eee', padding: '1rem', background: '#fafafa', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '6rem', height: '6rem', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                             onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML = '<span style="font-size:0.5rem; opacity:0.5; text-align:center">ARCHIVO NO ENCONTRADO EN /ASSETS/</span>'; }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>PREVISUALIZACIÓN DE PIEL (GRID CARD)</span>
                                        <span style={{ fontSize: '0.55rem', opacity: 0.5, maxWidth: '20rem' }}>
                                            ⚠️ SOBERANÍA MANUAL: Asegúrate de que el archivo físico esté en <code>/public/assets/materia/</code> con el nombre exacto que ves arriba.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="identity-field">
                            <label className="group-label">RESUMEN EJECUTIVO (SKIN)</label>
                            <textarea 
                                placeholder="Breve descripción para la tarjeta del grid..." 
                                value={typeof formData.summary === 'object' ? formData.summary?.es : formData.summary} 
                                onChange={e => setFormData({...formData, summary: e.target.value})} 
                                style={{ minHeight: '6rem', padding: '1rem', width: '100%', border: '1px solid #eee', fontSize: '1rem', lineHeight: '1.6' }} 
                            />
                        </div>
                    </div>

                    <div className="composition-lane" style={{ margin: '3rem 0', borderTop: '0.1rem solid #eee', paddingTop: '2rem' }}>
                        <label className="group-label" style={{ letterSpacing: '0.3em', marginBottom: '2rem', display: 'block' }}>TEJIDO DE COMPOSICIÓN</label>
                        
                        <InsertBar index={0} addBlock={addBlock} blockTypes={BLOCK_TYPES} />
                        
                        {(formData.composition || []).map((block, i) => (
                            <React.Fragment key={block.id}>
                                <div className="composition-block" style={{ background: '#fff', padding: '2rem', border: '1px solid #eee', position: 'relative', marginBottom: '0.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                    <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                                        <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0}>▲</button>
                                        <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === formData.composition.length - 1}>▼</button>
                                        <button type="button" onClick={() => removeBlock(block.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900 }}>ELIMINAR</button>
                                    </div>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.3, fontWeight: 900, textTransform: 'uppercase' }}>Bloque #{i+1} // {BLOCK_TYPES[block.type]}</span>
                                    
                                    <div style={{ marginTop: '1.5rem' }}>
                                        {block.type === 'TITLE' && <input type="text" value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })} placeholder="Texto del título" style={{ fontSize: '1.2rem', border: 'none', borderBottom: '1px solid #eee', width: '100%' }} />}
                                        {block.type === 'MARKDOWN' && <MateriaEditor value={block.content} onChange={(val) => updateBlock(block.id, { content: val })} placeholder="Escribe aquí..." />}
                                        {block.type === 'IMAGE' && (
                                            <div style={{ display: 'grid', gap: '1rem' }}>
                                                {(block.images || []).map((img, imgIdx) => (
                                                    <MateriaLinker 
                                                        key={imgIdx}
                                                        value={img}
                                                        label={`IMAGEN #${imgIdx + 1}`}
                                                        onChange={(val) => {
                                                            const ni = [...block.images]; ni[imgIdx] = val;
                                                            updateBlock(block.id, { images: ni });
                                                        }}
                                                    />
                                                ))}
                                                <button type="button" onClick={() => updateBlock(block.id, { images: [...(block.images || []), ''] })} className="new-btn" style={{ fontSize: '0.6rem' }}>+ AÑADIR IMAGEN A GALERÍA</button>
                                            </div>
                                        )}
                                        {block.type === 'LIBRARY_RESOURCE' && (
                                            <div style={{ display: 'grid', gap: '1rem' }}>
                                                <MateriaLinker 
                                                    value={block.url || ''} 
                                                    label="ARCHIVO DEL RECURSO"
                                                    onChange={(val) => updateBlock(block.id, { url: val })} 
                                                />
                                                <div style={{ display: 'grid', gap: '0.8rem', padding: '1rem', background: '#fcfcfc', border: '1px solid #eee' }}>
                                                    <input type="text" placeholder="Descripción del recurso" value={block.desc || ''} onChange={e => updateBlock(block.id, { desc: e.target.value })} />
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input type="text" placeholder="Curador" value={block.curator || ''} onChange={e => updateBlock(block.id, { curator: e.target.value })} />
                                                        <input type="text" placeholder="Justificación NOMON" value={block.rationale || ''} onChange={e => updateBlock(block.id, { rationale: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {block.type === 'RESONANCE' && (
                                            <select value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })} style={{ width: '100%', padding: '0.8rem' }}>
                                                <option value="">Enlazar con otra materia...</option>
                                                {inventory.map(m => <option key={m.slug} value={m.slug}>{m.data?.content?.title?.es || m.slug}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <InsertBar index={i + 1} addBlock={addBlock} blockTypes={BLOCK_TYPES} />
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="forge-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="forge-btn" style={{ padding: '1.2rem 3rem', background: '#000', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>
                            {isEditing ? 'ACTUALIZAR MATERIA' : 'CRISTALIZAR MATERIA'}
                        </button>
                        {isEditing && (
                            <>
                                <button type="button" onClick={handleDelete} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '1.2rem 2rem', fontWeight: 900, cursor: 'pointer' }}>
                                    ELIMINAR MATERIA
                                </button>
                                <button type="button" onClick={resetForm} className="forge-btn-cancel" style={{ background: '#fff', border: '1px solid #eee', padding: '1.2rem 2rem', cursor: 'pointer' }}>
                                    DESCARTAR
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>

            <aside className="forge-inventory" style={{ width: '30rem', borderLeft: '1px solid #eee', paddingLeft: '2rem' }}>
                <h3 className="inventory-header" style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.3em', marginBottom: '2rem' }}>SILO DE ENTIDADES</h3>
                {Object.keys(groupedInventory).map(t => (
                    <div key={t} className="inventory-group" style={{ marginBottom: '2rem' }}>
                        <span className="group-label" style={{ fontSize: '0.55rem', opacity: 0.4, borderBottom: '1px solid #eee', display: 'block', paddingBottom: '0.3rem', marginBottom: '0.5rem' }}>{t}</span>
                        {groupedInventory[t].map(m => (
                            <div key={m.slug} className="inventory-item" onClick={() => handleSelectForEdit(m)} style={{ cursor: 'pointer', padding: '0.8rem', borderBottom: '1px solid #f9f9f9', fontSize: '0.8rem', background: '#fff', transition: 'all 0.2s' }}>
                                <strong>{m.data?.content?.title?.es || m.slug}</strong>
                                <code style={{ display: 'block', fontSize: '0.6rem', opacity: 0.5 }}>{m.slug}</code>
                            </div>
                        ))}
                    </div>
                ))}
            </aside>
        </section>
    );
};
