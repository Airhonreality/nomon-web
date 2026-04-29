/**
 * @indra_schema MappingSchema
 * Dharma: El sistema nervioso central. Define las aristas del grafo.
 */
export const schema = {
    id: 'NOMON_MAPPING',
    class: 'DATA_SCHEMA',
    handle: {
        alias: 'NOMON_MAPPING',
        label: 'Cerebro de la Malla',
        icon: 'HUB'
    },
    payload: {
        fields: [
            { id: 'parent_id', label: 'ID Padre (Origen)', type: 'reference', required: true },
            { id: 'child_id', label: 'ID Hijo (Destino)', type: 'reference', required: true },
            { 
                id: 'relation_type', 
                label: 'Tipo de Vínculo', 
                type: 'enum', 
                options: ['CHILD_OF', 'RELATED_TO', 'AUTHORED_BY', 'POWERED_BY'] 
            },
            { id: 'weight', label: 'Resonancia (Peso)', type: 'number' }
        ],
        target_provider: 'sheets'
    }
};
