# Estado de la Línea: OS Interno

**Línea:** `os-interno`
**Responsable:** Supervisor (Javier)
**Última actualización:** 2026-08-08

---

## Resumen

**Estado actual:** **No iniciada.**

**Objetivo:** Construir el OS interno para NOMON, que incluirá:
1. Dashboards de gestión (tareas, cronogramas, proyectos).
2. Bandeja de correo corporativo avanzada.
3. Gestión de usuarios y roles.
4. Integración con el web público (ej: acceso rápido desde `/perfil`).

**Prioridad:** Media (futuro, no bloqueante para el web público).

---

## Dependencias

Esta línea **depende de** que la línea `web-publico` complete al menos:
- F0 (schema).
- F1 (lógica de negocio).
- F6 (auth).

**Razón:** El OS interno reutilizará:
- El schema de `Usuario` y `Sesion`.
- El middleware de autenticación.
- La lógica de acceso a recursos.

---

## Fases Planificadas

| Fase | Objetivo | Dependencias | Prioridad |
|------|----------|--------------|-----------|
| F0 | Schema del OS interno | `web-publico` F0 | Alta |
| F1 | Lógica de negocio (tareas, cronogramas) | `web-publico` F1 | Alta |
| F2 | Dashboard principal | F0, F1 | Media |
| F3 | Gestión de tareas | F0, F1 | Media |
| F4 | Gestión de cronogramas | F0, F1 | Media |
| F5 | Integración con correo | F0, F1, `web-publico` F7 | Media |
| F6 | Hardening | F2–F5 | Alta |
| F7 | QA y corte | F6 | Alta |

---

## Próxima Acción Permitida

**Esperar a que `web-publico` complete F0–F1.**

Una vez que el schema y la lógica de negocio del web público estén aprobados, se puede:
1. Crear `arnes/lineas/os-interno/plan_os-interno.md`.
2. Definir el schema específico del OS interno (Tarea, Proyecto, Cronograma, Etapa).
3. Iniciar el diseño de pantallas (F2–F5).

---

## Decisiones Vigentes

- **Stack técnico:** Mismo que `web-publico` (Next.js 15, Drizzle, Neon, etc.).
- **Autenticación:** Reutilizar middleware y better-auth del web público.
- **Almacenamiento:** Reutilizar Cloudflare R2.
- **Deploy:** Mismo proyecto Vercel (ruta `/admin` o subdominio).

---

## Bloqueantes

| Bloqueante | Estado | Solución |
|------------|--------|----------|
| Dependencia de `web-publico` F0–F1 | Activo | Esperar a que se completen. |
| Decisión de ruta ( `/admin` vs subdominio) | Pendiente | Decidir con el Supervisor. |

---

## Tareas Asociadas

**Vacío.** Las tareas se crearán cuando la línea se inicie.

---

## Notas

- Esta línea **no es prioritaria** para el MVP del web público.
- Se recomienda iniciar esta línea **solo después de que `web-publico` esté en producción** (F9 aprobado).
- El OS interno puede desarrollarse en paralelo al web público **solo si no hay solapamiento de recursos** (ej: no tocar el mismo schema al mismo tiempo).
