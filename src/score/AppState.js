import { AgnosticVault } from './logic/AgnosticVault.js';
import { INDRA_CONFIG } from '../../indra_identity.js';
import { ComponentMap } from './logic/NomonBridge.js';

/**
 * 🧠 APP STATE (v1.0 OMEGA)
 * Responsabilidad: Única fuente de verdad reactiva para el satélite.
 * Axioma: El estado es un reflejo de la realidad reconocida.
 */
export class AppState {
    constructor() {
        this.state = {
            lang: 'es',
            theme: 'dark',
            inventory: [...ComponentMap], // ADN Estructural inicial
            identity: {
                isLoggedIn: false,
                user: null,
                role: 'GUEST'
            },
            network: {
                status: 'IDLE'
            }
        };

        this.listeners = [];
        this.hydrateFromVault();
    }

    hydrateFromVault() {
        const cachedState = AgnosticVault.load();
        if (cachedState.identity) this.state.identity = cachedState.identity;
        if (cachedState.lang) this.state.lang = cachedState.lang;
        console.log("🧠 AppState: Hidratación completada.");
    }

    get() {
        return JSON.parse(JSON.stringify(this.state));
    }

    update(partialState, persist = false) {
        this.state = { ...this.state, ...partialState };
        if (persist) {
            AgnosticVault.save(this.state);
        }
        this.notify();
    }

    setIdentity(profile) {
        if (!profile) {
            this.update({
                identity: { isLoggedIn: false, role: 'GUEST', user: null }
            }, true);
            return;
        }

        const identityAtom = {
            isLoggedIn: true,
            role: profile.role || 'ALLY',
            user: {
                id: profile.id,
                handle: { alias: profile.alias || 'user', label: profile.name || 'Usuario' },
                class: 'IDENTITY',
                payload: { ...profile }
            }
        };

        this.update({ identity: identityAtom }, true);
        console.log(`🏛️ [Identidad] Soberanía reconocida: ${identityAtom.role}`);
    }

    async logout(bridge) {
        console.log("🧹 [Soberanía] Revocando sesión...");
        try {
            if (bridge) {
                await bridge.execute({
                    protocol: 'SYSTEM_SESSION_REVOKE',
                    data: { satellite_name: INDRA_CONFIG.satellite_name }
                });
            }
        } catch (e) {
            console.warn("⚠️ Error en revocación remota:", e.message);
        }

        this.update({
            identity: { isLoggedIn: false, user: null, role: 'GUEST' }
        }, true);

        AgnosticVault.clear();
        window.location.reload();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        const currentState = this.get();
        this.listeners.forEach(callback => callback(currentState));
    }
}

export const appState = new AppState();
// Sync pulse: 2026-04-26T17:26:00
