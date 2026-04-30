import React, { useState } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { MateriaRelations } from './MateriaRelations.jsx';
import { MateriaComposer } from './MateriaComposer.jsx';

/**
 * 🛰️ MATERIA READER ACTOR (Sovereign Edition)
 * Un entorno de lectura premium que equilibra estabilidad y estética.
 */
export const MateriaReader = ({ params }) => {
    const { state } = useSovereign();
    const [theme, setTheme] = useState('dark');
    const slug = params?.slug;

    const hashParts = window.location.hash.split('?');
    const query = new URLSearchParams(hashParts[1] || "");
    const resIdx = parseInt(query.get('res')) || 0;
    const directUrl = query.get('url');

    const materia = state.inventory?.find(m => m.slug === slug) || 
                   state.NOMON_ENTRIES?.find(m => m.slug === slug);

    const library = materia?.data?.content?.library || [];
    const resource = library[resIdx] || (library.length > 0 ? library[0] : null);
    
    const pdfUrl = directUrl || resource?.url || "";
    const title = resource?.desc || materia?.data?.content?.title?.es || "DOCUMENTO DIGITAL";
    const userEmail = state.identity?.user?.handle?.label || "USUARIO_NOMON_ANONIMO";

    return (
        <div className={`materia-reader-viewport theme-${theme}`}>
            <header className="reader-toolbar">
                <div className="reader-brand">NOMON // {title}</div>
                <div className="reader-controls">
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ctrl-btn">
                        {theme === 'dark' ? '☀️ MODO CLARO' : '🌙 MODO OSCURO'}
                    </button>
                    <button onClick={() => window.location.hash = '/'} className="ctrl-btn exit">CERRAR</button>
                </div>
            </header>

            <main className="reader-canvas">
                {/* 🛡️ MARCA DE AGUA ESTRUCTURAL */}
                <div className="reader-watermark">
                    {Array(40).fill(`${userEmail} | SOVEREIGN PROTOCOL | `).join('')}
                </div>

                {pdfUrl ? (
                    <div className="document-container">
                        <div className="document-shadow-box animate-fade-up">
                            <iframe 
                                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                                className={`pdf-proyector ${theme === 'dark' ? 'pdf-inverted' : ''}`}
                                title={title}
                            />
                        </div>
                        
                        {/* SECCIÓN DE CONTEXTO (Bajo el documento) */}
                        {(materia?.data?.content?.composition || materia?.data?.relations) && (
                            <div className="document-context">
                                <div className="context-divider"></div>
                                {materia?.data?.content?.composition && (
                                    <MateriaComposer composition={materia.data.content.composition} />
                                )}
                                <MateriaRelations relations={materia?.data?.relations || []} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="reader-empty">CRISTALIZACIÓN NO ENCONTRADA</div>
                )}
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .materia-reader-viewport {
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    background: ${theme === 'dark' ? '#080808' : '#f0f0f0'};
                    color: ${theme === 'dark' ? '#fff' : '#000'};
                    font-family: 'Outfit', sans-serif;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .reader-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2rem 2.5rem;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(15px);
                    color: #fff;
                    z-index: 100;
                    border-bottom: 0.05rem solid rgba(255,255,255,0.1);
                }

                .reader-brand { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; }

                .reader-controls { display: flex; gap: 0.8rem; }
                .ctrl-btn {
                    background: none;
                    color: #fff;
                    border: 0.05rem solid rgba(255,255,255,0.3);
                    padding: 0.6rem 1.2rem;
                    font-size: 0.6rem;
                    font-weight: 900;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                }

                .ctrl-btn:hover { background: #fff; color: #000; border-color: #fff; }
                .ctrl-btn.exit { background: #fff; color: #000; border-color: #fff; }

                .reader-canvas {
                    flex: 1;
                    overflow-y: auto;
                    position: relative;
                    padding: 4rem 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .document-container {
                    width: 90%;
                    max-width: 75rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4rem;
                }

                .document-shadow-box {
                    width: 100%;
                    background: #fff;
                    box-shadow: 0 4rem 8rem rgba(0,0,0,0.5);
                    position: relative;
                    z-index: 10;
                }

                .pdf-proyector {
                    width: 100%;
                    height: 90vh;
                    border: none;
                    display: block;
                    transition: filter 0.6s ease;
                }

                .pdf-inverted {
                    filter: invert(0.9) hue-rotate(180deg) contrast(1.1) brightness(1.1);
                    background: #000;
                }

                .document-context {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                .context-divider {
                    height: 0.1rem;
                    width: 5rem;
                    background: currentColor;
                    opacity: 0.2;
                }

                .animate-fade-up {
                    animation: fadeUp 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(2rem); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .reader-watermark {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    opacity: 0.03;
                    z-index: 5;
                    font-size: 1.2rem;
                    font-weight: 300;
                    overflow: hidden;
                    transform: rotate(-30deg) scale(1.5);
                    display: flex;
                    flex-wrap: wrap;
                }

                .reader-empty {
                    padding: 10rem;
                    font-weight: 900;
                    letter-spacing: 0.5em;
                    opacity: 0.3;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .document-container { width: 100%; }
                    .pdf-proyector { height: 75vh; }
                    .reader-brand { display: none; }
                }
            `}} />
        </div>
    );
};
