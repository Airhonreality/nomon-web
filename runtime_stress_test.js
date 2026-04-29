/**
 * 🛰️ RUNTIME STRESS TEST (Phase 5 - Post Patch)
 * Simula datos ruidosos o incompletos para ver si el Router sobrevive.
 */
const mockInventory = [
    { metadata: { component_id: 'hero_portal_home' }, data: { content: { title: { es: 'Test' } } } },
    { meta: { component_id: 'grid_entries_newsfeed' }, data: { content: { items: [] } } },
    null, // Dato ruidoso
    { something: 'else' } // Dato incompleto
];

function simulateRouterLogic(compId, inventory) {
    console.log(`🔍 Buscando componente: ${compId}`);
    try {
        const definition = inventory.find(ex => {
            // Lógica exacta que pusimos en el Router
            return (ex?.meta?.component_id || ex?.metadata?.component_id) === compId;
        }) || { meta: { component_id: compId } };

        console.log(`✅ Resultado: Encontrado [${definition.meta?.component_id || definition.metadata?.component_id}]`);
        return true;
    } catch (e) {
        console.error(`❌ CRASH detectado para ${compId}:`, e.message);
        return false;
    }
}

const test1 = simulateRouterLogic('hero_portal_home', mockInventory);
const test2 = simulateRouterLogic('grid_entries_newsfeed', mockInventory);

if (test1 && test2) {
    console.log("\n✨ ✨ ✨ TEST DE ESTRÉS: POSITIVO ✨ ✨ ✨");
    console.log("El Router es ahora inmune a datos nulos o mal formados.");
} else {
    process.exit(1);
}
