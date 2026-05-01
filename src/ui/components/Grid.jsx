import React, { useEffect } from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { SovereignHydrator as DataHydrator } from '../../score/logic/sovereign_hydrator.js';
import { DataCard } from './DataCard.jsx';
import { Skeleton } from './Skeleton.jsx';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 📦 GRID CONTAINER (Sovereign Actor)
 */
export const Grid = ({ definition }) => {
    const componentId = definition?.meta?.component_id || definition?.metadata?.component_id;
    const { bridge, dispatch } = useSovereign();
    const resonanceId = componentId === 'grid_entries_newsfeed' ? 'NOMON_ENTRIES' : componentId;

    console.log(`🏗️ [Grid] Render: ${componentId}`);

    const { remoteData, loading } = useIndraResonance(resonanceId);

    // 🧬 UNIFICACIÓN DE RESONANCIA
    const [projectedItems, setProjectedItems] = React.useState([]);

    useEffect(() => {
        const rawItems = remoteData?.items || remoteData;
        if (rawItems && Array.isArray(rawItems)) {
            // Mapeo agnóstico y FILTRADO por clase (Proyectos y Noticias)
            const itemsToProject = rawItems
                .filter(item => {
                    const type = item.meta?.component_type || '';
                    const isPortalClass = type === 'ENTITY_PROJECT' || type === 'ENTITY_NEWS';
                    const title = item.data?.content?.title?.es || item.data?.content?.title || item.metadata?.title || item.name;
                    return isPortalClass && title;
                })
                .map(item => ({
                    ...item,
                    meta: { ...item.meta, component_id: item.slug || item.id },
                    data: item.data || { content: { 
                        title: item.metadata?.title || item.name,
                        summary: item.metadata?.summary || item.description,
                        image: item.metadata?.image || item.image
                    }}
                }));

            setProjectedItems(itemsToProject);

            // Sincronizamos con el inventario global para persistencia
            const currentItems = definition?.data?.content?.items || [];
            if (JSON.stringify(currentItems) !== JSON.stringify(itemsToProject)) {
                dispatch('inventory_update_component', { 
                    id: componentId, 
                    data: { content: { items: itemsToProject } } 
                });
            }
        }
    }, [remoteData, componentId]);


    const items = projectedItems.length > 0 ? projectedItems : (definition?.data?.content?.items || []);

    if (loading && items.length === 0) {
        return (
            <section className="grid-container">
                {[1, 2, 3].map(i => <Skeleton key={i} type="card" />)}
            </section>
        );
    }

    return (
        <section className="grid-container">
            {items.length > 0 ? (
                items.map((item, index) => {
                    const identity = item.slug || item.id || item.meta?.component_id || `entry_${index}`;
                    return <DataCard key={identity} definition={item} />;
                })
            ) : (
                <div className="empty-state">No hay materia disponible para este sector.</div>
            )}
        </section>
    );
};
