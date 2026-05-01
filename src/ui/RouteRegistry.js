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
                    materia_id: 'somos-nomon' 
                } 
            },
            'grid_entries_newsfeed',
            { 
                meta: { 
                    component_id: 'banner_info_footer', 
                    component_type: 'banner_info',
                    materia_id: 'ideas-que-echan-raices' 
                } 
            }
        ]
    },
    '/materia/:slug': {
        id: 'materia_detail',
        components: ['materia_detail']
    },
    '/biblioteca/:slug': {
        id: 'materia_reader',
        components: ['materia_reader']
    },
    '/perfil': {
        id: 'user_profile',
        components: ['identity_profile']
    },
    '/quienes-somos': {
        id: 'quienes_somos',
        components: [
            { meta: { component_type: 'banner_info', materia_id: 'quienes-somos-intro' } },
            { meta: { component_type: 'banner_info', materia_id: 'nuestra-filosofia' } }
        ]
    },
    '/admin/forge': {
        id: 'forge',
        components: ['hero_forge', 'materia_forge']
    },
    '/comercialFilbo': {
        id: 'comercial_filbo',
        components: ['comercial_portal'],
        restricted: true
    },
    '/comercialAuditoria': {
        id: 'comercial_auditoria',
        components: ['comercial_auditoria'],
        restricted: true
    }



};
