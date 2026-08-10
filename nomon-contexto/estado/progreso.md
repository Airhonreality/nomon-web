# Progreso - NOMON Contexto

**Última actualización:** 2026-08-09

---

## 📋 Tareas Principales

### Tarea 1: Conectar con Notion API

**Estado:** ⏳ Pendiente

**Objetivo:** Configurar acceso a Notion usando API key y establecer extracción de datos de proyectos y reuniones del Simposio.

**Detalles:**
- **API Key:** `$NOTION_API_KEY` (definida en `.env` local, no versionada)
- **Enlace Notion:** https://app.notion.com/p/SIMPOSIO-ET-CA-3a8b5567ba7180be98f1db073682a3fb
- **Referencia:** `C:\Users\javir\Documents\DEVs\Skills-virgin` (comandos CLI y extracción de skills)

**Criterios de Aceptación:**
- [ ] Validar API key de Notion
- [ ] Descargar y parsear datos de proyectos de Notion
- [ ] Descargar y parsear datos de reuniones de Notion
- [ ] Crear archivos JSON con datos extraídos en `recursos/notion/`

**Comando Principal:**
```bash
# Probar API key y descargar datos
python scripts/notion_sync.py \
  --api-key "$NOTION_API_KEY" \
  --projects-dir "nomon-contexto/recursos/notion/proyectos/" \
  --meetings-dir "nomon-contexto/recursos/notion/reuniones/"
```

**Requisitos de Seguridad:**
- Usar variables de entorno para `NOTION_API_KEY`
- Nunca guardar clave en texto plano en archivos versionados
- Implementar manejo de errores para fallos de API

---

### Tarea 2: Procesar Documento Principal del Simposio

**Estado:** ⏳ Pendiente

**Objetivo:** Procesar el documento preliminar "Planteamiento de proyecto simposio preliminar.docx" en slides estructurados y contenido de Hero.

**Detalles:**
- **Documento Fuente:** `L:\Mi unidad\SIMPOSIO\Planteamiento de proyecto simposio preliminar.docx`
- **Línea:** Javier García con compañeros UNAL

**Criterios de Aceptación:**
- [ ] Extraer contenido principal del documento
- [ ] Generar 12 slides para `recursos/simposio/processed/slides/`
- [ ] Generar contenido de Hero para `recursos/simposio/processed/hero/`
- [ ] Validar estructura contra schema de `REGISTRO_DE_ENTIDADES.md`
- [ ] Generar `recursos/simposio/processed/simposio_summary.json`

**Comando Principal:**
```bash
# Procesar documento y generar slides y hero
python scripts/process_symposium_doc.py \
  --input "L:\Mi unidad\SIMPOSIO\Planteamiento de proyecto simposio preliminar.docx" \
  --output "nomon-contexto/recursos/simposio/processed/" \
  --slides-dir "nomon-contexto/recursos/simposio/processed/slides/" \
  --hero-dir "nomon-contexto/recursos/simposio/processed/hero/"
```

**Requisitos de Contenido:**
- Usar secciones existentes del documento original
- Mantener jerarquía de títulos y estructura
- Adaptar contenido al formato de slides requerido

---

## 📊 Estado General

| Tarea | Estado | Dependencias | Próximo Paso |
|-------|--------|-------------|-------------|
| **Tarea 1: Notion API** | ⏳ Pendiente | Credenciales disponibles | Verificar acceso a API |
| **Tarea 2: Documento Simposio** | ⏳ Pendiente | Documento disponible | Confirmar ruta exacta |

---

## 🎯 Próximos Pasos Inmediatos

1. **Verificar acceso a Notion API** con la key proporcionada
2. **Confirmar disponibilidad del documento** en `L:\Mi unidad\SIMPOSIO\Planteamiento de proyecto simposio preliminar.docx`
3. **Iniciar Tarea 1** (Notion API) una vez verificado el acceso
4. **Iniciar Tarea 2** (Documento Simposio) una vez confirmado el documento

---

## 📝 Notas

- Todas las tareas deben seguir el flujo del arnés agéntico
- Las credenciales de Notion deben manejarse con seguridad
- El documento del Simposio es la fuente principal para P02
