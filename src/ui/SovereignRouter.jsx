import React, { useState, useEffect } from 'react';
import { useSovereign } from '../score/SovereignContext.jsx';
import { ROUTE_MAP } from './RouteRegistry.js';
import { COMPONENT_REGISTRY } from './ComponentRegistry.jsx';

export const SovereignRouter = () => {
    const { state } = useSovereign();
    const [path, setPath] = useState(window.location.pathname);
    const [routeConfig, setRouteConfig] = useState(null);
    const [params, setParams] = useState({});

    useEffect(() => {
        const handlePopState = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        
        window.Router = { navigate: (newPath) => {
            window.history.pushState({}, '', newPath);
            setPath(newPath);
        }};

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        let matchedRoute = ROUTE_MAP[path];
        let matchedParams = {};

        if (!matchedRoute) {
            for (const r in ROUTE_MAP) {
                if (r.includes(':')) {
                    const regex = new RegExp(`^${r.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
                    const match = path.match(regex);
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
