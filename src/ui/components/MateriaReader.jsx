import React, { useState, useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { appState } from '../../score/AppState.js';
import { MateriaRelations } from './MateriaRelations.jsx';
import { MateriaComposer } from './MateriaComposer.jsx';
import { Sun, Moon, User, ShieldAlert, X as CloseIcon, LogOut } from 'lucide-react';


// Helper para decodificar JWT de Google de forma nativa
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Fallo al decodificar el token de Google:", e);
        return null;
    }
}

// Helper para calcular el hash SHA-256 de forma nativa
async function calcSha256(message) {
    const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 🛰️ MATERIA READER ACTOR (Sovereign & Restricted Edition)
 * Un entorno de lectura premium que equilibra estabilidad y estética.
 */
export const MateriaReader = ({ params }) => {
    const { state } = useSovereign();
    const getSystemTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [theme, setTheme] = useState(getSystemTheme());
    const slug = params?.slug;

    const hashParts = window.location.hash.split('?');
    const query = new URLSearchParams(hashParts[1] || "");
    const resIdx = parseInt(query.get('res')) || 0;
    const directUrl = query.get('url');

    const [isWhitelisted, setIsWhitelisted] = useState(null);

    const materia = state.inventory?.find(m => m.slug === slug) || 
                   state.NOMON_ENTRIES?.find(m => m.slug === slug);

    const library = materia?.data?.content?.library || [];
    const resource = library[resIdx] || (library.length > 0 ? library[0] : null);
    
    const pdfUrl = directUrl || resource?.url || "";
    const title = resource?.desc || materia?.data?.content?.title?.es || "DOCUMENTO DIGITAL";
    const userEmail = state.identity?.user?.payload?.email || "USUARIO_NOMON_ANONIMO";

    const accessControl = materia?.data?.access_control || {};
    const strategy = accessControl.strategy || 'PUBLIC';
    const isRestricted = strategy !== 'PUBLIC';

    // Efecto 1: Inicializar Google Sign-In
    useEffect(() => {
        if (!state.identity?.isLoggedIn && window.google && isRestricted) {
            setTimeout(() => {
                const btnContainer = document.getElementById("google-signin-btn");
                if (btnContainer) {
                    window.google.accounts.id.initialize({
                        client_id: "957715051136-pcma3u1cpl9d4h0jsl81vjbcoe0rt62s.apps.googleusercontent.com",
                        callback: async (res) => {
                            const payload = decodeJwt(res.credential);
                            if (payload) {
                                const emailHash = await calcSha256(payload.email);
                                appState.setIdentity({
                                    id: payload.sub,
                                    email: payload.email,
                                    email_hash: emailHash,
                                    name: payload.name,
                                    picture: payload.picture,
                                    alias: payload.given_name
                                });
                            }
                        }
                    });
                    window.google.accounts.id.renderButton(
                        btnContainer,
                        { theme: "outline", size: "large", text: "continue_with" }
                    );
                }
            }, 100);
        }
    }, [state.identity?.isLoggedIn, isRestricted]);

    // Efecto 2: Evaluar si el usuario está en la Whitelist de esta entidad específica
    useEffect(() => {
        const checkAccess = async () => {
            if (!isRestricted) {
                setIsWhitelisted(true);
                return;
            }

            if (state.identity?.isLoggedIn && state.identity?.user?.payload?.email) {
                if (strategy === 'REGISTERED_ONLY') {
                    setIsWhitelisted(true);
                    return;
                }

                if (strategy === 'REFERENCE_WHITELIST' && accessControl.whitelist_slug) {
                    const fullDb = state.inventory || state.NOMON_ENTRIES || [];
                    const whitelistEntity = fullDb.find(m => m.slug === accessControl.whitelist_slug);
                    
                    if (!whitelistEntity) {
                        console.log("⏳ [Reader] Esperando a que cargue la Whitelist...");
                        return; // Esperamos al siguiente ciclo de render
                    }

                    const hashes = whitelistEntity?.data?.whitelist || [];
                    const emailHash = state.identity.user.payload.email_hash || await calcSha256(state.identity.user.payload.email);
                    
                    if (hashes.includes(emailHash)) {
                        setIsWhitelisted(true);
                    } else {
                        setIsWhitelisted(false);
                    }
                    return;
                }

                setIsWhitelisted(false);
            } else {
                setIsWhitelisted(false);
            }
        };

        checkAccess();
    }, [state.identity?.isLoggedIn, state.identity?.user?.payload?.email, state.inventory, state.NOMON_ENTRIES, strategy, accessControl.whitelist_slug, isRestricted]);

    const handleLogout = () => {
        appState.logout();
    };

    return (
        <div className={`materia-reader-viewport theme-${theme}`}>
            <header className="reader-toolbar">
                <div className="reader-brand">NOMON // {title}</div>
                <div className="reader-controls">
                    {state.identity?.isLoggedIn && (
                        <span className="reader-profile" style={{ fontSize: '0.65rem', opacity: 0.8, alignSelf: 'center', marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={12} strokeWidth={2} /> {state.identity.user.payload.email}
                        </span>
                    )}
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ctrl-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {theme === 'dark' ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
                        {theme === 'dark' ? 'MODO CLARO' : 'MODO OSCURO'}
                    </button>

                    {state.identity?.isLoggedIn && (
                        <button onClick={handleLogout} className="ctrl-btn exit" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <LogOut size={12} strokeWidth={2} /> SALIR
                        </button>
                    )}
                    <button onClick={() => window.location.hash = '/'} className="ctrl-btn exit" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CloseIcon size={12} strokeWidth={2} /> CERRAR
                    </button>
                </div>

            </header>

            <main className="reader-canvas">
                {/* 🛡️ MARCA DE AGUA ESTRUCTURAL */}
                <div className="reader-watermark">
                    {Array(40).fill(`${userEmail} | SOVEREIGN PROTOCOL | `).join('')}
                </div>

                {!isRestricted || isWhitelisted ? (
                    pdfUrl ? (
                        <div className="document-container">
                            <div className="document-shadow-box animate-fade-up">
                                <iframe 
                                    src={window.innerWidth < 768 
                                        ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
                                        : `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`
                                    } 
                                    className={`pdf-proyector ${theme === 'dark' ? 'pdf-inverted' : ''}`}
                                    title={title}
                                    style={{ width: '100%', height: window.innerWidth < 768 ? '60vh' : '90vh', border: 'none' }}
                                />
                                {window.innerWidth < 768 && (
                                    <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8f8f8', borderTop: '1px solid #eee' }}>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '1rem', color: '#000' }}>
                                            ¿El visor no carga correctamente?
                                        </p>
                                        <a 
                                            href={pdfUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ 
                                                display: 'inline-block', padding: '0.8rem 1.5rem', 
                                                background: '#000', color: '#fff', fontSize: '0.7rem', 
                                                fontWeight: 900, textDecoration: 'none', letterSpacing: '0.1em' 
                                            }}
                                        >
                                            ABRIR DOCUMENTO ORIGINAL
                                        </a>
                                    </div>
                                )}

                            </div>
                            
                            {/* SECCIÓN DE CONTEXTO */}
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
                    )
                ) : (
                    /* 🛡️ ESCUDO DE IDENTIDAD (ACCESO RESTRINGIDO) */
                    <div className="reader-restricted-box animate-fade-up" style={{ textAlign: 'center', background: '#fff', color: '#000', padding: '4rem 2rem', border: '1px solid #ddd', maxWidth: '35rem', boxShadow: '0 4rem 8rem rgba(0,0,0,0.1)', marginTop: '5rem', zIndex: 10 }}>
                        <ShieldAlert size={48} strokeWidth={1} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>
                            {materia?.data?.content?.restricted_title || "MATERIA DE ACCESO RESTRINGIDO"}
                        </h2>
                        <p style={{ fontSize: '0.9rem', opacity: 0.6, lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            {materia?.data?.content?.restricted_message || "Esta entidad pertenece a un estrato de conocimiento reservado. Para continuar con su proyección, debes iniciar sesión."}
                        </p>


                        {!state.identity?.isLoggedIn ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div id="google-signin-btn"></div>
                            </div>
                        ) : (
                            <div style={{ background: '#fff4f4', padding: '1.5rem', border: '1px solid #ffebeb', borderRadius: '4px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#d32f2f', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                    <ShieldAlert size={12} strokeWidth={2.5} /> ACCESO NO AUTORIZADO
                                </span>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                    {materia?.data?.content?.denied_message || `El correo ${state.identity.user.payload.email} no se encuentra en la whitelist de esta materia.`}
                                </p>

                            </div>
                        )}
                    </div>
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
