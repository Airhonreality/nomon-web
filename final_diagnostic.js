/**
 * 🛰️ INDRA FINAL DIAGNOSTIC
 * Dharma: Obtener el log crudo del Core para detectar la desviación de materia.
 */
import { INDRA_CONFIG } from './indra_identity.js';

async function diagnose() {
    console.log("🚀 [Final Diagnostic] Iniciando pulso de inserción...");
    
    const uqo = {
        protocol: 'TABULAR_UPDATE',
        schema_id: 'NOMON_ENTITY',
        workspace_id: INDRA_CONFIG.workspace_id,
        token: INDRA_CONFIG.core_token,
        data: {
            actions: [{
                type: 'INSERT',
                data: {
                    id: "test_" + Date.now(),
                    slug: "test-v20",
                    type: "diagnostic",
                    status: "active",
                    metadata: { title: "Sonda de Verdad" }
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
        
        console.log("\n📥 [CORE_RAW_RESPONSE]:");
        console.log(JSON.stringify(result, null, 2));
        console.log("\n-------------------------------------------");
        
        if (result.metadata?.status === 'OK') {
            console.log(`✅ El Core reporta ÉXITO.`);
            console.log(`📊 Filas mutadas: ${result.metadata.records_mutated || 0}`);
            console.log(`📂 ID de Destino (Physical): ${result.metadata.physical_id || 'No reportado'}`);
        } else {
            console.log(`❌ El Core reporta ERROR: ${result.metadata?.error || 'Sin mensaje'}`);
        }
    } catch (e) {
        console.error("❌ [Transport Error]:", e.message);
    }
}

diagnose();
