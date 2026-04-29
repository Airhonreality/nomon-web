/**
 * @indra_schema RouteSchema
 * Dharma: El mapa topográfico del satélite.
 */
export const RouteSchema = {
    class: 'DATA_SCHEMA',
    handle: {
        alias: 'NOMON_ROUTE',
        label: 'Mapa de Navegación',
        icon: 'MAP'
    },
    payload: {
        fields: [
            { id: 'path', label: 'Coordenada (URL)', type: 'string', required: true },
            { id: 'component_id', label: 'ID del Proyector', type: 'reference' },
            { id: 'context_entity_id', label: 'Materia de Contexto', type: 'reference' },
            { 
                id: 'view_mode', 
                label: 'Modo de Proyección', 
                type: 'enum', 
                options: ['card', 'hero', 'full_page'] 
            },
            { id: 'roles_allowed', label: 'Acceso (Roles)', type: 'array' },
            { id: 'is_active', label: 'Estado Operativo', type: 'boolean' }
        ],
        target_provider: 'json_manifest'
    }
};

export const schema = RouteSchema;

/**
 * 🗺️ REGISTRO DE RUTAS (Modo Standby)
 * Este objeto mapea los paths a los componentes reales del Portal.
 */
export const REGISTRY = {
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

export const RouteRegistry = REGISTRY; 
