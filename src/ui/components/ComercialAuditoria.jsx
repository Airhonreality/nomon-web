import React, { useState } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';

/**
 * 📊 COMERCIAL AUDITORIA ACTOR
 * Panel privado de estadísticas de ventas y auditoría de activaciones.
 */
export const ComercialAuditoria = () => {
    const { state } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    const [filterBySalesperson, setFilterBySalesperson] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    const inventory = entries || [];
    const fixedWhitelistSlug = "digital-sextante";
    const wlEntity = inventory.find(i => i.slug === fixedWhitelistSlug);

    const activations = wlEntity?.data?.activations || [];

    // Agrupar estadísticas por comercial
    const statsBySalesperson = activations.reduce((acc, current) => {
        const by = current.by || "Asesor Desconocido";
        if (!acc[by]) {
            acc[by] = {
                salesperson: by,
                total: 0,
                withReceipt: 0,
                withPhoto: 0
            };
        }
        acc[by].total += 1;
        if (current.receipt_name) acc[by].withReceipt += 1;
        if (current.receipt_image) acc[by].withPhoto += 1;
        return acc;
    }, {});

    const statsArray = Object.values(statsBySalesperson);

    // Listar comerciales únicos para el filtro
    const uniqueSalespeople = [...new Set(activations.map(a => a.by))];

    // Filtrar activaciones para la tabla de auditoría
    const filteredActivations = filterBySalesperson 
        ? activations.filter(a => a.by === filterBySalesperson)
        : activations;

    return (
        <div className="comercial-auditoria-viewport">
            {/* Modal de Previsualización de Imagen */}
            {previewImage && (
                <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="modal-content animate-fade-up">
                        <img src={previewImage} alt="Previsualización de Comprobante" />
                        <button className="close-modal">CERRAR</button>
                    </div>
                </div>
            )}

            <div className="auditoria-wrapper">
                <header className="auditoria-header">
                    <h1 className="header-title">SATELLITE // AUDITORÍA PRIVADA</h1>
                    <p className="header-subtitle">Estadísticas de rendimiento y control de ventas digitales</p>
                </header>

                {/* 🎯 SECCIÓN DE MÉTRICAS GLOBALES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
                    <div className="metric-card">
                        <span className="metric-label">TOTAL ACCESOS ACTIVADOS</span>
                        <span className="metric-value">{activations.length}</span>
                    </div>
                    <div className="metric-card">
                        <span className="metric-label">ASESORES COMERCIALES ACTIVOS</span>
                        <span className="metric-value">{uniqueSalespeople.length}</span>
                    </div>
                </div>

                {/* 💼 TABLA DE RENDIMIENTO POR ASESOR */}
                <div className="auditoria-section">
                    <h2>📊 RENDIMIENTO POR ASESOR COMERCIAL</h2>
                    <p className="section-desc">Consolidado de ventas digitales registradas por cada comercial.</p>

                    <div className="table-container animate-fade-up">
                        <table>
                            <thead>
                                <tr>
                                    <th>ASESOR COMERCIAL</th>
                                    <th>VENTAS</th>
                                    <th>RECIBOS (TEXTO)</th>
                                    <th>FOTOS RECIBO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statsArray.length > 0 ? statsArray.map((stat, idx) => (
                                    <tr key={idx}>
                                        <td className="salesperson-email">{stat.salesperson}</td>
                                        <td className="sales-total">{stat.total}</td>
                                        <td className="sales-total" style={{ color: '#666' }}>{stat.withReceipt}</td>
                                        <td className="sales-total" style={{ color: '#15803d' }}>{stat.withPhoto}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                                            Aún no hay registros de activaciones.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🔍 TABLA DE ACTIVACIONES DETALLADA */}
                <div className="auditoria-section" style={{ marginTop: '4rem' }}>
                    <h2>📑 DETALLE DE TODAS LAS ACTIVACIONES</h2>
                    <p className="section-desc">Auditoría completa de compradores habilitados en la whitelist.</p>

                    {/* Filtro por Asesor */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.5, letterSpacing: '0.05em' }}>FILTRAR POR ASESOR:</label>
                        <select 
                            value={filterBySalesperson} 
                            onChange={e => setFilterBySalesperson(e.target.value)}
                            style={{ padding: '0.6rem 1rem', border: '1px solid #ddd', background: '#fff', fontSize: '0.75rem' }}
                        >
                            <option value="">Todos los asesores...</option>
                            {uniqueSalespeople.map((p, idx) => (
                                <option key={idx} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="table-container animate-fade-up">
                        <table>
                            <thead>
                                <tr>
                                    <th>FOTO</th>
                                    <th>COMPRADOR (CORREO)</th>
                                    <th>NOMBRE COMPROBANTE</th>
                                    <th>VENDIDO POR</th>
                                    <th>FECHA Y HORA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActivations.length > 0 ? filteredActivations.map((act, idx) => (
                                    <tr key={idx}>
                                        <td style={{ width: '60px' }}>
                                            {act.receipt_image ? (
                                                <div 
                                                    onClick={() => setPreviewImage(act.receipt_image)}
                                                    style={{ width: '40px', height: '40px', background: `url(${act.receipt_image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', cursor: 'pointer', border: '1px solid #eee' }} 
                                                />
                                            ) : (
                                                <div style={{ width: '40px', height: '40px', background: '#f5f5f5', borderRadius: '4px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#ccc' }}>N/A</div>
                                            )}
                                        </td>
                                        <td className="buyer-email">{act.buyer || 'Anónimo'}</td>
                                        <td className="receipt-name">{act.receipt_name || 'N/A'}</td>
                                        <td className="salesperson-email">{act.by || 'Asesor Anónimo'}</td>
                                        <td className="timestamp">
                                            {act.timestamp ? new Date(act.timestamp).toLocaleString('es-ES') : 'N/A'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                                            No se encontraron activaciones con este filtro.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .comercial-auditoria-viewport {
                    min-height: 100vh;
                    background: #fafafa;
                    color: #000;
                    padding: 4rem 2rem;
                    font-family: 'Outfit', sans-serif;
                }

                .auditoria-wrapper {
                    max-width: 65rem;
                    margin: 0 auto;
                }

                .auditoria-header {
                    margin-bottom: 3.5rem;
                }

                .header-title { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.25em; color: #666; margin: 0; }
                .header-subtitle { font-size: 1.6rem; font-weight: 900; letter-spacing: -0.02em; margin-top: 0.5rem; color: #000; }

                .metric-card {
                    background: #fff; border: 1px solid #eee; padding: 2rem;
                    box-shadow: 0 4rem 8rem rgba(0,0,0,0.02);
                }

                .metric-label {
                    font-size: 0.55rem; font-weight: 900; letter-spacing: 0.15em; color: #888; display: block; margin-bottom: 0.5rem;
                }

                .metric-value { font-size: 2.4rem; font-weight: 900; color: #000; display: block; }

                .auditoria-section h2 { font-size: 1rem; font-weight: 900; letter-spacing: 0.02em; margin-bottom: 0.3rem; }
                .section-desc { font-size: 0.75rem; opacity: 0.6; margin-bottom: 1.5rem; }

                .table-container {
                    background: #fff; border: 1px solid #eee; overflow-x: auto;
                    box-shadow: 0 4rem 8rem rgba(0,0,0,0.02);
                }

                table { width: 100%; border-collapse: collapse; text-align: left; }
                th {
                    background: #fafafa; border-bottom: 1px solid #eee; padding: 1rem;
                    font-size: 0.55rem; font-weight: 900; letter-spacing: 0.1em; color: #666; text-transform: uppercase;
                }

                td { padding: 1rem; border-bottom: 1px solid #f9f9f9; font-size: 0.75rem; color: #333; }

                .salesperson-email { font-weight: 900; color: #000; }
                .sales-total { font-weight: 900; font-size: 1rem; color: #000; }
                .buyer-email { font-weight: 900; color: #026aa2; }
                .receipt-name { font-weight: bold; color: #15803d; }
                .timestamp { opacity: 0.7; font-size: 0.7rem; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); z-index: 100000;
                    display: flex; align-items: center; justify-content: center; padding: 2rem;
                }

                .modal-content {
                    background: #fff; padding: 1rem; max-width: 90%; max-height: 90%;
                    display: flex; flexDirection: column; gap: 1rem; align-items: center;
                }

                .modal-content img { max-width: 100%; max-height: 80vh; object-fit: contain; }

                .close-modal {
                    background: #000; color: #fff; border: none; padding: 1rem 2rem;
                    font-size: 0.7rem; font-weight: 900; cursor: pointer; letter-spacing: 0.1em;
                }

                .animate-fade-up {
                    animation: fadeUp 0.6s ease forwards;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(1.5rem); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media(max-width: 768px) {
                    .auditoria-section { padding: 0 1rem; }
                }
            `}} />
        </div>
    );
};
