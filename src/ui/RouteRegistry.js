/**
 * 🛰️ ROUTE REGISTRY
 * Definición declarativa de las capas de navegación.
 */
export const ROUTE_MAP = {
    '/': {
        id: 'home',
        components: ['landing_page']
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
    },
    '/red': {
        id: 'red_home',
        components: [
            'hero_portal_home',
            'grid_entries_newsfeed'
        ]
    },
    '/presentacion': {
        id: 'investor_deck',
        components: ['interactive_deck']
    }
};
