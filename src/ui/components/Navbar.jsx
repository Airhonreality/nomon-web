import React, { useEffect } from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';
import { appState } from '../../score/AppState.js';

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

/**
 * 🛰️ NAVBAR ACTOR (V2 - Mobile First)
 */
export const Navbar = ({ definition }) => {
    const { state } = useSovereign();
    const links = definition?.data?.content?.links || [];

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
                        callback: (res) => {
                            const payload = decodeJwt(res.credential);
                            if (payload) {
                                appState.setIdentity({
                                    id: payload.sub,
                                    email: payload.email,
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
    }, [state.identity?.isLoggedIn]);

    return (
        <nav className="main-navbar" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 9999, gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
            <div className="nav-logo" onClick={() => handleNavigate('/')} style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em', cursor: 'pointer' }}>NOMON</div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                <ul className="nav-links" style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', gap: '1rem', margin: 0, padding: 0 }}>
                    {links.map((link, idx) => (
                        <li key={idx} onClick={() => handleNavigate(link.path)} style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: 0.7 }}>
                            {link.label}
                        </li>
                    ))}
                </ul>


                <div className="nav-identity-box" style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid #eee', paddingLeft: '1rem', minHeight: '2.5rem' }}>
                    {state.identity?.isLoggedIn ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.8rem' }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#666', wordBreak: 'break-all' }}>
                                👤 {state.identity.user?.payload?.email || 'USUARIO'}
                            </span>
                            <button 
                                onClick={() => appState.logout()} 
                                style={{ background: 'none', border: '1px solid #ddd', padding: '0.4rem 0.8rem', fontSize: '0.55rem', fontWeight: 900, cursor: 'pointer', letterSpacing: '0.05em' }}
                            >
                                SALIR
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
