# Worker de correo entrante — `rednomon-email-handler`

Worker de Cloudflare que recibe los correos que llegan a `rednomon.com` (Email Routing), parsea el MIME y los reenvía como JSON al webhook de la app en Vercel.

```
Rednomon.com (Email Routing)
        │
        ▼
[Cliente] ──> x@rednomon.com ──> Cloudflare Email Worker
                                      │  parsea (postal-mime)
                                      ▼
                              POST /api/webhooks/incoming-email  (Vercel)
                                      │  Bearer WEBHOOK_SECRET
                                      ▼
                              Neon Postgres (tabla Mensaje, direccion=RECIBIDO)
```

## Deploy — `[SOLO_HUMANO]`

Requiere acceso al dashboard de Cloudflare (los secretos no pueden versionarse).

> ⚠️ **NO pegar `index.js` a mano en el dashboard.** `index.js:10` importa `postal-mime`,
> que es una dependencia externa. Si subes el código pegado sin bundle, el import falla
> silenciosamente y **ningún correo entrante llega a la bandeja**. Única vía correcta:
> `npx wrangler deploy` (o bundle manual de `postal-mime`).

1. **Crear el Worker:** Workers & Pages → Create → Worker. Nombre: `rednomon-email-handler`.
2. **Subir el código:** desde esta carpeta (`workers/email-handler/`):
   - `npm i postal-mime` (instala la dependencia local para bundling)
   - `npx wrangler deploy` (empaqueta `postal-mime` junto al Worker)
   - En modo dev puede reemplazarse por `npx wrangler dev` para pruebas.
3. **NO subir el código por el dashboard** (ver advertencia arriba).
4. **Verificación post-deploy:** cuando un correo real llegue a `contacto@rednomon.com`,
   `wrangler` desplegado debería invocar el webhook; si `/mail` no lo refleja, revisar
   las variables del Worker y que el deploy fue por `wrangler`, no pegado.
4. **Variables del Worker** (Settings → Variables):
   - `WEBHOOK_SECRET`: token secreto igual al de `WEBHOOK_SECRET` en Vercel.
   - `WEBHOOK_URL`: `https://rednomon.com/api/webhooks/incoming-email` (o la URL preview en dev).
5. **Email Routing** (Correo electrónico → Email Routing → Reglas de enrutamiento):
   - Acción: *Send to a Worker*.
   - Worker: `rednomon-email-handler`.
   - Dirección: `*@rednomon.com` (o solo `contacto@rednomon.com`).
6. **Verificar DNS:** el registro MX y los registros de verificación que Cloudflare genere para el dominio.
7. **Probar:** enviar un mail de prueba a `contacto@rednomon.com` y comprobar que aparece en la bandeja de `/mail` (tras iniciar sesión con una cuenta `@rednomon.com`).

## Variables de entorno en Vercel

- `WEBHOOK_SECRET`: el mismo valor que la variable del Worker (esta vez en Vercel).
- `RESEND_API_KEY`: clave de la API de Resend (para el envío saliente).

## Dependencia

- `postal-mime`: parseo de correo MIME en el Worker (se instala/bundlea en el deploy, no en el repo).