# Auth y Perfil (`/perfil`)

Doc vivo. Comportamiento base tomado de `AuthModal.jsx`/`IdentityProfile.jsx` del repo viejo — **con un problema de seguridad real detectado que no se migra tal cual**.

## Decisión: dos dominios de sesión separados (2026-08-10)

Hubo una contradicción ontológica entre "login de miembros" y "login al correo":
el buzón corporativo es una herramienta operativa del dueño, no un servicio de socio.
Se resuelve con dos puertas y dos cookies independientes:

- **Membresía** (`/login`): usuarios aliados con rol `ALIADO`, cookie `nomon_session`.
  Ruta existente pero **oculta de la UI pública** mientras no haya panel de usuario diseñado.
- **NOMON Mail** (`/mail`, `/mail/login`): solo correos `@rednomon.com`, cookie `nomon_mail`.
  Es un servicio paralelo de solo mail, con URL y sesión separadas; los aliados no la ven.

El middleware exige la cookie de su dominio en cada árbol: `nomon_session` para rutas privadas del sitio, `nomon_mail` para `/mail/**`. Ver [05-correo-aliados.md](05-correo-aliados.md) para el detalle del buzón.

## Comportamiento a preservar

- Registro con: nombre completo, teléfono, área/rama de interés, email (+confirmación), contraseña (+confirmación, mínimo 6 caracteres). Rol asignado: `ALIADO`.
- Login con: email + contraseña.
- Perfil (`/perfil`): nombre, email, rol, biografía editable, tags de interés editables.
- Mientras no exista `/perfil` real, la UI pública no expone enlaces a `/login` ni a `/register` (oculto, no eliminado).

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

El rol `ADMIN` se conserva como campo del esquema (se sigue creando al menos un admin por seed para tareas internas), pero la autorización real al buzón `NOMON Mail` se hace por **dominio de correo** (`@rednomon.com`), no por rol — eso es lo que valida `requireMailAccess` en [05-correo-aliados.md](05-correo-aliados.md).

## Backend confirmado

Usuarios en Postgres, verificación de contraseña en una función serverless de Vercel (nunca en el cliente) — ver `../06-stack-y-proceso.md`. El hashing debe hacerse con una librería pensada para contraseñas (`bcrypt` o `argon2`, con sal), no `SHA-256` plano como hacía el repo viejo.

Tabla de sesiones en Postgres (no JWT autocontenido) para poder revocarlas de verdad.
