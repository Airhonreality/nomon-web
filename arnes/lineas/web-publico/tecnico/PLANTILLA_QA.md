# PLANTILLA_QA — Verificación y Corte

**Contrato vivo.** Toda fase de QA (F9) sigue esta plantilla. **6 secciones obligatorias.**

**Regla:** Si una fase de QA no cumple con las 6 secciones, el veredicto es `no_verificable` y el sistema se frena.

---

## 1. Gates a verificar

**Tabla de gates** con predicado SQL, datos de prueba y resultado esperado.

| Gate | Descripción | Predicado SQL | Datos de prueba | Resultado esperado |
|------|-------------|---------------|-----------------|---------------------|
| E-01 | Usuario registrado | `SELECT * FROM Usuario WHERE email = 'test@ejemplo.com'` | `email = 'test@ejemplo.com'` | 1 fila |
| E-02 | Sesión válida | `SELECT * FROM Sesion WHERE user_id = 1 AND expires_at > NOW()` | `user_id = 1` | 1 fila |
| E-03 | Rol ADMIN | `SELECT rol FROM Usuario WHERE id = 1 AND rol = 'ADMIN'` | `id = 1` | 1 fila |
| E-04 | Recurso accesible (PUBLICO) | `SELECT * FROM Recurso WHERE slug = 'test-publico'` | `slug = 'test-publico'` | 1 fila |
| E-04 | Recurso accesible (SOLO_REGISTRADOS) | `SELECT * FROM Recurso WHERE slug = 'test-registrados' AND EXISTS (SELECT 1 FROM Sesion WHERE user_id = 1)` | `slug = 'test-registrados'`, `user_id = 1` | 1 fila |
| E-04 | Recurso accesible (LISTA_BLANCA) | `SELECT * FROM RecursoAcceso WHERE recurso_id = (SELECT id FROM Recurso WHERE slug = 'test-lista-blanca') AND email = 'test@ejemplo.com'` | `slug = 'test-lista-blanca'`, `email = 'test@ejemplo.com'` | 1 fila |

**Verificación:**
```bash
# Ejecutar predicados en Neon (dev-local)
psql -h <host> -U <user> -d <db> -c "SELECT * FROM Usuario WHERE email = 'test@ejemplo.com'"
```

---

## 2. Trazabilidad de eventos

**Tabla de eventos** con entrada de auditoría (si aplica).

| Evento | Descripción | Query de audit_logs | Entrada esperada |
|--------|-------------|---------------------|------------------|
| E-01 | Login exitoso | `SELECT * FROM eventos WHERE tipo = 'LOGIN' AND usuario_id = 1` | 1 entrada |
| E-02 | Acceso a recurso | `SELECT * FROM eventos WHERE tipo = 'ACCESO_RECURSO' AND recurso_id = 1` | 1 entrada |
| E-03 | Envío de correo | `SELECT * FROM eventos WHERE tipo = 'ENVIO_CORREO' AND mensaje_id = 1` | 1 entrada |

**Nota:** Si el proyecto no tiene tabla de `eventos`, esta sección se marca como `N/A`.

---

## 3. Checklist de corte

**10 condiciones del gate de salida** (ver `arnes/ESTRUCTURA_OUTPUT_PRE_CODIGO.md` §4).

| # | Condición | Evidencia | Estado |
|---|-----------|-----------|--------|
| 1 | `REGISTRO_DE_ENTIDADES.md` sin contradicciones internas | `grep -c "PUBLICO\|SOLO_REGISTRADOS\|LISTA_BLANCA" arnes/nucleo/REGISTRO_DE_ENTIDADES.md` | ⬜ |
| 2 | 6/6 decisiones de negocio cerradas | `decisiones_cerradas.md` (si existe) | ⬜ |
| 3 | 10/10 decisiones técnicas axiomatizadas | `docs/09-auditoria-completa-stack.md` | ✅ |
| 4 | Plan de cada fase F0–F9 aprobado | `ls arnes/lineas/web-publico/plan_*.md` | ⬜ |
| 5 | Artefactos de cada tipo completos | `ls arnes/lineas/web-publico/pantallas/disenio_*.md` | ⬜ |
| 6 | 5 gates documentados con predicados | §1 de este documento | ⬜ |
| 7 | Glosario H07 etiqueta toda entidad y estado | `grep -c "Label natural" arnes/nucleo/glosario.md` | ⬜ |
| 8 | M-06 L1 (patrones técnicos) declarados | `m06_capa_tecnica_transversal.md` (si existe) | ⬜ |
| 9 | Migración de schema validada | `npx drizzle-kit generate` | ⬜ |
| 10 | Checkpoint final del Supervisor | Veredicto explícito | ⬜ |

**Regla:** Todas las condiciones deben estar en ✅ para aprobar el corte.

---

## 4. Evidencia mecánica

**Output crudo** de los comandos de verificación (pegar textual, no resumir).

### 4.1 Tipos (TypeScript)
```bash
$ npx tsc --noEmit
# Output esperado: Sin errores
```

### 4.2 Lint (Biome)
```bash
$ npx biome check .
# Output esperado: Sin errores
```

### 4.3 Build (Next.js)
```bash
$ npx next build
# Output esperado: Build exitoso
```

### 4.4 Tests (Vitest)
```bash
$ npx vitest run
# Output esperado: Todos los tests pasan
```

### 4.5 Schema (Drizzle)
```bash
$ npx drizzle-kit generate
# Output esperado: Schema válido
```

---

## 5. Reporte de hallazgos

**Lista de bugs encontrados** con severidad y estado.

| ID | Descripción | Severidad | Estado | Reproducible | Archivo | Línea |
|----|-------------|-----------|--------|--------------|--------|-------|
| H-01 | Error de tipo en `RecursoMetadata` | Alta | Abierto | Sí | `lib/db/schema.ts` | 42 |
| H-02 | Link roto en navbar | Baja | Cerrado | Sí | `app/components/Navbar.tsx` | 15 |

**Severidad:**
- **Alta:** Bloquea el deploy (ej: error de tipos, seguridad).
- **Media:** Afecta funcionalidad pero no bloquea.
- **Baja:** Cosmético (ej: estilo, texto).

---

## 6. Veredicto

**Veredicto:** [APROBADO / RECHAZADO / NO_VERIFICABLE]

### Si APROBADO:
- **Motivo:** Todas las condiciones del checklist están en ✅ y la evidencia mecánica es limpia.
- **Firma:** Supervisor (Javier).
- **Fecha:** ISO 8601 (ej: `2026-08-08T00:00:00Z`).

### Si RECHAZADO:
- **Motivo:** [Descripción clara de qué falló].
- **Condiciones pendientes:** [Lista de condiciones del checklist en ⬜].
- **Hallazgos críticos:** [Lista de bugs con severidad Alta].
- **Acciones requeridas:** [Qué hacer para aprobar].

### Si NO_VERIFICABLE:
- **Motivo:** Falta evidencia mecánica (ej: comandos de verificación no declarados en `AGENTS.md`).
- **Acciones requeridas:** Declarar comandos en `AGENTS.md`.

---

## 📌 Notas

- **Regla de oro:** El veredicto se basa en **evidencia mecánica**, no en la palabra del agente.
- **Prohibido:** Aprobar sin output crudo de los comandos.
- **Obligatorio:** Pegar el output textual completo (no resúmenes).

---

## 📄 Estructura del Archivo de QA

El archivo de QA para una fase F9 debe llamarse `plan_f9.md` y vivir en `arnes/lineas/web-publico/tecnico/`.

**Ejemplo de contenido:**
```markdown
# Plan: QA y Corte (F9)

**ID:** F9
**Línea:** web-publico
**Tipo:** mutacion_arnes
**Riesgo:** máximo

## 1. Gates a verificar

| Gate | Descripción | Predicado SQL | Datos de prueba | Resultado esperado |
|------|-------------|---------------|-----------------|---------------------|
| E-01 | Usuario registrado | `SELECT * FROM Usuario WHERE email = 'test@ejemplo.com'` | `email = 'test@ejemplo.com'` | 1 fila |

## 2. Trazabilidad de eventos

| Evento | Descripción | Query | Entrada esperada |
|--------|-------------|-------|------------------|
| E-01 | Login exitoso | `SELECT * FROM eventos WHERE tipo = 'LOGIN'` | 1 entrada |

... (resto de secciones)

## 6. Veredicto

**Veredicto:** APROBADO
**Motivo:** Todas las condiciones del checklist están en ✅.
**Firma:** Javier (Supervisor)
**Fecha:** 2026-08-08T00:00:00Z
```
