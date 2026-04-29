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
    useEffect(() => {
        const processMateria = (materia) => {
            if (materia && Array.isArray(materia)) {
                // Mapeo agnóstico y FILTRADO por tipo universal
                const itemsToProject = materia
                    .filter(item => {
                        const type = (item.meta?.component_type || item.metadata?.type || '').toUpperCase();
                        return type.startsWith('ENTITY_') || type === 'DATA_CARD' || !type;
                    })
                    .map(item => ({
                        ...item,
                        meta: { ...item.meta, component_id: item.slug || item.id },
                        data: item.data || { content: { 
                            title: { es: item.metadata?.title || item.name },
                            summary: { es: item.metadata?.summary || item.description },
                            image: item.metadata?.image || item.image
                        }}
                    }));

                dispatch('inventory_update_component', { 
                    id: componentId, 
                    data: { content: { items: itemsToProject } } 
                });
            }
        };
        // ... (resto de la lógica de sincronía)

        if (remoteData) {
            processMateria(remoteData);
        } else {
            // Bypass si el hook no entrega nada pero el bridge sí tiene datos
            console.log(`📡 [Grid:Sync] Intentando sincronía directa...`);
            bridge.execute({ protocol: 'ATOM_READ', context_id: resonanceId })
                .then(res => processMateria(res.items))
                .catch(err => console.error("❌ [Grid:Error]", err));
        }
    }, [remoteData, resonanceId]);

    const items = definition?.data?.content?.items || [];

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
