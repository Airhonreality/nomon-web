/**
 * 🛰️ ROUTE REGISTRY
 * Definición declarativa de las capas de navegación.
 */
export const ROUTE_MAP = {
    '/': {
        id: 'home',
        components: [
            'hero_portal_home',
            { 
                meta: { 
                    component_type: 'banner_action', 
                    materia_id: 'somos-nomon-y-esta-es-nuestra-forma-de-navegar' 
                } 
            },
            'grid_entries_newsfeed',
            { 
                meta: { 
                    component_id: 'banner_info_footer', 
                    component_type: 'banner_info',
                    materia_id: 'ideas-que-echan-raices-acciones-que-transforman' 
                } 
            }
        ]
    },
    '/materia/:slug': {
        id: 'materia_detail',
        components: ['materia_detail']
    },
    '/admin/forge': {
        id: 'forge',
        components: ['hero_forge', 'materia_forge']
    }
};
