/**
 * 🧭 ROUTER MATCHING TEST
 */
const registry = {
    '/': { name: 'Home' },
    '/proyectos/:slug': { name: 'Detail' }
};

function resolve(path) {
    console.log(`🔍 Resolviendo: ${path}`);
    let config = registry[path];
    let params = {};

    if (!config) {
        for (const route in registry) {
            if (route.includes(':')) {
                // Convertir :slug a un grupo de captura (letras, números, guiones)
                const regexPath = route.replace(/:[^\s/]+/g, '([\\w-]+)');
                const pattern = new RegExp(`^${regexPath}$`);
                const match = path.match(pattern);
                
                if (match) {
                    config = registry[route];
                    const paramNames = route.match(/:[^\s/]+/g);
                    paramNames.forEach((name, i) => {
                        params[name.substring(1)] = match[i + 1];
                    });
                    break;
                }
            }
        }
    }
    return { config, params };
}

const test1 = resolve('/proyectos/despertar-nomon');
console.log("Resultado Test 1:", JSON.stringify(test1, null, 2));

if (test1.config && test1.params.slug === 'despertar-nomon') {
    console.log("\n✅ EL MOTOR DE RUTEO ES VÁLIDO.");
} else {
    console.log("\n❌ EL MOTOR DE RUTEO HA FALLADO.");
    process.exit(1);
}
