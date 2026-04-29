/**
 * 🗺️ ROUTE REGISTRY
 * Definición declarativa de las capas de navegación.
 */
export const ROUTE_MAP = {
    '/': { 
        id: 'home',
        components: [
            'hero_portal_home', 
            { meta: { component_id: 'banner_info', component_type: 'banner_info' } }, 
            'grid_entries_newsfeed'
        ] 
    },
    '/proyectos/:slug': { 
        id: 'detail',
        components: ['hero_detail', 'markdown_body'] 
    },
    '/admin/forge': {
        id: 'forge',
        components: ['hero_forge', 'materia_forge']
    }
};
