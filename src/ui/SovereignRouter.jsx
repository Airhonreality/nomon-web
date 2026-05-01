import React, { useState, useEffect } from 'react';
import { useSovereign } from '../score/SovereignContext.jsx';
import { ROUTE_MAP } from './RouteRegistry.js';
import { COMPONENT_REGISTRY } from './ComponentRegistry.jsx';

export const SovereignRouter = () => {
    const { state } = useSovereign();
    const [path, setPath] = useState(window.location.hash.replace('#', '') || '/');
    const [routeConfig, setRouteConfig] = useState(null);
    const [params, setParams] = useState({});

    useEffect(() => {
        const handleHashChange = () => setPath(window.location.hash.replace('#', '') || '/');
        window.addEventListener('hashchange', handleHashChange);
        
        window.Router = { navigate: (newPath) => {
            window.location.hash = newPath;
        }};

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        // Separamos la ruta de los parámetros de búsqueda (?...)
        const [cleanPath, search] = path.split('?');
        let matchedRoute = ROUTE_MAP[cleanPath];
        let matchedParams = {};

        if (!matchedRoute) {
            for (const r in ROUTE_MAP) {
                if (r.includes(':')) {
                    // Regex mejorado para manejar slugs y separar parámetros
                    const regex = new RegExp(`^${r.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
                    const match = cleanPath.match(regex);
                    if (match) {
                        matchedRoute = ROUTE_MAP[r];
                        matchedParams.slug = match[1];
                        break;
                    }
                }
            }
        }

        setRouteConfig(matchedRoute);
        setParams(matchedParams);
        
        if (matchedRoute) {
            console.log(`🎬 [Router] Match: ${matchedRoute.id} (${path}). Proyectando ${matchedRoute.components.length} actores.`);
        }
    }, [path]);

    if (!routeConfig) return <div className="error-404">Ruta No Encontrada</div>;

    // 🔒 ESCUDO DE ACCESO SOBERANO
    if (routeConfig.restricted && !state.identity?.isLoggedIn) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' }}>
                <span style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔐</span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '1rem' }}>ACCESO RESTRINGIDO</h2>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, maxWidth: '25rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                    Esta sección del satélite requiere una identidad validada. Por favor, inicia sesión con tu cuenta autorizada de Google para continuar.
                </p>
                <div id="google-signin-btn-router"></div>
                <script dangerouslySetInnerHTML={{ __html: `
                    if (window.google) {
                        window.google.accounts.id.renderButton(
                            document.getElementById("google-signin-btn-router"),
                            { theme: "outline", size: "large", text: "continue_with" }
                        );
                    }
                `}} />
            </div>
        );
    }


    return (
        <main id="app-root-inner">
            {routeConfig.components.map((actorDef, idx) => {
                const isObject = typeof actorDef === 'object';
                const compId = isObject ? (actorDef.meta?.component_type || actorDef.meta?.component_id) : actorDef;
                
                const Component = COMPONENT_REGISTRY[compId];
                
                // Si es objeto, lo usamos directamente. Si es string, buscamos en inventario.
                const definition = isObject ? actorDef : state.inventory?.find(ex => (ex?.meta?.component_id || ex?.metadata?.component_id) === compId) 
                    || { meta: { component_id: compId } };
                
                const key = isObject ? (actorDef.meta?.component_id || idx) : compId;
                
                return Component ? <Component key={key} definition={definition} params={params} /> : null;
            })}
        </main>
    );
};
