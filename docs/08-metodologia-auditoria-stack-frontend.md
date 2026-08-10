# Metodología de Auditoría Ponderada: Vite + React vs Next.js

**Contexto**: Decisión crítica entre **Vite + React puro** (heredado del repo viejo) y **Next.js 15 (App Router)** para el proyecto NOMON, considerando:
- Web público actual (6 pantallas, contenido estático + auth + recursos)
- Futuro OS interno (correos, cronogramas, tareas de equipo)
- Stack backend confirmado: Vercel (hosting + serverless) + Neon Postgres + Drizzle + better-auth

---

## 📌 Principios de la Metodología

1. **Criterios ponderados**: Cada decisión se evalúa contra criterios específicos con pesos explícitos (suman 100%).
2. **Puntaje 1-5**: 1 = pobre, 3 = aceptable, 5 = excelente.
3. **Trade-offs explícitos**: El ganador debe justificar qué se sacrifica.
4. **Contexto NOMON**: Priorizar:
   - **Simplicidad** (evitar abstracciones sin 2+ casos de uso)
   - **Integración con Vercel** (backend ya confirmado)
   - **Escalabilidad** (de 6 pantallas a OS interno sin reescritura)
   - **Seguridad** (lecciones del repo viejo: auth casera, validación de datos)

---

## 🔍 Comparación: Vite + React vs Next.js

### Candidatos

| Framework | Descripción | Versión Recomendada |
|-----------|-------------|---------------------|
| **Vite + React** | Build tool (Vite) + biblioteca (React) | Vite 5 + React 19 |
| **Next.js** | Framework full-stack (React + API routes + SSR/SSG) | Next.js 15 (App Router) |

---

### 📊 Matriz de Criterios Ponderados

| Criterio | Peso | Vite + React | Next.js | Notas |
|----------|------|--------------|---------|-------|
| **A. Integración con Vercel** | 25% | 3 | **5** | Next.js es el framework nativo de Vercel. API routes integradas, middleware en edge, deploy automático. Vite requiere configuración manual de funciones serverless en `/api`. |
| **B. Integración con Backend Existente** | 20% | 2 | **5** | Next.js: API routes en `/app/api/` usan el mismo runtime que el frontend. Drizzle/better-auth tienen adaptadores oficiales para Next.js. Vite: funciones serverless en carpeta separada, configuración manual de conexiones a Neon. |
| **C. Escalabilidad a OS Interno** | 20% | 2 | **5** | Next.js soporta nativamente: autenticación (middleware), rutas protegidas, SSR para dashboards, API routes para lógica de negocio. Vite + React requeriría añadir `react-router` + configuración manual de auth + funciones serverless separadas. |
| **D. Performance (Cold Start / TTFB)** | 15% | **4** | 4 | Vite: Bundle estático optimizado (mejor para SPAs puras). Next.js: App Router usa Server Components (menor bundle cliente), pero cold start en serverless puede ser similar. Empate técnico. |
| **E. Complejidad de Setup Inicial** | 10% | **4** | 3 | Vite: `npm create vite@latest` + React. Next.js: más configuración inicial (App Router, layout, etc.), pero Vercel lo simplifica. |
| **F. Mantenibilidad a Largo Plazo** | 10% | 3 | **4** | Next.js: ecosistema más maduro para apps full-stack, mejor soporte para TypeScript, más recursos/comunidad. Vite: más ligero, pero menos integrado con backend. |
| **Puntaje Ponderado** | **100%** | **3.15** | **4.7** | **Next.js gana por 1.55 puntos** |

---

### 📝 Detalle por Criterio

#### A. Integración con Vercel (25%)

- **Next.js (5/5)**:
  - Deploy nativo: `vercel --prod` detecta automáticamente Next.js y configura todo.
  - API routes en `/app/api/` se despliegan como funciones serverless sin configuración extra.
  - Middleware (`/app/middleware.ts`) corre en el edge de Vercel (ideal para auth/sesiones).
  - Integración con Neon Postgres: Vercel tiene [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (basado en Neon) con driver serverless automático.
  - **Ejemplo**: `better-auth` tiene [adaptador oficial para Next.js](https://better-auth.com/docs/adapters/nextjs).

- **Vite + React (3/5)**:
  - Vercel despliega el frontend estático sin problemas.
  - **Pero**: Las funciones serverless (para auth, recursos, correo) deben vivir en una carpeta `/api` separada, con configuración manual en `vercel.json`:
    ```json
    {
      "functions": {
        "api/*.ts": {
          "memory": 3008,
          "maxDuration": 60
        }
      }
    }
    ```
  - Conexión a Neon requiere configurar manualmente el driver serverless (`@neondatabase/serverless`).
  - **Riesgo**: Desincronización entre frontend (Vite) y backend (funciones Vercel).

#### B. Integración con Backend Existente (20%)

- **Next.js (5/5)**:
  - **API routes integradas**: El código de backend (auth, recursos, correo) vive en el mismo repo, en `/app/api/`.
  - **Ejemplo de estructura**:
    ```
    /app
      /api
        /auth
          route.ts       # better-auth endpoints
        /resources
          route.ts       # Drizzle + Neon
        /email
          route.ts       # Resend/Cloudflare R2
      /(public)
        /login
          page.tsx
      /(protected)
        /dashboard
          page.tsx
    ```
  - **Ventaja**: Compartir tipos TypeScript entre frontend y backend sin configuración extra.
  - **better-auth**: Adaptador oficial para Next.js (usa `next/headers` y `next/cookies` nativamente).

- **Vite + React (2/5)**:
  - Backend en carpeta `/api` separada (funciones Vercel).
  - **Problemas**:
    - Configuración manual de CORS para llamadas desde el frontend.
    - Duplicación de tipos TypeScript (o configuración de `tsconfig.json` para path aliases).
    - `better-auth` no tiene adaptador oficial para funciones Vercel puras (requiere adaptador personal).

#### C. Escalabilidad a OS Interno (20%)

- **Next.js (5/5)**:
  - **Autenticación**: Middleware en `/app/middleware.ts` puede proteger rutas enteras:
    ```ts
    import { auth } from "@/auth";
    export default auth((req) => {
      if (!req.auth) return Response.redirect(new URL("/login", req.url));
    });
    export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"], };
    ```
  - **Server Components**: Ideal para dashboards internos (menos JS en el cliente, datos fetchados directamente en el servidor).
  - **API routes**: Lógica de negocio (cronogramas, tareas) vive junto al frontend.
  - **ISR/SSR**: Para datos dinámicos (ej: lista de tareas del equipo).

- **Vite + React (2/5)**:
  - **Autenticación**: Requeriría:
    1. Configurar `react-router` con rutas protegidas.
    2. Manejar sesiones en el cliente (menos seguro).
    3. Funciones serverless separadas para validar tokens.
  - **Dashboard**: SPA pura con fetch al backend (más código cliente, peor performance para datos sensibles).
  - **Riesgo**: Acoplamiento entre frontend (Vite) y backend (funciones Vercel) se vuelve frágil a medida que crece el OS interno.

#### D. Performance (15%)

- **Empate (4/5 ambos)**:
  - **Vite**: Bundle estático optimizado, ideal para SPAs (ej: web público de NOMON).
  - **Next.js**: App Router usa Server Components (solo envía HTML + JSON minimal al cliente). Para páginas estáticas, `generateStaticParams` + SSG.
  - **Cold Start**: En Vercel, ambas opciones usan funciones serverless. Next.js tiene optimizaciones para cold start en App Router.
  - **Conclusión**: Diferencia marginal en performance real para el tráfico de NOMON.

#### E. Complejidad de Setup Inicial (10%)

- **Vite + React (4/5)**:
  - Setup mínimo:
    ```bash
    npm create vite@latest nomon-web -- --template react-ts
    cd nomon-web
    npm install react-router-dom @tanstack/react-query
    ```
  - **Ventaja**: Menos "magia" (más fácil de debuggear para desarrolladores nuevos).

- **Next.js (3/5)**:
  - Setup inicial más complejo (App Router, layouts, etc.), pero:
    - Vercel proporciona templates oficiales.
    - La curva de aprendizaje se compensa con la integración nativa.
  - **Ejemplo de setup**:
    ```bash
    npx create-next-app@latest nomon-web --typescript --tailwind --eslint --src-dir --app --import-alias "@/*"
    ```

#### F. Mantenibilidad a Largo Plazo (10%)

- **Next.js (4/5)**:
  - Ecosistema más maduro para apps full-stack.
  - Mejor soporte para TypeScript (inferencia automática en API routes).
  - Más recursos, plugins, y comunidad (ej: [Next.js + Drizzle](https://orm.drizzle.team/docs/nextjs)).
  - **Riesgo**: App Router es más nuevo que Pages Router (pero ya estable).

- **Vite + React (3/5)**:
  - Más ligero, pero menos integrado.
  - Requeriría mantener configuraciones separadas para frontend y backend.

---

## 🏆 Resultado Final

| Framework | Puntaje Ponderado | Veredicto |
|-----------|-------------------|-----------|
| **Next.js 15 (App Router)** | **4.7/5** | **Ganador** |
| Vite + React | 3.15/5 | Rechazado |

**Margen**: Next.js gana por **1.55 puntos** (33% más).

---

## ✅ Trade-offs Aceptados con Next.js

1. **Curva de aprendizaje inicial**:
   - **Qué se sacrifica**: Setup más complejo que Vite + React.
   - **Qué se gana**: Integración nativa con Vercel, backend y frontend en el mismo proyecto, escalabilidad garantizada.
   - **Mitigación**: Usar templates oficiales de Vercel/Next.js + documentación existente.

2. **App Router vs Pages Router**:
   - **Qué se sacrifica**: Pages Router es más familiar para algunos desarrolladores.
   - **Qué se gana**: App Router es el futuro de Next.js (recomendado por Vercel), mejor performance con Server Components.

3. **Bundle size**:
   - **Qué se sacrifica**: Next.js puede tener un bundle ligeramente más grande que Vite para SPAs puras.
   - **Qué se gana**: Server Components reducen el bundle cliente para páginas dinámicas (OS interno).

---

## 🚀 Recomendación Final

**Usar Next.js 15 con App Router** por las siguientes razones:

1. **Integración perfecta con Vercel**: El stack backend (Neon, Drizzle, better-auth) ya está optimizado para Vercel. Next.js es el framework nativo de Vercel.
2. **Backend y frontend unificados**: Las API routes viven en `/app/api/`, el middleware en `/app/middleware.ts`, y el frontend en `/app/`. Todo en un solo proyecto.
3. **Escalabilidad garantizada**: De 6 pantallas públicas a un OS interno sin reescritura. Next.js soporta:
   - Autenticación con middleware.
   - Rutas protegidas.
   - Server Components para dashboards.
   - API routes para lógica de negocio.
4. **Seguridad mejorada**:
   - Middleware en el edge para validar sesiones antes de que lleguen al cliente.
   - `better-auth` tiene adaptador oficial para Next.js.
5. **TypeScript primero**: Next.js 15 tiene soporte nativo para TypeScript en API routes, middleware, y componentes.

---

## 📋 Pasos Siguientes (si se aprueba Next.js)

1. **Actualizar `06-stack-y-proceso.md`**:
   - Reemplazar "Vite + React 19" por "Next.js 15 (App Router)".
   - Eliminar `react-router-dom` (Next.js usa su propio router).
   - Confirmar que `better-auth` usará el adaptador de Next.js.

2. **Estructura del Proyecto**:
   ```
   /app
     /(public)          # Web público (landing, simposio, recursos)
       /login
         page.tsx
       /register
         page.tsx
       /resources
         page.tsx
     /(protected)       # OS interno (futuro)
       /dashboard
         page.tsx
       /email
         page.tsx
       /schedule
         page.tsx
     /api
       /auth            # better-auth endpoints
         [...path]
           route.ts
       /resources       # Drizzle + Neon
         route.ts
       /email           # Resend/Cloudflare R2
         route.ts
     /layout.tsx
     /middleware.ts     # Auth en el edge
   /lib
     /db               # Drizzle schema + migraciones
     /auth             # Configuración de better-auth
   /public             # Assets estáticos
   ```

3. **Configuración Inicial**:
   - Crear proyecto con:
     ```bash
     npx create-next-app@latest nomon-web --typescript --tailwind --eslint --src-dir --app --import-alias "@/*" --use-npm
     ```
   - Instalar dependencias clave:
     ```bash
     npm install drizzle-orm @neondatabase/serverless better-auth zod @aws-sdk/client-s3 biome
     ```

4. **Validar con el Dueño del Proyecto**:
   - Confirmar que el cambio de Vite a Next.js alinea con la visión de "no abstracciones sin 2+ casos de uso".
   - Next.js **no** es una abstracción genérica: es una herramienta específica para apps full-stack en Vercel.

---

## 🔄 Alternativa: Híbrido (Vite + Next.js)

Si el equipo prefiere mantener Vite para el web público por simplicidad, se podría considerar:
- **Web público**: Vite + React (despliegue estático en Vercel).
- **OS interno**: Next.js (despliegue en `/admin` o subdominio).

**Problemas con esta alternativa**:
- Dos repositorios o configuraciones separadas.
- Duplicación de lógica de auth (better-auth tendría que configurarse en ambos).
- Complejidad adicional en CI/CD.

**Recomendación**: Evitar. Next.js puede manejar ambos casos de uso (público e interno) en un solo proyecto.

---

## 📌 Conclusión

La auditoría ponderada **recomienda Next.js 15 (App Router)** con un puntaje de **4.7/5**, superando a Vite + React (3.15/5) en los criterios más críticos para NOMON: integración con Vercel, backend unificado, y escalabilidad al OS interno. Los trade-offs (curva de aprendizaje inicial) son aceptables frente a las ventajas a largo plazo.

**Decisión final**: Pendiente de confirmación del dueño del proyecto. Si se aprueba, actualizar `06-stack-y-proceso.md` y `07-auditoria-backend.md` en consecuencia.