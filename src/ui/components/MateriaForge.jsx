import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { MateriaEditor } from './MateriaEditor.jsx';
import { MateriaLinker } from './MateriaLinker.jsx';
import { 
    Plus, X, Shield, Unlock, Users, Key, 
    ArrowUp, ArrowDown, Trash2, Zap, 
    Layers, Search, FileText, Image as ImageIcon,
    UserPlus, Sparkles, BookOpen, Settings, Eye, Database
} from 'lucide-react';

/**
 * 🖋️ COMPONENTE AUXILIAR: Barra de Inserción
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
 * 🏛️ NOMON ARQUETYPES & CAPABILITIES
 */
const ARQUETYPES = {
    'ENTITY_ROUTER': { 
        label: 'Ruta / Landing', 
        capabilities: ['SLUG', 'TITLE', 'COMPOSITION', 'ACCESS'] 
    },
    'ENTITY_NAVBAR': {
        label: 'Definición de Navegación',
        capabilities: ['SLUG', 'TITLE', 'NAV_LINKS']
    },
    'ENTITY_PROJECT': { 
        label: 'Proyecto', 
        capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'IMAGE', 'ACCESS', 'COMPOSITION'] 
    },
    'ENTITY_NEWS': { 
        label: 'Noticia', 
        capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'IMAGE', 'ACCESS', 'COMPOSITION'] 
    },
    'LIBRARY_RESOURCE': { 
        label: 'Biblioteca', 
        capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'METADATA_LIB', 'FILE_LINK', 'ACCESS'] 
    },
    'ENTITY_WHITELIST': { 
        label: 'Whitelist', 
        capabilities: ['SLUG', 'TITLE', 'WHITELIST_DATA'] 
    },
    'BANNER_INFO': { 
        label: 'Informativo (Banner)', 
        capabilities: ['SLUG', 'TITLE', 'SUMMARY'] 
    },
    'BANNER_ACTION': {
        label: 'Acción (Banner)',
        capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'ACCESS']
    }
};

/**
 * 🛠️ MATERIA CONSTRUCTOR (V6 - Zonal Projection Engine)
 */
export const MateriaForge = () => {
    const { bridge } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    
    const [selectedClass, setSelectedClass] = useState('ENTITY_PROJECT');
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '', summary: '', slug: '', image: '', relations: [], composition: [], pdf_url: '',
        nav_links: [], // Array de { label, slug, priority }
        metadata: { author: '', editorial: '', year: '', id_universal: '', license: 'CC BY-NC', language: 'es', tags: '', curator: '', rationale: '' },
        access_control: { strategy: 'PUBLIC', whitelist_slug: '', restricted_title: '', restricted_message: '', denied_message: '' },
        whitelist_emails: [] 
    });

    const currentArquetype = ARQUETYPES[selectedClass] || ARQUETYPES['ENTITY_PROJECT'];

    // --- LOGICA DE WHITELIST MANAGER ---
    const [newEmail, setNewEmail] = useState('');
    const addEmail = () => {
        if (!newEmail.includes('@')) return;
        if (formData.whitelist_emails.includes(newEmail.toLowerCase())) return;
        setFormData({ ...formData, whitelist_emails: [...formData.whitelist_emails, newEmail.toLowerCase().trim()] });
        setNewEmail('');
    };
    const removeEmail = (email) => {
        setFormData({ ...formData, whitelist_emails: formData.whitelist_emails.filter(e => e !== email) });
    };

    // --- LOGICA DE COMPOSICIÓN ---
    const BLOCK_TYPES = { 'TITLE': 'Título', 'MARKDOWN': 'Texto/MD', 'IMAGE': 'Imagen', 'RESONANCE': 'Resonancia' };
    const addBlock = (type, index = null) => {
        const newBlock = { type, id: Date.now(), content: '' };
        if (type === 'IMAGE') newBlock.images = [''];
        if (type === 'RESONANCE') newBlock.content = ''; 
        const next = [...formData.composition];
        if (index !== null) next.splice(index, 0, newBlock); else next.push(newBlock);
        setFormData({ ...formData, composition: next });
    };
    const updateBlock = (id, field, value) => {
        setFormData({ ...formData, composition: formData.composition.map(b => b.id === id ? { ...b, [field]: value } : b) });
    };
    const deleteBlock = (id) => setFormData({ ...formData, composition: formData.composition.filter(b => b.id !== id) });
    const moveBlock = (index, dir) => {
        const next = [...formData.composition];
        const targetIndex = index + dir;
        if (targetIndex < 0 || targetIndex >= next.length) return;
        const temp = next[index]; next[index] = next[targetIndex]; next[targetIndex] = temp;
        setFormData({ ...formData, composition: next });
    };

    const generateSlug = (txt) => (txt || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-");

    const handleEdit = (item) => {
        const d = item.data || {};
        const c = d.content || {};
        const m = item.metadata || d.metadata || {};
        
        setFormData({
            title: c.title?.es || (typeof c.title === 'string' ? c.title : '') || item.name || '',
            summary: c.summary?.es || (typeof c.summary === 'string' ? c.summary : '') || d.summary || '',
            slug: item.slug || '',
            image: c.image || d.image || item.image || '',
            relations: d.relations || [],
            composition: c.composition || [],
            pdf_url: c.pdf_url || '',
            nav_links: d.nav_links || [],
            metadata: { author: m.author || '', editorial: m.editorial || '', year: m.year || '', id_universal: m.id_universal || '', license: m.license || 'CC BY-NC', language: m.language || 'es', tags: m.tags || '', curator: m.curator || '', rationale: m.rationale || '' },
            access_control: d.access_control || { strategy: 'PUBLIC', whitelist_slug: '', restricted_title: '', restricted_message: '', denied_message: '' },
            whitelist_emails: d.emails && d.emails.length > 0 ? d.emails : (d.activations ? d.activations.map(a => a.buyer).filter(Boolean) : []),
            activations: d.activations || []
        });
        setSelectedClass(item.meta?.component_type || 'ENTITY_PROJECT');
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const cleanSlug = generateSlug(formData.slug || formData.title);

        let hashes = [];
        if (selectedClass === 'ENTITY_WHITELIST') {
            hashes = await Promise.all(formData.whitelist_emails.map(async (email) => {
                const msgBuffer = new TextEncoder().encode(email);
                const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            }));
        }
        
        const uqo = {
            protocol: 'CREATE',
            context_id: 'NOMON_ENTRIES',
            data: {
                slug: cleanSlug,
                meta: { component_type: selectedClass },
                metadata: formData.metadata,
                data: {
                    content: { title: { es: formData.title }, summary: { es: formData.summary }, image: formData.image, composition: formData.composition, pdf_url: formData.pdf_url },
                    nav_links: formData.nav_links,
                    relations: formData.relations,
                    access_control: (selectedClass !== 'ENTITY_WHITELIST' && selectedClass !== 'ENTITY_NAVBAR') ? formData.access_control : undefined,
                    whitelist: selectedClass === 'ENTITY_WHITELIST' ? hashes : undefined,
                    emails: selectedClass === 'ENTITY_WHITELIST' ? formData.whitelist_emails : undefined,
                    activations: selectedClass === 'ENTITY_WHITELIST' ? formData.activations : undefined
                }
            }
        };
        try {
            await bridge.execute(uqo);
            alert("Materia Cristalizada con éxito.");
            window.location.reload();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas disolver esta materia permanentemente?")) return;
        try {
            await bridge.execute({
                protocol: 'DELETE',
                context_id: 'NOMON_ENTRIES',
                payload: { context_id: 'NOMON_ENTRIES', slug: formData.slug }
            });
            alert("Materia Disuelta.");
            window.location.reload();
        } catch (err) { console.error(err); }
    };

    const inventory = entries || [];
    const whitelists = inventory.filter(item => item.meta?.component_type === 'ENTITY_WHITELIST');

    return (
        <section className="materia-forge-v6" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
            
            <aside style={{ width: '20%', borderRight: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-primary)' }}>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>SILO DE ENTIDADES</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {inventory.map((item, idx) => (
                        <div key={item.slug || idx} onClick={() => handleEdit(item)} style={{ padding: '0.8rem', borderBottom: '1px solid var(--border-primary)', cursor: 'pointer', background: formData.slug === item.slug ? 'var(--bg-primary)' : 'transparent', borderLeft: formData.slug === item.slug ? '4px solid var(--accent-color)' : '4px solid transparent' }}>
                            <span style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.4 }}>{item.meta?.component_type}</span>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, margin: '0.2rem 0', color: 'var(--text-primary)' }}>{item.data?.content?.title?.es || item.slug}</h4>
                        </div>
                    ))}
                </div>
                <div style={{ padding: '1rem' }}>
                    <button onClick={() => { setIsEditing(false); setFormData({ title: '', summary: '', slug: '', image: '', relations: [], composition: [], pdf_url: '', nav_config: { show_in_nav: false, priority: 0, nav_label: '' }, metadata: { author: '', editorial: '', year: '', id_universal: '', license: 'CC BY-NC', language: 'es', tags: '', curator: '', rationale: '' }, access_control: { strategy: 'PUBLIC', whitelist_slug: '', restricted_title: '', restricted_message: '', denied_message: '' }, whitelist_emails: [], activations: [] }); }} style={{ width: '100%', padding: '0.8rem', background: 'var(--accent-color)', color: 'var(--bg-primary)', border: 'none', fontWeight: 900, cursor: 'pointer' }}>+ NUEVA MATERIA</button>
                </div>
            </aside>

            <main style={{ width: '80%', overflowY: 'auto', padding: '4rem', background: 'var(--bg-primary)' }}>
                <form onSubmit={handleSave} style={{ maxWidth: '65rem', margin: '0 auto' }}>
                    
                    <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.5 }}>ARQUETIPO AGNOSTICO</label>
                            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ display: 'block', padding: '0.5rem 0', border: 'none', borderBottom: '2px solid var(--accent-color)', fontSize: '1.4rem', fontWeight: 900, background: 'transparent', color: 'var(--text-primary)', outline: 'none' }}>
                                {Object.keys(ARQUETYPES).map(key => <option key={key} value={key}>{ARQUETYPES[key].label}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {isEditing && (
                                <button type="button" onClick={handleDelete} style={{ background: 'transparent', color: '#d32f2f', border: '1px solid #d32f2f', padding: '1rem 2rem', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>DISOLVER MATERIA</button>
                            )}
                            <button type="submit" style={{ background: 'var(--accent-color)', color: 'var(--bg-primary)', border: 'none', padding: '1rem 3rem', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>CRISTALIZAR MATERIA</button>
                        </div>
                    </header>

                    {/* 🧊 ZONA ALFA: IDENTIDAD */}
                    <div className="zone-alfa" style={{ marginBottom: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', opacity: 0.3 }}><Eye size={16}/><span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em' }}>ZONA ALFA: IDENTIDAD VISUAL</span></div>
                        
                        {currentArquetype.capabilities.includes('TITLE') && (
                            <input type="text" placeholder="Título de la entidad..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ fontSize: '3rem', fontWeight: 900, width: '100%', border: 'none', borderBottom: '2px solid var(--border-primary)', padding: '1rem 0', background: 'transparent', color: 'var(--text-primary)', marginBottom: '2rem' }} />
                        )}
                        {currentArquetype.capabilities.includes('SUMMARY') && (
                            <textarea placeholder="Resumen ejecutivo..." maxLength={280} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} style={{ fontSize: '1.2rem', width: '100%', border: 'none', borderBottom: '1px solid var(--border-primary)', padding: '1rem 0', minHeight: '3rem', background: 'transparent', color: 'var(--text-primary)', marginBottom: '2rem' }} />
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {currentArquetype.capabilities.includes('SLUG') && (
                                <div><label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>IDENTIFICADOR ÚNICO (SLUG)</label>
                                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                            )}
                            {currentArquetype.capabilities.includes('IMAGE') && <MateriaLinker value={formData.image} label="IMAGEN DE PORTADA" onChange={val => setFormData({...formData, image: val})} />}
                        </div>
                    </div>

                    {/* ⚙️ ZONA SIGMA: CONFIGURACIÓN TÉCNICA */}
                    {(currentArquetype.capabilities.includes('NAV_LINKS') || currentArquetype.capabilities.includes('ACCESS') || currentArquetype.capabilities.includes('WHITELIST_DATA')) && (
                        <div className="zone-sigma" style={{ marginBottom: '5rem', background: 'var(--bg-secondary)', padding: '3rem', border: '1px solid var(--border-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', opacity: 0.6 }}><Settings size={16}/><span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em' }}>ZONA SIGMA: CONFIGURACIÓN Y SOBERANÍA</span></div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                
                                {currentArquetype.capabilities.includes('NAV_LINKS') && (
                                    <div>
                                        <label style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '1.5rem', display: 'block' }}>RESONANCIAS DE NAVEGACIÓN (LINKS)</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {formData.nav_links.map((link, idx) => (
                                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--border-primary)' }}>
                                                    <input type="text" placeholder="Etiqueta..." value={link.label} onChange={e => {
                                                        const next = [...formData.nav_links]; next[idx].label = e.target.value; setFormData({...formData, nav_links: next});
                                                    }} style={{ padding: '0.5rem', fontSize: '0.75rem' }} />
                                                    <select value={link.slug} onChange={e => {
                                                        const next = [...formData.nav_links]; next[idx].slug = e.target.value; setFormData({...formData, nav_links: next});
                                                    }} style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
                                                        <option value="">Vincular Materia...</option>
                                                        {inventory.map(ent => <option key={ent.slug} value={ent.slug}>{ent.data?.content?.title?.es || ent.slug}</option>)}
                                                    </select>
                                                    <input type="number" placeholder="Prioridad" value={link.priority} onChange={e => {
                                                        const next = [...formData.nav_links]; next[idx].priority = parseInt(e.target.value); setFormData({...formData, nav_links: next});
                                                    }} style={{ padding: '0.5rem', fontSize: '0.75rem' }} />
                                                    <button type="button" onClick={() => setFormData({...formData, nav_links: formData.nav_links.filter((_, i) => i !== idx)})} style={{ background: 'none', border: 'none', color: '#d32f2f' }}><Trash2 size={16}/></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => setFormData({...formData, nav_links: [...formData.nav_links, { label: '', slug: '', priority: 0 }]})} style={{ padding: '1rem', background: '#000', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '0.6rem' }}>+ AÑADIR LINK DE NAVEGACIÓN</button>
                                        </div>
                                    </div>
                                )}

                                {currentArquetype.capabilities.includes('ACCESS') && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}><Shield size={20} /><h3 style={{ fontSize: '0.65rem', fontWeight: 900 }}>ESTRATEGIA DE ACCESO</h3>
                                            <select value={formData.access_control.strategy} onChange={e => setFormData({ ...formData, access_control: { ...formData.access_control, strategy: e.target.value } })} style={{ padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontWeight: 900 }}>
                                                <option value="PUBLIC">PÚBLICO</option><option value="REGISTERED_ONLY">REGISTRADOS</option><option value="REFERENCE_WHITELIST">WHITELIST ESPECÍFICA</option>
                                            </select>
                                        </div>
                                        {formData.access_control.strategy === 'REFERENCE_WHITELIST' && <select value={formData.access_control.whitelist_slug} onChange={e => setFormData({ ...formData, access_control: { ...formData.access_control, whitelist_slug: e.target.value } })} style={{ padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}><option value="">Selecciona una whitelist...</option>{whitelists.map(w => <option key={w.slug} value={w.slug}>{w.name || w.slug}</option>)}</select>}
                                    </div>
                                )}

                                {currentArquetype.capabilities.includes('WHITELIST_DATA') && (
                                    <div>
                                        <label style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '1rem', display: 'block' }}>NODOS AUTORIZADOS (GESTIÓN DE ACCESO)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <input type="email" placeholder="añadir email..." value={newEmail} onChange={e => setNewEmail(e.target.value)} style={{ flex: 1, padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }} />
                                            <button type="button" onClick={addEmail} style={{ padding: '0.8rem 2rem', background: '#000', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>AÑADIR</button>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                            {formData.whitelist_emails.map(email => (
                                                <div key={email} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 1rem', background: '#000', color: '#fff', borderRadius: '2rem', fontSize: '0.75rem' }}>
                                                    {email} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeEmail(email)} />
                                                </div>
                                            ))}
                                            {formData.whitelist_emails.length === 0 && <p style={{ fontSize: '0.7rem', opacity: 0.4 }}>No hay nodos autorizados. Esta lista está vacía.</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 🔮 ZONA OMEGA: MATERIA Y CONTENIDO */}
                    <div className="zone-omega">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', opacity: 0.3 }}><Database size={16}/><span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em' }}>ZONA OMEGA: PROFUNDIDAD DE MATERIA</span></div>
                        
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
                                <InsertBar onInsert={addBlock} blockTypes={BLOCK_TYPES} index={0} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                                    {formData.composition.map((b, idx) => (
                                        <div key={b.id} style={{ border: '1px solid var(--border-primary)', padding: '1.5rem', background: 'var(--bg-secondary)' }}>
                                            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><span style={{ fontSize: '0.6rem', fontWeight: 900, opacity: 0.5 }}>{BLOCK_TYPES[b.type]}</span>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}><button type="button" onClick={() => moveBlock(idx, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}><ArrowUp size={14}/></button><button type="button" onClick={() => moveBlock(idx, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}><ArrowDown size={14}/></button><button type="button" onClick={() => deleteBlock(b.id)} style={{ background: 'none', border: 'none', color: '#d32f2f' }}><Trash2 size={14}/></button></div>
                                            </header>
                                            {b.type === 'MARKDOWN' ? <MateriaEditor value={b.content} onChange={val => updateBlock(b.id, 'content', val)} /> : b.type === 'RESONANCE' ? (
                                                <select value={b.content || ''} onChange={e => updateBlock(b.id, 'content', e.target.value)} style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontWeight: 800 }}>
                                                    <option value="">Selecciona materia...</option>{inventory.map(item => <option key={item.slug} value={item.slug}>[{item.meta?.component_type}] {item.data?.content?.title?.es || item.slug}</option>)}
                                                </select>
                                            ) : <input type="text" value={b.content || b.url || ''} onChange={e => updateBlock(b.id, 'content', e.target.value)} style={{ width: '100%', padding: '1rem' }} />}
                                            <InsertBar onInsert={addBlock} blockTypes={BLOCK_TYPES} index={idx + 1} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </main>
        </section>
    );
};
