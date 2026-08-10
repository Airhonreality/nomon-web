# Índice de Recursos - NOMON Contexto

**Propósito:** Navegación completa y enlaces directos a todos los recursos del proyecto NOMON.

---

## 📁 Recursos Locales

### 1. Prototipos y Desarrollo

| Recurso | Ruta | Descripción |
|---------|------|-------------|
| **NOMON (Prototipo Uno)** | `C:\Users\javir\Documents\DEVs\NOMON` | Primer prototipo de NOMON y hallazgos iniciales del negocio |
| **NOMON WEB (Producción Actual)** | `C:\Users\javir\Documents\DEVs\NOMON WEB` | Sitio web actual en producción |
| **nomon_clone (Prototipo Completo)** | `C:\Users\javir\Documents\DEVs\nomon_clone` | Prototipo completo de aplicación web NOMON |

### 2. Documentación del Simposio

| Recurso | Ruta | Descripción |
|---------|------|-------------|
| **SIMPOSIO (Victor Hugo)** | `G:\Mi unidad\SIMPOSIO` | Carpeta de trabajo del simposio (línea Victor Hugo) |
| **SIMPOSIO UNAL (Javier García)** | `L:\Mi unidad\SIMPOSIO` | Documento preliminar de trabajo del simposio con gente de UNAL (línea Javier García) |
| **Documento Principal** | `L:\Mi unidad\SIMPOSIO\Planteamiento de proyecto simposio preliminar.docx` | Documento base para estructurar el simposio |

### 3. Skills y Herramientas

| Recurso | Ruta | Descripción |
|---------|------|-------------|
| **Skills Virgin** | `C:\Users\javir\Documents\DEVs\Skills-virgin` | Comandos CLI y extracción de skills para Notion API |

---

## 🔗 Recursos Externos

### Notion

| Recurso | Enlace | Descripción |
|---------|--------|-------------|
| **Notion - Simposio** | https://app.notion.com/p/SIMPOSIO-ET-CA-3a8b5567ba7180be98f1db073682a3fb | Tareas y reuniones del Simposio |
| **API Key** | `$NOTION_API_KEY` (ver `.env` local) | Clave de acceso a la API de Notion |

---

## 📊 Estructura Interna

```
nomon-contexto/
├── INDEX.md                    # Este archivo
├── estado/
│   └── progreso.md             # Documento de progreso con tareas
├── ledger/
│   └── tareas/                 # Historial de tareas (t-xxx.json)
└── recursos/
    ├── web-publico/            # Componentes de la web pública
    │   └── src/
    │       └── components/
    │           └── specialized/
    │               └── nomon/
    │                   └── homepages/
    ├── simposio/               # Contenido del Simposio
    │   ├── raw/                # Documentos originales
    │   └── processed/          # Contenido estructurado
    │       ├── slides/         # Slides del Simposio (P02)
    │       └── hero/           # Contenido del Hero (P01)
    └── notion/                 # Datos de Notion
```

---

## 🎯 Próximos Pasos

1. **Conectar con Notion API** - Extraer datos de proyectos y reuniones
2. **Procesar documento del Simposio** - Estructurar contenido en slides
3. **Canonizar Hero** - Integrar contenido del Hero en la estructura

---

## 📝 Notas

- Todas las rutas son locales a esta máquina
- La API key de Notion debe usarse solo en variables de entorno, nunca en archivos versionados
- El documento principal del Simposio está en `L:\Mi unidad\SIMPOSIO\Planteamiento de proyecto simposio preliminar.docx`
