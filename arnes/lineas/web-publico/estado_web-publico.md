# Estado de la Línea: Web Público

**Línea:** `web-publico`
**Responsable:** Supervisor (Javier)
**Última actualización:** 2026-08-09

---

## Resumen

**Estado actual:** F0 (schema) **aprobado**. F1 (lógica) **aprobado**. F2 (Inicio) **en diseño**. F3 (Simposio) **cerrado/aprobado**. F4 (Recursos listado + detalle) **diseños creados**. F5 (Auth) **diseño creado**. F6 (Perfil) **diseño creado**. F7 (Correo) **diseño creado**. F8/F9 (hardening/QA) **pendiente**. **Fase de diseño de pantallas COMPLETA.**

**Objetivo:** Construir el sitio web público de NOMON con 6 pantallas:
1. Inicio (4 nodos de acción).
2. Simposio (deck de 12 slides).
3. Recursos (listado + detalle).
4. Perfil (usuario autenticado).
5. Correo (bandeja corporativa, solo ADMIN).
6. Auth (modal de login/registro).

---

## Fases Completadas

### ✅ F0: Cimientos (Schema)
- **Estado:** Aprobado.
- **Entregables:**
  - `arnes/nucleo/REGISTRO_DE_ENTIDADES.md` (schema canónico).
  - `arnes/nucleo/logica_de_negocio.md` (mapa maestro).
  - `arnes/nucleo/glosario.md` (vocabulario de UI).
- **Decisiones:**
  - Schema basado en `docs/design/` (Usuario, Recurso, Mensaje, Slide).
  - No se migra el schema del repo viejo (Google Apps Script).

### ✅ F1: Lógica de Negocio
- **Estado:** Aprobado.
- **Entregables:**
  - Flujo de autenticación (better-auth + middleware).
  - Control de acceso a recursos (PUBLICO/SOLO_REGISTRADOS/LISTA_BLANCA).
  - Bandeja de correo (Resend + R2).
- **Decisiones:**
  - Middleware en `/app/middleware.ts` (Next.js).
  - Validación de datos con Zod.

---

## Fases en Progreso

### 🚧 F2: Inicio (`/`)
- **Estado:** **En diseño** (2026-08-08).
- **Diseño:** `arnes/lineas/web-publico/pantallas/disenio_P01_inicio.md` ✅ **Creado**.
- **Componentes:**
  - Header (logo NOMON, navbar).
  - Hero (tagline, CTAs).
  - Sección "Nodos de Acción" (4 tarjetas).
- **Bloqueante:** Depende de F0/F1 (✅ Aprobados).
- **Próximo paso:** Revisión del diseño por el Supervisor.

### ✅ F3: Simposio (`/simposio`)
- **Estado:** **Cerrado / Aprobado** (2026-08-09).
- **Diseño:** `arnes/lineas/web-publico/pantallas/disenio_P02_simposio.md` ✅ **Aprobado**.
- **Contenido:** Destilado de `NOMON WEB/SIMposio.md` (contenido del Simposio Internacional de Ética).
- **Componentes:**
  - Deck de 12 slides (layout 2 columnas).
  - Navegación (click, teclado, swipe).
  - Modal "Leer más".
- **Decisión:** Implementar como **estático** (hardcodeado en `lib/data/simposio.ts`).
- **Bloqueante:** Ninguno (F0/F1 aprobados).

### 🚧 F4: Recursos (`/recursos`, `/recursos/:slug`)
- **Estado:** **En diseño** (2026-08-09).
- **Diseño:**
  - `arnes/lineas/web-publico/pantallas/disenio_P03_recursos_listado.md` ✅ **Creado**.
  - `arnes/lineas/web-publico/pantallas/disenio_P04_recursos_detalle.md` ✅ **Creado**.
- **Componentes:**
  - Listado: Grilla de tarjetas (título, autor, año, badge de acceso).
  - Detalle: Ficha bibliográfica + botón de descarga (PDF) + contenido.
- **Lógica:**
  - Filtro por `acceso.estrategia` (PUBLICO/SOLO_REGISTRADOS/LISTA_BLANCA).
  - Descarga de PDF desde R2.
- **Bloqueante:** Depende de F0/F1 (✅ Aprobados).
- **Próximo paso:** Revisión del diseño por el Supervisor.

### 🚧 F5: Auth (Modal)
- **Estado:** **En diseño** (2026-08-09).
- **Diseño:** `arnes/lineas/web-publico/pantallas/disenio_P05_auth.md` ✅ **Creado**.
- **Componentes:**
  - Modal `AuthModal` (login/registro).
  - Formulario de registro (nombre, teléfono, área, email, password).
  - Formulario de login (email, password).
- **Lógica:**
  - better-auth (adaptador Next.js + Drizzle).
  - Middleware para redirección.
- **Bloqueante:** Depende de F0/F1 (✅ Aprobados).
- **Próximo paso:** Revisión del diseño por el Supervisor.

### 🚧 F6: Perfil (`/perfil`)
- **Estado:** **En diseño** (2026-08-09).
- **Diseño:** `arnes/lineas/web-publico/pantallas/disenio_P06_perfil.md` ✅ **Creado**.
- **Componentes:**
  - Datos del usuario (nombre, email, rol, bio, tags).
  - Botón "Cerrar sesión".
- **Lógica:**
  - Solo accesible con sesión válida (E-02).
- **Bloqueante:** Depende de F5 (Auth) ✅ **Diseño creado**.
- **Próximo paso:** Revisión del diseño por el Supervisor.

### 🚧 F7: Correo (`/correo`)
- **Estado:** **En implementación** (2026-08-09).
- **Diseño:** `arnes/lineas/web-publico/pantallas/disenio_P07_correo.md` ✅ **Creado**.
- **Decisión recibida:** Recepción vía Cloudflare Email Routing → Worker (`postal-mime`) → `POST /api/webhooks/incoming-email` en Vercel → Postgres. Envío vía Resend. Worker versionado en repo (`workers/email-handler/`), deploy manual.
- **Tareas:** t-012 → t-019 (schema Mensaje extendido, dep `resend`, fix `getCurrentUser`, webhook, APIs bandeja, worker, UI `/login`+`/correo`, docs).
- **Componentes:**
  - Bandeja: Lista de mensajes (dirección, de/para, asunto, fecha).
  - Detalle: Cuerpo del mensaje + adjuntos.
  - Compositor: Formulario de envío (destinatario, asunto, cuerpo).
- **Lógica:**
  - Solo accesible con rol `ADMIN` (E-03).
  - Envío vía Resend API.
- **Bloqueante `[SOLO_HUMANO]`:** Configurar `RESEND_API_KEY` y `WEBHOOK_SECRET` en Vercel; desplegar Worker + Email Routing en Cloudflare; aplicar migración Drizzle a Neon.
- **Próximo paso:** Implementar t-012 → t-019.

---

## Fases Pendientes

### ⏳ F8: Hardening
- **Estado:** Pendiente (no iniciado).
- **Objetivo:**
  - Migración de datos desde el repo viejo (si aplica).
  - Validación de schema con Drizzle.
  - Pruebas de integración (auth, recursos, correo).
- **Bloqueante:** Depende de F2–F7.

### ⏳ F9: QA y Corte
- **Estado:** Pendiente (no iniciado).
- **Objetivo:**
  - Verificación de gates (E-01 a E-05).
  - Checklist de corte (10 condiciones).
  - Merge `dev` → `main`.
- **Bloqueante:** Depende de F8.

---

## Próxima Acción Permitida

**Completar diseños de pantallas (F2–F7):**
1. ✅ Crear `disenio_P01_inicio.md` (Inicio) — **Completado**.
2. ✅ Crear `disenio_P02_simposio.md` (Simposio) — **Aprobado**.
3. ✅ Crear `disenio_P03_recursos_listado.md` (Listado de Recursos) — **Completado**.
4. ✅ Crear `disenio_P04_recursos_detalle.md` (Detalle de Recurso) — **Completado**.
5. ✅ Crear `disenio_P05_auth.md` (Auth Modal) — **Completado**.
6. ✅ Crear `disenio_P06_perfil.md` (Perfil) — **Completado**.
7. ✅ Crear `disenio_P07_correo.md` (Correo) — **Completado**.

**🎉 Fase de diseño de pantallas COMPLETA.** Todas las 7 pantallas tienen diseño creado siguiendo `PLANTILLA_PANTALLA.md` (10 secciones obligatorias).

**Próxima acción:** Revisión del Supervisor de los diseños pendientes (P01, P04, P05, P06, P07) antes de pasar a implementación.

**Requisito:** Cada diseño debe seguir `PLANTILLA_PANTALLA.md` (10 secciones obligatorias).

---

## Decisiones Vigentes

- **Stack técnico:** Next.js 15 (App Router) + TypeScript + Drizzle + Neon + better-auth + R2 + Biome + Vitest.
- **Simposio estático:** No se implementa editor en vivo (solo hardcodeado en `lib/data/simposio.ts`).
- **Auth:** better-auth (no auth casera como en el repo viejo).
- **Storage:** Cloudflare R2 (no Google Drive ni otro servicio).
- **Correo:** Resend (envío) + Cloudflare Email Routing (recepción).

---

## Bloqueantes

| Bloqueante | Estado | Solución |
|------------|--------|----------|
| Diseños de pantallas (F2–F7) | Pendiente | Crear `disenio_PXX.md` usando `PLANTILLA_PANTALLA.md`. |
| Configuración de Resend | Pendiente | Configurar `RESEND_API_KEY` en Vercel. |
| Configuración de R2 | Pendiente | Configurar `CF_R2_*` en Vercel. |

---

## Tareas Asociadas

| ID | Tarea | Estado | Ejecutor |
|----|-------|--------|----------|
| t-012 | Extender schema Mensaje (messageId, cuerpoHtml) | ⏳ **Creada** (2026-08-09) | — |
| t-013 | Instalar dependencia resend | ⏳ **Creada** (2026-08-09) | — |
| t-014 | Corregir getCurrentUser (gate E-03) | ⏳ **Creada** (2026-08-09) | — |
| t-015 | Webhook recepción incoming-email | ⏳ **Creada** (2026-08-09) | — |
| t-016 | APIs bandeja: GET listar + POST enviar | ⏳ **Creada** (2026-08-09) | — |
| t-017 | Worker Cloudflare versionado + README | ⏳ **Creada** (2026-08-09) | — |
| t-018 | Página /login mínima + bandeja /correo | ⏳ **Creada** (2026-08-09) | — |
| t-019 | Actualizar docs/design/05-correo-aliados.md | ⏳ **Creada** (2026-08-09) | — |
