# Auth y Perfil (`/perfil`, modal de login/registro)

Doc vivo. Comportamiento base tomado de `AuthModal.jsx`/`IdentityProfile.jsx` del repo viejo — **con un problema de seguridad real detectado que no se migra tal cual**.

## Comportamiento a preservar

- Registro con: nombre completo, teléfono, área/rama de interés, email (+confirmación), contraseña (+confirmación, mínimo 6 caracteres). Rol asignado: `ALIADO`.
- Login con: email + contraseña.
- Perfil (`/perfil`): nombre, email, rol, biografía editable, tags de interés editables.
- El modal de auth se abre desde cualquier página (botón "Ingresar" / "Únete a NOMON"), no es una ruta propia.

## ⚠️ Problema de seguridad real (NO migrar así)

El repo viejo hace esto:
1. Calcula `SHA-256(password)` **en el navegador**, sin sal.
2. Para hacer login, descarga la lista completa de aliados (incluyendo su `password_hash`) al cliente y compara el hash ahí mismo, en JavaScript.

Esto expone los hashes de contraseña de todos los usuarios a cualquiera que abra las herramientas de desarrollador — exactamente el tipo de error que el propio repo viejo documentó como lección ("la autenticación real se valida en el servidor, nunca en el cliente", ver `../NOMON WEB/docs/SOVEREIGN_AUTH_IDENTITY.md`) pero no aplicó en su propio código de auth.

**Para este rediseño**: la verificación de contraseña debe ocurrir en el backend (o un servicio de auth), nunca comparando hashes en el cliente. El endpoint de login debe recibir email+password y devolver solo un token/sesión — nunca debe exponerse `password_hash` de ningún usuario al frontend.

## Schema de Usuario/Aliado

```
Usuario {
  email: string
  nombre: string
  telefono: string
  area_interes: string
  password_hash: string        // SOLO en backend, nunca enviado al cliente
  rol: 'ALIADO' | 'ADMIN'
  bio?: string
  tags?: string[]
  fecha_registro: timestamp
}
```

## Backend confirmado

Usuarios en Postgres, verificación de contraseña en una función serverless de Vercel (nunca en el cliente) — ver `../06-stack-y-proceso.md`. El hashing debe hacerse con una librería pensada para contraseñas (`bcrypt` o `argon2`, con sal), no `SHA-256` plano como hacía el repo viejo.

## Pregunta abierta

¿Sesión vía JWT (cookie httpOnly) o vía tabla de sesiones en Postgres? Afecta cómo se implementa `bridge.setSessionToken`/logout en el nuevo backend. Recomendado por simplicidad y por poder revocar sesiones de verdad: tabla de sesiones en Postgres en vez de JWT autocontenido.
