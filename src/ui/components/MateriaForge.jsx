import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

/**
 * 🛠️ MATERIA CONSTRUCTOR (Admin Actor)
 */
export const MateriaForge = () => {
    const { bridge } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    
    const [selectedClass, setSelectedClass] = useState('DATA_CARD');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '', summary: '', slug: '', image: '', body: '', type: 'DATA_CARD', relations: [], composition: [], pdf_url: ''
    });

    // Tipos de bloques disponibles
    const BLOCK_TYPES = {
        'TITLE': 'Título Destacado',
        'MARKDOWN': 'Bloque de Texto / MD',
        'IMAGE': 'Imagen / Galería',
        'RESONANCE': 'Vínculo (Resonancia)',
        'LIBRARY_RESOURCE': 'Recurso Bibliográfico'
    };

    const addBlock = (type) => {
        const newBlock = { type, id: Date.now(), content: '' };
        if (type === 'IMAGE') newBlock.images = [''];
        if (type === 'LIBRARY_RESOURCE') {
            newBlock.url = '';
            newBlock.resType = 'PDF';
            newBlock.desc = '';
            newBlock.curator = '';
            newBlock.rationale = '';
        }
        setFormData(prev => ({ ...prev, composition: [...prev.composition, newBlock] }));
    };

    const updateBlock = (id, data) => {
        setFormData(prev => ({
            ...prev,
            composition: prev.composition.map(b => b.id === id ? { ...b, ...data } : b)
        }));
    };

    const removeBlock = (id) => {
        setFormData(prev => ({
            ...prev,
            composition: prev.composition.filter(b => b.id !== id)
        }));
    };

    const inventory = entries || [];
    const groupedInventory = inventory.reduce((acc, item) => {
        const type = item.meta?.component_type || item.metadata?.type || 'OTRO';
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {});

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
            .replace(/[^a-z0-9]/g, '-') // Reemplaza no-alfanumérico por guiones
            .replace(/-+/g, '-') // Elimina guiones dobles
            .replace(/^-|-$/g, ''); // Elimina guiones al inicio/final
    };
    
    // 🧬 Efecto de Auto-Slug
    useEffect(() => {
        if (!isEditing && formData.title) {
            setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
        }
    }, [formData.title, isEditing]);

    const handleSelectForEdit = (item) => {
        const title = item.data?.content?.title?.es || item.metadata?.title || item.name || '';
        const summary = item.data?.content?.summary?.es || item.metadata?.summary || item.description || '';
        const image = item.data?.content?.image || item.metadata?.image || '';
        const type = item.meta?.component_type || item.metadata?.type || 'DATA_CARD';
        const body = item.data?.content?.body || item.metadata?.body_markdown || '';
        const relations = item.data?.relations || item.data?.content?.relations || [];
        const composition = item.data?.content?.composition || [];
        const pdf_url = item.data?.content?.pdf_url || '';

        setFormData({ title, summary, type, slug: item.slug || '', image, body, relations, composition, pdf_url });
        setSelectedClass(type);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ title: '', summary: '', body: '', type: selectedClass, slug: '', image: '', relations: [], composition: [], pdf_url: '' });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas disolver esta materia? Esta acción es irreversible en el Silo local.")) return;
        
        try {
            await bridge.execute({
                protocol: 'DELETE',
                context_id: 'NOMON_ENTRIES',
                data: { slug: formData.slug }
            });
            resetForm();
            window.location.reload(); 
        } catch (err) { alert("Error al disolver: " + err.message); }
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
                        body: formData.body,
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
            alert("Materia cristalizada.");
            if (!isEditing) resetForm();
        } catch (err) { console.error(err); }
    };

    const uploadFile = async (file) => {
        if (!file) return null;
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'x-filename': file.name },
                body: file
            });
            const result = await response.json();
            return result.url;
        } catch (err) {
            console.error("Error subiendo materia:", err);
            return null;
        }
    };

    const handleFileUpload = async (e) => {
        const url = await uploadFile(e.target.files[0]);
        if (url) setFormData({ ...formData, image: url });
    };

    return (
        <section className="materia-forge-container">
            <div className="forge-main">
                <div className="class-selector-header">
                    <label>CLASE DE ENTIDAD</label>
                    <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setFormData({...formData, type: e.target.value}); }}>
                        <option value="ENTITY_NEWS">Entidad: Noticia</option>
                        <option value="ENTITY_PROJECT">Entidad: Proyecto</option>
                        <option value="ENTITY_ALLY">Entidad: Aliado</option>
                        <option value="LIBRARY_RESOURCE">Recurso de Biblioteca</option>
                        <option value="BANNER_INFO">Estructura: Banner Informativo</option>
                        <option value="BANNER_ACTION">Estructura: Banner de Acción (Landing)</option>
                    </select>
                    <button className="new-btn" onClick={resetForm}>+ NUEVA ENTIDAD</button>
                </div>
                <h2 className="forge-title">{isEditing ? `Editando: ${formData.slug}` : `Nueva Entidad: ${selectedClass}`}</h2>
                <form onSubmit={handleSave} className="forge-form">
                    <div className="form-row">
                        <input type="text" placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        {!isEditing && <input type="text" placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />}
                    </div>
                    <div className="form-row" style={{ alignItems: 'center' }}>
                        <input type="text" style={{ flex: 1 }} placeholder="URL Imagen" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                        <label className="file-upload-btn" style={{ marginLeft: '10px', cursor: 'pointer', background: '#000', color: '#fff', padding: '10px 15px' }}>
                            📁 CARGAR LOCAL
                            <input type="file" onChange={handleFileUpload} style={{display: 'none'}} />
                        </label>
                    </div>

                    {/* 🏗️ CARRIL VERTICAL DE COMPOSICIÓN */}
                    <div className="composition-lane">
                        <div className="add-block-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))', gap: '0.5rem', background: '#000', padding: '0.5rem', marginBottom: '2rem' }}>
                            {Object.keys(BLOCK_TYPES).map(type => (
                                <button key={type} type="button" onClick={() => addBlock(type)} className="forge-btn" style={{ fontSize: '0.6rem', padding: '0.8rem' }}>+ {BLOCK_TYPES[type]}</button>
                            ))}
                        </div>

                        <label className="group-label">SECUENCIA DE COMPOSICIÓN</label>
                        
                        <div className="blocks-vertical-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {formData.composition.map((block, i) => (
                                <div key={block.id} className="composition-block" style={{ background: '#f9f9f9', padding: '1.5rem', border: '0.05rem solid rgba(0,0,0,0.1)', position: 'relative' }}>
                                    <span className="block-badge" style={{ fontSize: '0.6rem', fontWeight: 900, opacity: 0.5 }}>#{i+1} {BLOCK_TYPES[block.type]}</span>
                                    <button type="button" onClick={() => removeBlock(block.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.6rem', fontWeight: 900 }}>ELIMINAR</button>
                                    
                                    <div className="block-editor" style={{ marginTop: '1rem' }}>
                                        {block.type === 'TITLE' && <input type="text" placeholder="Texto del Título" value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })} />}
                                        {block.type === 'MARKDOWN' && <textarea placeholder="Contenido Markdown / HTML" value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })} style={{ minHeight: '15rem' }} />}
                                        {block.type === 'IMAGE' && (
                                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                {block.images.map((img, imgIdx) => (
                                                    <div key={imgIdx} style={{ display: 'flex', gap: '5px' }}>
                                                        <input type="text" placeholder={`URL Imagen ${imgIdx + 1}`} value={img} onChange={e => {
                                                            const newImgs = [...block.images];
                                                            newImgs[imgIdx] = e.target.value;
                                                            updateBlock(block.id, { images: newImgs });
                                                        }} style={{ flex: 1 }} />
                                                        <label className="file-upload-btn" style={{ cursor: 'pointer', background: '#000', color: '#fff', padding: '5px 10px', fontSize: '0.6rem' }}>
                                                            📁
                                                            <input type="file" onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;
                                                                const url = await uploadFile(file);
                                                                if (url) {
                                                                    const newImgs = [...block.images];
                                                                    newImgs[imgIdx] = url;
                                                                    updateBlock(block.id, { images: newImgs });
                                                                }
                                                            }} style={{display: 'none'}} />
                                                        </label>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => updateBlock(block.id, { images: [...block.images, ''] })} className="new-btn" style={{ fontSize: '0.6rem' }}>+ AÑADIR OTRA IMAGEN A LA GALERÍA</button>
                                            </div>
                                        )}
                                        {block.type === 'RESONANCE' && (
                                            <select value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })}>
                                                <option value="">Seleccionar materia a incrustar...</option>
                                                {inventory.map(m => <option key={m.slug} value={m.slug}>{m.data?.content?.title?.es || m.slug}</option>)}
                                            </select>
                                        )}
                                        {block.type === 'LIBRARY_RESOURCE' && (
                                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                <div 
                                                    className="dropzone"
                                                    onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = '#eee'; }}
                                                    onDragLeave={e => { e.preventDefault(); e.currentTarget.style.background = 'none'; }}
                                                    onDrop={async (e) => {
                                                        e.preventDefault();
                                                        e.currentTarget.style.background = 'none';
                                                        const file = e.dataTransfer.files[0];
                                                        if (file) {
                                                            const url = await uploadFile(file);
                                                            if (url) updateBlock(block.id, { url });
                                                        }
                                                    }}
                                                    style={{ border: '0.1rem dashed #ccc', padding: '1.5rem', textAlign: 'center', transition: 'all 0.3s' }}
                                                >
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <input type="text" placeholder="URL Archivo / Link" value={block.url} onChange={e => updateBlock(block.id, { url: e.target.value })} style={{ flex: 2 }} />
                                                        <label className="file-upload-btn" style={{ cursor: 'pointer', background: '#000', color: '#fff', padding: '10px 15px', fontSize: '0.7rem' }}>
                                                            📁 SUBIR PDF
                                                            <input type="file" onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const url = await uploadFile(file);
                                                                    if (url) updateBlock(block.id, { url });
                                                                }
                                                            }} style={{display: 'none'}} />
                                                        </label>
                                                        <select value={block.resType} onChange={e => updateBlock(block.id, { resType: e.target.value })} style={{ flex: 1 }}>
                                                            <option value="PDF">Documento PDF</option>
                                                            <option value="WEB">Link Externo</option>
                                                            <option value="VIDEO">Video / Multimedia</option>
                                                        </select>
                                                    </div>
                                                    <small style={{ display: 'block', marginTop: '1rem', color: '#888' }}>O arrastra tu PDF aquí</small>
                                                </div>
                                                <input type="text" placeholder="Descripción corta del recurso" value={block.desc} onChange={e => updateBlock(block.id, { desc: e.target.value })} />
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input type="text" placeholder="Curador" value={block.curator} onChange={e => updateBlock(block.id, { curator: e.target.value })} />
                                                    <input type="text" placeholder="Justificación (Por qué NOMON?)" value={block.rationale} onChange={e => updateBlock(block.id, { rationale: e.target.value })} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <label className="group-label">CUERPO / TEXTO PRINCIPAL (Legacy)</label>
                    <textarea placeholder="Cuerpo de la materia..." value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} style={{ minHeight: '10rem' }} />

                    <label className="group-label">RESUMEN / SUBTÍTULO (Card View)</label>
                    <textarea placeholder="Resumen / Subtítulo para la Card (Opcional)" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
                    
                    <div className="forge-actions">
                        <button type="submit" className="forge-btn">
                            {isEditing ? 'ACTUALIZAR' : 'CRISTALIZAR'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleDelete} className="forge-btn-delete">
                                DISOLVER
                            </button>
                        )}
                        <button type="button" onClick={resetForm} className="forge-btn-cancel">CANCELAR</button>
                    </div>
                </form>
            </div>
            <aside className="forge-inventory">
                <h3 className="inventory-header">CATÁLOGO DE MATERIA</h3>
                {Object.keys(groupedInventory).map(type => (
                    <div key={type} className="inventory-group">
                        <span className="group-label">{type}</span>
                        {groupedInventory[type].map((item, idx) => (
                            <div key={idx} className="inventory-item" onClick={() => handleSelectForEdit(item)}>
                                <strong>{item.data?.content?.title?.es || item.name}</strong>
                                <code>{item.slug}</code>
                            </div>
                        ))}
                    </div>
                ))}
            </aside>
        </section>
    );
};
