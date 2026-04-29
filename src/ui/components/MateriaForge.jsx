import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

/**
 * 🛠️ MATERIA CONSTRUCTOR (Admin Actor)
 */
export const MateriaForge = () => {
    const { bridge } = useSovereign();
    // Resonamos con las entradas y con el mapa de componentes (Estructura)
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    
    const [selectedClass, setSelectedClass] = useState('DATA_CARD');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        slug: '',
        image: '',
        body: '',
        type: 'DATA_CARD'
    });

    // 📂 Agrupación de Inventario
    const inventory = entries || [];
    const groupedInventory = inventory.reduce((acc, item) => {
        const type = item.meta?.component_type || item.metadata?.type || 'OTRO';
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {});

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
        const uqo = {
            protocol: 'CREATE',
            context_id: 'NOMON_ENTRIES',
            data: {
                slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-'),
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

    return (
        <section className="materia-forge-container">
            <div className="forge-main">
                {/* 👑 SELECTOR DE CLASE SUPREMO */}
                <div className="class-selector-header">
                    <label>CLASE DE ENTIDAD</label>
                    <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setFormData({...formData, type: e.target.value}); }}>
                        <option value="ENTITY_NEWS">Entidad: Noticia</option>
                        <option value="ENTITY_PROJECT">Entidad: Proyecto</option>
                        <option value="ENTITY_ALLY">Entidad: Aliado</option>
                        <option value="BANNER_INFO">Estructura: Banner Intermedio</option>
                    </select>
                    <button className="new-btn" onClick={resetForm}>+ NUEVA ENTIDAD</button>
                </div>

                <h2 className="forge-title">{isEditing ? `Editando: ${formData.slug}` : `Nueva Entidad: ${selectedClass}`}</h2>
                
                <form onSubmit={handleSave} className="forge-form">
                    <div className="form-row">
                        <input type="text" placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        {!isEditing && <input type="text" placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />}
                    </div>

                    <input type="text" placeholder="URL Imagen" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />

                    <textarea placeholder="Resumen / Subtítulo (Vista Colapsada)" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />

                    {/* El cuerpo ahora es universal para cualquier Entidad */}
                    {selectedClass.startsWith('ENTITY_') && (
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
