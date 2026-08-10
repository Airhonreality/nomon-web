# Auditoría del backend y frontend: Stack completo para NOMON

Doc vivo. Auditoría con criterios ponderados de **todo el stack** (`GitHub → Vercel → Postgres → Cloudflare R2` confirmado en `06-stack-y-proceso.md`). Cada decisión: candidatos → criterios con peso → puntaje 1-5 por criterio → ganador → trade-off aceptado (ninguna elección es gratis, se deja explícito qué se sacrifica).

**Nota**: El frontend se resolvió en `08-metodologia-auditoria-stack-frontend.md` (Next.js 15 gana sobre Vite + React). Este documento ahora cubre **todo el stack de forma unificada**.

## A. ORM / capa de acceso a datos

Candidatos: **Drizzle**, Prisma, Kysely, SQL crudo (`postgres.js`/`pg`).

| Criterio | Peso | Drizzle | Prisma | Kysely | SQL crudo |
|---|---|---|---|---|---|
| Cold start / ajuste serverless (sin binario de motor, arranque liviano en una función de Vercel) | 35% | 5 | 2 | 5 | 5 |
| Seguridad de tipos end-to-end (inferencia desde el schema hasta el componente) | 25% | 5 | 5 | 4 | 2 |
| Migraciones integradas | 15% | 4 | 5 | 2 | 1 |
| Cercanía a SQL / curva de aprendizaje | 15% | 4 | 3 | 4 | 5 |
| Madurez/ecosistema | 10% | 4 | 5 | 3 | 5 |
| **Puntaje ponderado** | | **4.6** | **3.65** | **3.95** | **3.65** |

**Ganador: Drizzle.** Prisma pierde puntos justo donde más pesa para este stack: su motor de queries corre como binario nativo separado, lo que penaliza el cold start en funciones serverless de Vercel (hay mitigaciones de pago — Prisma Accelerate — que no tiene sentido pagar para el volumen de tráfico de este sitio). Drizzle genera SQL directo sin motor intermedio, tiene inferencia de tipos igual de buena, y `drizzle-kit` cubre migraciones razonablemente bien aunque es más joven que Prisma Migrate.

**Trade-off aceptado**: Drizzle es más joven que Prisma — menos años de batalla en producción, comunidad más chica (aunque creciendo rápido). Se acepta porque el criterio dominante (ajuste serverless) es real y medible, no moda.

## B. Proveedor de Postgres

Candidatos: **Neon**, Supabase (solo Postgres), Railway.

| Criterio | Peso | Neon | Supabase | Railway |
|---|---|---|---|---|
| Integración nativa con Vercel (branching de DB por preview deploy) | 30% | 5 | 3 | 2 |
| Driver serverless (HTTP/WebSocket — evita agotar el pool de conexiones TCP con funciones efímeras) | 30% | 5 | 3 | 2 |
| Capa gratuita usable | 20% | 4 | 4 | 3 |
| No trae features sin usar (auth/storage/realtime que no se necesitan aquí) | 20% | 5 | 2 | 4 |
| **Puntaje ponderado** | | **4.8** | **3.0** | **2.6** |

**Ganador: Neon**, vía la integración oficial de Vercel (Vercel Postgres corre sobre Neon). El driver serverless (`@neondatabase/serverless`) hace queries por HTTP/WebSocket en vez de mantener conexiones TCP persistentes — importante porque cada invocación de una función de Vercel es efímera, y con un driver Postgres tradicional el pool de conexiones se agota rápido bajo tráfico concurrente. Supabase pierde puntos porque trae su propio sistema de auth/storage/realtime — exactamente el tipo de pieza sin usar que este proyecto ya decidió evitar (ya se eligió better-auth y R2 por separado, ver abajo).

**Trade-off aceptado**: se ata la base de datos al ecosistema Vercel/Neon. Si algún día se migra el hosting fuera de Vercel, hay que revisar el driver de conexión (no el motor Postgres en sí, que es estándar).

## C. Auth

Candidatos: construir a mano (como proponía yo antes de esta auditoría), **better-auth**, Auth.js, Clerk (SaaS gestionado).

| Criterio | Peso | A mano | better-auth | Auth.js | Clerk |
|---|---|---|---|---|---|
| Seguridad por defecto (hashing, manejo de sesión) sin que el equipo la reinvente | 35% | 2 | 5 | 4 | 5 |
| Costo | 25% | 5 | 5 | 5 | 2 |
| Ajuste al stack (Drizzle + Postgres + funciones Vercel, email+password propio) | 25% | 4 | 5 | 3 | 3 |
| Simplicidad (sin dashboard/infra extra que no se necesita) | 15% | 3 | 4 | 3 | 2 |
| **Puntaje ponderado** | | **3.4** | **4.85** | **3.85** | **3.3** |

**Ganador: better-auth.** Es la corrección más importante de esta auditoría: construir auth a mano es exactamente lo que ya salió mal en `../NOMON WEB` (hashing SHA-256 sin sal, verificación de contraseña en el cliente — ver `docs/design/04-auth.md`). No hay razón para repetir ese riesgo cuando existe una librería gratuita, self-hosted, con adaptador oficial para Drizzle+Postgres, que maneja hashing (scrypt) y sesiones de forma correcta por defecto. Clerk sería más rápido de integrar pero mete un costo recurrente y un sistema de usuarios externo a Postgres — no tiene sentido para un sitio de una ONG con un puñado de aliados registrados.

**Trade-off aceptado**: better-auth es más joven que Auth.js (que existe desde hace años como NextAuth). Se acepta porque Auth.js está diseñado sobre todo para login social/OAuth multi-proveedor — este proyecto necesita ante todo email+password propio para aliados, que es el caso de uso central de better-auth.

## D. TypeScript — ya no es una pregunta abierta

Drizzle, better-auth y `zod` (ya elegido para validar datos en el límite) dependen todos de inferencia de tipos de TypeScript para dar su valor real — usarlos en JavaScript plano tira la mitad de su beneficio. Se confirma **TypeScript**, no como preferencia sino como consecuencia directa de las otras 3 decisiones de esta auditoría.

## E. Cliente de almacenamiento para R2

R2 es compatible con S3 — no hay una decisión real que auditar con múltiples candidatos serios: `@aws-sdk/client-s3` apuntando al endpoint de R2 es el estándar, ligero, y evita meter una capa de abstracción extra (tipo `unstorage`) para un solo backend de storage.

## F. Lint/format

Candidatos: **Biome**, ESLint + Prettier.

| Criterio | Peso | Biome | ESLint + Prettier |
|---|---|---|---|
| Simplicidad (una herramienta y un config vs. dos) | 30% | 5 | 2 |
| Velocidad (escrito en Rust vs. JS) | 25% | 5 | 3 |
| Cobertura de reglas específicas de React/hooks y plugins del ecosistema | 25% | 3 | 5 |
| Madurez | 20% | 3 | 5 |
| **Puntaje ponderado** | | **4.1** | **3.6** |

**Ganador: Biome**, por márgen estrecho — encaja con la regla de este proyecto de minimizar piezas móviles (un binario, un archivo de config, sin plugins que mantener). El trade-off real: la cobertura de reglas específicas de hooks de React de Biome, aunque ya es razonable, todavía no iguala la profundidad de `eslint-plugin-react-hooks` con años de reglas acumuladas. Para un proyecto de este tamaño (6 pantallas) ese hueco no pesa tanto como la simplicidad ganada.

## Resumen de decisiones (reemplaza las "decisiones abiertas" de `06-stack-y-proceso.md`)

| Pieza | Elección |
|---|---|
| **Frontend** | Next.js 15 (App Router) |
| **Lenguaje** | TypeScript |
| **ORM** | Drizzle + `drizzle-kit` |
| **Postgres** | Neon (vía integración de Vercel) |
| **Auth** | better-auth (adaptador Drizzle + Next.js) |
| **Storage** | `@aws-sdk/client-s3` → Cloudflare R2 |
| **Validación de límite** | `zod` |
| **Lint/format** | Biome |

Sigue abierto (menor peso, no bloquea el arranque del proyecto): CSS Modules vs. otra estrategia de estilos, y package manager (`pnpm` recomendado por velocidad/disco, pero `npm` funciona igual de bien a esta escala).

**Nota**: Para la auditoría completa del stack (incluyendo frontend, backend, y todos los componentes), ver `09-auditoria-completa-stack.md`.
