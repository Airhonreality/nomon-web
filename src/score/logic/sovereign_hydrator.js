import { EntitySchema as EntrySchema, EntryUIMapping } from '../schemas/EntitySchema.js';

/**
 * 💧 DATA HYDRATOR (Agnostic Version)
 * Misión: Traducir "Materia Prima" (JSON de Drive) a "Materia Refinada" (ComponentContract).
 */
export const SovereignHydrator = {
    /**
     * Transforma una lista de Entries en un Grid de DataCards.
     */
    hydrateEntriesToGrid(rawEntries, targetComponentId) {
        return {
            meta: {
                component_type: "GRID_CONTAINER",
                component_id: targetComponentId,
                layout_rules: "newsfeed-grid"
            },
            data: {
                content: {
                    items: rawEntries.map(entry => this.hydrateEntryToCard(entry))
                }
            }
        };
    },

    /**
     * Traduce una Entry individual a una DataCard.
     */
    hydrateEntryToCard(entry) {
        const uiMap = EntryUIMapping[entry.type] || { icon: "📄", badge_class: "badge-generic" };
        const metadata = entry.metadata || {};
        
        return {
            meta: {
                component_type: "DATA_CARD",
                component_id: `entry_${entry.id}`,
                layout_rules: `card-entry ${uiMap.badge_class}`
            },
            data: {
                content: {
                    title: { es: metadata.title || "Sin Título" },
                    subtitle: { es: metadata.summary || "Sin descripción disponible." },
                    label: { es: entry.type_label || entry.type },
                    icon: uiMap.icon,
                    image: metadata.media_url || "",
                    url: `/proyectos/${entry.slug}` 
                }
            },
            logic: {
                events: {
                    on_click: {
                        workflow: "NAVIGATE",
                        params: { path: `/proyectos/${entry.slug}` }
                    }
                }
            }
        };
    },

    /**
     * TRANSFOMADOR: Convierte el cuerpo de un proyecto en un bloque de contenido.
     */
    projectToDetail(project) {
        return [
            {
                meta: { component_type: "HERO_PROJECTION", component_id: `hero_${project.id}` },
                data: { content: { title: project.name, subtitle: project.description } },
                logic: { events: {} }
            },
            {
                meta: { component_type: "MARKDOWN_BLOCK", component_id: `body_${project.id}` },
                data: { content: { body: project.body_markdown } },
                logic: { events: {} }
            }
        ];
    },

    /**
     * Mapea registros crudos a definiciones de componentes.
     */
    mapToCards(records, mapping) {
        if (!Array.isArray(records)) return [];
        return records.map(record => this.projectToCard(record));
    }
};
