import React, { useState, useEffect } from 'react';
import { useSovereign } from '../score/SovereignContext.jsx';
import { ROUTE_MAP } from './RouteRegistry.js';
import { COMPONENT_REGISTRY } from './ComponentRegistry.jsx';
import { useIndraResonance } from '../score/hooks/useIndraResonance.js';

/**
 * 🛰️ SOVEREIGN ROUTER ACTOR
 * Resuelve la proyección de componentes basada en la URL.
 * Incluye un motor de resolución dinámica (Fallback) para el Silo.
 */
export const SovereignRouter = () => {
    const { state } = useSovereign();
    const { remoteData: entries } = useIndraResonance('NOMON_ENTRIES');
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
        const [cleanPath, search] = path.split('?');
        let matchedRoute = ROUTE_MAP[cleanPath];
        let matchedParams = {};

        if (!matchedRoute) {
            // 🔍 RESOLUCIÓN DINÁMICA: Buscamos el slug directamente en el Silo
            const slug = cleanPath.replace(/^\//, '');
            const dynamicMatch = (entries || []).find(item => item.slug === slug);
            
            if (dynamicMatch) {
                matchedRoute = {
                    id: 'dynamic_materia',
                    components: ['materia_detail']
                };
                matchedParams.slug = slug;
            } else {
                // Fallback a patrones con parámetros (:slug)
                for (const r in ROUTE_MAP) {
                    if (r.includes(':')) {
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
        }

        setRouteConfig(matchedRoute);
        setParams(matchedParams);
        
        if (matchedRoute) {
            console.log(`🎬 [Router] Match: ${matchedRoute.id} (${path})`);
        }
    }, [path, entries]);

    if (!routeConfig) return <div className="error-404" style={{ padding: '5rem', textAlign: 'center', opacity: 0.5 }}>MATERIA NO ENCONTRADA EN EL SILO</div>;

    return (
        <main id="app-root-inner">
            {routeConfig.components.map((actorDef, idx) => {
                const isObject = typeof actorDef === 'object';
                const compId = isObject ? (actorDef.meta?.component_type || actorDef.meta?.component_id) : actorDef;
                const Component = COMPONENT_REGISTRY[compId];
                
                const definition = isObject ? actorDef : (entries || []).find(ex => (ex?.meta?.component_id || ex?.metadata?.component_id) === compId) 
                    || { meta: { component_id: compId } };
                
                const key = isObject ? (actorDef.meta?.component_id || idx) : compId;
                return Component ? <Component key={key} definition={definition} params={params} /> : null;
            })}
        </main>
    );
};
