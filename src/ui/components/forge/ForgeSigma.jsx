import React from 'react';
import { Settings, Shield, Trash2, X, Plus } from 'lucide-react';

/**
 * ⚙️ FORGE SIGMA: CONFIGURACIÓN Y SOBERANÍA
 */
export const ForgeSigma = ({ formData, setFormData, currentArquetype, inventory, whitelists, newEmail, setNewEmail, addEmail, removeEmail }) => {
    
    // La Zona Sigma ahora es agnóstica: resuena con cualquier capacidad declarada.
    const hasSigmaCapabilities = currentArquetype.capabilities.some(c => 
        ['NAV_LINKS', 'ACCESS', 'WHITELIST_DATA', 'SYSTEM_SETTINGS', 'WORKFLOW_EDITOR'].includes(c)
    );

    if (!hasSigmaCapabilities) return null;

    return (
        <div className="zone-sigma" style={{ marginBottom: '5rem', background: 'var(--bg-secondary)', padding: '3rem', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', opacity: 0.6 }}>
                <Settings size={16}/><span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em' }}>ZONA SIGMA: CONFIGURACIÓN Y SOBERANÍA</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                
                {/* 🔗 NAVEGACIÓN */}
                {currentArquetype.capabilities.includes('NAV_LINKS') && (
                    <div>
                        <label style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '1.5rem', display: 'block' }}>RESONANCIAS DE NAVEGACIÓN (LINKS)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {formData.nav_links?.map((link, idx) => (
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
                            <button type="button" onClick={() => setFormData({...formData, nav_links: [...(formData.nav_links || []), { label: '', slug: '', priority: 0 }]})} style={{ padding: '1rem', background: '#000', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '0.6rem' }}>+ AÑADIR LINK DE NAVEGACIÓN</button>
                        </div>
                    </div>
                )}

                {/* 🛡️ ACCESO */}
                {currentArquetype.capabilities.includes('ACCESS') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Shield size={20} />
                            <h3 style={{ fontSize: '0.65rem', fontWeight: 900 }}>ESTRATEGIA DE ACCESO</h3>
                            <select 
                                value={formData.access_control.strategy} 
                                onChange={e => setFormData({ ...formData, access_control: { ...formData.access_control, strategy: e.target.value } })} 
                                style={{ padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontWeight: 900 }}
                            >
                                <option value="PUBLIC">PÚBLICO</option>
                                <option value="REGISTERED_ONLY">REGISTRADOS</option>
                                <option value="REFERENCE_WHITELIST">WHITELIST ESPECÍFICA</option>
                            </select>
                        </div>
                        {formData.access_control.strategy === 'REFERENCE_WHITELIST' && (
                            <select 
                                value={formData.access_control.whitelist_slug} 
                                onChange={e => setFormData({ ...formData, access_control: { ...formData.access_control, whitelist_slug: e.target.value } })} 
                                style={{ padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}
                            >
                                <option value="">Selecciona una whitelist...</option>
                                {whitelists.map(w => <option key={w.slug} value={w.slug}>{w.name || w.slug}</option>)}
                            </select>
                        )}
                    </div>
                )}

                {/* 📝 WHITELIST DATA */}
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

                {/* 🛰️ SYSTEM SETTINGS (MANIFEST) */}
                {currentArquetype.capabilities.includes('SYSTEM_SETTINGS') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h3 style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.5 }}>PARÁMETROS DEL MANIFIESTO</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>NAVBAR ACTIVA (SLUG)</label>
                                <select 
                                    value={formData.manifest?.active_nav_slug || ''} 
                                    onChange={e => setFormData({ ...formData, manifest: { ...formData.manifest, active_nav_slug: e.target.value } })}
                                    style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontWeight: 800 }}
                                >
                                    <option value="">Selecciona navegación...</option>
                                    {inventory.filter(i => i.meta?.component_type === 'ENTITY_NAVBAR').map(i => <option key={i.slug} value={i.slug}>{i.data?.content?.title?.es || i.slug}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>PÁGINA DE INICIO (HOME SLUG)</label>
                                <select 
                                    value={formData.manifest?.home_slug || ''} 
                                    onChange={e => setFormData({ ...formData, manifest: { ...formData.manifest, home_slug: e.target.value } })}
                                    style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontWeight: 800 }}
                                >
                                    <option value="">Selecciona inicio...</option>
                                    {inventory.filter(i => i.meta?.component_type === 'ENTITY_ROUTER' || i.meta?.component_type === 'ENTITY_PROJECT').map(i => <option key={i.slug} value={i.slug}>{i.data?.content?.title?.es || i.slug}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
                {/* ⚙️ WORKFLOW EDITOR */}
                {currentArquetype.capabilities.includes('WORKFLOW_EDITOR') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h3 style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.5 }}>DISEÑO DEL FLUJO LÓGICO</h3>
                        <div>
                            <label style={{ fontSize: '0.5rem', fontWeight: 900, opacity: 0.5 }}>ID DE INTENCIÓN (TRIGGER)</label>
                            <input 
                                type="text" 
                                placeholder="Ej: LIQUIDAR_NOMINA" 
                                value={formData.intent_id} 
                                onChange={e => setFormData({ ...formData, intent_id: e.target.value })} 
                                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontWeight: 800 }} 
                            />
                        </div>
                        <ForgeFieldFactory 
                            type="WORKFLOW_EDITOR" 
                            value={formData.steps} 
                            onChange={val => setFormData({ ...formData, steps: val })} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
