/**
 * 🛰️ INDRA RESONANCE PULSE
 * Dharma: Activar el motor de resonancia para que el Bridge cristalice la materia.
 */
import { INDRA_CONFIG } from './indra_identity.js';

async function pulse() {
    console.log("🧠 [Resonancia] Enviando pulso de análisis...");
    
    const uqo = {
        protocol: 'RESONANCE_ANALYZE',
        workspace_id: INDRA_CONFIG.workspace_id,
        token: INDRA_CONFIG.core_token,
        data: {
            schema_id: 'NOMON_ENTITY',
            sat_payload: {
                items: [
                    { id: "ent_home", slug: "inicio", type: "news", status: "active", metadata: { title: "Home" } }
                ]
            }
        }
    };

    try {
        const response = await fetch(INDRA_CONFIG.core_url, {
            method: 'POST',
            body: JSON.stringify(uqo)
        });
        const result = await response.json();
        
        console.log("📥 [Result] Respuesta de Resonancia:");
        console.log(JSON.stringify(result, null, 2));

        if (result.metadata?.resonance?.actions) {
            console.log(`🎯 Acciones detectadas por el Bridge: ${result.metadata.resonance.actions.length}`);
        }
    } catch (e) {
        console.error("❌ [Error]:", e.message);
    }
}

pulse();
