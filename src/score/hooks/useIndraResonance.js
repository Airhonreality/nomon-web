import { useState, useEffect } from 'react';
import { useSovereign } from '../SovereignContext.jsx';

console.log("🧬 [Module] useIndraResonance.js CARGADO.");

export const useIndraResonance = (contextId, externalContext = null) => {
    // Si se provee un contexto externo (ej. desde el Provider), lo usamos. 
    // Si no, recurrimos al hook estándar (que fallará si está fuera del provider).
    let bridge, state;
    
    if (externalContext) {
        bridge = externalContext.bridge;
        state = externalContext.state;
    } else {
        const sovereign = useSovereign();
        bridge = sovereign.bridge;
        state = sovereign.state;
    }

    const [loading, setLoading] = useState(false);
    const [remoteData, setRemoteData] = useState(null);

    // console.log(`🧪 [Hook:Invoke] contextId: ${contextId} | Bridge listo: ${!!bridge}`);

    const localDefinition = state.inventory?.find(ex => (ex?.meta?.component_id || ex?.metadata?.component_id) === contextId);

    useEffect(() => {
        console.log(`📡 [Hook:Effect] Disparado para: ${contextId}. Bridge: ${!!bridge}`);
        
        if (localDefinition?.data?.content?.items?.length > 0) {
            console.log(`🏠 [Hook:Homeostasis] Materia ya presente para ${contextId}. Abortando petición.`);
            return;
        }

        if (!contextId) {
            console.warn(`⚠️ [Hook:Warning] Intentando resonar sin contextId.`);
            return;
        }

        let isMounted = true;

        const resonate = async () => {
            console.log(`🚀 [Hook:Resonate] Iniciando petición ATOM_READ para ${contextId}...`);
            setLoading(true);
            try {
                const response = await bridge.execute({ 
                    protocol: 'ATOM_READ', 
                    context_id: contextId 
                });

                console.log(`💎 [Hook:Success] Respuesta recibida para ${contextId}:`, response);

                if (isMounted) {
                    const entries = Array.isArray(response.items) ? response.items : response.items?.NOMON_ENTRIES || [];
                    console.log(`📦 [Hook:Data] Entradas extraídas: ${entries.length}`);
                    setRemoteData(entries);
                    setLoading(false);
                }
            } catch (err) {
                console.error(`❌ [Hook:Error] Fallo en resonancia para ${contextId}:`, err);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        resonate();
        return () => { 
            console.log(`🧹 [Hook:Cleanup] Desmontando resonancia de ${contextId}`);
            isMounted = false; 
        };
    }, [contextId, bridge]);

    return { definition: localDefinition, remoteData, loading };
};
