import localDatabaseFallback from '../silo/local_database.json';


export const Config = {
    SOVEREIGN_ACTOR: 'indra-core',
    BRIDGE_STRATEGY: 'CLOUD', // 'LOCAL' o 'CLOUD'
    ROLES: {
        ADMIN: ['indra-core'],
        AUDITOR: ['auditor-core']
    }
};

export const RouteContexts = {
    'forge': { 
        id: 'hero_forge',
        roles: ['ADMIN'],
        components: ['hero_forge', 'materia_constructor'],
        meta: { title: 'NOMON | La Forja' }
    },
    'materia': {
        id: 'hero_detail',
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
                    { label: 'Quiénes Somos', path: '/quienes-somos' },
                    { label: 'Simposio', path: '/presentacion' }
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

// -------------------------------------------------------------------------
// 🏛️ PERSISTENCE STRATEGY INTERFACE
// -------------------------------------------------------------------------
class PersistenceStrategy {
    async read(context_id) { throw new Error("Método no implementado"); }
    async persist(context_id, materia) { throw new Error("Método no implementado"); }
    async delete(context_id, slug) { throw new Error("Método no implementado"); }
}

// -------------------------------------------------------------------------
// ☁️ ESTRATEGIA: GITHUB API DIRECTO (Silo Cloud Universal)
// -------------------------------------------------------------------------
class GitHubStrategy extends PersistenceStrategy {
    constructor() {
        super();
        this.owner = 'Airhonreality';
        this.repo = 'nomon-web';
        this.branch = 'master';
        this.dbPath = 'src/score/silo/local_database.json';
        
        // La llave soberana ha sido purgada del código para evitar revocaciones automáticas.
        // Se implementará un mecanismo de Bóveda (Vault) para inyectarla en tiempo de ejecución.
        this.token = null; 
    }

    async hydrateVault(email) {
        if (!email) {
            console.warn("⚠️ [Vault] No se proporcionó identidad para acceder a la bóveda.");
            return false;
        }

        try {
            // URL de la Bóveda en Vercel (Desacoplada de GitHub Pages)
            const vaultUrl = 'https://project-wgrrd.vercel.app/api/vault';
            
            console.log(`🔐 [Vault] Solicitando llave soberana a la bóveda externa...`);
            const response = await fetch(vaultUrl, {
                headers: {
                    'x-sovereign-email': email
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ [Vault] Acceso denegado:", errorData.error || response.statusText);
                return false;
            }

            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                console.log("✅ [Vault] Llave soberana obtenida con éxito. Silo desbloqueado.");
                return true;
            } else {
                console.warn("⚠️ [Vault] La bóveda no entregó ningún token.");
            }
        } catch (error) {
            console.error("❌ [Vault] Error de conexión con la bóveda:", error);
        }
        return false;
    }

    async fetchFullDb() {
        const rawUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.dbPath}?t=${Date.now()}`;
        const apiUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dbPath}`;
        
        // Si tenemos token, preferimos la API (evita caché de Raw GitHub)
        if (this.token) {
            console.log("📡 [Bridge:Fetch] Usando API de GitHub (Modo Soberano)...");
            try {
                const res = await fetch(apiUrl, {
                    headers: { 'Authorization': `token ${this.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const content = decodeURIComponent(escape(atob(data.content)));
                    return JSON.parse(content);
                }
            } catch (err) {
                console.warn("⚠️ [Bridge:Fetch] Error en API, reintentando con Raw...", err);
            }
        }

        console.log("📡 [Bridge:Fetch] Leyendo desde Raw GitHub (Optimized)...");
        try {
            const res = await fetch(rawUrl);
            if (res.ok) return await res.json();
            throw new Error("No se pudo leer la base de datos.");
        } catch (err) {
            console.error("❌ [Bridge:Fetch] Error fatal:", err);
            return localDatabaseFallback || { NOMON_ENTRIES: [] };
        }
    }

    async read(context_id) {
        const db = await this.fetchFullDb();
        return db[context_id] || [];
    }

    async persist(context_id, materia) {
        console.log(`🚀 [Bridge:Persist] Intentando persistir materia: ${materia.slug} en ${context_id}`);
        const db = await this.fetchFullDb();
        
        if (!db[context_id]) db[context_id] = [];
        const index = db[context_id].findIndex(item => item.slug === materia.slug);
        if (index !== -1) {
            console.log(`📝 [Bridge:Persist] Actualizando entrada existente: ${materia.slug}`);
            db[context_id][index] = materia;
        } else {
            console.log(`➕ [Bridge:Persist] Insertando nueva entrada: ${materia.slug}`);
            db[context_id].unshift(materia);
        }

        return await this.commitToGitHub(db, `🛰️ [Silo] Actualizando materia: ${materia.slug}`);
    }

    async delete(context_id, slug) {
        console.log(`🔥 [Bridge:Delete] Eliminando materia: ${slug}`);
        const db = await this.fetchFullDb();
        if (db[context_id]) {
            db[context_id] = db[context_id].filter(item => item.slug !== slug);
            return await this.commitToGitHub(db, `🔥 [Silo] Disolviendo materia: ${slug}`);
        }
        return { status: 'OK', msg: 'No se encontró la materia.' };
    }

    async commitToGitHub(newDb, commitMessage) {
        const apiUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dbPath}`;
        console.log(`📤 [Bridge:Commit] Iniciando persistencia. Token presente: ${!!this.token}`);
        
        if (!this.token) {
            console.error("❌ [Bridge:Commit] ERROR: No hay token cargado. Abortando.");
            throw new Error("No hay llave soberana. Por favor, re-inicia sesión.");
        }

        try {
            const res = await fetch(apiUrl, {
                headers: { 
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!res.ok) {
                const errJson = await res.json();
                console.error("❌ [Bridge:Commit] No se pudo obtener SHA:", errJson);
                throw new Error(`Error de conexión (SHA): ${errJson.message}`);
            }

            const fileData = await res.json();
            const sha = fileData.sha;
            console.log("📤 [Bridge:Commit] SHA obtenido para sobrescritura:", sha);

            const body = {
                message: commitMessage,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(newDb, null, 4)))),
                sha: sha,
                branch: this.branch
            };

            const updateRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(body)
            });

            if (!updateRes.ok) {
                const errorData = await updateRes.json();
                console.error("❌ [Bridge:Commit] Error en PUT:", errorData);
                throw new Error(`Error de sincronización (PUT): ${errorData.message}`);
            }

            console.log("✅ [Bridge:Commit] Sincronización exitosa.");
            return { status: 'OK', msg: 'Cambios cristalizados en GitHub.' };
        } catch (err) {
            console.error("❌ [Bridge:Commit] Error fatal:", err.message);
            throw err;
        }
    }
}

// -------------------------------------------------------------------------
// 🏠 ESTRATEGIA: PERSISTENCIA LOCAL (Vite Middleware Server)
// -------------------------------------------------------------------------
class LocalStrategy extends PersistenceStrategy {
    constructor() {
        super();
        this.dbPath = 'src/score/silo/local_database.json';
    }

    async read(context_id) {
        console.log(`🏠 [Bridge:LocalRead] Leyendo del silo local para ${context_id}...`);
        return localDatabaseFallback[context_id] || [];
    }

    async persist(context_id, materia) {
        console.log(`🏠 [Bridge:LocalPersist] Persistiendo materia ${materia.slug} en ${context_id}...`);
        try {
            const response = await fetch('/api/persist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ context_id, materia })
            });

            if (!response.ok) {
                throw new Error(`Fallo al persistir en el Silo físico local: ${response.statusText}`);
            }

            const res = await response.json();
            
            // Actualizar localmente la referencia en memoria
            if (!localDatabaseFallback[context_id]) localDatabaseFallback[context_id] = [];
            const index = localDatabaseFallback[context_id].findIndex(item => item.slug === materia.slug);
            if (index !== -1) {
                localDatabaseFallback[context_id][index] = materia;
            } else {
                localDatabaseFallback[context_id].unshift(materia);
            }

            return { status: 'OK', msg: 'Cambios localizados en el disco.', data: res };
        } catch (error) {
            console.error("❌ [Bridge:LocalPersist] Error:", error);
            throw error;
        }
    }

    async delete(context_id, slug) {
        console.log(`🏠 [Bridge:LocalDelete] Disolviendo materia ${slug} de ${context_id}...`);
        try {
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ context_id, slug })
            });

            if (!response.ok) {
                throw new Error(`Fallo al disolver en el Silo físico local: ${response.statusText}`);
            }

            const res = await response.json();
            if (localDatabaseFallback[context_id]) {
                localDatabaseFallback[context_id] = localDatabaseFallback[context_id].filter(item => item.slug !== slug);
            }

            return { status: 'OK', msg: 'Cambios localizados en el disco.', data: res };
        } catch (error) {
            console.error("❌ [Bridge:LocalDelete] Error:", error);
            throw error;
        }
    }
}

// -------------------------------------------------------------------------
// 🌉 NOMON BRIDGE ACTOR
// -------------------------------------------------------------------------
import { SovereignWorkflows } from './SovereignWorkflows.js';

export class NomonBridge {
    constructor() {
        this.token = null;
        this.identity = null;
        const isLocal = typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' || 
             window.location.hostname.startsWith('192.168.'));
        this.strategy = (Config.BRIDGE_STRATEGY === 'CLOUD' && !isLocal) ? new GitHubStrategy() : new LocalStrategy();
    }

    /**
     * ⚡ EXECUTE WORKFLOW (The Intent Dispatcher)
     * Ejecuta una secuencia de lógica de negocio centralizada.
     */
    async executeWorkflow(workflowId, payload) {
        const workflow = SovereignWorkflows[workflowId];
        if (!workflow) {
            throw new Error(`ERROR_BRIDGE: El workflow '${workflowId}' no existe en el sistema.`);
        }
        return await workflow(this, payload);
    }

    async hydrateVault(email) {
        if (!this.strategy) return false;
        const success = await this.strategy.hydrateVault(email);
        if (success) {
            // Sincronizamos el token hacia la clase principal por si acaso
            this.token = this.strategy.token;
        }
        return success;
    }

    async execute(uqo) {
        const { protocol, context_id, data, payload } = uqo;
        
        if (protocol === 'ATOM_READ') {
            const items = await this.strategy.read(context_id);
            return { items, metadata: { context_id, count: items.length } };
        }

        if (protocol === 'CREATE' || protocol === 'UPDATE') {
            return await this.strategy.persist(context_id, data);
        }

        if (protocol === 'DELETE') {
            return await this.strategy.delete(payload.context_id, payload.slug);
        }

        throw new Error(`Protocolo desconocido: ${protocol}`);
    }
}
