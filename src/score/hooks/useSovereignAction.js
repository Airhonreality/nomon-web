import { useSovereign } from '../SovereignContext.jsx';
import { WorkflowEngine } from '../logic/WorkflowEngine.js';

/**
 * 🛰️ HOOK: SOVEREIGN ACTION
 * Interfaz para disparar intenciones desde componentes React.
 */
export const useSovereignAction = () => {
    const { state, bridge } = useSovereign();

    const executeIntent = async (intentId, payload = {}) => {
        console.log(`📡 [Action] Intentando disparar intención: ${intentId}`);

        // 1. Buscar el workflow en el inventario (Resonancia)
        const workflowEntity = (state.inventory || []).find(item => 
            item.meta?.component_type === 'ENTITY_WORKFLOW' && 
            (item.data?.intent_id === intentId || item.slug === intentId)
        );

        if (!workflowEntity) {
            // Si no está en el inventario, intentamos ver si el bridge tiene un workflow hardcoded
            try {
                return await bridge.executeWorkflow(intentId, payload);
            } catch (err) {
                console.error(`❌ [Action] Intención no encontrada: ${intentId}`);
                throw new Error(`INTENT_NOT_FOUND: La intención ${intentId} no existe en el Silo ni en el Bridge.`);
            }
        }

        // 2. Extraer pasos y ejecutar en el Motor
        const steps = workflowEntity.data?.steps || [];
        try {
            return await WorkflowEngine.run(steps, payload, bridge);
        } catch (error) {
            console.error(`❌ [Action] Error ejecutando intención ${intentId}:`, error.message);
            throw error;
        }
    };

    return { executeIntent };
};
