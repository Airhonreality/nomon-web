/**
 * @indra_schema ComponentSchema
 * Dharma: Planos de proyección visual (UI DNA).
 */
export const schema = {
    id: 'NOMON_COMPONENT',
    class: 'DATA_SCHEMA',
    handle: {
        alias: 'NOMON_COMPONENT',
        label: 'Biblioteca de Proyectores',
        icon: 'VIEW_QUILT'
    },
    payload: {
        fields: [
            { id: 'id', label: 'ID del Proyector', type: 'string', required: true },
            { 
                id: 'type', 
                label: 'Tipo de Proyección', 
                type: 'enum', 
                options: ['hero_projection', 'data_grid', 'agnostic_form', 'markdown_block'] 
            },
            { id: 'props_schema', label: 'Contrato de Props (JSON)', type: 'json' },
            { 
                id: 'actions', 
                label: 'Capacidades de Acción', 
                type: 'enum', 
                options: ['NAVIGATE', 'SUBMIT', 'TRIGGER_WORKFLOW'] 
            }
        ],
        target_provider: 'json_manifest'
    }
};
