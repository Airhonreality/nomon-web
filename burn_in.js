/**
 * 🛰️ INDRA BURN-IN v4.0 (The Sovereign Injector)
 * Dharma: Usar TABULAR_UPDATE vía Schema para que el Bridge procese la materia.
 * AXIOMA: Si no proveemos context_id físico, el Core DEBE usar el Bridge.
 */
import { INDRA_CONFIG } from './indra_identity.js';

async function ignite() {
    console.log("🔥 [Burn-In:Sovereign] Inyectando materia vía Schema...");

    const uqo = {
        protocol: 'TABULAR_UPDATE',
        schema_id: 'NOMON_ENTITY', // En la raíz, para que el Core lo resuelva
        token: INDRA_CONFIG.core_token,
        data: {
            actions: [
                {
                    type: 'CREATE',
                    data: { id: "ent_home", slug: "inicio", type: "news", status: "active", metadata: { title: "Home" } }
                }
            ]
        }
    };

    try {
        const response = await fetch(INDRA_CONFIG.core_url, {
            method: 'POST',
            body: JSON.stringify(uqo)
        });
        const result = await response.json();
        
        console.log("📥 [Result] Respuesta del Core:");
        console.log(JSON.stringify(result, null, 2));

        if (result.metadata?.status === 'OK') {
            console.log("\n✅ [Burn-In] Materia entregada con éxito.");
        }
    } catch (e) {
        console.error("❌ [Error]:", e.message);
    }
}

ignite();
