/**
 * 🧠 SOVEREIGN WORKFLOW ENGINE
 * Intérprete de secuencias lógicas atómicas.
 */

export const WorkflowEngine = {
    /**
     * Ejecuta una lista de pasos de forma secuencial y atómica.
     * @param {Array} steps - Lista de operaciones [{ op: '...', params: {} }]
     * @param {Object} payload - Datos de entrada para el flujo
     * @param {Object} bridge - Instancia del NomonBridge
     */
    run: async (steps = [], payload, bridge) => {
        console.log("🚀 [Engine] Iniciando ejecución de workflow...");
        const GAS_LIMIT = 20;
        let stepCount = 0;
        let context = { ...payload };

        for (const step of steps) {
            stepCount++;
            if (stepCount > GAS_LIMIT) {
                throw new Error("ERROR_ENGINE: Límite de pasos (Gas Limit) excedido. Posible bucle detectado.");
            }

            console.log(`🎬 [Engine] Paso ${stepCount}: ${step.op}`);

            try {
                switch (step.op) {
                    case 'VALIDATE':
                        // Lógica de validación de esquema
                        if (step.params?.required) {
                            for (const field of step.params.required) {
                                if (!context.entityData?.data?.content?.[field] && !context.entityData?.[field]) {
                                    throw new Error(`Falta campo requerido: ${field}`);
                                }
                            }
                        }
                        break;

                    case 'BRIDGE':
                        // Ejecución directa de protocolos del Bridge
                        const { protocol, context_id } = step.params;
                        await bridge.executeProtocol(protocol, { ...step.params, data: context.entityData });
                        break;

                    case 'NOTIFY':
                        // Disparador de feedback visual
                        alert(step.params?.msg || "Operación completada.");
                        break;

                    case 'RESONATE':
                        // Lógica de actualización cruzada (Cross-context)
                        console.log("📡 [Engine] Resonando con contexto:", step.params?.target);
                        // Aquí iría la lógica de actualización de otras entidades
                        break;

                    default:
                        console.warn(`⚠️ [Engine] Operación desconocida: ${step.op}`);
                }
            } catch (error) {
                console.error(`❌ [Engine] Error en paso ${stepCount} (${step.op}):`, error.message);
                throw new Error(`WORKFLOW_FAILED: ${error.message}`);
            }
        }

        console.log("✅ [Engine] Workflow finalizado con éxito.");
        return { status: 'COMPLETED', stepsProcessed: stepCount };
    }
};
