# PLANTILLA_HARDENING — Migración Técnica

**Contrato vivo.** Toda fase de hardening (F8) sigue esta plantilla. **6 secciones obligatorias.**

**Regla:** Si una fase de hardening no cumple con las 6 secciones, el plan es inválido y no se ejecuta.

---

## 1. Inventario de migración de schema

**Tabla de cambios en el schema**, con columna, tipo actual, tipo destino y backfill.

| Tabla | Columna | Tipo actual | Tipo destino | Backfill | Script |
|-------|---------|-------------|-------------|---------|---------|
| `Usuario` | `password_hash` | `TEXT` | `TEXT` | — | — |
| `Recurso` | `acceso.estrategia` | `VARCHAR` | `ENUM('PUBLICO', 'SOLO_REGISTRADOS', 'LISTA_BLANCA')` | — | `ALTER TABLE Recurso MODIFY COLUMN estrategia ENUM(...)` |

**Verificación:**
```bash
# Validar schema actual
npx drizzle-kit introspect

# Validar migración
npx drizzle-kit generate
```

---

## 2. Módulos de código impactados

**Lista de archivos** que deben modificarse, con línea, código actual y nuevo.

| Archivo | Línea | Código actual | Código nuevo | Razón |
|---------|-------|---------------|--------------|-------|
| `lib/db/schema.ts` | 10 | `password: string` | `password_hash: string` | Ajuste a naming canónico |
| `app/api/auth/route.ts` | 20 | `SHA256(password)` | `scrypt(password)` | Seguridad (better-auth) |

**Verificación:**
```bash
grep -n "password" lib/db/schema.ts
grep -n "scrypt" app/api/auth/route.ts
```

---

## 3. Orden de ejecución

**Secuencia estricta** de pasos, con dependencias.

1. **Paso 1:** Actualizar `lib/db/schema.ts` (schema Drizzle).
   - **Dependencias:** Ninguna.
   - **Verificación:** `npx drizzle-kit generate`.

2. **Paso 2:** Aplicar migración a Neon.
   - **Dependencias:** Paso 1.
   - **Verificación:** `npx drizzle-kit push`.

3. **Paso 3:** Actualizar `app/api/auth/route.ts` (lógica de auth).
   - **Dependencias:** Paso 2.
   - **Verificación:** `npx tsc --noEmit`.

4. **Paso 4:** Validar con tests de integración.
   - **Dependencias:** Paso 3.
   - **Verificación:** `npx vitest run`.

**Regla:** Cada paso solo usa artefactos de pasos anteriores.

---

## 4. Integraciones diferidas

**Lista de integraciones** que se activarán después (placeholders actuales).

| Integración | Estado actual | Estado destino | Trigger |
|-------------|---------------|---------------|---------|
| Resend (envío de correos) | Configurada | Activa | `RESEND_API_KEY` en Vercel |
| Cloudflare R2 (storage) | Configurada | Activa | `CF_R2_*` en Vercel |
| Webhook de correo (recepción) | No configurada | Activa | Configuración de Cloudflare |

**Verificación:**
```bash
# Verificar variables de entorno en Vercel
echo $RESEND_API_KEY
echo $CF_R2_ACCESS_KEY_ID
```

---

## 5. Verificación post-hardening

**Comandos ejecutables** con output esperado.

| Comando | Output esperado | Verificación |
|---------|-----------------|--------------|
| `npx tsc --noEmit` | Sin errores | ✅ |
| `npx biome check .` | Sin errores | ✅ |
| `npx drizzle-kit generate` | Schema válido | ✅ |
| `npx next build` | Build exitoso | ✅ |
| `npx vitest run` | Todos los tests pasan | ✅ |

**Regla:** Cada comando debe devolver salida limpia (sin errores).

---

## 6. Criterios de aceptación

**Lista de condiciones verificables mecánicamente.**

1. **Schema válido:**
   - `npx drizzle-kit generate` no tiene errores.
   - **Verificación:** Output crudo del comando.

2. **Migración aplicada:**
   - `npx drizzle-kit push` se ejecuta sin errores.
   - **Verificación:** Output crudo del comando.

3. **Código impactado actualizado:**
   - Todos los archivos listados en §2 tienen el código nuevo.
   - **Verificación:** `git diff` muestra solo los cambios esperados.

4. **Integraciones activas:**
   - `RESEND_API_KEY` y `CF_R2_*` están configuradas en Vercel.
   - **Verificación:** Variables de entorno visibles en dashboard de Vercel.

5. **Cero regresiones:**
   - Todos los tests pasan (`npx vitest run`).
   - **Verificación:** Output crudo de Vitest.

6. **Build exitoso:**
   - `npx next build` no tiene errores.
   - **Verificación:** Output crudo de Next.js.

---

## 📌 Notas

- **Regla de oro:** Si un criterio no es verificable ejecutando algo, no es válido.
- **Prohibido:** "Se ve bien", "funciona", "debería estar OK".
- **Obligatorio:** Output crudo de comandos, tests que pasan, build exitoso.

---

## 📄 Estructura del Archivo de Hardening

El archivo de hardening para una fase F8 debe llamarse `plan_f8.md` y vivir en `arnes/lineas/web-publico/tecnico/`.

**Ejemplo de contenido:**
```markdown
# Plan: Hardening (F8)

**ID:** F8
**Línea:** web-publico
**Tipo:** datos_contrato
**Riesgo:** alto

## 1. Inventario de migración de schema

| Tabla | Columna | Tipo actual | Tipo destino | Backfill |
|-------|---------|-------------|-------------|---------|
| `Usuario` | `password` | `TEXT` | `password_hash` | — |

## 2. Módulos de código impactados

| Archivo | Línea | Código actual | Código nuevo |
|---------|-------|---------------|--------------|
| `lib/db/schema.ts` | 10 | `password: string` | `password_hash: string` |

... (resto de secciones)
```
