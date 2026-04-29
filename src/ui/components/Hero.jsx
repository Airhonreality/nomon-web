import React, { useEffect } from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 🦸 HERO PROJECTION (Sovereign Actor)
 */
export const Hero = ({ definition, params }) => {
    const componentId = definition?.meta?.component_id || definition?.metadata?.component_id;
    const { dispatch } = useSovereign();
    
    // Si estamos en una vista de detalle, resonamos con el slug
    const resonanceId = params?.slug || componentId;
    const { remoteData, loading } = useIndraResonance(resonanceId);

    useEffect(() => {
        if (remoteData && !Array.isArray(remoteData)) {
            console.log(`💎 [Hero] Materia recibida para ${resonanceId}.`);
            
            // Si el objeto viene del ComponentMap (tiene data.content) o del Silo (tiene metadata)
            const newTitle = remoteData.data?.content?.title?.es || remoteData.metadata?.title || remoteData.name;
            const newSubtitle = remoteData.data?.content?.subtitle?.es || remoteData.metadata?.summary || remoteData.description;

            dispatch('inventory_update_component', { 
                id: componentId, 
                data: {
                    content: {
                        title: { es: newTitle },
                        subtitle: { es: newSubtitle }
                    }
                }
            });
        }
    }, [remoteData]);

    const content = definition?.data?.content || {};

    return (
        <header className="hero-section">
            <h1 className="hero-title">{content.title?.es || content.title || "NOMON"}</h1>
            <p className="hero-subtitle">{content.subtitle?.es || content.subtitle || ""}</p>
        </header>
    );
};
