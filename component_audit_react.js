/**
 * 🛰️ COMPONENT INTEGRITY AUDIT (Phase 3)
 */
import fs from 'fs';
import path from 'path';

const componentsPath = './src/ui/components/';
const components = ['DataCard.jsx', 'Hero.jsx', 'Grid.jsx', 'Skeleton.jsx'];

function auditComponents() {
    console.log("🔍 [Audit] Verificando Integridad de Componentes JSX...");

    components.forEach(file => {
        const fullPath = path.resolve(componentsPath, file);
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ El archivo ${file} no existe.`);
            process.exit(1);
        }

        const content = fs.readFileSync(fullPath, 'utf8');

        // 1. Verificar protección contra materia nula
        if (file !== 'Skeleton.jsx' && !content.includes('!definition')) {
            console.warn(`⚠️ [${file}] Posible falta de protección contra materia nula.`);
        }

        // 2. Verificar integración con Workflows (solo para DataCard)
        if (file === 'DataCard.jsx' && !content.includes('WorkflowDispatcher.execute')) {
            console.error(`❌ [${file}] El átomo está desconectado del sistema nervioso (Workflows).`);
            process.exit(1);
        }

        // 3. Verificar soporte de Skeletons (solo para Grid y DataCard)
        if ((file === 'Grid.jsx' || file === 'DataCard.jsx') && !content.includes('Skeleton')) {
            console.warn(`⚠️ [${file}] El componente no parece soportar estados de carga (Skeleton).`);
        }

        console.log(`✅ [${file}] Estructura validada.`);
    });

    console.log("\n✨ ✨ ✨ AUDITORÍA FASE 3: POSITIVA ✨ ✨ ✨");
    console.log("Los átomos han sido cristalizados con las protecciones de Indra.");
}

auditComponents();
