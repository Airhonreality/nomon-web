import React, { useEffect } from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 🚩 BANNER INFO ACTOR
 * Resuena con materia de tipo BANNER_INFO.
 */
export const BannerInfo = ({ definition: initialDefinition }) => {
    const { state, dispatch } = useSovereign();
    const componentId = initialDefinition?.meta?.component_id || 'banner_info';
    
    // 🔍 Buscamos la versión más fresca de nuestra definición en el estado global
    const currentDefinition = state.inventory?.find(ex => 
        (ex?.meta?.component_id || ex?.metadata?.component_id) === componentId
    ) || initialDefinition;

    const { remoteData } = useIndraResonance('NOMON_ENTRIES');

    useEffect(() => {
        if (remoteData && Array.isArray(remoteData)) {
            const bannerMateria = remoteData.find(item => {
                const type = (item.meta?.component_type || item.metadata?.type || '').toUpperCase();
                return type === 'BANNER_INFO' || type === 'BANNER';
            });

            if (bannerMateria) {
                dispatch('inventory_update_component', {
                    id: componentId,
                    data: {
                        content: {
                            title: { es: bannerMateria.data?.content?.title?.es || bannerMateria.metadata?.title || bannerMateria.name },
                            text: { es: bannerMateria.data?.content?.summary?.es || bannerMateria.metadata?.summary || bannerMateria.description }
                        }
                    }
                });
            }
        }
    }, [remoteData]);

    const content = currentDefinition?.data?.content || {};

    return (
        <section className="banner-info">
            <div className="banner-content">
                <h2 className="banner-title">{content.title?.es || content.title || "Proyectando Banner..."}</h2>
                <p className="banner-text">{content.text?.es || content.text || ""}</p>
            </div>
        </section>
    );
};
