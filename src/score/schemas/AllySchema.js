/**
 * @indra_schema AllySchema
 * Dharma: Definir la identidad soberana y sus capacidades granulares.
 */
export const AllySchema = {
    id: 'NOMON_ALLY',
    class: 'DATA_SCHEMA',
    handle: {
        alias: 'NOMON_ALLY',
        label: 'Registro de Aliados',
        icon: 'ACCOUNT_CIRCLE'
    },
    payload: {
        fields: [
            { id: 'email', label: 'Correo Electrónico', type: 'string', required: true },
            { id: 'alias', label: 'Nombre de Guerra (Alias)', type: 'string' },
            { id: 'role_label', label: 'Rango Visual', type: 'string' },
            { 
                id: 'permissions', 
                label: 'Capacidades de Malla', 
                type: 'json', 
                description: 'Objetos JSON con permisos granulares.' 
            },
            { id: 'last_sync', label: 'Última Resonancia', type: 'timestamp' }
        ],
        target_provider: 'sheets'
    }
};

export const schema = AllySchema;
