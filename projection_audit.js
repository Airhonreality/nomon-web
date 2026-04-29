/**
 * 🛰️ NOMON PROJECTION AUDIT (Node.js Edition)
 * Misión: Verificar la integridad de la materia antes de la proyeccción.
 */
import { SovereignHydrator as DataHydrator } from './src/score/logic/sovereign_hydrator.js';
import { NomonBridge } from './src/score/logic/NomonBridge.js';

async function runAudit() {
    console.log("🔍 [Audit] Iniciando Resonancia de Prueba...");
    
    // 1. Simular petición al Puente
    const response = await NomonBridge.execute({ 
        protocol: 'ATOM_READ', 
        context_id: 'NOMON_ENTRIES' 
    });

    console.log(`📡 [Bridge] Entradas recuperadas: ${response.items.length}`);

    if (response.items.length > 0) {
        // 2. Ejecutar Hidratación
        console.log("💧 [Hydrator] Transformando materia...");
        const gridConfig = DataHydrator.hydrateEntriesToGrid(response.items, 'grid_entries_newsfeed');
        
        // 3. Inspeccionar el primer item proyectado
        const firstItem = gridConfig.data.content.items[0];
        
        console.log("\n💎 [RESULTADO DE PROYECCIÓN - ITEM 0]:");
        console.log(JSON.stringify(firstItem, null, 2));

        // 4. Verificación de Contrato (Axiomas)
        console.log("\n⚖️ [Verificación de Contrato]:");
        const hasTitle = !!firstItem.data.content.title;
        const hasSubtitle = !!firstItem.data.content.subtitle;
        const hasLogic = !!firstItem.logic;
        const hasOnClick = hasLogic && !!firstItem.logic.events?.on_click;
        
        console.log(`- ¿Tiene Title? ${hasTitle ? '✅' : '❌'}`);
        console.log(`- ¿Tiene Subtitle? ${hasSubtitle ? '✅' : '❌'}`);
        console.log(`- ¿Tiene Objeto Logic? ${hasLogic ? '✅' : '❌'}`);
        console.log(`- ¿Tiene Evento on_click? ${hasOnClick ? '✅' : '❌'}`);
        
        if (!hasLogic || !hasOnClick) {
            console.error("🚨 ERROR: El componente crasheará al hacer clic porque no tiene 'logic.events'.");
        }
    } else {
        console.error("🚨 ERROR: El puente no devolvió materia del Silo.");
    }
}

runAudit().catch(err => console.error("❌ Fallo crítico en la auditoría:", err));
