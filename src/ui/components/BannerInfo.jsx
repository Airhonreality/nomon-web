import React, { useEffect, useState } from 'react';
import { useIndraResonance } from '../../score/hooks/useIndraResonance.js';
import { useSovereign } from '../../score/SovereignContext.jsx';

/**
 * 🚩 BANNER INFO ACTOR
 * Resuena con materia específica por materia_id.
 */
export const BannerInfo = ({ definition: initialDefinition }) => {
    const { state, dispatch } = useSovereign();
    const componentId = initialDefinition?.meta?.component_id || 'banner_info';
    const targetId = initialDefinition?.meta?.materia_id;
    
    // Estado local de seguridad (Fallback rápido)
    const [localContent, setLocalContent] = useState(null);

    const { remoteData } = useIndraResonance('NOMON_ENTRIES');

    useEffect(() => {
        if (remoteData && Array.isArray(remoteData) && targetId) {
            console.log(`📡 [Banner:Resonance] Buscando materia_id: ${targetId}`);
            
            const bannerMateria = remoteData.find(item => item.slug === targetId);

            if (bannerMateria) {
                const title = bannerMateria.data?.content?.title?.es || bannerMateria.metadata?.title || bannerMateria.name;
                const text = bannerMateria.data?.content?.summary?.es || bannerMateria.metadata?.summary || bannerMateria.description;

                // Evitar bucles de actualización si la materia es la misma
                const currentData = currentDefinition?.data?.content;
                const hasChanged = currentData?.title?.es !== title || currentData?.text?.es !== text;

                if (hasChanged) {
                    console.log("🎯 [Banner:Success] Materia encontrada y actualizada!");
                    setLocalContent({ title, text });
                    dispatch('inventory_update_component', {
                        id: componentId,
                        data: { content: { title: { es: title }, text: { es: text } } }
                    });
                } else if (!localContent) {
                    // Si no ha cambiado pero no tenemos contenido local, lo sincronizamos una vez
                    setLocalContent({ title, text });
                }
            } else {
                console.warn(`⚠️ [Banner:NotFound] No se encontró materia con slug: ${targetId}`);
            }
        }
    }, [remoteData, targetId]);

    // Prioridad: Local (fresco) > State (global) > Initial (prop)
    const currentDefinition = state.inventory?.find(ex => 
        (ex?.meta?.component_id || ex?.metadata?.component_id) === componentId
    ) || initialDefinition;

    const displayTitle = localContent?.title || currentDefinition?.data?.content?.title?.es || currentDefinition?.data?.content?.title;
    const displayText = localContent?.text || currentDefinition?.data?.content?.text?.es || currentDefinition?.data?.content?.text;

    return (
        <section className="banner-info">
            <div className="banner-content">
                <h2 className="banner-title">{displayTitle || "Proyectando Banner..."}</h2>
                <p className="banner-text">{displayText || ""}</p>
            </div>
        </section>
    );
};
