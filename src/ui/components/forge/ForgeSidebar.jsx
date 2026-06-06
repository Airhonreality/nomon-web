import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, X } from 'lucide-react';

/**
 * 🛰️ FORGE SIDEBAR (Silo de Entidades v2)
 * Implementa filtros acumulativos, búsqueda en tiempo real y acciones rápidas.
 */
export const ForgeSidebar = ({ 
    inventory, onEdit, onDelete, activeSlug, arquetypes,
    activeTab, setActiveTab 
}) => {
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState([]); // Filtros acumulativos

    const toggleFilter = (type) => {
        setActiveFilters(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const filteredItems = inventory.filter(item => {
        const matchesSearch = (item.data?.content?.title?.es || item.slug || "").toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilters.length === 0 || activeFilters.includes(item.meta?.component_type);
        return matchesSearch && matchesFilter;
    });

    return (
        <aside className="forge-sidebar-fragment" style={{ 
            width: '22rem', borderRight: '1px solid var(--border-primary)', 
            display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)',
            height: '100%'
        }}>
            {/* 📑 TAB SWITCHER */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
                <button
                    onClick={() => setActiveTab('entities')}
                    style={{
                        flex: 1, padding: '1rem', fontSize: '0.65rem', fontWeight: 900,
                        border: 'none', borderBottom: activeTab === 'entities' ? '2px solid #002d62' : '2px solid transparent',
                        background: 'transparent', color: activeTab === 'entities' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase'
                    }}
                >
                    Entidades
                </button>
                <button
                    onClick={() => setActiveTab('allies')}
                    style={{
                        flex: 1, padding: '1rem', fontSize: '0.65rem', fontWeight: 900,
                        border: 'none', borderBottom: activeTab === 'allies' ? '2px solid #002d62' : '2px solid transparent',
                        background: 'transparent', color: activeTab === 'allies' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase'
                    }}
                >
                    Aliados
                </button>
            </div>

            {activeTab === 'entities' ? (
                <>
                    {/* 🔍 HEADER & SEARCH */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-primary)' }}>
                        <h2 style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.4, marginBottom: '1.5rem' }}>SILO DE ENTIDADES</h2>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                    <input 
                        type="text" 
                        placeholder="Buscar materia..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ 
                            width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', 
                            background: 'var(--bg-primary)', border: '1px solid var(--border-primary)',
                            fontSize: '0.75rem', outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* 🏷️ CUMULATIVE FILTERS */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Object.keys(arquetypes).map(key => {
                    const isActive = activeFilters.includes(key);
                    return (
                        <button 
                            key={key}
                            onClick={() => toggleFilter(key)}
                            style={{ 
                                padding: '0.4rem 0.8rem', fontSize: '0.5rem', fontWeight: 900,
                                background: isActive ? 'var(--accent-color)' : 'transparent',
                                color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                                border: '1px solid var(--border-primary)',
                                cursor: 'pointer', borderRadius: '2rem', transition: 'all 0.2s'
                            }}
                        >
                            {key.replace('ENTITY_', '').replace('BANNER_', '')}
                        </button>
                    );
                })}
                {activeFilters.length > 0 && (
                    <button onClick={() => setActiveFilters([])} style={{ background: 'none', border: 'none', fontSize: '0.5rem', fontWeight: 900, opacity: 0.5, cursor: 'pointer' }}>LIMPIAR</button>
                )}
            </div>

            {/* 📜 ITEM LIST */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                {filteredItems.map((item, idx) => (
                    <div 
                        key={item.slug || idx} 
                        className="silo-item"
                        style={{ 
                            padding: '1rem', marginBottom: '0.2rem',
                            borderLeft: activeSlug === item.slug ? '4px solid var(--accent-color)' : '4px solid transparent',
                            background: activeSlug === item.slug ? 'var(--bg-primary)' : 'transparent',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            cursor: 'pointer', transition: 'background 0.2s'
                        }}
                    >
                        <div style={{ flex: 1 }} onClick={() => onEdit(item)}>
                            <span style={{ fontSize: '0.45rem', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase' }}>{item.meta?.component_type}</span>
                            <h4 style={{ fontSize: '0.7rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>{item.data?.content?.title?.es || item.slug}</h4>
                        </div>
                        <div className="item-actions" style={{ display: 'flex', gap: '0.6rem', opacity: 0.4 }}>
                            <a href={`/#/materia/${item.slug}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><Eye size={12}/></a>
                            <button onClick={() => onDelete(item.slug)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}><Trash2 size={12}/></button>
                        </div>
                    </div>
                ))}
                {filteredItems.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.3, fontSize: '0.7rem' }}>Sin resonancias...</div>
                )}
            </div>
        </>
    ) : (
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em', opacity: 0.4, textTransform: 'uppercase' }}>Aliados del Satélite</h2>
                    <p style={{ fontSize: '0.75rem', lineHeight: '1.4', opacity: 0.6 }}>
                        Aquí se listan los miembros de la red que se han registrado a través del portal editorial.
                    </p>
                    <div style={{ padding: '1rem', borderLeft: '2px solid var(--accent-color)', background: 'var(--bg-primary)', fontSize: '0.7rem', opacity: 0.8 }}>
                        Revisa la lista completa, sus correos de contacto, teléfonos y áreas de interés en el panel de la derecha.
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .silo-item:hover { background: var(--bg-primary); }
                .silo-item:hover .item-actions { opacity: 1 !important; }
            `}} />
        </aside>
    );
};
