/**
 * 🛰️ INDRA SILO BRIDGE (Universal Source)
 * Dharma: Fuente única de verdad para el satélite en modo Standby.
 * Axioma: Sin redundancia, sin cache, sin alias. Exactitud absoluta.
 */
import localDatabase from '../silo/local_database.json';

export const BRIDGE_MODE = 'OFFLINE'; 

/**
 * 🗺️ REGISTRO DE RUTAS CANÓNICO
 */
export const RouteRegistry = {
    '/': {
        roles: ['ADMIN', 'GUEST'],
        components: ['hero_portal_home', 'grid_entries_newsfeed'],
        meta: { title: 'NOMON | Inicio', desc: 'Portal de Soberanía Cognitiva' }
    },
    '/proyectos/:slug': {
        roles: ['ADMIN', 'GUEST'],
        components: ['hero_detail', 'markdown_body'],
        meta: { title: 'NOMON | Detalle', desc: 'Información del Proyecto' }
    }
};

/**
 * 📦 INVENTARIO DE COMPONENTES CANÓNICO
 */
export const ComponentInventory = [
    {
        meta: { component_type: "HERO_PROJECTION", component_id: "hero_portal_home" },
        data: { 
            content: { 
                title: "NOMON: Portal de Soberanía", 
                subtitle: "Nodo de información del protocolo Indra." 
            } 
        }
    },
    {
        meta: { component_type: "GRID_CONTAINER", component_id: "grid_entries_newsfeed" },
        data: { 
            content: { 
                items: [] 
            } 
        }
    }
];

export const SiloBridge = {
    async execute(uqo) {
        if (BRIDGE_MODE === 'OFFLINE') {
            return this._handleLocal(uqo);
        }
        return this._handleRemote(uqo);
    },

    _handleLocal(uqo) {
        const schemaId = uqo.schema_id || uqo.data?.schema_id;
        if (uqo.protocol === 'TABULAR_STREAM' || uqo.protocol === 'ATOM_READ' || uqo.protocol === 'INDUSTRIAL_SYNC') {
            const data = localDatabase[schemaId] || [];
            return {
                items: data,
                metadata: { status: 'OK', source: 'LOCAL_SILO', schema_id: schemaId }
            };
        }
        return { items: [], metadata: { status: 'OFFLINE_STUB' } };
    },

    getSession() {
        return {
            profile: { email: "invitado@nomon.local", name: "Arquitecto Offline", role: "ADMIN" }
        };
    },

    async _handleRemote(uqo) {
        return this._handleLocal(uqo);
    }
};
