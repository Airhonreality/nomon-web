# Lógica de Negocio — NOMON

**Contrato vivo.** Mapa maestro del negocio y sus implicaciones técnicas. Este documento es la **fuente única de verdad** para entender cómo funciona NOMON desde el punto de vista de negocio y cómo se traduce eso en el sistema.

---

## Parte I: Negocio

### 1. Misión y Visión

**Misión:**
"Impulsamos la evolución de organizaciones y comunidades a través de una consultoría estratégica de alto impacto fundamentada en la integridad, programas de formación humana que trascienden el aula para fortalecer un liderazgo ético consciente, y la creación artística como motor de cohesión social."

**Visión:**
Ser el referente en ética aplicada para la transformación organizacional y social en Latinoamérica.

---

### 2. Flujo de Autenticación y Autorización

#### 2.1 Registro de Usuarios
1. **Entrada:** Usuario completa formulario con:
   - Nombre completo.
   - Teléfono.
   - Área/rama de interés (ej: Gubernamental, Corporativo, Académico, Jurídico).
   - Email (+ confirmación).
   - Contraseña (+ confirmación, mínimo 6 caracteres).
2. **Validación:**
   - Email único (no duplicado en `Usuario.email`).
   - Contraseña válida (longitud mínima).
3. **Creación:**
   - Se crea `Usuario` con `rol = ALIADO` (por defecto).
   - Se hashea la contraseña con **scrypt** (better-auth).
   - Se genera una `Sesion` con token httpOnly.
4. **Salida:** Usuario autenticado, redirigido a `/perfil`.

#### 2.2 Login
1. **Entrada:** Email + contraseña.
2. **Validación:**
   - better-auth verifica email + password_hash en el backend.
   - **Nunca en el cliente** (lección del repo viejo).
3. **Salida:**
   - `Sesion` creada con token httpOnly.
   - Cookie de sesión configurada con `httpOnly: true`, `secure: true`.

#### 2.3 Cierre de Sesión
1. **Acción:** Usuario hace click en "Salir".
2. **Backend:**
   - better-auth destruye la `Sesion`.
   - Cookie de sesión se invalida.

#### 2.4 Middleware de Autenticación
- **Ubicación:** `/app/middleware.ts` (Next.js).
- **Función:** Validar sesión en el edge antes de que la request llegue al cliente.
- **Rutas protegidas:**
  - `/perfil` (requiere `ALIADO` o `ADMIN`).
  - `/correo` (requiere `ADMIN`).
- **Comportamiento:**
  - Si no hay sesión: redirige a `/` (con modal de login).
  - Si hay sesión pero rol insuficiente: redirige a `/` con mensaje de error.

---

### 3. Gestión de Recursos

#### 3.1 Listado de Recursos (`/recursos`)
- **Acceso:** Público (pero con filtros).
- **Filtros:**
  - `PUBLICO`: Siempre visibles.
  - `SOLO_REGISTRADOS`: Visibles solo si hay sesión activa.
  - `LISTA_BLANCA`: Visibles solo si el email del usuario está en `RecursoAcceso`.
- **Orden:** Por fecha de creación (descendente) o alfabético.

#### 3.2 Detalle de Recurso (`/recursos/:slug`)
- **Acceso:** Depende de `Recurso.acceso.estrategia`.
- **Si no está autorizado:**
  - Mostrar mensaje: "Contenido reservado. Si crees que deberías tener acceso, contacta a un administrador."
- **Contenido:**
  - Ficha bibliográfica (`RecursoMetadata`).
  - Botón de descarga (si `pdf_url` existe).
  - Contenido compuesto (`Recurso.contenido`).
  - Recursos relacionados (`RecursoRelacionado`).

#### 3.3 Subida de Recursos (Futuro)
- **Rol requerido:** `ADMIN`.
- **Flujo:**
  1. Formulario con campos de `Recurso` + `RecursoMetadata`.
  2. Subida de PDF a Cloudflare R2.
  3. Creación de `Recurso` en Postgres.
  4. Opcional: Configuración de `RecursoAcceso` (lista blanca).

---

### 4. Bandeja de Correo Corporativo (`/correo`)

#### 4.1 Envío de Mensajes
- **Rol requerido:** `ADMIN`.
- **Flujo:**
  1. Seleccionar destinatario:
     - Aliado registrado (lista de `Usuario` con `rol = ALIADO`).
     - Email libre (para destinatarios no registrados).
  2. Completar:
     - Asunto.
     - Cuerpo (texto plano o HTML).
     - Adjuntos (opcional, subida a R2).
  3. **Backend:**
     - Guardar `Mensaje` en Postgres (`direccion = ENVIADO`).
     - Enviar email vía Resend API.
     - Guardar `adjuntos` en R2 (si aplica).
  4. **Validación:**
     - `RESEND_API_KEY` debe estar configurada.
     - El email del remitente es `contacto@rednomon.com`.

#### 4.2 Recepción de Mensajes
- **Origen:** Cloudflare Email Routing → Gmail (actual).
- **Futuro:** Webhook de Cloudflare a Vercel (para automatizar la recepción).
- **Backend:**
  - Guardar `Mensaje` en Postgres (`direccion = RECIBIDO`).
  - Extraer:
    - `de`: Email del remitente.
    - `para`: `contacto@rednomon.com`.
    - `asunto`: Subject del email.
    - `cuerpo`: Body del email.
    - `aliado_ref`: Si `de` coincide con un `Usuario.email`, vincularlo.

#### 4.3 Listado de Mensajes
- **Filtros:**
  - `ENVIADO` / `RECIBIDO`.
  - Por fecha (descendente).
  - Por `aliado_ref` (si aplica).
- **Paginación:** 20 mensajes por página.

---

### 5. Simposio (`/simposio`)

#### 5.1 Visualización
- **Estructura:** Deck de 12 slides (ver `docs/design/02-simposio.md`).
- **Layout:** 2 columnas (izquierda: índice + navegación; derecha: contenido de la slide activa).
- **Navegación:**
  - Click en índice.
  - Flechas de teclado.
  - Swipe táctil.
- **Modal "Leer más":** Para contenido extendido (`readMoreContent`).

#### 5.2 Decisión de Diseño
- **Opción A (Estático):**
  - Datos hardcodeados en `lib/data/simposio.ts`.
  - **Ventaja:** Simple, sin backend.
  - **Desventaja:** Requiere re-deploy para cambios.
- **Opción B (Dinámico):**
  - Datos en Postgres (tabla `Slide`).
  - API routes para CRUD.
  - **Ventaja:** Editable sin re-deploy.
  - **Desventaja:** Complejidad adicional.
- **Decisión actual:** **Opción A (Estático)** (ver `CLAUDE.md` §2: "Si algo tiene un solo caso de uso, se hardcodea").

---

## Parte II: Implicaciones Técnicas

### 1. Middleware de Autenticación

**Ubicación:** `/app/middleware.ts` (Next.js App Router).

**Implementación:**
```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isPublicPath = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/simposio") || nextUrl.pathname.startsWith("/recursos");
  
  if (!isPublicPath && !auth?.user) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }
  
  // Rutas protegidas por rol
  if (nextUrl.pathname.startsWith("/correo") && auth?.user?.rol !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

**Gates de autenticación:**
| Gate | Descripción | Predicado SQL (si aplica) |
|------|-------------|--------------------------|
| E-01 | Usuario registrado | `SELECT * FROM Usuario WHERE email = ?` |
| E-02 | Sesión válida | `SELECT * FROM Sesion WHERE token = ? AND expires_at > NOW()` |
| E-03 | Rol ADMIN | `SELECT rol FROM Usuario WHERE id = ? AND rol = 'ADMIN'` |

---

### 2. API Routes

**Estructura:** `/app/api/` (Next.js App Router).

| Ruta | Método | Descripción | Middleware |
|------|--------|-------------|------------|
| `/api/auth/[...path]` | POST/GET | better-auth endpoints (login, registro, logout) | — |
| `/api/recursos` | GET | Listado de recursos (con filtros de acceso) | E-01, E-02 |
| `/api/recursos/:slug` | GET | Detalle de un recurso | E-01, E-02, E-04 |
| `/api/correo` | GET | Listado de mensajes (bandeja) | E-01, E-02, E-03 |
| `/api/correo/enviar` | POST | Enviar mensaje | E-01, E-02, E-03 |

**E-04 (Acceso a Recurso):**
```sql
-- Para SOLO_REGISTRADOS
SELECT 1 FROM Sesion WHERE user_id = ? AND expires_at > NOW()

-- Para LISTA_BLANCA
SELECT 1 FROM RecursoAcceso WHERE recurso_id = ? AND email = ?
```

---

### 3. Integración con Cloudflare R2

**Configuración:**
- **Bucket:** `nomon-web-react` (o nombre a definir).
- **Endpoint:** `https://<account>.r2.cloudflarestorage.com`.
- **Cliente:** `@aws-sdk/client-s3` (R2 es compatible con S3).

**Uso:**
- **Subida de PDFs:**
  ```typescript
  import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
  
  const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.CF_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
    },
  });
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.CF_R2_BUCKET_NAME,
    Key: `recursos/${slug}.pdf`,
    Body: fileBuffer,
  }));
  ```
- **URL pública:** `https://<account>.r2.cloudflarestorage.com/<bucket>/<key>`.

---

### 4. Integración con Resend

**Configuración:**
- **API Key:** `RESEND_API_KEY` (variable de entorno en Vercel).
- **Dominio:** `rednomon.com` (verificado en Resend).

**Uso:**
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "contacto@rednomon.com",
  to: destinatario,
  subject: asunto,
  html: cuerpo,
});
```

---

### 5. Validación de Datos (Zod)

**Ubicación:** `/lib/validations/` (schemas de Zod).

**Ejemplo (Recurso):**
```typescript
import { z } from "zod";

export const RecursoSchema = z.object({
  slug: z.string().min(1),
  titulo: z.string().min(1),
  acceso: z.object({
    estrategia: z.enum(["PUBLICO", "SOLO_REGISTRADOS", "LISTA_BLANCA"]),
    lista_blanca_ref: z.string().optional(),
  }),
  metadata: z.object({
    autor: z.string().optional(),
    editorial: z.string().optional(),
    anio: z.string().optional(),
  }).optional(),
});

export type Recurso = z.infer<typeof RecursoSchema>;
```

**Uso en API routes:**
```typescript
import { RecursoSchema } from "@/lib/validations";

const body = await req.json();
const recurso = RecursoSchema.parse(body); // Lanza error si no válida
```

---

## Parte III: Gates de Validación

| Gate | Descripción | Predicado | Evento |
|------|-------------|-----------|--------|
| E-01 | Usuario registrado | `SELECT * FROM Usuario WHERE email = ?` | Login/Registro |
| E-02 | Sesión válida | `SELECT * FROM Sesion WHERE user_id = ? AND expires_at > NOW()` | Middleware |
| E-03 | Rol ADMIN | `SELECT rol FROM Usuario WHERE id = ? AND rol = 'ADMIN'` | Middleware (`/correo`) |
| E-04 | Recurso accesible | Ver §2.2 (Acceso a Recurso) | API `/recursos/:slug` |
| E-05 | Mensaje enviado | `SELECT * FROM Mensaje WHERE id = ? AND direccion = 'ENVIADO'` | API `/correo/enviar` |

---

## Parte IV: Diagrama de Flujo (Mermaid)

```mermaid
flowchart TD
    A[Usuario no autenticado] -->|/login| B[Modal Auth]
    B -->|Registro| C[Crear Usuario + Sesion]
    B -->|Login| D[Validar credenciales + Sesion]
    C --> E[Usuario autenticado]
    D --> E
    E -->|/perfil| F[Perfil]
    E -->|/recursos| G[Listado de Recursos]
    G -->|Click en recurso| H{Acceso?}
    H -->|PUBLICO| I[Mostrar recurso]
    H -->|SOLO_REGISTRADOS| J[Validar sesión (E-02)]
    J -->|Válida| I
    J -->|Inválida| K[Redirigir a /login]
    H -->|LISTA_BLANCA| L[Validar email (E-04)]
    L -->|Autorizado| I
    L -->|No autorizado| M[Mostrar "Contenido reservado"]
    E -->|/correo (ADMIN)| N[Bandeja de Correo]
    N -->|Enviar| O[Crear Mensaje + Resend]
    O -->|Éxito| P[Mensaje guardado (E-05)]
```
