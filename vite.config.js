import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'indra-persistence-middleware',
      configureServer(server) {
        server.middlewares.use('/api/persist', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { context_id, materia } = JSON.parse(body);
                const dbPath = path.resolve(__dirname, 'src/score/silo/local_database.json');
                
                // 1. Leer el Silo actual
                const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
                
                // 2. Inyectar o Actualizar la materia
                if (!db[context_id]) db[context_id] = [];
                
                const existingIndex = db[context_id].findIndex(item => item.slug === materia.slug);
                if (existingIndex !== -1) {
                    console.log(`📝 [Indra:Silo] Actualizando materia existente: ${materia.slug}`);
                    db[context_id][existingIndex] = materia;
                } else {
                    console.log(`🆕 [Indra:Silo] Creando nueva materia: ${materia.slug}`);
                    db[context_id].unshift(materia); 
                }

                // 3. Escribir físicamente en el disco
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));
                
                console.log(`💾 [Indra:Silo] Materia cristalizada en ${context_id}: ${materia.slug}`);
                
                res.statusCode = 200;
                res.end(JSON.stringify({ status: 'OK', msg: 'Materia cristalizada en el Silo Físico.' }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ status: 'ERROR', msg: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    strictPort: true
  }
});
