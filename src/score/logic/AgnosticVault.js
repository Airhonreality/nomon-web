import { INDRA_CONFIG } from '../../../indra_identity.js';

/**
 * AXIOMA DE SINCERIDAD (Vector C): Namespacing Atómico.
 * Cada satélite es una isla de identidad independiente para evitar crisis de personalidad.
 */
const SATELLITE_ID = INDRA_CONFIG.satellite_id || 'nomon_sat_01';
const SESSION_KEY = `indra_session_${SATELLITE_ID}`;
const VAULT_KEY = `indra_vault_${SATELLITE_ID}`;

export const AgnosticVault = {
    /**
     * Persiste el estado completo o parcial.
     */
    save(state) {
        // Separamos la identidad del resto del estado para cumplir con el protocolo L2
        const { identity, ...rest } = state;
        
        if (identity) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(identity));
        }
        
        localStorage.setItem(VAULT_KEY, JSON.stringify(rest));
        // console.log(`💾 [Vault] Malla sincronizada en ${VAULT_KEY}`);
    },

    /**
     * Recupera el estado guardado.
     */
    load() {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        const vaultStr = localStorage.getItem(VAULT_KEY);
        
        const identity = sessionStr ? JSON.parse(sessionStr) : null;
        const rest = vaultStr ? JSON.parse(vaultStr) : {};

        return {
            identity,
            ...rest
        };
    },

    /**
     * Limpieza total (Extinción Física Local)
     */
    clear() {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(VAULT_KEY);
        console.warn(`🧹 [Vault] Materia purgada.`);
    }
};
