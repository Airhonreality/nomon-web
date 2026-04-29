/**
 * 🚀 SOVEREIGN WORKFLOWS (v1.0)
 */
import { appState } from '../AppState.js';

export const WorkflowDispatcher = {
    bridge: null,
    setBridge(bridge) { this.bridge = bridge; },

    registry: {
        'NAVIGATE': async (payload) => {
            console.log("🧭 [Workflow] Navegando a:", payload.path);
            if (window.Router) window.Router.navigate(payload.path);
        }
    },

    async execute(workflowId, payload = {}) {
        console.log(`[workflow:dispatcher] 📡 Resonando: ${workflowId}`);
        const func = this.registry[workflowId];
        if (func) await func(payload, this.bridge);
        else console.warn(`⚠️ Workflow [${workflowId}] no registrado.`);
    }
};
