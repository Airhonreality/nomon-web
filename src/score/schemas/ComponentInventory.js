/**
 * 📦 COMPONENT INVENTORY (Materia Estructural)
 * Dharma: Definiciones de componentes para la proyeccción del portal.
 * AXIOMA: Solo estructura y datos. Cero estilos estéticos.
 */

export const UI_COMPONENTS = [
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
                items: [] // Se llenará dinámicamente desde el Silo
            } 
        }
    }
];
