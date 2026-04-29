/**
 * 🛰️ INDRA READ CHECK
 * Dharma: Verificar si los datos inyectados existen en el Core.
 */
import { INDRA_CONFIG } from './indra_identity.js';

async function check() {
    console.log("🔍 [Check] Consultando NOMON_ENTITY...");
    
    const uqo = {
        protocol: 'TABULAR_STREAM',
        schema_id: 'NOMON_ENTITY',
        workspace_id: INDRA_CONFIG.workspace_id,
        token: INDRA_CONFIG.core_token,
        data: { limit: 10 }
    };

    try {
        const response = await fetch(INDRA_CONFIG.core_url, {
            method: 'POST',
            body: JSON.stringify(uqo)
        });
        const result = await response.json();
        
        if (result.metadata?.status === 'OK') {
            console.log(`✅ [Check] Datos encontrados: ${result.items?.length || 0} filas.`);
            if (result.items?.length > 0) {
                console.log("📄 Primera fila detectada:", JSON.stringify(result.items[0], null, 2));
            }
        } else {
            console.error("❌ [Check] El Core no encuentra los datos:", result.metadata?.msg);
        }
    } catch (e) {
        console.error("❌ [Check] Error de conexión:", e.message);
    }
}

check();
