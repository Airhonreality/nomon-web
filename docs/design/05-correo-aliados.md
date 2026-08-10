# Correo corporativo y bandeja de aliados (`/correo`)

Doc vivo. Feature nueva (no existe en el repo viejo) — confirmada con el dueño del proyecto con este alcance exacto:

- **Un solo buzón corporativo** (ej. `contacto@rednomon.com`), no un correo por usuario registrado.
- Objetivo: enviar comunicaciones/cartas a **aliados** (la lista de `Usuario`/`Aliado` ya definida en `04-auth.md`).
- Se prioriza: la integración de correo + una UI simple de bandeja dentro del sitio. Nada más por ahora.

## Infraestructura de correo (fuera del código de la app)

Referencia: `../NOMON WEB/PLan correo dominio propio.md` documenta el plan original:
- **Recepción**: Cloudflare Email Routing → **Email Worker** → webhook en Vercel → Postgres (ya no pasa por Gmail).
- **Envío**: Resend (API de envío transaccional).

Con el stack confirmado (`../06-stack-y-proceso.md`: Vercel + Postgres + R2), esto encaja directo: la bandeja habla con una función serverless en Vercel, que llama a la API de Resend (la API key vive como variable de entorno en Vercel, nunca en el navegador) y guarda el histórico de mensajes en Postgres. No hace falta Cloudflare Worker aparte ni ningún backend adicional — es una función más del mismo backend de Vercel que ya sirve auth y recursos.

## Pantalla

- **Bandeja** (`/correo`, restringida a rol `ADMIN`): lista de mensajes (recibidos y enviados), con remitente/destinatario, asunto y fecha.
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

**Envío saliente:** `POST /api/correo/enviar` (rol ADMIN) → Resend (`RESEND_API_KEY`) → guarda en Postgres como `direccion: 'ENVIADO'`. Ambas escrituras pasan por el mismo backend serverless de Vercel ya existente (auth + recursos). No hace falta Cloudflare Worker aparte para envío ni billetera ni backend adicional.
