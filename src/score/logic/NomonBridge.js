/**
 * 🛰️ NOMON BRIDGE (Final Resonance)
 * Dharma: Fuente única de verdad para el portal.
 * Axioma: Exactitud absoluta. HERO_PROJECTION y GRID_CONTAINER.
 */
import localDatabase from '../silo/local_database.json' with { type: 'json' };

export const RouteMap = {
    '/': {
        roles: ['ADMIN', 'GUEST'],
        components: ['hero_portal_home', 'grid_entries_newsfeed'],
        meta: { title: 'NOMON | Inicio' }
    },
    '/proyectos/:slug': {
        roles: ['ADMIN', 'GUEST'],
        components: ['hero_detail', 'markdown_body'],
        meta: { title: 'NOMON | Proyecto' }
    }
};

export const ComponentMap = [
    {
        meta: { component_type: 'NAVBAR_PROJECTION', component_id: 'main_navbar' },
        data: { 
            content: { 
                links: [
                    { label: 'Inicio', path: '/' },
                    { label: 'Quiénes Somos', path: '/quienes-somos' }
                ] 
            } 
        }
    },
    {
        meta: { component_type: 'HERO_PROJECTION', component_id: 'hero_portal_home' },
        data: { content: { title: { es: 'REDNOMON' }, subtitle: { es: 'Red de colaboración hacia los futuros eutópicos' } } }
    },
    {
        meta: { component_type: 'GRID_CONTAINER', component_id: 'grid_entries_newsfeed' },
        data: { content: { items: [] } }
    },
    {
        meta: { component_type: 'HERO_PROJECTION', component_id: 'hero_detail' },
        data: { content: { title: { es: 'Cargando...' }, subtitle: { es: 'Recuperando materia del silo...' } } }
    },
    {
        meta: { component_type: 'MARKDOWN_PROJECTION', component_id: 'markdown_body' },
        data: { content: { body: '' } }
    }
];

class NomonBridgeClass {
    constructor() {
        console.log("📡 [NomonBridge] Instanciando Singleton...");
    }

    async execute(uqo) {
        const id = uqo.schema_id || uqo.context_id || uqo.data?.schema_id;
        console.log(`🔌 [Bridge] Recibida petición: ${uqo.protocol} para ID: ${id}`);
        
        // --- PERSISTENCIA REAL (Offline via Vite Middleware) ---
        if (uqo.protocol === 'CREATE') {
            try {
                const response = await fetch('/api/persist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        context_id: uqo.context_id || 'NOMON_ENTRIES',
                        materia: uqo.data
                    })
                });
                return await response.json();
            } catch (err) {
                console.error("❌ [Bridge:Persist] Fallo de conexión con el Silo:", err);
                throw err;
            }
        }

        if (uqo.protocol === 'DELETE') {
            try {
                const response = await fetch('/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        context_id: uqo.context_id || 'NOMON_ENTRIES',
                        slug: uqo.data.slug
                    })
                });
                return await response.json();
            } catch (err) {
                console.error("❌ [Bridge:Delete] Fallo en la disolución de materia:", err);
                throw err;
            }
        }

        if (uqo.protocol === 'TABULAR_STREAM' || uqo.protocol === 'ATOM_READ' || uqo.protocol === 'INDUSTRIAL_SYNC') {
            // 1. Intentar búsqueda por ID directo (Contexto)
            let result = localDatabase[id];

            // 2. Si no hay resultado, buscar por SLUG en todas las colecciones (Detalle)
            if (!result) {
                console.log(`🔍 [Bridge] ID no encontrado como contexto. Buscando como slug...`);
                for (const context in localDatabase) {
                    const found = localDatabase[context].find(item => item.slug === id);
                    if (found) {
                        result = found;
                        break;
                    }
                }
            }

            console.log(`💎 [Bridge] Datos encontrados para [${id}]:`, result ? (Array.isArray(result) ? `${result.length} items` : '1 objeto') : 'NADA');
            
            return {
                items: result || [],
                metadata: { status: 'OK', id: id }
            };
        }
        return { items: [], metadata: { status: 'OK' } };
    }

    getSession() {
        return { profile: { email: "admin@nomon.dev", name: "Arquitecto", role: "ADMIN" } };
    }
}

export const NomonBridge = new NomonBridgeClass();
