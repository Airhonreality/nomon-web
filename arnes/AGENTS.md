# NOMON — React puro + Next.js 15 (App Router)

**Fuente de verdad del arnés agéntico.** Todo agente lee este archivo antes de actuar. Si algo que quieres que haga un agente no está aquí, no va a pasar.

**Regla canónica:** Este proyecto adopta el modelo de arneses agéntico (`ARNES_AGENTICO.md`).

---

## Cómo arrancar (si eres un agente, esto es lo primero)

1. Lee este archivo (`AGENTS.md`).
2. Lee `arnes/estado.md`.
3. Lee `arnes/INDEX.md`.
4. Asume tu rol leyendo su contrato en `arnes/roles/`.

Si nadie te dijo qué rol asumir, asume **Orquestador** y pregunta antes de actuar.

**Regla de arranque que no se negocia:** No escribas ni modifiques código sin un plan aprobado para una tarea registrada.

---

## Qué construye este proyecto

**NOMON — V3 "React Puro"**: Reconstrucción limpia del sitio de NOMON (rednomon.com) en **Next.js 15 (App Router)**, sin el motor agnóstico genérico del repo viejo (`../NOMON WEB`).

**Alcance confirmado:**
- Web público: Inicio (4 nodos), Simposio, Recursos, Auth, Correo corporativo.
- Futuro OS interno: Cronogramas, tareas de equipo, dashboards.

**Stack técnico:**
- Frontend: Next.js 15 (App Router) + TypeScript + CSS Modules.
- Backend: Vercel (serverless + edge) + Neon Postgres + Drizzle ORM.
- Auth: better-auth (adaptador Drizzle + Next.js).
- Storage: Cloudflare R2 (`@aws-sdk/client-s3`).
- Validación: Zod.
- Lint/Format: Biome.
- Testing: Vitest + React Testing Library.
- Package Manager: pnpm.

---

## Zonas y dueños

| Zona | Qué contiene | Dueño | Riesgo |
|------|--------------|-------|--------|
| `arnes/` | Arnés: núcleo, líneas, roles, ledger, planes | Supervisor | **Alto** |
| `arnes/nucleo/` | Verdad de negocio compartida (schema, lógica, glosario, estándares UI/UX/SEO) | Supervisor | **Alto** |
| `arnes/nucleo/ESTANDARES_UI.md` | Estándares técnicos de UI/UX (CSS, responsive, tipografía) | Supervisor | **Alto** |
| `arnes/nucleo/ERGONOMIA_COGNITIVA.md` | Principios de usabilidad y carga cognitiva | Supervisor | **Alto** |
| `arnes/nucleo/SEO_TECNICO.md` | Mejores prácticas de SEO y JSON-LD | Supervisor | **Alto** |
| `arnes/lineas/web-publico/pantallas/` | Diseños de pantallas (P-XX) y plantillas | Iniciador | **Alto** |
| `app/` | Código de la aplicación (Next.js App Router) | Código | Medio |
| `lib/` | Lógica de negocio (Drizzle, auth, API routes) | Código | **Alto** |
| `docs/` | Documentación de diseño (contratos vivos) | Iniciador | Bajo |
| `public/` | Assets estáticos (imágenes, SVGs) | Código | Bajo |
| `package.json` | Dependencias y scripts | Código | Medio |

---

## Prohibido

- **No hacer push a `main`** sin aprobación explícita del Supervisor (checkpoint final).
- **No modificar `CLAUDE.md`** sin pasar por el ciclo de mutación del arnés (§8 en `ARNES_AGENTICO.md`).
- **No versionar secretos**: `DATABASE_URL`, `RESEND_API_KEY`, `CF_R2_*`, `SESSION_SECRET`, etc. **Nunca** en archivos versionados.
- **No ejecutar `npm run dev` con `DATABASE_URL` apuntando a producción** (Neon real). Usar siempre `dev-local` o entorno de prueba.
- **No reutilizar código del repo viejo** (`../NOMON WEB`). Este es código nuevo desde cero.
- **No tocar `../NOMON WEB`** (el repo viejo no se modifica desde aquí).
- **No construir abstracciones genéricas** sin al menos 2 casos de uso reales hoy (regla de `CLAUDE.md`).
- **No usar `react-router-dom`**: Next.js App Router maneja el enrutamiento nativamente.
- **No usar Prisma**: Drizzle es el ORM seleccionado (ver `docs/09-auditoria-completa-stack.md`).

---

## Comandos de verificación

**Stack confirmado:** Next.js 15 + TypeScript + Drizzle + Neon + Biome + Vitest.

| Qué verifica | Comando | Nota |
|--------------|---------|------|
| **Tipos** | `npx tsc --noEmit` | TypeScript en todo el árbol. **Obligatorio en cada tarea.** |
| **Lint/Format** | `npx biome check .` | Biome (reemplaza ESLint + Prettier). |
| **Lint: Fix** | `npx biome check --apply .` | Aplica fixes automáticos. |
| **Build** | `npx next build` | Verificación de Next.js. |
| **Tests** | `npx vitest run` | Vitest + React Testing Library. |
| **Tests: Watch** | `npx vitest` | Modo watch. |
| **Schema Drizzle** | `npx drizzle-kit generate` | Validar migraciones de Drizzle. |
| **Schema: Push** | `npx drizzle-kit push` | Aplicar migraciones a Neon. |
| **DB: Seed** | `npx tsx scripts/seed.ts` | Cargar datos iniciales. |
| **Ejecución local** | `npm run dev` | Requiere `DATABASE_URL` (usar `dev-local`). |
| **Lighthouse (Full)** | `npx lighthouse http://localhost:3000/<ruta>` | Performance, Accessibility, Best Practices, SEO. **Obligatorio para UI/UX/SEO.** |
| **Lighthouse (CI)** | `npx lighthouse http://localhost:3000/<ruta> --output=json --output-path=./lighthouse.json` | Para integración con CI/CD. |
| **Lighthouse (Desktop)** | `npx lighthouse http://localhost:3000/<ruta> --chrome-flags="--window-size=1280,800"` | Simular desktop. |
| **SEO Check** | `npx seo-check http://localhost:3000/<ruta>` | Validar meta tags, Open Graph, Twitter Cards. |
| **Schema Validator** | `curl http://localhost:3000/<ruta> \| grep -o '<script type="application/ld+json">.*</script>' \| npx jsonlint` | Validar JSON-LD manualmente. |
| **Core Web Vitals** | `npx lighthouse http://localhost:3000/<ruta> --output=json \| grep -E "(lcp|cls|inp)"` | Extraer LCP, CLS, INP. |
| **Accessibility Audit** | `npx axe-core http://localhost:3000/<ruta>` | Auditoría de accesibilidad avanzada. |
| **Responsive Test** | `npm run dev` + Chrome DevTools (Ctrl+Shift+M) | Probar en 320px, 768px, 1280px. |

**Regla:** Si esta tabla está vacía o incompleta, QA no puede aprobar nada y el sistema se detiene.

**Nota:** Los comandos de **Lighthouse**, **SEO Check** y **Schema Validator** son **obligatorios** para aprobar cualquier pantalla (P-XX).

---

## Modelo de repositorio y despliegue

**No hay repo nuevo, no hay Neon nuevo, no hay Cloudflare R2 nuevo.** Todo vive en el mismo repositorio GitHub (`nomon-web-react`), la misma base de datos Neon, el mismo bucket R2, el mismo proyecto Vercel.

```
main                     → producción real (rednomon.com). **NO se toca hasta el corte final.**
dev                      → rama de desarrollo (trabajo activo).
```

**Flujo de corte:**
1. Todo el trabajo ocurre en `dev`.
2. Vercel genera automáticamente una URL de preview por cada push a `dev` (usando las mismas variables de entorno de Neon/R2 que producción).
3. El Supervisor prueba esa URL de preview con datos de prueba (nunca con producción real).
4. Solo cuando el Supervisor aprueba explícitamente, se hace merge de `dev` → `main`.
5. **Nunca se hace push directo a `main`** durante el desarrollo.

---

## Checkpoints obligatorios

- Antes de mergear `dev` → `main` (corte final de producción).
- Antes de cualquier mutación del arnés (`arnes/`, `AGENTS.md`, `CLAUDE.md`).
- Antes de decidir el stack/arquitectura final de destino (ya resuelto en `docs/09-auditoria-completa-stack.md`).
- Antes de que cualquier escritura desde `dev` toque la base de datos real de producción.
- Antes de habilitar el entorno Preview de Vercel a usar las credenciales reales de Neon/R2 (verificar en el dashboard de Vercel que `DATABASE_URL`, `CF_R2_*` estén habilitadas para el entorno Preview).
- **Antes de aprobar cualquier pantalla (P-XX):**
  - Lighthouse score ≥ 90 en **Performance**, **Accessibility**, **Best Practices** y **SEO**.
  - JSON-LD válido (usar [schema.org validator](https://validator.schema.org/)).
  - Pasa todos los checks del `ESTANDARES_PANTALLA.md`.
  - Prueba de usuario: 5 usuarios completan la tarea principal en ≤ 30 segundos.

---

## Secretos y credenciales

**Tareas marcadas `[SOLO_HUMANO]` en el ledger** porque requieren credenciales que el sandbox del agente no puede leer (redactadas automáticamente):
- Auditoría de objetos en Cloudflare R2 (`CF_R2_*`).
- Configuración de variables de entorno en Vercel.
- Configuración de DNS en Cloudflare.

**El repo, Neon y Vercel ya existen** — no hace falta crear nada. Las credenciales reales ya existen en las variables de entorno de Vercel de este mismo proyecto.

**Regla no negociable:** Credenciales y secretos **nunca** viven en archivos que un agente puede editar. Van en:
- Variables de entorno de Vercel.
- `.env.local` (solo para desarrollo local, **nunca versionado**).

---

## Versión del arnés

```
version_arnes: 2
based_on: ARNES_AGENTICO.md (empresa_muebles_clone_v3)
last_updated: 2026-08-08
changes:
  - Añadidas zonas para estándares UI/UX/SEO en arnes/nucleo/
  - Añadidos comandos de verificación para Lighthouse, SEO y Schema
  - Actualizados checkpoints obligatorios para pantallas (P-XX)
```
