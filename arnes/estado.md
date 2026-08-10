# Estado del proyecto — Dashboard

Este archivo se lee al arrancar cualquier sesión. Es un dashboard corto: en qué fase está cada línea de trabajo activa, ahora mismo. El detalle cronológico completo vive en el `estado_<linea>.md` de cada línea — no se duplica acá.

**Índice de líneas:** `arnes/lineas/REGISTRO_LINEAS.md`.

---

## Línea técnica (Web Público)

**Estado:** F0 (schema) **aprobado**. F1 (lógica) **aprobado**. F2–F7 (pantallas) **diseños completos**. F7 (Correo) **en implementación**. F8/F9 (hardening/QA) **pendiente**.

**Rebanada activa — subsistema de correo (t-012 → t-019):**
- Schema `Mensaje` extendido (messageId, cuerpoHtml), dep `resend`, fix de `getCurrentUser` (gate E-03), webhook de recepción, APIs de bandeja, Worker de Cloudflare versionado, UI `/login` + `/correo`.

**Próxima acción permitida:**
- Completar `arnes/nucleo/logica_de_negocio.md` (F1).
- Completar `arnes/nucleo/glosario.md` (F1).
- Iniciar diseño de pantallas (F2–F7) usando `PLANTILLA_PANTALLA.md`.

**Detalle completo:** `arnes/lineas/web-publico/estado_web-publico.md`.

---

## Línea de OS Interno (Futuro)

**Estado:** No iniciada.

**Próxima acción permitida:** Esperar a que la línea `web-publico` complete F0–F7.

**Detalle completo:** `arnes/lineas/os-interno/estado_os-interno.md` (por crear).

---

## Artefactos canónicos del arnés (leer al arrancar)

1. `AGENTS.md` — zonas, prohibiciones, comandos.
2. `estado.md` — este archivo.
3. `INDEX.md` — índice de contexto activo.
4. `ARNES_AGENTICO.md` — principios agnósticos del arnés.
5. `nucleo/REGISTRO_DE_ENTIDADES.md` — schema canónico compartido.
6. `nucleo/logica_de_negocio.md` — mapa de negocio compartido.
7. `nucleo/glosario.md` — vocabulario de UI compartido.
8. `lineas/REGISTRO_LINEAS.md` — qué líneas de trabajo existen y qué producen.

---

## Decisiones vigentes (aplican a todas las líneas)

- **Stack técnico:** Next.js 15 (App Router) + TypeScript + Drizzle ORM + Neon Postgres + better-auth + Cloudflare R2 + Biome + Vitest + pnpm.
- **Hosting:** Vercel (serverless + edge).
- **Infraestructura:** Neon (Postgres) + Cloudflare R2 (storage) + Resend (correo).
- **Sin motor schema-driven genérico:** No se construye abstracción sin 2+ casos de uso reales.
- **Tareas de riesgo alto o máximo pasan por checkpoint humano explícito** antes de considerarse terminadas.
- **`main` no recibe push directo** bajo ninguna circunstancia durante el desarrollo.
- **Ningún agente corre la app (`npm run dev`)** con `DATABASE_URL` apuntando a la Neon de producción.
- **El código es desechable:** No se optimiza por reusabilidad especulativa (regla de `CLAUDE.md`).

---

## Última sesión cerrada

**Fecha:** 2026-08-09
**Qué se hizo (rebanada: subsistema de correo):**
- Registradas t-012 → t-019 en el ledger (schema, dep, auth fix, webhook, APIs, worker, UI, docs).
- Decisión de recepción resuelta: Cloudflare Email Routing + Worker (`postal-mime`) → `POST /api/webhooks/incoming-email` en Vercel → Postgres. (Responde la pregunta abierta de `05-correo-aliados.md`.)

**Qué quedó pendiente:**
- Implementar el código de las tareas t-012 → t-019.
- Desplegar el Worker en Cloudflare y configurar secretos `[SOLO_HUMANO]` (`RESEND_API_KEY`, `WEBHOOK_SECRET` en Vercel; Email Routing → Worker en Cloudflare).

## Próxima acción permitida

**Implementar la rebanada de correo (t-012 → t-019), en orden:**
1. t-012: Extender `Mensaje` en `app/src/lib/db/schema.ts`.
2. t-013: Instalar `resend`.
3. t-014: Corregir `getCurrentUser` en `app/src/lib/auth.ts`.
4. t-015: Webhook `app/src/app/api/webhooks/incoming-email/route.ts`.
5. t-016: APIs `app/src/app/api/correo/route.ts` y `/enviar/route.ts`.
6. t-017: Worker `workers/email-handler/`.
7. t-018: Páginas `/login` y `/correo`.
8. t-019: Actualizar `docs/design/05-correo-aliados.md`.

**Verificación al cerrar:** `npx tsc --noEmit`, `npx biome check .`, `npx next build`.

**Bloqueante `[SOLO_HUMANO]` (fuera del código):** configurar `RESEND_API_KEY` y `WEBHOOK_SECRET` en Vercel; desplegar el Worker y apuntar Email Routing en Cloudflare; aplicar la migración Drizzle a Neon.
