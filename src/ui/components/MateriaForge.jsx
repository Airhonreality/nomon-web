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
        title: '', summary: '', slug: '', image: '', body: '', type: 'DATA_CARD'
    });

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

        setFormData({ title, summary, type, slug: item.slug || '', image, body });
        setSelectedClass(type);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ title: '', summary: '', type: selectedClass, slug: '', image: '', body: '' });
        setIsEditing(false);
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
                        body: formData.body
                    }
                }
            }
        };

        try {
            await bridge.execute(uqo);
            alert("Materia cristalizada.");
            if (!isEditing) resetForm();
        } catch (err) { console.error(err); }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'x-filename': file.name },
                body: file
            });
            const result = await response.json();
            if (result.url) setFormData({ ...formData, image: result.url });
        } catch (err) { console.error(err); }
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
                    <textarea placeholder="Resumen / Subtítulo" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
                    
                    {/* El cuerpo ahora es universal para cualquier Entidad, Card o Banner de Acción */}
                    {(selectedClass.startsWith('ENTITY_') || selectedClass === 'DATA_CARD' || selectedClass === 'BANNER_ACTION') && (
                        <textarea placeholder="Cuerpo Completo (Vista Expandida / Markdown / HTML)" value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} className="body-editor" />
                    )}
                    <div className="forge-actions">
                        <button type="submit" className="forge-btn">{isEditing ? 'ACTUALIZAR' : 'CRISTALIZAR'}</button>
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
