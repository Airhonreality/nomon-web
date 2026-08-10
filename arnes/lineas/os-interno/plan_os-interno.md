# Plan Maestro: Línea OS Interno

**Línea:** `os-interno`
**Objetivo:** Construir el sistema operativo interno para NOMON (gestión de tareas, cronogramas, proyectos, correo avanzado).
**Estado:** **No iniciada** (pendiente de `web-publico` F0–F1).
**Stack:** Next.js 15 (App Router) + TypeScript + Drizzle + Neon + better-auth + Cloudflare R2 + Biome + Vitest.

---

## Contexto

El OS interno es la **segunda línea de trabajo** de NOMON, enfocada en:
1. **Gestión de tareas:** Asignación, seguimiento, estados.
2. **Cronogramas:** Planificación de proyectos y etapas.
3. **Dashboards:** Visualización de métricas y progreso.
4. **Correo avanzado:** Integración con la bandeja básica del web público.

**Dependencia:** Esta línea **no puede iniciar** hasta que la línea `web-publico` complete:
- F0 (schema base: Usuario, Recurso, Mensaje).
- F1 (lógica de negocio: auth, acceso a recursos).

---

## Fases y Entregables

| Fase | Objetivo | Entregables | Dependencias | Riesgo | ¿Frena al humano? |
|------|----------|-------------|--------------|--------|-------------------|
| **F0** | Schema del OS interno | `REGISTRO_DE_ENTIDADES.md` (actualizado con Tarea, Proyecto, Cronograma, Etapa) | `web-publico` F0 | Alto | Sí |
| **F1** | Lógica de negocio | Flujos de tareas, cronogramas, dashboards | `web-publico` F1 | Alto | Sí |
| **F2** | Dashboard principal | Diseño + implementación de `/admin` | F0, F1 | Medio | No |
| **F3** | Gestión de tareas | Diseño + implementación de `/admin/tareas` | F0, F1 | Medio | No |
| **F4** | Gestión de cronogramas | Diseño + implementación de `/admin/cronogramas` | F0, F1 | Medio | No |
| **F5** | Integración con correo | Extender bandeja de correo con filtros avanzados | F0, F1, `web-publico` F7 | Medio | No |
| **F6** | Hardening | Migración de datos, validación de schema, pruebas de integración | F2–F5 | Alto | Sí |
| **F7** | QA y Corte | Verificación de gates, checklist de corte, merge a `dev` | F6 | Máximo | Siempre |

---

## Schema Propuesto (F0)

**Nuevas entidades para el OS interno:**

| Entidad | Descripción | Relaciones |
|---------|-------------|------------|
| `Proyecto` | Proyecto interno (ej: "Simposio 2026", "Campaña de Ética") | 1—N `Tarea`, 1—N `Cronograma` |
| `Tarea` | Tarea individual (ej: "Redactar informe", "Enviar correos") | FK→`Proyecto`, FK→`Usuario` (asignado) |
| `Cronograma` | Cronograma de un proyecto | FK→`Proyecto`, 1—N `Etapa` |
| `Etapa` | Etapa de un cronograma (ej: "Fase 1", "Fase 2") | FK→`Cronograma` |

**Notas:**
- Reutilizar `Usuario` (de `web-publico` F0).
- Reutilizar `Mensaje` (de `web-publico` F0) para correo.
- `Tarea` y `Etapa` son entidades **nuevas** (no existen en el web público).

---

## Lógica de Negocio Propuesta (F1)

### 1. Gestión de Tareas
- **Estados:** `pendiente` → `en_progreso` → `completada` / `cancelada`.
- **Asignación:** Una tarea puede asignarse a un `Usuario` (FK).
- **Prioridad:** `baja`, `media`, `alta`, `urgente`.
- **Fechas:** `fecha_limite`, `fecha_completada`.

### 2. Gestión de Cronogramas
- **Estructura:** `Proyecto` → `Cronograma` → `Etapa`.
- **Fechas:** Cada `Etapa` tiene `fecha_inicio` y `fecha_fin`.
- **Progreso:** Calcular % de completitud basado en tareas terminadas.

### 3. Dashboards
- **Vistas:**
  - `/admin`: Resumen general (tareas pendientes, proyectos activos).
  - `/admin/tareas`: Listado de tareas (filtros por estado, prioridad, usuario).
  - `/admin/cronogramas`: Listado de cronogramas (filtros por proyecto, fecha).
- **Gráficos:** Usar librerías como `recharts` o `chart.js` (decidir en F2).

---

## Integración con Web Público

| Componente | Web Público | OS Interno | Integración |
|------------|-------------|------------|-------------|
| `Usuario` | Auth, perfil | Asignación de tareas | Reutilizar schema |
| `Mensaje` | Bandeja básica | Bandeja avanzada | Extender funcionalidad |
| Middleware | Auth básica | Auth + roles | Reutilizar `/app/middleware.ts` |

---

## Decisiones Pendientes

1. **Ruta del OS interno:**
   - Opción A: `/admin` (ruta bajo el mismo dominio).
   - Opción B: `os.rednomon.com` (subdominio).
   - **Recomendación:** Opción A (más simple, mismo proyecto Vercel).

2. **Autenticación:**
   - Opción A: Reutilizar middleware de `web-publico`.
   - Opción B: Middleware separado para `/admin`.
   - **Recomendación:** Opción A (consistencia).

3. **Librería de gráficos:**
   - Opción A: `recharts` (ligera, React).
   - Opción B: `chart.js` (más potente).
   - **Recomendación:** Decidir en F2.

---

## Próximos Pasos

1. **Esperar a que `web-publico` complete F0–F1.**
2. **Actualizar `REGISTRO_DE_ENTIDADES.md`** con las nuevas entidades (`Proyecto`, `Tarea`, `Cronograma`, `Etapa`).
3. **Crear diseños de pantallas** (F2–F5) usando `PLANTILLA_PANTALLA.md`.
4. **Iniciar desarrollo** (solo después de aprobación del Supervisor).

---

## Recursos Externos

- **Stack técnico:** `docs/09-auditoria-completa-stack.md`.
- **Schema base:** `arnes/nucleo/REGISTRO_DE_ENTIDADES.md`.
- **Lógica base:** `arnes/nucleo/logica_de_negocio.md`.
- **Template de pantallas:** `arnes/lineas/web-publico/pantallas/PLANTILLA_PANTALLA.md`.
