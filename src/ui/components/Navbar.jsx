import React, { useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { appState } from '../../score/AppState.js';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal.jsx';

/**
 * 🛰️ NAVBAR ACTOR (V2 - Mobile First)
 */
export const Navbar = ({ definition }) => {
    const { state, toggleTheme, manifest } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
    const [showAuth, setShowAuth] = React.useState(false);

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

    return (
        <>
            <nav className="main-navbar" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 9999, gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
                <div className="nav-logo" onClick={() => handleNavigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <svg viewBox="0 -20 500 145" style={{ height: '24px', width: 'auto', display: 'block', color: 'var(--text-primary)' }}>
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
                            <button 
                                onClick={() => setShowAuth(true)}
                                style={{ 
                                    background: '#002d62', border: 'none', color: '#fff',
                                    padding: '0.55rem 1.1rem', fontSize: '0.65rem', fontWeight: 900, 
                                    cursor: 'pointer', letterSpacing: '0.08em', borderRadius: '2px',
                                    transition: 'background 0.2s, transform 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#003d80'}
                                onMouseLeave={e => e.currentTarget.style.background = '#002d62'}
                            >
                                INGRESAR
                            </button>
                        )}

                    </div>

                </div>
            </nav>
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </>
    );
};
