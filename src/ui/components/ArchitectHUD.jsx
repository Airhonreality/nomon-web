import { appState } from '../../score/AppState.js';
import { RouteSchema as RouteRegistry } from '../../score/schemas/RouteSchema.js';
import { WorkflowDispatcher } from '../../score/logic/sovereign_workflows.js';

/**
 * 🏛️ ARCHITECT HUD (v1.0)
 * Responsabilidad: Panel flotante de herramientas para el Arquitecto.
 * Solo visible si el rol es ARCHITECT.
 */
export class ArchitectHUD {
    constructor() {
        this.identity = appState.get().identity;
    }

    render() {
        // Solo el Arquitecto puede ver este HUD
        if (this.identity.role !== 'ARCHITECT') return null;

        const hud = document.createElement('div');
        hud.id = 'nomon-architect-hud';
        hud.className = 'architect-hud glass-morph';
        
        hud.innerHTML = `
            <div class="hud-header">
                <span>🛰️ ARCHITECT HUD</span>
                <span class="user-badge">${this.identity.user.payload.email}</span>
            </div>
            <div class="hud-tools">
                <button onclick="Router.navigate('/')">🏠 Home</button>
                <button onclick="Router.navigate('/admin')">🏗️ Crear Entrada</button>
                <button onclick="appState.logout(WorkflowDispatcher.bridge)">🚪 Salir</button>
            </div>
            <div class="hud-status">
                <small>Rutas Registradas: ${Object.keys(RouteRegistry).length}</small>
            </div>
        `;

        return hud;
    }
}
