import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Activity } from 'lucide-react';

export const FieldWorkflow = ({ value, onChange }) => {
    const steps = value || [];

    const addStep = (op) => {
        onChange([...steps, { id: Date.now(), op, params: {} }]);
    };

    const updateStep = (id, field, val) => {
        onChange(steps.map(s => s.id === id ? { ...s, [field]: val } : s));
    };

    const updateParams = (id, key, val) => {
        onChange(steps.map(s => s.id === id ? { ...s, params: { ...s.params, [key]: val } } : s));
    };

    const removeStep = (id) => {
        onChange(steps.filter(s => s.id !== id));
    };

    const moveStep = (idx, dir) => {
        if (idx + dir < 0 || idx + dir >= steps.length) return;
        const next = [...steps];
        const [moved] = next.splice(idx, 1);
        next.splice(idx + dir, 0, moved);
        onChange(next);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-color)' }}>
                <Activity size={16} />
                <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.1em' }}>SECUENCIA DE OPERACIONES ATÓMICAS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {steps.map((step, idx) => (
                    <div key={step.id} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', position: 'relative' }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.55rem', fontWeight: 900, background: '#000', color: '#fff', padding: '0.2rem 0.5rem' }}>{step.op}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" onClick={() => moveStep(idx, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}><ArrowUp size={14}/></button>
                                <button type="button" onClick={() => moveStep(idx, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}><ArrowDown size={14}/></button>
                                <button type="button" onClick={() => removeStep(step.id)} style={{ background: 'none', border: 'none', color: '#d32f2f' }}><Trash2 size={14}/></button>
                            </div>
                        </header>

                        {/* Configuración específica por tipo de operación */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {step.op === 'NOTIFY' && (
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>MENSAJE</label>
                                    <input type="text" value={step.params.msg || ''} onChange={e => updateParams(step.id, 'msg', e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                                </div>
                            )}
                            {step.op === 'BRIDGE' && (
                                <>
                                    <div>
                                        <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>PROTOCOLO</label>
                                        <input type="text" value={step.params.protocol || ''} onChange={e => updateParams(step.id, 'protocol', e.target.value)} placeholder="Ej: UPDATE" style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>CONTEXTO</label>
                                        <input type="text" value={step.params.context_id || ''} onChange={e => updateParams(step.id, 'context_id', e.target.value)} placeholder="Ej: INVOICES" style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['VALIDATE', 'BRIDGE', 'NOTIFY', 'RESONATE'].map(op => (
                    <button 
                        key={op}
                        type="button"
                        onClick={() => addStep(op)}
                        style={{ padding: '0.6rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontSize: '0.55rem', fontWeight: 900, cursor: 'pointer' }}
                    >
                        + {op}
                    </button>
                ))}
            </div>
        </div>
    );
};
