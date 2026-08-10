# Registro de Líneas de Trabajo — NOMON

Índice de las líneas de trabajo activas en el arnés. Una línea es un frente de trabajo con su propio progreso y sus propios bucles, sin vivir mezclada con el histórico de otra línea. Las líneas de hoy (`web-publico`, `os-interno`) escriben hacia `arnes/nucleo/` (verdad de negocio compartida) o hacia sus propias carpetas.

**Regla de convivencia entre líneas:**
1. **`nucleo/` es tierra común.** Cualquier línea puede proponer un cambio (nueva entidad, campo, evento), pero el cambio se aplica en `nucleo/` una sola vez — no se duplica el dato en la carpeta de la línea.
2. **Una línea no edita el archivo histórico de otra.** `lineas/web-publico/archivo/` y `lineas/os-interno/archivo/` son propiedad de su línea.
3. **Una línea puede insertar trabajo en otra explícitamente**, citando el documento que lo hace — nunca implícitamente.
4. **El ledger (`arnes/tareas/`) es compartido.** Los IDs de tarea son un solo pool secuencial entre todas las líneas.

---

## Líneas Activas

| Línea | Estado | Qué produce | Escribe hacia | Detalle |
|-------|--------|-------------|---------------|---------|
| `web-publico` | F0–F1 aprobado, F2–F7 pendiente | Web público (6 pantallas: inicio, simposio, recursos, perfil, correo) | `nucleo/`, `app/`, `lib/` | `web-publico/estado_web-publico.md`, `web-publico/plan_web-publico.md` |
| `os-interno` | No iniciada | OS interno (cronogramas, tareas, dashboards) | `nucleo/`, `app/`, `lib/` | `os-interno/estado_os-interno.md` (por crear) |

---

## Líneas Archivadas

Vacío. Cuando una línea se cierra, se archiva aquí con su estado final.

---

## Cómo abrir una línea nueva

Ver `arnes/lineas/_plantilla/LEEME.md`.
