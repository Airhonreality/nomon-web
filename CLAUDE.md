# NOMON — React puro (Next.js 15)

Reconstrucción limpia del sitio de NOMON (rednomon.com), en **Next.js 15 (App Router) + TypeScript**, sin el motor agnóstico genérico (schemas/blueprints/vault/bridge/panel-admin) que sobrecargó al proyecto anterior. Carpeta hermana de `../NOMON WEB` (el repo viejo, "Indra Satellite Protocol").

> **Nota de reconciliación (2026-08-09):** Este repo usa **Next.js 15**, no Vite/React a secas. La decisión está audita y aprobada en `docs/09-auditoria-completa-stack.md` (puntaje 4.72/5). "React puro" se refiere a *no* usar el motor agnóstico del repo viejo, no a prescindir de un framework. `AGENTS.md` es la fuente de verdad del stack.

## Por qué existe este repo

`../NOMON WEB` diagnosticó su propio problema: demasiada capa agnóstica genérica (pensada para modelar "cualquier contenido") sirviendo casi nada de contenido real, y un panel admin ("Forja") que se construyó y nunca se usó. Este repo arranca de cero, con la regla inversa: **no se construye abstracción genérica sin al menos 2 casos de uso reales hoy**. Si algo tiene un solo caso de uso, se hardcodea.

`../NOMON WEB` NO se toca desde aquí — es solo referencia de lectura: contenido real, copy, assets de marca. No se copia arquitectura ni backend de ahí (el backend viejo era Google Apps Script; **no se reutiliza**), se copia contenido y lecciones.

## Alcance confirmado (esencia de NOMON a reconstruir)

Confirmado con el dueño del proyecto — se conserva:
- **Inicio** con los 4 nodos de acción (Gubernamental, Corporativo, Académico, Jurídico).
- **Lógica de recursos / repositorio** (lo que en el repo viejo era el sistema "Materia": contenido consultable tipo biblioteca).
- **Auth** (login/registro de usuarios).
- **Simposio** (el Simposio Internacional de Ética — hoy el producto insignia de NOMON).
- **Correo corporativo integrado**: un solo buzón corporativo (no uno por usuario) administrado con una UI simple dentro del sitio, para enviar comunicaciones/cartas a aliados. Ver `PLan correo dominio propio.md` en `../NOMON WEB` para el plan de infraestructura de correo (Cloudflare Email Routing + Resend).

Explícitamente **fuera de alcance** (se descarta, no se migra): todo lo comercial de "Filbo"/Auditoría (feria del libro, pagos, hashing de recibos).

## Cómo se trabaja en este repo

1. **Docs antes que código.** Antes de escribir un componente o pantalla nueva, su diseño (estructura, datos que necesita, comportamiento) se documenta en `docs/design/` como doc vivo — se actualiza cuando el diseño cambia, no se abandona una vez escrito el código.
2. **El código es desechable.** No se optimiza por reusabilidad especulativa. Un componente que hoy solo sirve a una pantalla se escribe para esa pantalla.
3. **Nombres descriptivos, sin mitología.** Nada de "soberano", "resonancia", "materia", "arnés" como nombres de variables/componentes reales — esos eran síntoma del problema anterior. Nombra las cosas por lo que hacen.
4. **Stack de backend confirmado — no se reinventa ni se mezcla con el del repo viejo.** GitHub (código) → Vercel (deploy + funciones serverless) → Postgres (datos) → Cloudflare R2 (archivos/imágenes/PDFs). El backend de Google Apps Script del repo viejo **no se reutiliza**. Detalle en `docs/06-stack-y-proceso.md`.
5. **Deploy es una acción visible en producción.** Nunca se publica (`build`/`deploy`) sin confirmación explícita del usuario en esa sesión.

## Estado actual

Repo recién inicializado (`git init`, sin commits todavía). Los documentos vivos de diseño ya existen en `docs/design/` (estructura del sitio, inicio, simposio, recursos, auth, correo-aliados) — léelos antes de escribir cualquier componente. Cada uno tiene una sección "Pregunta abierta" con decisiones aún sin confirmar; no las resuelvas por tu cuenta, pregunta. Pendiente: instalar Vite/React (todavía no se ha escrito ni una línea de código de la app).
