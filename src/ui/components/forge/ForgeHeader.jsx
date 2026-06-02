import React from 'react';

/**
 * 👑 FORGE HEADER (Sticky Command Bar)
 */
export const ForgeHeader = ({ 
    selectedClass, setSelectedClass, arquetypes, 
    isEditing, onSave, onDelete, onNew 
}) => {
    return (
        <header style={{ 
            position: 'sticky', top: 0, zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
            padding: '2rem 4rem', borderBottom: '1px solid var(--border-primary)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '4rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div>
                    <label style={{ fontSize: '0.55rem', fontWeight: 900, opacity: 0.5, display: 'block' }}>ARQUETIPO AGNOSTICO</label>
                    <select 
                        value={selectedClass} 
                        onChange={e => setSelectedClass(e.target.value)} 
                        style={{ 
                            padding: '0.5rem 0', border: 'none', borderBottom: '2px solid var(--accent-color)', 
                            fontSize: '1.4rem', fontWeight: 900, background: 'transparent', 
                            color: 'var(--text-primary)', outline: 'none', cursor: 'pointer'
                        }}
                    >
                        {Object.keys(arquetypes).map(key => <option key={key} value={key}>{arquetypes[key].label}</option>)}
                    </select>
                </div>
                <button 
                    type="button" 
                    onClick={onNew}
                    style={{ 
                        padding: '0.5rem 1rem', background: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-primary)', fontSize: '0.6rem', 
                        fontWeight: 900, cursor: 'pointer' 
                    }}
                >
                    + NUEVA
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={onDelete} 
                        style={{ 
                            background: 'transparent', color: '#d32f2f', border: '1px solid #d32f2f', 
                            padding: '1rem 2rem', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' 
                        }}
                    >
                        DISOLVER MATERIA
                    </button>
                )}
                <button 
                    type="button"
                    onClick={onSave}
                    style={{ 
                        background: 'var(--accent-color)', color: 'var(--bg-primary)', 
                        border: 'none', padding: '1rem 3rem', fontSize: '0.7rem', 
                        fontWeight: 900, cursor: 'pointer', boxShadow: '0 1rem 2rem rgba(0,0,0,0.1)'
                    }}
                >
                    CRISTALIZAR MATERIA
                </button>
            </div>
        </header>
    );
};
