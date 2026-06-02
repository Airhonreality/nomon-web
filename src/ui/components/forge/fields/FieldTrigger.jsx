import React from 'react';
import { Zap } from 'lucide-react';

export const FieldTrigger = ({ value, onChange }) => {
    const config = value || { workflow_id: '', label: 'Ejecutar Protocolo' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                <Zap size={14} />
                <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.1em' }}>CONFIGURACIÓN DEL DISPARADOR</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>ID DEL WORKFLOW</label>
                    <input 
                        type="text" 
                        placeholder="Ej: SALE_PIPELINE" 
                        value={config.workflow_id || ''} 
                        onChange={e => onChange({ ...config, workflow_id: e.target.value })} 
                        style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontWeight: 800 }} 
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>TEXTO DEL BOTÓN</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Procesar Venta" 
                        value={config.label || ''} 
                        onChange={e => onChange({ ...config, label: e.target.value })} 
                        style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontWeight: 800 }} 
                    />
                </div>
            </div>
            <p style={{ fontSize: '0.6rem', opacity: 0.4 }}>Este botón no tiene lógica propia. Solo dispara el workflow especificado a través del Bridge.</p>
        </div>
    );
};
