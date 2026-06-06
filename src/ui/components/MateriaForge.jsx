import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

// Fragmentos
import { ForgeSidebar } from './forge/ForgeSidebar.jsx';
import { ForgeHeader } from './forge/ForgeHeader.jsx';
import { ForgeAlfa } from './forge/ForgeAlfa.jsx';
import { ForgeSigma } from './forge/ForgeSigma.jsx';
import { ForgeOmega } from './forge/ForgeOmega.jsx';

/**
 * 🏛️ NOMON ARQUETYPES & CAPABILITIES
 */
const ARQUETYPES = {
    'ENTITY_ROUTER': { label: 'Ruta / Landing', capabilities: ['SLUG', 'TITLE', 'COMPOSITION', 'ACCESS'] },
    'ENTITY_NAVBAR': { label: 'Definición de Navegación', capabilities: ['SLUG', 'TITLE', 'NAV_LINKS'] },
    'ENTITY_PROJECT': { label: 'Proyecto', capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'IMAGE', 'ACCESS', 'COMPOSITION'] },
    'ENTITY_NEWS': { label: 'Noticia', capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'IMAGE', 'ACCESS', 'COMPOSITION'] },
    'LIBRARY_RESOURCE': { label: 'Biblioteca', capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'METADATA_LIB', 'FILE_LINK', 'ACCESS'] },
    'ENTITY_WHITELIST': { label: 'Whitelist', capabilities: ['SLUG', 'TITLE', 'WHITELIST_DATA'] },
    'ENTITY_WORKFLOW': { label: 'Workflow (Lógica)', capabilities: ['SLUG', 'TITLE', 'WORKFLOW_EDITOR'] },
    'SYSTEM_CONFIG': { label: 'Configuración del Satélite', capabilities: ['SLUG', 'TITLE', 'SYSTEM_SETTINGS'] },
    'BANNER_INFO': { label: 'Informativo (Banner)', capabilities: ['SLUG', 'TITLE', 'SUMMARY'] },
    'BANNER_ACTION': { label: 'Acción (Banner)', capabilities: ['SLUG', 'TITLE', 'SUMMARY', 'ACCESS'] }
};

const BLOCK_TYPES = { 
    'TITLE': 'Título', 'MARKDOWN': 'Texto/MD', 'IMAGE': 'Imagen', 
    'RESONANCE': 'Resonancia', 'DYNAMIC_GRID': 'Rejilla Inteligente (Grid)', 
    'GALLERY': 'Galería de Imágenes', 'RADIAL_MAP': 'Mapa Radial de Relaciones',
    'SOVEREIGN_TRIGGER': 'Disparador Soberano (Botón/Workflow)',
    'HERO_LOGO': 'Logo de Portada (Hero)'
};

/**
 * 🛠️ MATERIA FORGE ORCHESTRATOR (v7 - Radical Fragmented Engine)
 */
export const MateriaForge = () => {
    const { bridge } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    const { remoteData: allies } = useIndraResonance('NOMON_ALLY');
    
    const [activeTab, setActiveTab] = useState('entities'); // 'entities' | 'allies'
    const [selectedClass, setSelectedClass] = useState('ENTITY_PROJECT');
    const [isEditing, setIsEditing] = useState(false);
    const [isSlugDirty, setIsSlugDirty] = useState(false);
    const [originalSlug, setOriginalSlug] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '', summary: '', slug: '', image: '', relations: [], composition: [], pdf_url: '',
        nav_links: [],
        manifest: { active_nav_slug: '', home_slug: '' },
        intent_id: '', steps: [],
        metadata: { author: '', editorial: '', year: '', id_universal: '', license: 'CC BY-NC', language: 'es', tags: '', curator: '', rationale: '' },
        access_control: { strategy: 'PUBLIC', whitelist_slug: '', restricted_title: '', restricted_message: '', denied_message: '' },
        whitelist_emails: [] 
    });

    const currentArquetype = ARQUETYPES[selectedClass] || ARQUETYPES['ENTITY_PROJECT'];

    // --- LOGICA DE WHITELIST ---
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

    // --- LOGICA DE SLUGS ---
    const generateSlug = (txt) => (txt || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-");
    
    useEffect(() => {
        if (!isEditing && !isSlugDirty) {
            setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
        }
    }, [formData.title, isEditing, isSlugDirty]);

    // --- LOGICA DE COMPOSICIÓN ---
    const addBlock = (type, index = null) => {
        const newBlock = { type, id: Date.now(), content: '' };
        if (type === 'IMAGE') newBlock.images = [''];
        if (type === 'GALLERY') newBlock.images = ['', '', ''];
        if (type === 'DYNAMIC_GRID') newBlock.content = { title: '', classes: ['ENTITY_PROJECT', 'ENTITY_NEWS'], limit: 6 };
        if (type === 'RADIAL_MAP') newBlock.content = { title: '', relations: [] };
        if (type === 'SOVEREIGN_TRIGGER') newBlock.content = { label: 'EJECUTAR', workflow_id: '' };
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

    // --- PERSISTENCIA ---
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
            manifest: d.manifest || { active_nav_slug: '', home_slug: '' },
            intent_id: d.intent_id || '',
            steps: d.steps || [],
            metadata: { author: m.author || '', editorial: m.editorial || '', year: m.year || '', id_universal: m.id_universal || '', license: m.license || 'CC BY-NC', language: m.language || 'es', tags: m.tags || '', curator: m.curator || '', rationale: m.rationale || '' },
            access_control: d.access_control || { strategy: 'PUBLIC', whitelist_slug: '', restricted_title: '', restricted_message: '', denied_message: '' },
            whitelist_emails: d.emails || [],
            activations: d.activations || []
        });
        setSelectedClass(item.meta?.component_type || 'ENTITY_PROJECT');
        setIsEditing(true);
        setOriginalSlug(item.slug);
        setIsSlugDirty(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
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
                    content: { 
                        title: { es: formData.title }, 
                        summary: { es: formData.summary }, 
                        image: formData.image, 
                        composition: formData.composition, 
                        pdf_url: formData.pdf_url 
                    },
                    relations: formData.relations,
                    // Persistencia Sensible a Capacidades
                    ...(currentArquetype.capabilities.includes('NAV_LINKS') && { nav_links: formData.nav_links }),
                    ...(currentArquetype.capabilities.includes('SYSTEM_SETTINGS') && { manifest: formData.manifest }),
                    ...(currentArquetype.capabilities.includes('WORKFLOW_EDITOR') && { 
                        intent_id: formData.intent_id, 
                        steps: formData.steps 
                    }),
                    ...(currentArquetype.capabilities.includes('ACCESS') && { access_control: formData.access_control }),
                    ...(currentArquetype.capabilities.includes('WHITELIST_DATA') && { 
                        whitelist: hashes, 
                        emails: formData.whitelist_emails, 
                        activations: formData.activations 
                    })
                }
            }
        };
        try {
            if (isEditing && originalSlug && originalSlug !== cleanSlug) {
                await bridge.execute({ protocol: 'DELETE', context_id: 'NOMON_ENTRIES', payload: { context_id: 'NOMON_ENTRIES', slug: originalSlug } });
            }
            await bridge.execute(uqo);
            alert("Materia Cristalizada.");
            window.location.reload();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (slug) => {
        const targetSlug = slug || formData.slug;
        if (!window.confirm(`¿Disolver ${targetSlug}?`)) return;
        try {
            await bridge.execute({ protocol: 'DELETE', context_id: 'NOMON_ENTRIES', payload: { context_id: 'NOMON_ENTRIES', slug: targetSlug } });
            alert("Materia Disuelta.");
            window.location.reload();
        } catch (err) { console.error(err); }
    };

    const handleNew = () => {
        setIsEditing(false);
        setOriginalSlug(null);
        setIsSlugDirty(false);
        setFormData({ 
            title: '', summary: '', slug: '', image: '', relations: [], composition: [], pdf_url: '', nav_links: [],
            manifest: { active_nav_slug: '', home_slug: '' },
            intent_id: '', steps: [],
            metadata: { author: '', editorial: '', year: '', id_universal: '', license: 'CC BY-NC', language: 'es', tags: '', curator: '', rationale: '' }, 
            access_control: { strategy: 'PUBLIC', whitelist_slug: '', restricted_title: '', restricted_message: '', denied_message: '' }, 
            whitelist_emails: [], activations: [] 
        });
    };

    const handleDeleteAlly = async (slug) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar a este aliado?`)) return;
        try {
            await bridge.execute({
                protocol: 'DELETE',
                context_id: 'NOMON_ALLY',
                payload: { context_id: 'NOMON_ALLY', slug }
            });
            alert("Aliado disuelto de la red.");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Error al eliminar aliado. Comprueba los permisos de escritura del satélite.");
        }
    };

    const handleExportCSV = () => {
        if (!allies || allies.length === 0) return;
        const headers = ['Email', 'Nombre', 'Telefono', 'Area de Interes', 'Fecha Registro'];
        const rows = allies.map(a => [
            a.email || '',
            a.name || '',
            a.phone || '',
            a.interest_area || '',
            a.timestamp || ''
        ]);
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `nomon_allies_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="materia-forge-v7" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
            
            <ForgeSidebar 
                inventory={entries || []} 
                activeSlug={formData.slug}
                arquetypes={ARQUETYPES}
                onEdit={handleEdit}
                onDelete={handleDelete}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
                {activeTab === 'entities' ? (
                    <>
                        <ForgeHeader 
                            selectedClass={selectedClass}
                            setSelectedClass={setSelectedClass}
                            arquetypes={ARQUETYPES}
                            isEditing={isEditing}
                            onSave={handleSave}
                            onDelete={() => handleDelete()}
                            onNew={handleNew}
                        />

                        <div style={{ maxWidth: '65rem', margin: '0 auto', padding: '0 4rem 10rem 4rem' }}>
                            <ForgeAlfa 
                                formData={formData} 
                                setFormData={setFormData} 
                                currentArquetype={currentArquetype}
                                onSlugChange={(val) => { setIsSlugDirty(true); setFormData({...formData, slug: val}); }}
                            />

                            <ForgeSigma 
                                formData={formData} 
                                setFormData={setFormData}
                                currentArquetype={currentArquetype}
                                inventory={entries || []}
                                whitelists={(entries || []).filter(item => item.meta?.component_type === 'ENTITY_WHITELIST')}
                                newEmail={newEmail}
                                setNewEmail={setNewEmail}
                                addEmail={addEmail}
                                removeEmail={removeEmail}
                            />

                            <ForgeOmega 
                                formData={formData} 
                                setFormData={setFormData}
                                currentArquetype={currentArquetype}
                                inventory={entries || []}
                                arquetypes={ARQUETYPES}
                                blockTypes={BLOCK_TYPES}
                                addBlock={addBlock}
                                updateBlock={updateBlock}
                                deleteBlock={deleteBlock}
                                moveBlock={moveBlock}
                            />
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '4rem', maxWidth: '75rem', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-primary)', paddingBottom: '2rem', marginBottom: '3rem' }}>
                            <div>
                                <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.25em', color: 'var(--text-secondary)', opacity: 0.5 }}>PANEL DE CONTROL</span>
                                <h1 style={{ fontSize: '2.2rem', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, margin: '0.5rem 0 0', color: 'var(--text-primary)' }}>Aliados Registrados</h1>
                            </div>
                            <button
                                onClick={handleExportCSV}
                                disabled={!allies || allies.length === 0}
                                style={{
                                    background: 'var(--text-primary)', color: 'var(--bg-primary)',
                                    border: 'none', padding: '0.8rem 1.6rem', fontSize: '0.65rem',
                                    fontWeight: 900, cursor: 'pointer', letterSpacing: '0.08em',
                                    opacity: (!allies || allies.length === 0) ? 0.5 : 1
                                }}
                            >
                                EXPORTAR A CSV (EXCEL)
                            </button>
                        </div>

                        {/* ⚠️ DIDÁCTICA DEV E INFORME DE OBSTÁCULOS */}
                        <div style={{ background: '#f9f9fb', borderLeft: '4px solid #002d62', padding: '1.5rem', marginBottom: '3rem' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem', color: '#002d62' }}>💡 Nota de Arquitectura y Persistencia</h4>
                            <p style={{ fontSize: '0.75rem', lineHeight: '1.6', margin: 0, opacity: 0.75 }}>
                                Este satélite web opera bajo una <strong>arquitectura desacoplada y estática (Jamstack)</strong>. Los registros de usuarios 
                                se inician localmente en el cliente. Para consolidarlos en la base de datos centralizada (almacenada en el repositorio remoto <code>local_database.json</code>) 
                                y que aparezcan en esta lista global, se requiere contar con la sesión de administrador activa y con la <strong>llave soberana de escritura</strong> cargada a través del modal de ingreso.
                            </p>
                        </div>

                        {/* 📊 LISTA / TABLA DE REGISTROS */}
                        <div style={{ border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
                            {allies && allies.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: 800 }}>Nombre</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: 800 }}>Correo Electrónico</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: 800 }}>Teléfono</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: 800 }}>Área de Interés</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: 800 }}>Fecha</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: 800, textAlign: 'center' }}>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allies.map((ally, idx) => (
                                            <tr key={ally.slug || idx} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                                                <td style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>{ally.name}</td>
                                                <td style={{ padding: '1.2rem 1.5rem', fontFamily: 'monospace', opacity: 0.85 }}>{ally.email}</td>
                                                <td style={{ padding: '1.2rem 1.5rem' }}>{ally.phone || 'N/A'}</td>
                                                <td style={{ padding: '1.2rem 1.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{ally.interest_area || 'N/A'}</td>
                                                <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.7rem', opacity: 0.6 }}>
                                                    {ally.timestamp ? new Date(ally.timestamp).toLocaleString() : 'N/A'}
                                                </td>
                                                <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleDeleteAlly(ally.slug)}
                                                        style={{
                                                            background: 'none', border: 'none', color: '#d32f2f',
                                                            fontWeight: 900, fontSize: '0.65rem', cursor: 'pointer',
                                                            textTransform: 'uppercase', letterSpacing: '0.05em'
                                                        }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
                                    No hay aliados registrados en el silo remoto en este momento.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </section>
    );
};
