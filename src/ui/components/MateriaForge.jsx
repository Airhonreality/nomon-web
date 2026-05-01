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

    const [activeTab, setActiveTab] = useState('ALL');
    const inventory = entries || [];
    const whitelists = inventory.filter(item => item.meta?.component_type === 'ENTITY_WHITELIST');

    const filteredInventory = inventory.filter(item => {
        if (activeTab === 'ALL') return true;
        return (item.meta?.component_type || 'DATA_CARD') === activeTab;
    });

    const TABS = [
        { id: 'ALL', label: 'Todo' },
        { id: 'ENTITY_PROJECT', label: 'Proyectos' },
        { id: 'ENTITY_NEWS', label: 'Noticias' },
        { id: 'LIBRARY_RESOURCE', label: 'Biblioteca' },
        { id: 'ENTITY_WHITELIST', label: 'Whitelists' },
        { id: 'BANNER_INFO', label: 'Banners' }
    ];

    return (
        <section className="materia-forge-v5" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#fff' }}>
            {/* 🛰️ SIDEBAR: INVENTARIO COMPACTO (20%) */}
            <aside className="forge-sidebar" style={{ width: '20%', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', background: '#fcfcfc' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.1em', margin: '0 0 1.5rem 0' }}>LISTA DE ENTIDADES</h2>
                    <h2 style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2em', margin: '0 0 1rem 0', opacity: 0.5 }}>SILO DE MATERIA</h2>
                    
                    <div className="sovereign-filter-container">
                        <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.4, display: 'block', marginBottom: '0.3rem' }}>FILTRAR POR CLASE</label>
                        <select 
                            value={activeTab} 
                            onChange={e => setActiveTab(e.target.value)}
                            style={{ 
                                width: '100%', padding: '0.6rem', border: '1px solid #000', 
                                background: '#fff', fontSize: '0.65rem', fontWeight: 900, 
                                textTransform: 'uppercase', cursor: 'pointer', outline: 'none'
                            }}
                        >
                            {TABS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>
                </div>


                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {filteredInventory.map((item, idx) => (
                        <div 
                            key={item.slug || idx} 
                            onClick={() => handleEdit(item)}
                            style={{ 
                                padding: '0.8rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                                background: formData.slug === item.slug ? 'var(--bg-primary)' : 'transparent',
                                borderLeft: formData.slug === item.slug ? '4px solid var(--accent-color)' : '4px solid transparent'
                            }}
                        >
                            <span style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase' }}>{item.meta?.component_type || 'DATA_CARD'}</span>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, margin: '0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.data?.content?.title?.es || item.name || item.slug}
                            </h4>
                            <code style={{ fontSize: '0.55rem', opacity: 0.3 }}>{item.slug}</code>
                        </div>
                    ))}
                </div>
                
                <div style={{ padding: '1.5rem', borderTop: '1px solid #eee' }}>
                    <button onClick={resetForm} style={{ width: '100%', background: 'var(--accent-color)', color: 'var(--bg-primary)', border: 'none', padding: '0.8rem', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>
                        + NUEVA ENTIDAD
                    </button>
                </div>
            </aside>

            {/* 🖋️ MAIN AREA: EDITOR DINÁMICO (80%) */}
            <main className="forge-main-editor" style={{ width: '80%', overflowY: 'auto', padding: '3rem' }}>
                <form onSubmit={handleSave} style={{ maxWidth: '60rem', margin: '0 auto' }}>
                    <header style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em', margin: '0 0 1.5rem 0' }}>EDICIÓN DE ENTIDADES</h2>
                    </header>

                    <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>ARQUETIPO</label>
                            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ display: 'block', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid var(--accent-color)', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', background: 'transparent' }}>
                                <option value="ENTITY_PROJECT">Proyecto</option>
                                <option value="ENTITY_NEWS">Noticia</option>
                                <option value="ENTITY_ALLY">Aliado</option>
                                <option value="LIBRARY_RESOURCE">Biblioteca</option>
                                <option value="ENTITY_WHITELIST">Whitelist</option>
                                <option value="BANNER_INFO">Informativo</option>
                                <option value="BANNER_ACTION">Acción</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {isEditing && (
                                <button type="button" onClick={handleDelete} style={{ background: 'transparent', border: '1px solid #d32f2f', color: '#d32f2f', padding: '0.8rem 1.5rem', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>
                                    ELIMINAR
                                </button>
                            )}
                            <button type="submit" style={{ background: 'var(--accent-color)', color: 'var(--bg-primary)', border: 'none', padding: '0.8rem 2.5rem', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>
                                {isEditing ? 'CRISTALIZAR CAMBIOS' : 'CRISTALIZAR MATERIA'}
                            </button>
                        </div>
                    </header>

                    <div className="editor-body">
                        {/* TÍTULO GIGANTE */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>TÍTULO DE LA ENTIDAD</label>
                            <input 
                                type="text" 
                                placeholder="Nombre de la materia..." 
                                value={typeof formData.title === 'object' ? formData.title?.es : formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                required 
                                style={{ fontSize: '2.5rem', fontWeight: 900, width: '100%', border: 'none', borderBottom: '2px solid var(--border-primary)', padding: '1rem 0' }} 
                            />
                        </div>

                        {/* RESUMEN / SUMMARY */}
                        <div style={{ marginBottom: '3rem' }}>
                            <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5 }}>RESUMEN EJECUTIVO</label>
                            <textarea 
                                placeholder="Escribe una breve descripción..." 
                                value={typeof formData.summary === 'object' ? formData.summary?.es : formData.summary} 
                                onChange={e => setFormData({...formData, summary: e.target.value})} 
                                style={{ fontSize: '1rem', width: '100%', border: 'none', borderBottom: '1px solid var(--border-primary)', padding: '1rem 0', minHeight: '4rem', resize: 'none', fontFamily: 'inherit' }} 
                            />
                        </div>


                        {/* 🛡️ REGLAS DE SOBERANÍA (AHORA ARRIBA) */}
                        {selectedClass !== 'ENTITY_WHITELIST' && (
                            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', border: '1px solid var(--border-primary)', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.15em', margin: 0 }}>🛡️ SOBERANÍA DE ACCESO</h4>
                                    <select 
                                        value={formData.access_control?.strategy || 'PUBLIC'} 
                                        onChange={e => setFormData({
                                            ...formData, 
                                            access_control: { ...formData.access_control, strategy: e.target.value }
                                        })}
                                        style={{ padding: '0.4rem', border: '1px solid var(--border-primary)', fontSize: '0.65rem', fontWeight: 900, background: 'transparent' }}
                                    >
                                        <option value="PUBLIC">🔓 PÚBLICO</option>
                                        <option value="REGISTERED_ONLY">👥 REGISTRADOS</option>
                                        <option value="REFERENCE_WHITELIST">🔑 WHITELIST</option>
                                    </select>

                                    {formData.access_control?.strategy === 'REFERENCE_WHITELIST' && (
                                        <select 
                                            value={formData.access_control?.whitelist_slug || ''} 
                                            onChange={e => setFormData({
                                                ...formData, 
                                                access_control: { ...formData.access_control, whitelist_slug: e.target.value }
                                            })}
                                            style={{ padding: '0.4rem', border: '1px solid var(--border-primary)', fontSize: '0.65rem', background: 'transparent' }}
                                        >
                                            <option value="">Selecciona...</option>
                                            {whitelists.map(item => (
                                                <option key={item.slug} value={item.slug}>{item.data?.content?.title?.es || item.slug}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                {formData.access_control?.strategy !== 'PUBLIC' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="text" placeholder="Título bloqueo..." value={formData.access_control?.restricted_title || ''} onChange={e => setFormData({...formData, access_control: {...formData.access_control, restricted_title: e.target.value}})} style={{ fontSize: '0.7rem', padding: '0.5rem', border: '1px solid var(--border-primary)' }} />
                                        <input type="text" placeholder="Mensaje bloqueo..." value={formData.access_control?.restricted_message || ''} onChange={e => setFormData({...formData, access_control: {...formData.access_control, restricted_message: e.target.value}})} style={{ fontSize: '0.7rem', padding: '0.5rem', border: '1px solid var(--border-primary)' }} />
                                    </div>
                                )}
                            </div>
                        )}


                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            <div>
                                <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.5 }}>SLUG</label>
                                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee', fontSize: '0.8rem' }} />
                            </div>
                            {selectedClass === 'ENTITY_WHITELIST' ? (
                                <div>
                                    <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.5 }}>EMAILS (WHITELIST)</label>
                                    <input type="text" value={formData.whitelist_emails} onChange={e => setFormData({...formData, whitelist_emails: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee', fontSize: '0.8rem' }} />
                                </div>
                            ) : (
                                <div>
                                    <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.5 }}>PDF URL</label>
                                    <input type="text" value={formData.pdf_url} onChange={e => setFormData({...formData, pdf_url: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee', fontSize: '0.8rem' }} />
                                </div>
                            )}
                        </div>

                        {selectedClass !== 'ENTITY_WHITELIST' && (
                            <>
                                <MateriaLinker value={formData.image} label="IMAGEN PRINCIPAL" onChange={val => setFormData({...formData, image: val})} />
                                
                                <div style={{ marginTop: '3rem' }}>
                                    <label style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.5, display: 'block', marginBottom: '1rem' }}>COMPOSICIÓN</label>
                                    <InsertBar onInsert={addBlock} blockTypes={BLOCK_TYPES} index={0} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                        {formData.composition.map((b, idx) => (
                                            <div key={b.id} style={{ border: '1px solid var(--border-primary)', padding: '1rem', background: 'var(--bg-primary)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.4 }}>
                                                    <span style={{ fontSize: '0.5rem', fontWeight: 900 }}>{BLOCK_TYPES[b.type]}</span>
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button type="button" onClick={() => moveBlock(idx, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.6rem', color: 'var(--text-primary)' }}>↑</button>
                                                        <button type="button" onClick={() => moveBlock(idx, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.6rem', color: 'var(--text-primary)' }}>↓</button>
                                                        <button type="button" onClick={() => deleteBlock(b.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.6rem', color: '#d32f2f' }}>[×]</button>
                                                    </div>
                                                </div>
                                                {b.type === 'MARKDOWN' ? (
                                                    <MateriaEditor value={b.content || ''} onChange={val => updateBlock(b.id, 'content', val)} />
                                                ) : (
                                                    <input type="text" value={b.url || b.content || ''} onChange={e => updateBlock(b.id, b.type === 'LIBRARY_RESOURCE' ? 'url' : 'content', e.target.value)} placeholder="..." style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-primary)', background: 'transparent' }} />
                                                )}
                                                <InsertBar onInsert={addBlock} blockTypes={BLOCK_TYPES} index={idx + 1} />
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </>
                        )}
                    </div>
                </form>
            </main>
        </section>
    );
};

