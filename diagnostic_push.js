/**
 * 🛰️ INDRA BURN-IN DIAGNOSTIC (Single Shot)
 * Dharma: Identificar por qué la materia no llega a las Sheets.
 */
import { INDRA_CONFIG } from './indra_identity.js';

async function test() {
    console.log("🧪 [Diagnostic] Intentando Push Individual de ent_home...");
    
    const uqo = {
        protocol: 'TABULAR_UPDATE',
        schema_id: 'NOMON_ENTITY',
        workspace_id: INDRA_CONFIG.workspace_id,
        token: INDRA_CONFIG.core_token,
        data: {
            actions: [{
                type: 'CREATE',
                data: {
                    id: "ent_home_diag",
                    slug: "inicio-diag",
                    type: "news",
                    status: "active",
                    metadata: { title: "Diagnóstico de Resonancia" }
                }
            }]
        }
    };

    try {
        const response = await fetch(INDRA_CONFIG.core_url, {
            method: 'POST',
            body: JSON.stringify(uqo)
        });
        const result = await response.json();
        
        console.log("📥 [Result] Respuesta completa del Core:");
        console.log(JSON.stringify(result, null, 2));
        
        if (result.metadata?.ignored_fields) {
            console.warn("⚠️ Campos ignorados:", result.metadata.ignored_fields);
        }
    } catch (e) {
        console.error("❌ [Error]:", e.message);
    }
}

test();
