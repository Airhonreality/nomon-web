/**
 * 🛰️ NOMON FLIGHT TEST (Full Integration)
 * Misión: Validar la cadena completa: Ignición -> Clic -> Navegación -> Detalle.
 */
import { NomonBridge } from './src/score/logic/NomonBridge.js';
import { SovereignHydrator } from './src/score/logic/sovereign_hydrator.js';
import { WorkflowDispatcher } from './src/score/logic/Workflows.js';

// Mock del Router para Node
const MockRouter = {
    currentPath: '/',
    navigate(path) {
        this.currentPath = path;
        console.log(`🧭 [MockRouter] Navegando a: ${path}`);
    }
};

// Mock de window y localStorage para Node (Inyección de nivel raíz)
globalThis.localStorage = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
};
globalThis.window = { Router: MockRouter, localStorage: globalThis.localStorage };
WorkflowDispatcher.setBridge(NomonBridge);

async function startFlight() {
    console.log("🚀 [Flight] Iniciando Simulación de Vuelo...");

    // 1. RESONANCIA (Cargar noticias)
    const response = await NomonBridge.execute({ protocol: 'ATOM_READ', context_id: 'NOMON_ENTRIES' });
    console.log(`✅ [1/4] Resonancia Exitosa: ${response.items.length} entradas.`);

    // 2. HIDRATACIÓN (Convertir a tarjetas con lógica)
    const gridConfig = SovereignHydrator.hydrateEntriesToGrid(response.items, 'grid_entries_newsfeed');
    const firstCard = gridConfig.data.content.items[0];
    console.log("✅ [2/4] Hidratación Exitosa. Nervio de navegación detectado.");

    // 3. INTERACCIÓN (Simular Clic)
    console.log("🖱️ [Simulación] Usuario hace clic en la primera tarjeta...");
    const event = firstCard.logic.events.on_click;
    
    // Ejecutar como lo haría el componente DataCard corregido
    console.log(`📡 [Dispatcher] Disparando Workflow: ${event.workflow}`);
    await WorkflowDispatcher.execute(event.workflow, event.params);
    console.log("✅ [3/4] Workflow Dispatcher ejecutado con éxito.");

    // 4. VERIFICACIÓN DE RUTA FINAL
    console.log(`🏁 [4/4] Verificación de Destino: ${MockRouter.currentPath}`);
    
    if (MockRouter.currentPath === '/proyectos/despertar-nomon') {
        console.log("\n✨ ✨ ✨ SISTEMA OPERATIVO Y ESTABLE ✨ ✨ ✨");
        console.log("La cadena Ignición -> Clic -> Navegación ha sido validada en la Shell.");
    } else {
        throw new Error("Fallo en la navegación final.");
    }
}

startFlight().catch(err => {
    console.error("\n❌ FALLO CRÍTICO EN EL SISTEMA:");
    console.error(err);
    process.exit(1);
});
