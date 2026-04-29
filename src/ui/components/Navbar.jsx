import React from 'react';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 🛰️ NAVBAR ACTOR
 * Un proyector de intenciones de navegación.
 */
export const Navbar = ({ definition }) => {
    const links = definition?.data?.content?.links || [];

    const handleNavigate = (path) => {
        if (window.Router) {
            window.Router.navigate(path);
        }
    };

    return (
        <nav className="main-navbar">
            <div className="nav-logo" onClick={() => handleNavigate('/')}>NOMON</div>
            <ul className="nav-links">
                {links.map((link, idx) => (
                    <li key={idx} onClick={() => handleNavigate(link.path)}>
                        {link.label}
                    </li>
                ))}
            </ul>
        </nav>
    );
};
