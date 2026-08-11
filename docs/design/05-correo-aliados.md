# NOMON Mail (`/mail`)

Doc vivo. Servicio paralelo de solo mail dentro del sitio — buzón corporativo único de `@rednomon.com`.

## Decisión (2026-08-10)

Hubo una contradicción entre "login de miembros" y "login al correo": el buzón es una herramienta operativa del dueño, no un servicio de socio. Se resuelve con:

- Ruta separada: `/mail` (bandeja) y `/mail/login` (puerta).
- Cookie de sesión propia: `nomon_mail`. Solo `requireMailAccess` la lee.
- Acceso restringido por **dominio corporativo** (`@rednomon.com`): lo exige `/api/auth/mail-login` y lo vuelve a exigir el middleware en `/mail/**`.

Los aliados no ven enlaces a `/mail` en ningún lado del sitio público. Ver [04-auth.md](04-auth.md) para la separación de dominios de sesión.

## Alcance

- **Un solo buzón corporativo** (ej. `contacto@rednomon.com`), no un correo por usuario registrado.
- Objetivo: enviar comunicaciones/cartas a **aliados** (la lista de `Usuario`/`Aliado` ya definida en `04-auth.md`).
- Se prioriza: la integración de correo + una UI simple de bandeja. Nada más por ahora.

## Infraestructura de correo (fuera del código de la app)

- **Recepción**: Cloudflare Email Routing → **Email Worker** → webhook en Vercel → Postgres.
- **Envío**: Resend (API de envío transaccional).

Con el stack confirmado (`../06-stack-y-proceso.md`: Vercel + Postgres + R2), encaja directo: la bandeja habla con una función serverless en Vercel, que llama a la API de Resend (la API key vive como variable de entorno en Vercel, nunca en el navegador) y guarda el histórico de mensajes en Postgres.

## Pantalla

- **Bandeja** (`/mail`, restringida a correo `@rednomon.com`): lista de mensajes (recibidos y enviados), con remitente/destinatario, asunto y fecha.
- **Detalle de mensaje**: cuerpo completo.
- **Compositor**: redactar/responder, seleccionando destinatario idealmente desde la lista de aliados ya registrados (no un campo de email libre exclusivamente — aunque debe permitir ambos).

## Schema de Mensaje

```
Mensaje {
  id: string
  messageId?: string          // id del mensaje en el proveedor (dedup)
  direccion: 'ENVIADO' | 'RECIBIDO'
  de: string
  para: string
  asunto: string
  cuerpo: string              // texto plano
  cuerpoHtml?: string         // HTML original recibido
  aliado_ref?: string         // email del Usuario/Aliado si el destinatario/remitente es uno registrado
  fecha: timestamp
}
```

## Recepción de correo entrante (decisión tomada)

Los correos **recibidos** NO pasan por Gmail. Cloudflare Email Routing envía cada mensaje a un **Email Worker** (`workers/email-handler/`, versionado en este repo) que parsea el MIME con `postal-mime` y hace `POST` a la ruta protegida `/api/webhooks/incoming-email` de la app (Bearer `WEBHOOK_SECRET`). Esa función serverless guarda el mensaje en Postgres con `direccion: 'RECIBIDO'`, deduplicando por `messageId`.

```
Cliente ──> contacto@rednomon.com ──> Cloudflare Email Worker (postal-mime)
                                          │
                                          ▼
                          POST /api/webhooks/incoming-email (Vercel, Bearer WEBHOOK_SECRET)
                                          │
                                          ▼
                              Neon Postgres (Mensaje, direccion RECIBIDO)
```

**⚠️ Advertencia operativa del Worker:** `workers/email-handler/index.js` importa `postal-mime`. Si se pega el archivo a mano en el dashboard de Cloudflare, `postal-mime` no viaja y falla silenciosamente. El Worker debe desplegarse con `npx wrangler deploy` desde `workers/email-handler/` para que sus dependencias se empaqueten. Ver `workers/email-handler/README.md`.

**Envío saliente:** `POST /api/correo/enviar` (correo `@rednomon.com` vía cookie `nomon_mail`) → Resend (`RESEND_API_KEY`) → guarda en Postgres como `direccion: 'ENVIADO'`. Ambas escrituras pasan por el mismo backend serverless de Vercel ya existente.
