/**
 * @indra_schema EntitySchema
 * Dharma: Único atractor de materia universal.
 */
export const EntitySchema = {
    id: 'NOMON_ENTITY',
    class: 'DATA_SCHEMA',
    handle: {
        alias: 'NOMON_ENTITY',
        label: 'Malla de Entidades',
        icon: 'DATA_USAGE'
    },
    payload: {
        fields: [
            { id: 'slug', label: 'Slug (URL)', type: 'string', required: true },
            { 
                id: 'type', 
                label: 'Naturaleza', 
                type: 'enum', 
                options: ['seed', 'project', 'news', 'event', 'artifact'] 
            },
            { 
                id: 'status', 
                label: 'Estado de la Materia', 
                type: 'enum', 
                options: ['draft', 'active', 'archived', 'redacted'] 
            },
            { id: 'metadata', label: 'Metadatos Fractales', type: 'json' },
            { id: 'updated_at', label: 'Última Edición', type: 'timestamp' }
        ],
        target_provider: 'sheets'
    }
};

export const schema = EntitySchema;
export const EntrySchema = EntitySchema; // Alias para compatibilidad

export const EntryUIMapping = {
    seed: { icon: "🌱", badge_class: "badge-seed" },
    project: { icon: "🚀", badge_class: "badge-project" },
    news: { icon: "📰", badge_class: "badge-news" },
    event: { icon: "📅", badge_class: "badge-event" },
    artifact: { icon: "🏺", badge_class: "badge-artifact" }
};
