import React, { useState } from 'react';
import { AuthModal } from './AuthModal.jsx';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 🏛️ EDITORIAL MAGAZINE LANDING PAGE ACTOR
 * Página de inicio pública. Presenta la organización e integra el
 * formulario de registro propio (sin dependencia de Google).
 */
export const LandingPage = () => {
    const [showAuth, setShowAuth] = useState(false);
    const { state } = useSovereign();
    const isLoggedIn = state.identity?.isLoggedIn;
    return (
        <section className="landing-portal-container">
            {/* Carga dinámica de tipografías premium desde Google Fonts */}
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
            `}} />

            {/* 🍃 CABECERA MINIMALISTA (Solo el logotipo oficial Sociedad BIC a la derecha) */}
            <div className="landing-header">
                <div className="landing-header-spacer"></div>
                
                <div className="landing-logos-group">
                    {/* SVG Oficial Reconstruido con Precisión Matemática: Sociedad BIC */}
                    <div className="bic-logo-wrapper" title="Sociedad BIC (Beneficio e Interés Compartido)">
                        <svg viewBox="0 0 240 85" className="bic-svg-logo">
                            <defs>
                                <linearGradient id="bic-orange" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#f37024" />
                                    <stop offset="100%" stopColor="#e15c10" />
                                </linearGradient>
                                <linearGradient id="bic-yellow" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#ffcc00" />
                                    <stop offset="100%" stopColor="#f5b800" />
                                </linearGradient>
                                <linearGradient id="bic-blue" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#009fe3" />
                                    <stop offset="100%" stopColor="#0083cc" />
                                </linearGradient>
                                <linearGradient id="bic-purple" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#96157f" />
                                    <stop offset="100%" stopColor="#7a0965" />
                                </linearGradient>
                                <linearGradient id="bic-green" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#3da849" />
                                    <stop offset="100%" stopColor="#2c8d37" />
                                </linearGradient>
                            </defs>
                            
                            {/* Molinete / Espiral oficial exacto */}
                            <g transform="translate(38, 42)">
                                {/* Aspa Naranja (Arriba Izquierda) */}
                                <path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-orange)" />
                                
                                {/* Aspa Amarilla (Arriba) */}
                                <g transform="rotate(72)">
                                    <path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-yellow)" />
                                </g>
                                
                                {/* Aspa Azul (Derecha) */}
                                <g transform="rotate(144)">
                                    <path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-blue)" />
                                </g>
                                
                                {/* Aspa Violeta (Abajo) */}
                                <g transform="rotate(216)">
                                    <path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-purple)" />
                                </g>
                                
                                {/* Aspa Verde (Abajo Izquierda) */}
                                <g transform="rotate(288)">
                                    <path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-green)" />
                                </g>
                                
                                {/* Botón Blanco Central */}
                                <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
                            </g>
                            
                            {/* Tipografía Oficial Exacta Reconstruida */}
                            <text x="82" y="27" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="11" fontWeight="300" fill="#5a5b5e" letterSpacing="0.32em">SOCIEDAD</text>
                            <text x="80" y="61" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="38" fontWeight="800" fill="#002d62" letterSpacing="-0.02em">BIC</text>
                            <text x="82" y="75" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="9.5" fontWeight="400" fill="#5a5b5e" letterSpacing="0.04em">Empresa con propósito</text>
                        </svg>
                    </div>
                </div>
            </div>

            {/* 🏛️ DIAGRAMACIÓN EDITORIAL DE REVISTA (Title, Slogan, Statement) */}
            <div className="landing-main-banner">
                <div className="magazine-grid">
                    {/* Columna Izquierda: Título Principal Monumental */}
                    <div className="magazine-title-column">
                        <div style={{ width: '100%', maxWidth: '440px' }}>
                            <svg viewBox="0 -20 500 145" className="brand-logo-svg" style={{ width: '100%', height: 'auto', display: 'block', color: 'var(--text-primary)' }}>
                                <path 
                                    d="M 20,110 L 20,30 L 80,110 L 80,30" 
                                    stroke="currentColor" 
                                    strokeWidth="11.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    fill="none" 
                                />
                                <circle 
                                    cx="145" 
                                    cy="70" 
                                    r="34.5" 
                                    stroke="currentColor" 
                                    strokeWidth="11.5" 
                                    fill="none" 
                                />
                                <path 
                                    d="M 210,110 L 210,30 L 250,110 L 290,30 L 290,110" 
                                    stroke="currentColor" 
                                    strokeWidth="11.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    fill="none" 
                                />
                                <circle 
                                    cx="355" 
                                    cy="70" 
                                    r="34.5" 
                                    stroke="currentColor" 
                                    strokeWidth="11.5" 
                                    fill="none" 
                                />
                                <path 
                                    d="M 420,110 L 420,30 L 480,110 L 480,30" 
                                    stroke="currentColor" 
                                    strokeWidth="11.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    fill="none" 
                                />
                                <path 
                                    d="M 356,36 C 358,32 357,27 356,22" 
                                    stroke="#6cb367" 
                                    strokeWidth="4.5" 
                                    strokeLinecap="round" 
                                    fill="none" 
                                />
                                <path 
                                    d="M 355,22 C 343,15 345,0 377,-11 C 369,-4 362,6 355,22 Z" 
                                    fill="#6cb367" 
                                />
                                <path 
                                    d="M 357,22 C 364,8 371,-2 379,-9 C 381,3 373,16 357,22 Z" 
                                    fill="#6cb367" 
                                />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Columna Derecha: Slogan en Itálicas Flotantes */}
                    <div className="magazine-slogan-column">
                        <h2 className="brand-tagline-text">
                            Ideas que echan raíces,<br />
                            acciones que transforman.
                        </h2>
                    </div>
                </div>
                
                {/* Separador Editorial Fino */}
                <div className="editorial-divider"></div>
                
                {/* Párrafo con Letra Capital (Drop Cap) */}
                <p className="brand-manifest-statement">
                    <span className="drop-cap">I</span>
                    mpulsamos la evolución de organizaciones y comunidades a través de una consultoría estratégica de alto impacto fundamentada en la integridad, programas de formación humana que trascienden el aula para fortalecer un liderazgo ético consciente, y la creación artística como motor de cohesión social.
                </p>

                {/* CTA principal */}
                <div className="landing-cta-row">
                    {isLoggedIn ? (
                        <button
                            className="cta-btn-primary"
                            onClick={() => window.Router?.navigate('/red')}
                        >
                            Ir a la Red →
                        </button>
                    ) : (
                        <button
                            className="cta-btn-primary"
                            onClick={() => setShowAuth(true)}
                        >
                            Únete a NOMON →
                        </button>
                    )}
                    <button
                        className="cta-btn-secondary"
                        onClick={() => window.Router?.navigate('/somos-nomon')}
                    >
                        Conoce más
                    </button>
                </div>
            </div>

            {/* 🔗 SECCIÓN SECUNDARIA: NODOS DE ACCIÓN */}
            <div className="landing-nodes-section">
                <h3 className="nodes-section-title">NUESTROS NODOS DE ACCIÓN</h3>
                
                <div className="nodes-grid-layout">
                    {/* Nodo 1 */}
                    <div className="node-card card-gov">
                        <div className="node-card-decorator"></div>
                        <h4 className="node-card-title">GUBERNAMENTAL</h4>
                        <p className="node-card-description">
                            Fortalecimiento institucional y políticas públicas basadas en integridad técnica.
                        </p>
                    </div>
                    {/* Nodo 2 */}
                    <div className="node-card card-corp">
                        <div className="node-card-decorator"></div>
                        <h4 className="node-card-title">CORPORATIVO</h4>
                        <p className="node-card-description">
                            Transformación de la cultura organizacional hacia la tecnología de la ética.
                        </p>
                    </div>
                    {/* Nodo 3 */}
                    <div className="node-card card-acad">
                        <div className="node-card-decorator"></div>
                        <h4 className="node-card-title">ACADÉMICO</h4>
                        <p className="node-card-description">
                            Investigación aplicada para la construcción de modelos de futuro sostenibles.
                        </p>
                    </div>
                    {/* Nodo 4 */}
                    <div className="node-card card-jur">
                        <div className="node-card-decorator"></div>
                        <h4 className="node-card-title">JURÍDICO</h4>
                        <p className="node-card-description">
                            Blindaje legal y estatutario para la protección del propósito organizacional.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal de autenticación */}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

            {/* Stylesheets encapsulados para dar un estilo premium de vanguardia */}
            <style dangerouslySetInnerHTML={{ __html: `
                .landing-portal-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 3rem 8rem;
                    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    animation: landingFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes landingFadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Header Layout */
                .landing-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4rem;
                }

                .landing-logos-group {
                    display: flex;
                    align-items: center;
                }

                .bic-logo-wrapper {
                    width: 220px;
                    height: auto;
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .bic-logo-wrapper:hover {
                    transform: scale(1.02);
                }

                .bic-svg-logo {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                /* Main Banner & Magazine Grid */
                .landing-main-banner {
                    text-align: left;
                    margin-bottom: 6rem;
                }

                .magazine-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: flex-end;
                    gap: 3rem;
                    margin-bottom: 2.5rem;
                }

                .magazine-title-column {
                    display: flex;
                    align-items: flex-end;
                }

                .magazine-slogan-column {
                    display: flex;
                    align-items: flex-end;
                    padding-bottom: 0.4rem;
                }

                .brand-massive-title {
                    font-family: 'Playfair Display', 'Georgia', serif;
                    font-size: 7.2rem;
                    font-weight: 500;
                    margin: 0;
                    letter-spacing: -0.04em;
                    line-height: 0.85;
                    color: var(--text-primary);
                }

                .brand-tagline-text {
                    font-family: 'Playfair Display', 'Georgia', serif;
                    font-style: italic;
                    font-size: 2.4rem;
                    font-weight: 400;
                    margin: 0;
                    color: #8f764a; /* Tono ocre dorado premium */
                    line-height: 1.15;
                    letter-spacing: -0.02em;
                }

                /* Editorial Separator Line */
                .editorial-divider {
                    width: 100%;
                    height: 1px;
                    background: var(--border-primary);
                    margin: 2.5rem 0 3.5rem;
                }

                /* Paragraph with Editorial Drop Cap */
                .brand-manifest-statement {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 1.45rem;
                    line-height: 1.95;
                    color: var(--text-secondary);
                    font-weight: 300;
                    max-width: 960px;
                    margin: 0;
                    text-align: justify;
                }

                .drop-cap {
                    font-family: 'Playfair Display', 'Georgia', serif;
                    font-size: 5rem;
                    font-weight: 600;
                    float: left;
                    line-height: 0.75;
                    margin-right: 0.8rem;
                    margin-top: 0.3rem;
                    color: #8f764a;
                    text-shadow: 1px 1px 0px rgba(0,0,0,0.05);
                }

                /* CTA Row */
                .landing-cta-row {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    margin-top: 3rem;
                    flex-wrap: wrap;
                }

                .cta-btn-primary {
                    background: #002d62;
                    color: #fff;
                    border: none;
                    padding: 0.9rem 2rem;
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    border-radius: 2px;
                    transition: background 0.2s, transform 0.2s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .cta-btn-primary:hover {
                    background: #003d80;
                    transform: translateY(-2px);
                }

                .cta-btn-secondary {
                    background: none;
                    color: var(--text-primary);
                    border: 1px solid var(--border-primary);
                    padding: 0.9rem 2rem;
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    border-radius: 2px;
                    transition: border-color 0.2s, color 0.2s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .cta-btn-secondary:hover {
                    border-color: var(--text-primary);
                    opacity: 0.8;
                }

                /* Nodes Layout */
                .landing-nodes-section {
                    border-top: 1px solid var(--border-primary);
                    padding-top: 4.5rem;
                }

                .nodes-section-title {
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.25em;
                    color: var(--text-secondary);
                    margin-bottom: 3.5rem;
                    opacity: 0.5;
                }

                .nodes-grid-layout {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 3rem;
                }

                .node-card {
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                    position: relative;
                    padding: 1.5rem 0;
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .node-card-decorator {
                    width: 25px;
                    height: 2px;
                    background: var(--border-primary);
                    transition: width 0.3s ease, background 0.3s ease;
                }

                .node-card:hover {
                    transform: translateY(-4px);
                }

                .node-card:hover .node-card-decorator {
                    width: 50px;
                }

                /* Colores de acento sutiles para cada nodo en hover */
                .card-gov:hover .node-card-decorator { background: #3b82f6; }
                .card-corp:hover .node-card-decorator { background: #f59e0b; }
                .card-acad:hover .node-card-decorator { background: #10b981; }
                .card-jur:hover .node-card-decorator { background: #8b5cf6; }

                .node-card-title {
                    font-size: 0.95rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: var(--text-primary);
                    margin: 0;
                }

                .node-card-description {
                    font-size: 0.92rem;
                    line-height: 1.65;
                    color: var(--text-secondary);
                    margin: 0;
                    opacity: 0.75;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .brand-massive-title {
                        font-size: 5.5rem;
                    }
                    .brand-tagline-text {
                        font-size: 2rem;
                    }
                    .nodes-grid-layout {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 3.5rem 2.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .landing-portal-container {
                        padding: 2rem 2rem 6rem;
                    }
                    .landing-header {
                        margin-bottom: 3rem;
                    }
                    .magazine-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    .brand-massive-title {
                        font-size: 4.8rem;
                    }
                    .brand-tagline-text {
                        font-size: 1.9rem;
                    }
                    .brand-manifest-statement {
                        font-size: 1.25rem;
                        line-height: 1.8;
                        text-align: left;
                    }
                    .drop-cap {
                        font-size: 4rem;
                        margin-top: 0.2rem;
                    }
                }

                @media (max-width: 580px) {
                    .nodes-grid-layout {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .brand-massive-title {
                        font-size: 3.8rem;
                    }
                    .brand-tagline-text {
                        font-size: 1.6rem;
                    }
                    .node-card {
                        padding: 0.8rem 0;
                    }
                }
            `}} />
        </section>
    );
};
