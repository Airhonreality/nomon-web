import React, { useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { appState } from '../../score/AppState.js';
import { Sun, Moon, User, LogOut } from 'lucide-react';

// Helper para decodificar JWT
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
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
 * 🛰️ NAVBAR ACTOR (V2 - Mobile First)
 */
export const Navbar = ({ definition }) => {
    const { state, toggleTheme, manifest } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');

    // 🕸️ ESCÁNER DE NAVEGACIÓN AGNOSTICA
    // Buscamos la entidad que el MANIFIESTO dicta como activa
    const navEntity = (entries || []).find(item => item.slug === manifest.active_nav_slug);

    const brandName = manifest.title;

    // Escucha activa de cambios de ruta hash para re-renderizado independiente
    const [currentPath, setCurrentPath] = React.useState(window.location.hash.replace('#', '') || '/');

    useEffect(() => {
        const handleHash = () => {
            setCurrentPath(window.location.hash.replace('#', '') || '/');
        };
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    const isMinimal = currentPath === '/landing';

    const dynamicLinks = (navEntity?.data?.nav_links || [])
        .sort((a, b) => (a.priority || 0) - (b.priority || 0))
        .map(link => {
            // Si el slug no empieza por / ni http, asumimos que es una materia
            const isExternal = link.slug?.startsWith('http');
            const isAbsolute = link.slug?.startsWith('/');
            const path = (isExternal || isAbsolute) ? link.slug : `/materia/${link.slug}`;
            
            return {
                label: link.label,
                path: path
            };
        });

    const allLinks = [...dynamicLinks];

    const handleNavigate = (path) => {
        if (window.Router) {
            window.Router.navigate(path);
        }
    };

    useEffect(() => {
        if (!state.identity?.isLoggedIn && window.google) {
            setTimeout(() => {
                const btnContainer = document.getElementById("navbar-google-signin");
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
                        { theme: "outline", size: "medium", shape: "pill", text: "signin_with" }
                    );
                }
            }, 100);
        }
    }, [state.identity?.isLoggedIn, currentPath]); // Se actualiza también si cambia la ruta para asegurar el botón

    return (
        <nav className="main-navbar" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 9999, gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
            <div className="nav-logo" onClick={() => handleNavigate('/')} style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em', cursor: 'pointer' }}>{brandName}</div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                {!isMinimal && (
                    <ul className="nav-links" style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', gap: '1rem', margin: 0, padding: 0 }}>
                        <li onClick={() => handleNavigate('/')} style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: 0.7 }}>INICIO</li>
                        {allLinks.map((link, idx) => (
                            <li key={idx} onClick={() => handleNavigate(link.path)} style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: 0.7 }}>
                                {link.label}
                            </li>
                        ))}
                    </ul>
                )}


                <div className="nav-identity-box" style={{ display: 'flex', alignItems: 'center', borderLeft: isMinimal ? 'none' : '1px solid #eee', paddingLeft: isMinimal ? 0 : '1rem', minHeight: '2.5rem', gap: '1rem' }}>
                    {!isMinimal && (
                        <button 
                            onClick={() => toggleTheme()}
                            style={{ 
                                background: 'none', border: 'none', cursor: 'pointer', 
                                fontSize: '1rem', padding: '0.2rem', display: 'flex', 
                                alignItems: 'center', opacity: 0.6, transition: 'opacity 0.2s',
                                color: 'var(--text-primary)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                            title={state.theme === 'dark' ? "Activar Modo Luz" : "Activar Modo Oscuro"}
                        >
                            {state.theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
                        </button>
                    )}

                    {state.identity?.isLoggedIn ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.8rem' }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-primary)', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <User size={12} strokeWidth={2} /> {state.identity.user?.payload?.email || state.identity.user?.email || 'USUARIO'}
                            </span>
                            <button 
                                onClick={() => appState.logout()} 
                                style={{ 
                                    background: 'none', border: '1px solid var(--border-primary)', 
                                    padding: '0.4rem 0.8rem', fontSize: '0.55rem', fontWeight: 900, 
                                    cursor: 'pointer', letterSpacing: '0.05em', color: 'var(--text-primary)',
                                    display: 'flex', alignItems: 'center', gap: '0.3rem'
                                }}
                            >
                                <LogOut size={10} strokeWidth={2} /> SALIR
                            </button>
                        </div>
                    ) : (
                        <div id="navbar-google-signin"></div>
                    )}

                </div>

            </div>
        </nav>
    );
};
