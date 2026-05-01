import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { MateriaEditor } from './MateriaEditor.jsx';
import { MateriaLinker } from './MateriaLinker.jsx';

/**
 * 🖋️ COMPONENTE AUXILIAR: Barra de Inserción
 * (Definido fuera para evitar pérdida de estado en renders)
 */
const InsertBar = ({ onInsert, blockTypes, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ position: 'relative', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: open ? 1 : 0.2, transition: 'opacity 0.2s' }}>
            <button 
                type="button" 
                onClick={() => setOpen(!open)}
                style={{ 
                    background: '#000', color: '#fff', border: 'none', 
                    borderRadius: '50%', width: '1.5rem', height: '1.5rem', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 
                }}
            >
                {open ? '×' : '+'}
            </button>
            {open && (
                <div style={{ 
                    position: 'absolute', top: '2rem', zIndex: 100, 
                    background: '#fff', border: '1px solid #000', padding: '0.5rem', 
                    display: 'flex', gap: '0.5rem', boxShadow: '0 1rem 3rem rgba(0,0,0,0.2)' 
                }}>
                    {Object.keys(blockTypes).map(t => (
                        <button 
                            key={t} type="button" 
                            onClick={() => { onInsert(t, index); setOpen(false); }}
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
 * 🛠️ MATERIA CONSTRUCTOR (V4 - Agnostic & Graph Whitelist Enabled)
 */
export const MateriaForge = () => {
    const { bridge } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    
    const [selectedClass, setSelectedClass] = useState('ENTITY_PROJECT');
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '', 
        summary: '', 
        slug: '', 
        image: '', 
        relations: [], 
        composition: [], 
        pdf_url: '',
        access_control: {
            strategy: 'PUBLIC',
            whitelist_slug: '',
            restricted_title: '',
            restricted_message: '',
            denied_message: ''
        },
        whitelist_emails: ''
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
        if (index !== null) {
            const next = [...formData.composition];
            next.splice(index, 0, newBlock);
            setFormData({ ...formData, composition: next });
        } else {
            setFormData({ ...formData, composition: [...formData.composition, newBlock] });
        }
    };

    const updateBlock = (id, field, value) => {
        setFormData({
            ...formData,
            composition: formData.composition.map(b => b.id === id ? { ...b, [field]: value } : b)
        });
    };

    const deleteBlock = (id) => {
        setFormData({ ...formData, composition: formData.composition.filter(b => b.id !== id) });
    };

    const moveBlock = (index, dir) => {
        const next = [...formData.composition];
        const targetIndex = index + dir;
        if (targetIndex < 0 || targetIndex >= next.length) return;
        const temp = next[index];
        next[index] = next[targetIndex];
        next[targetIndex] = temp;
        setFormData({ ...formData, composition: next });
    };

    const generateSlug = (txt) => {
        return (txt || "")
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s_]+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleEdit = (item) => {
        const d = item.data || {};
        const c = d.content || {};
        let comp = c.composition || [];

        const foundImage = c.image || c.img || d.image || d.img || item.image || item.thumbnail || '';

        if (c.body && c.body.trim().length > 0) {
            comp = [{ type: 'MARKDOWN', id: 'legacy-body-' + Date.now(), content: c.body }, ...comp];
        }

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
            pdf_url: c.pdf_url || '',
            access_control: d.access_control || {
                strategy: 'PUBLIC',
                whitelist_slug: '',
                restricted_title: '',
                restricted_message: '',
                denied_message: ''
            },
            whitelist_emails: ''
        });
        setSelectedClass(item.meta?.component_type || 'ENTITY_PROJECT');
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ 
            title: '', summary: '', slug: '', image: '', relations: [], composition: [], pdf_url: '',
            access_control: { strategy: 'PUBLIC', whitelist_slug: '', restricted_title: '', restricted_message: '', denied_message: '' },
            whitelist_emails: ''
        });
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
            resetForm();
            window.location.reload();
        } catch (err) {
            console.error("❌ Fallo en la disolución:", err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const cleanSlug = generateSlug(formData.slug || formData.title);

        let hashes = [];
        if (selectedClass === 'ENTITY_WHITELIST' && formData.whitelist_emails) {
            const lines = formData.whitelist_emails.split(/[\n,]/).map(e => e.trim().toLowerCase()).filter(Boolean);
            hashes = await Promise.all(lines.map(async (email) => {
                const msgBuffer = new TextEncoder().encode(email);
                const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }));
        }
        
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
                    relations: formData.relations,
                    access_control: selectedClass !== 'ENTITY_WHITELIST' ? {
                        strategy: formData.access_control?.strategy || 'PUBLIC',
                        whitelist_slug: formData.access_control?.whitelist_slug || '',
                        restricted_title: formData.access_control?.restricted_title || '',
                        restricted_message: formData.access_control?.restricted_message || '',
                        denied_message: formData.access_control?.denied_message || ''
                    } : undefined,
                    whitelist: selectedClass === 'ENTITY_WHITELIST' ? hashes : undefined
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
    const whitelists = inventory.filter(item => item.meta?.component_type === 'ENTITY_WHITELIST');

    const groupedInventory = inventory.reduce((acc, item) => {
        const t = item.meta?.component_type || 'OTRO';
        if (!acc[t]) acc[t] = []; acc[t].push(item); return acc;
    }, {});

    return (
        <section className="materia-forge-container" style={{ padding: '2rem', maxWidth: '75rem', margin: '0 auto' }}>
            <div className="forge-main">
                <div className="class-selector-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5, display: 'block' }}>ARQUETIPO DE ENTIDAD</label>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ padding: '0.8rem', border: '1px solid #ddd', minWidth: '15rem', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                            <option value="ENTITY_PROJECT">Entidad: Proyecto</option>
                            <option value="ENTITY_NEWS">Entidad: Noticia</option>
                            <option value="ENTITY_ALLY">Entidad: Aliado</option>
                            <option value="LIBRARY_RESOURCE">Recurso de Biblioteca</option>
                            <option value="ENTITY_WHITELIST">Entidad: Lista Blanca</option>
                            <option value="BANNER_INFO">Estructura: Informativa</option>
                            <option value="BANNER_ACTION">Estructura: Acción</option>
                        </select>
                    </div>
                    <button type="button" className="new-btn" onClick={resetForm} style={{ background: '#000', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>
                        + NUEVA ENTIDAD
                    </button>
                </div>

                <form onSubmit={handleSave} className="forge-form" style={{ background: '#fff', padding: '2.5rem', border: '1px solid #eee' }}>
                    <div className="identity-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="identity-field">
                            <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>TÍTULO DE LA ENTIDAD</label>
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
                            <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>SLUG / URL AMIGABLE</label>
                            <input type="text" placeholder="slug-de-la-materia" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee', marginTop: '0.3rem' }} />
                        </div>

                        {selectedClass === 'ENTITY_WHITELIST' ? (
                            <div className="identity-field" style={{ marginTop: '1.5rem' }}>
                                <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>EMAILS DE LA WHITELIST (Uno por línea o separados por coma)</label>
                                <textarea 
                                    placeholder="juan@gmail.com, maria@yahoo.com"
                                    value={formData.whitelist_emails}
                                    onChange={e => setFormData({ ...formData, whitelist_emails: e.target.value })}
                                    style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', height: '10rem', marginTop: '0.5rem', fontFamily: 'monospace' }}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="identity-field">
                                    <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>URL DIRECTA PDF (Opcional)</label>
                                    <input type="text" placeholder="https://..." value={formData.pdf_url} onChange={e => setFormData({...formData, pdf_url: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee' }} />
                                </div>

                                <div className="identity-field">
                                    <MateriaLinker 
                                        value={formData.image} 
                                        label="IMAGEN PRINCIPAL (MANIFEST)"
                                        onChange={(val) => setFormData({...formData, image: val})} 
                                    />
                                </div>

                                {/* 🛡️ REGLAS DE SOBERANÍA Y ACCESO DESACOPLADAS */}
                                <div className="access-rules-box" style={{ background: '#fafafa', padding: '1.5rem', border: '1px solid #e0e0e0', marginTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.15em', margin: 0, opacity: 0.8 }}>🛡️ REGLAS DE SOBERANÍA Y ACCESO</h4>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.6 }}>ESTRATEGIA DE ACCESO</label>
                                            <select 
                                                value={formData.access_control?.strategy || 'PUBLIC'} 
                                                onChange={e => setFormData({
                                                    ...formData, 
                                                    access_control: { ...formData.access_control, strategy: e.target.value }
                                                })}
                                                style={{ padding: '0.6rem', border: '1px solid #ddd', fontSize: '0.75rem', background: '#fff' }}
                                            >
                                                <option value="PUBLIC">🔓 Público (Por Defecto)</option>
                                                <option value="REGISTERED_ONLY">👥 Todos los usuarios registrados</option>
                                                <option value="REFERENCE_WHITELIST">🔑 Vincular a Whitelist por Slug</option>
                                            </select>
                                        </div>

                                        {formData.access_control?.strategy === 'REFERENCE_WHITELIST' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.6 }}>SELECCIONAR WHITELIST</label>
                                                <select 
                                                    value={formData.access_control?.whitelist_slug || ''} 
                                                    onChange={e => setFormData({
                                                        ...formData, 
                                                        access_control: { ...formData.access_control, whitelist_slug: e.target.value }
                                                    })}
                                                    style={{ padding: '0.6rem', border: '1px solid #ddd', fontSize: '0.75rem', background: '#fff' }}
                                                >
                                                    <option value="">Selecciona una lista...</option>
                                                    {whitelists.map(item => (
                                                        <option key={item.slug} value={item.slug}>{item.data?.content?.title?.es || item.name || item.slug}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {formData.access_control?.strategy !== 'PUBLIC' && (
                                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.6 }}>TÍTULO DE RESTRICCIÓN</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="MATERIA DE ACCESO RESTRINGIDO" 
                                                    value={formData.access_control?.restricted_title || ''} 
                                                    onChange={e => setFormData({
                                                        ...formData, 
                                                        access_control: { ...formData.access_control, restricted_title: e.target.value }
                                                    })}
                                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', background: '#fff', fontSize: '0.75rem' }} 
                                                />
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.6 }}>MENSAJE DE ACCESO RESTRINGIDO (Markdown)</label>
                                                <textarea 
                                                    placeholder="Este recurso es premium. Para continuar con su proyección, debes iniciar sesión..." 
                                                    value={formData.access_control?.restricted_message || ''} 
                                                    onChange={e => setFormData({
                                                        ...formData, 
                                                        access_control: { ...formData.access_control, restricted_message: e.target.value }
                                                    })}
                                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', background: '#fff', height: '4rem', fontSize: '0.75rem' }} 
                                                />
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.6 }}>MENSAJE DE ACCESO DENEGADO (Markdown)</label>
                                                <textarea 
                                                    placeholder="El correo no se encuentra autorizado en la whitelist..." 
                                                    value={formData.access_control?.denied_message || ''} 
                                                    onChange={e => setFormData({
                                                        ...formData, 
                                                        access_control: { ...formData.access_control, denied_message: e.target.value }
                                                    })}
                                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', background: '#fff', height: '4rem', fontSize: '0.75rem' }} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {selectedClass !== 'ENTITY_WHITELIST' && (
                        <div className="composer-section" style={{ borderTop: '2px solid #f0f0f0', paddingTop: '3rem', marginTop: '3rem' }}>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.2em', marginBottom: '2rem' }}>🎨 COMPOSICIÓN DE CONTENIDO</h3>
                            <InsertBar onInsert={addBlock} blockTypes={BLOCK_TYPES} index={0} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                                {formData.composition.map((b, idx) => (
                                    <div key={b.id} style={{ border: '1px solid #eee', background: '#fafafa', padding: '1.5rem', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#000', letterSpacing: '0.15em' }}>{BLOCK_TYPES[b.type]}</span>
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <button type="button" onClick={() => moveBlock(idx, -1)} style={{ background: '#fff', border: '1px solid #ddd', padding: '0.3rem 0.6rem', fontSize: '0.6rem', cursor: 'pointer' }}>↑</button>
                                                <button type="button" onClick={() => moveBlock(idx, 1)} style={{ background: '#fff', border: '1px solid #ddd', padding: '0.3rem 0.6rem', fontSize: '0.6rem', cursor: 'pointer' }}>↓</button>
                                                <button type="button" onClick={() => deleteBlock(b.id)} style={{ background: '#fff', border: '1px solid #d32f2f', color: '#d32f2f', padding: '0.3rem 0.6rem', fontSize: '0.6rem', cursor: 'pointer' }}>ELIMINAR</button>
                                            </div>
                                        </div>

                                        {b.type === 'TITLE' && (
                                            <input type="text" value={b.content || ''} onChange={e => updateBlock(b.id, 'content', e.target.value)} placeholder="Escribe el título aquí..." style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd' }} />
                                        )}

                                        {b.type === 'MARKDOWN' && (
                                            <MateriaEditor value={b.content || ''} onChange={val => updateBlock(b.id, 'content', val)} />
                                        )}

                                        <InsertBar onInsert={addBlock} blockTypes={BLOCK_TYPES} index={idx + 1} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem', borderTop: '2px solid #f0f0f0', paddingTop: '2.5rem' }}>
                        <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '1.2rem 3.5rem', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                            {isEditing ? '💎 CRISTALIZAR CAMBIOS' : '✨ CRISTALIZAR MATERIA'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleDelete} style={{ background: '#fff', border: '1px solid #d32f2f', color: '#d32f2f', padding: '1.2rem 3.5rem', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                                🔥 ELIMINAR MATERIA
                            </button>
                        )}
                    </div>
                </form>

                {/* VISOR DE INVENTARIO SOBERANO */}
                <div style={{ marginTop: '5rem', borderTop: '2px solid #eee', paddingTop: '4rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.2em', marginBottom: '2rem' }}>📂 INVENTARIO SOBERANO (SILO)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(22rem, 1fr))', gap: '2rem' }}>
                        {inventory.map((item, idx) => (
                            <div key={item.slug || idx} style={{ background: '#fff', border: '1px solid #eee', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <span style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.15em', opacity: 0.5, textTransform: 'uppercase' }}>{item.meta?.component_type || 'DATA_CARD'}</span>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0.5rem 0' }}>{item.data?.content?.title?.es || item.name || item.slug}</h4>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.5, margin: 0 }}>{item.slug}</p>
                                </div>
                                <button type="button" onClick={() => handleEdit(item)} style={{ background: '#000', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', fontSize: '0.65rem', fontWeight: 900, marginTop: '1.5rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                                    EDITAR MATERIA
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
