import React, { useState } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { MateriaRelations } from './MateriaRelations.jsx';
import { MateriaComposer } from './MateriaComposer.jsx';

/**
 * 🛰️ MATERIA READER ACTOR
 * Un entorno de lectura premium con soporte de temas y marcas de agua.
 */
export const MateriaReader = ({ params }) => {
    const { state } = useSovereign();
    const [theme, setTheme] = useState('dark'); // light | dark
    const slug = params?.slug;

    // Detectar recurso específico desde la URL (ya sea por índice o por URL directa)
    const hashParts = window.location.hash.split('?');
    const query = new URLSearchParams(hashParts[1] || "");
    const resIdx = parseInt(query.get('res')) || 0;
    const directUrl = query.get('url');

    // Buscamos la materia en el silo
    const materia = state.inventory?.find(m => m.slug === slug) || 
                   state.NOMON_ENTRIES?.find(m => m.slug === slug);

    const library = materia?.data?.content?.library || [];
    const resource = library[resIdx] || (library.length > 0 ? library[0] : null);
    
    // Prioridad: URL directa > Recurso de biblioteca > Fallback
    const pdfUrl = directUrl || resource?.url || "";
    const title = resource?.desc || materia?.data?.content?.title?.es || "Documento Digital";
    const userEmail = state.identity?.user?.handle?.label || "USUARIO_NOMON_ANONIMO";

    return (
        <div className={`materia-reader-viewport theme-${theme}`}>
            <header className="reader-toolbar">
                <div className="reader-title">{title} {library.length > 1 && `(${resIdx + 1}/${library.length})`}</div>
                <div className="reader-controls">
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="theme-toggle">
                        {theme === 'dark' ? '☀️ MODO CLARO' : '🌙 MODO OSCURO'}
                    </button>
                    <button onClick={() => window.location.hash = '/'} className="exit-btn">CERRAR</button>
                </div>
            </header>

            <main className="reader-canvas">
                {/* 🛡️ CAPA DE MARCA DE AGUA */}
                <div className="watermark-overlay">
                    <div className="watermark-text">
                        {Array(50).fill(`${userEmail} | NOMON PROTOCOL | `).join('')}
                    </div>
                </div>

                {/* 📖 PROYECTOR DE PDF */}
                {pdfUrl ? (
                    <div className="pdf-container" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                        <iframe 
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                            className="pdf-viewer"
                            title={title}
                        />
                        
                        {/* 🏗️ COMPOSICIÓN LINEAL EN LA BIBLIOTECA */}
                        {materia?.data?.content?.composition && (
                            <div className="reader-footer-composition" style={{ width: '90%', padding: '4rem 0' }}>
                                <MateriaComposer composition={materia.data.content.composition} />
                            </div>
                        )}

                        {/* 🕸️ RESONANCIAS EN LA BIBLIOTECA */}
                        <div className="reader-footer-relations" style={{ width: '90%', padding: '0 0 4rem 0' }}>
                            <MateriaRelations relations={materia?.data?.relations || []} />
                        </div>
                    </div>
                ) : (
                    <div className="reader-placeholder">
                        <div className="placeholder-msg">
                            <h2>Sin Archivo Digital</h2>
                            <p>Esta materia aún no ha sido cristalizada en formato PDF.</p>
                        </div>
                    </div>
                )}
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .materia-reader-viewport {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    font-family: 'Outfit', sans-serif;
                    transition: all 0.4s ease;
                }

                .theme-dark { background: #0a0a0a; color: #ffffff; }
                .theme-light { background: #f5f5f5; color: #000000; }

                .reader-toolbar {
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(128,128,128,0.2);
                    backdrop-filter: blur(10px);
                }

                .reader-title {
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                }

                .reader-controls {
                    display: flex;
                    gap: 1rem;
                }

                .theme-toggle, .exit-btn {
                    background: none;
                    border: 1px solid currentColor;
                    color: inherit;
                    padding: 0.5rem 1rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .theme-toggle:hover, .exit-btn:hover {
                    background: currentColor;
                    color: ${theme === 'dark' ? '#000' : '#fff'};
                    cursor: pointer;
                }

                .reader-canvas {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .pdf-viewer {
                    width: 90%;
                    height: 95%;
                    border: none;
                    border-radius: 4px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                }

                .watermark-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 10;
                    overflow: hidden;
                    opacity: 0.05;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(-30deg) scale(1.5);
                }

                .watermark-text {
                    font-size: 1.5rem;
                    font-weight: 900;
                    line-height: 2;
                    text-align: center;
                    white-space: pre-wrap;
                }

                .reader-placeholder {
                    text-align: center;
                    opacity: 0.5;
                }

                @media (max-width: 768px) {
                    .pdf-viewer { width: 100%; height: 100%; border-radius: 0; }
                    .reader-title { display: none; }
                }
            `}} />
        </div>
    );
};
