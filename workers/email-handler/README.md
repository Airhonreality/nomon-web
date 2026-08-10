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

1. **Crear el Worker:** Workers & Pages → Create → Worker. Nombre: `rednomon-email-handler`.
2. **Subir el código:** Editar código y pegar el contenido de `index.js`.
3. **Procesar para producción:** por la API de postal-mime hace falta hacer un bundle de `postal-mime` con el Worker:
   `npm i postal-mime` y `npx wrangler deploy` desde esta carpeta (o el bundle manual que Expose el dashboard de Cloudflare).
4. **Variables del Worker** (Settings → Variables):
   - `WEBHOOK_SECRET`: token secreto igual al de `WEBHOOK_SECRET` en Vercel.
   - `WEBHOOK_URL`: `https://rednomon.com/api/webhooks/incoming-email` (o la URL preview en dev).
5. **Email Routing** (Correo electrónico → Email Routing → Reglas de enrutamiento):
   - Acción: *Send to a Worker*.
   - Worker: `rednomon-email-handler`.
   - Dirección: `*@rednomon.com` (o solo `contacto@rednomon.com`).
6. **Verificar DNS:** el registro MX y los registros de verificación que Cloudflare genere para el dominio.
7. **Probar:** enviar un mail de prueba a `contacto@rednomon.com` y comprobar que aparece en la bandeja de `/correo`.

## Variables de entorno en Vercel

- `WEBHOOK_SECRET`: el mismo valor que la variable del Worker (esta vez en Vercel).
- `RESEND_API_KEY`: clave de la API de Resend (para el envío saliente).

## Dependencia

- `postal-mime`: parseo de correo MIME en el Worker (se instala/bundlea en el deploy, no en el repo).