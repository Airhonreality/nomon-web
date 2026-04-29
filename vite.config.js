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
        server.middlewares.use('/api/upload', (req, res, next) => {
          if (req.method === 'POST') {
            const filename = req.headers['x-filename'];
            if (!filename) return res.end("Missing filename");

            const targetDir = path.resolve(__dirname, 'public/assets/materia');
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

            const filePath = path.join(targetDir, filename);
            const fileStream = fs.createWriteStream(filePath);

            req.pipe(fileStream);
            req.on('end', () => {
              res.statusCode = 200;
              res.end(JSON.stringify({ 
                url: `/assets/materia/${filename}`,
                msg: "Activo cristalizado en el silo de medios." 
              }));
            });
          } else {
            next();
          }
        });

        server.middlewares.use('/api/delete', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { context_id, slug } = JSON.parse(body);
                console.log(`🧨 [Indra:Middleware] Petición de disolución: ${slug} en ${context_id}`);
                
                const dbPath = path.resolve(__dirname, 'src/score/silo/local_database.json');
                const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
                
                if (db[context_id]) {
                  const initialCount = db[context_id].length;
                  db[context_id] = db[context_id].filter(item => item.slug !== slug);
                  
                  if (db[context_id].length < initialCount) {
                    fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));
                    console.log(`🔥 [Indra:Silo] Materia disuelta con éxito: ${slug}`);
                    res.statusCode = 200;
                    res.end(JSON.stringify({ status: 'OK', msg: 'Disuelto.' }));
                  } else {
                    console.warn(`⚠️ [Indra:Silo] No se encontró materia con slug: ${slug}`);
                    res.statusCode = 404;
                    res.end(JSON.stringify({ status: 'NOT_FOUND', msg: 'No encontrado.' }));
                  }
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ status: 'ERROR', msg: 'Contexto no válido.' }));
                }
              } catch (err) {
                console.error("❌ [Indra:Middleware] Error en DELETE:", err.message);
                res.statusCode = 500;
                res.end(JSON.stringify({ status: 'ERROR', msg: err.message }));
              }
            });
          } else {
            next();
          }
        });

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
