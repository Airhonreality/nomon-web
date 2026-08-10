# Stack técnico y proceso de diseño → codificación → mantenimiento

Doc vivo. Segundo round del plan: con la esencia y las pantallas ya destiladas en `docs/design/`, esto define **cómo se construye** — el stack y el proceso de trabajo — aplicando explícitamente las prácticas de la investigación en ingeniería de arneses agénticos (`INS_Arnes agentico.md`, compartido por el dueño del proyecto). No se copian los términos místicos de esa investigación (nada de "resonancia" ni "soberanía"), se copian los mecanismos.

## Stack técnico propuesto

| Capa | Elección | Por qué |
|---|---|---|
| Build/runtime | **Next.js 15 (App Router)** | Framework nativo de Vercel con integración perfecta: API routes en `/app/api/`, middleware en edge (`/app/middleware.ts`), y deploy automático. Reemplaza Vite + React para unificar frontend y backend en un solo proyecto. Ver auditoría completa en `08-metodologia-auditoria-stack-frontend.md` (puntaje: 4.7/5). |
| Enrutamiento | **Next.js App Router** | Incluido en Next.js. El sitio tiene 6 rutas (`00-estructura-del-sitio.md`) + futuro OS interno. El App Router maneja rutas públicas/protegidas nativamente, con soporte para Server Components y middleware de autenticación. |
| Estado | React Context + hooks nativos | El patrón ya usado y probado (sesión de usuario, tema). No hay hoy un caso de uso que justifique Redux/Zustand. |
| Control de versiones | GitHub | Confirmado por el dueño del proyecto. |
| Hosting + backend | Vercel — el mismo despliegue sirve el sitio estático y las funciones serverless (API routes) para auth, recursos y correo | Confirmado por el dueño del proyecto. Resuelve de una vez la pregunta abierta que tenían `04-auth.md` y `05-correo-aliados.md` sobre dónde vive el backend — es Vercel, no Cloudflare Worker ni Google Apps Script. **Next.js integra nativamente con Vercel Postgres (Neon)**. |
| Base de datos | Postgres en **Neon** (vía integración de Vercel) | Ver auditoría ponderada en `07-auditoria-backend.md` §B. Reemplaza cualquier idea de reusar el backend viejo de Google Apps Script — **no se reutiliza**, es un backend nuevo desde cero. |
| ORM | **Drizzle** + `drizzle-kit` | Ver auditoría §A — gana por ajuste a serverless (sin binario de motor, cold start bajo en funciones de Vercel). |
| Auth | **better-auth** (adaptador Drizzle) | Ver auditoría §C — evita repetir el error real de seguridad ya detectado en `docs/design/04-auth.md` (auth casera del repo viejo). |
| Lenguaje | **TypeScript** | Ver auditoría §D — deja de ser una preferencia: Drizzle/better-auth/zod dependen de su inferencia de tipos para dar su valor real. |
| Almacenamiento de archivos | Cloudflare R2, cliente `@aws-sdk/client-s3` (R2 es S3-compatible) | Confirmado por el dueño del proyecto. Para PDFs de `docs/design/03-recursos.md`, imágenes de escarapelas/galería de `docs/design/02-simposio.md`, y adjuntos de `docs/design/05-correo-aliados.md`. |
| Validación de datos en el límite | `zod` para validar toda respuesta de la API de Vercel antes de que entre a un componente | Aplica directo una lección ya documentada en el repo viejo ("Alucinación de Protocolo", "Vectores de esquizofrenia"): fallar de forma ruidosa si el dato no tiene la forma esperada, no asumir. |
| Lint/format | **Biome** | Ver auditoría §F — una sola herramienta/config, más rápida; se acepta cobertura de reglas de hooks algo menor que ESLint. |
| Verificación mecánica | Biome + Vitest + React Testing Library | Ver sección de proceso — es la pieza central de por qué este stack sigue la investigación de arneses. |

## Decisiones ya resueltas por auditoría (`07-auditoria-backend.md`)

TypeScript, ORM (Drizzle), proveedor de Postgres (Neon), auth (better-auth), lint/format (Biome), y **frontend (Next.js 15)** — cada una con criterios ponderados y trade-off aceptado explícito en la auditoría (`07-auditoria-backend.md` y `08-metodologia-auditoria-stack-frontend.md`), no elegidas a ojo.

## Sigue abierto (menor peso, no bloquea instalar el proyecto)

- Estrategia de estilos: CSS Modules recomendado (nivel de complejidad de 6 pantallas no justifica Tailwind/styled-components salvo preferencia explícita) — a confirmar.
- Package manager: `pnpm` recomendado por velocidad/disco, `npm` funciona igual a esta escala — a confirmar.

## Proceso: diseño → codificación → mantenimiento

Cada paso está atado a un mecanismo concreto de la investigación de arneses, no es ceremonia:

### 1. Diseño (ya en marcha)
Doc vivo en `docs/design/` **antes** de escribir un componente — esto es exactamente el patrón NLAH (arnés de agente en lenguaje natural) de la investigación: reglas y contexto externalizados en documentos portátiles y estructurados, interpretados de forma consistente entre sesiones, en vez de reconstruir contexto de memoria cada vez.

### 2. Arnés mecánico antes que features
Antes de escribir la primera pantalla real: TypeScript + Biome + Vitest configurados y corriendo en verde. La investigación documenta que un agente solo, sin verificación externa, tiende a autodeclarar tareas terminadas con conexiones rotas ("hallucinated completion"). El linter/type-checker/test runner es lo que reemplaza esa autoevaluación por una señal mecánica.

### 3. Ciclo por feature
1. Confirmar o actualizar el doc correspondiente en `docs/design/`.
2. Implementar.
3. Validar: lint + typecheck + tests en verde — nunca "creo que funciona" por inspección visual.
4. Commit pequeño y revisable en una rama.
5. Checkpoint humano en decisiones de alcance o arquitectura — no en cada línea de código. Reparte el trabajo como lo documenta la investigación: el humano retiene el "qué", el agente ejecuta el "cómo".

### 4. Reinicio de contexto entre sesiones largas
En vez de alargar la sesión hasta que el agente empiece a tomar atajos ("ansiedad de contexto"), cuando una sesión se satura se cierra actualizando el estado en `CLAUDE.md` (sección "Estado actual") o un `docs/PROGRESO.md` dedicado, y la siguiente sesión arranca limpia leyendo ese estado — no re-derivando todo de memoria.

### 5. Aislamiento y permisos
- **Sin pedir permiso en cada paso**: editar código, correr `dev`/`build`/`test`, crear ramas locales.
- **Siempre con confirmación explícita antes**: deploy a producción, cambios de DNS/dominio, `git push`, cualquier acción sobre `../NOMON WEB` (el repo viejo no se toca desde aquí).

### 6. Gobernanza de cambios al propio arnés
Cambios a `CLAUDE.md` o a `docs/design/` (como el rename de "Landing" a "Inicio" de este mismo round) se hacen de forma explícita y quedan versionados en git — nunca se mutan las reglas del proyecto en silencio, en medio de otra tarea.

### 7. Validación como "evaluador", a escala del proyecto
No hace falta un agente supervisor/QA separado como en proyectos grandes — pero sí se adopta la idea central: la validación mecánica (lint/typecheck/test) certifica que una feature está lista, no el mismo agente que la escribió por simple inspección.

## Pregunta abierta

Con el frontend resuelto (Next.js 15, ver `08-metodologia-auditoria-stack-frontend.md`) y el backend auditado (`07-auditoria-backend.md`), solo faltan estilos y package manager — ¿los confirmás (CSS Modules + pnpm) o instalo ya con todo lo decidido? **Nota**: Se recomienda revisar la auditoría completa del stack en `09-auditoria-completa-stack.md` antes de confirmar.
