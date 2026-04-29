/**
 * 🗺️ INDRA ROUTE REGISTRY (Modo Standby)
 * Dharma: Mapa físico de navegación para el satélite NOMON.
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
