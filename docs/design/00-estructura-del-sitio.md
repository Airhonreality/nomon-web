# Estructura del sitio

Doc vivo — mapa de páginas y navegación para el alcance confirmado. Se actualiza si el alcance cambia.

## Mapa de páginas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio (4 nodos) | Público |
| `/simposio` | Deck del Simposio Internacional de Ética | Público (edición restringida) |
| `/recursos` | Listado de la biblioteca de recursos | Público (algunos ítems pueden requerir login) |
| `/recursos/:slug` | Detalle de un recurso | Depende del `access.strategy` del recurso — ver [03-recursos.md](03-recursos.md) |
| `/perfil` | Perfil del usuario autenticado | Requiere login |
| `/mail` | Bandeja de NOMON Mail (correo corporativo) | Sesión `nomon_mail` + correo `@rednomon.com` — ver [05-correo-aliados.md](05-correo-aliados.md) |
| `/mail/login` | Puerta del correo corporativo | Pública (sin sesión) |

Login de usuarios existe en `/login` y `/register` (rutas vivas) pero **no se promociona** en la UI pública mientras no haya panel de usuario diseñado; ver [04-auth.md](04-auth.md).

**Fuera de alcance** (no se migra): rutas comerciales `/comercialFilbo`, `/comercialAuditoria` y todo lo asociado a pagos/feria del libro.

## Navegación (Navbar)

- Logo NOMON (SVG, marca) a la izquierda, navega a `/`.
- Links: Simposio, Recursos.
- En el sitio público no se exponen enlaces a `/login` ni a `/mail` — `/mail` es un servicio paralelo de solo mail, y `/login` no tiene panel de usuario diseñado todavía.

Esto reproduce el comportamiento real de `Navbar.jsx` del repo viejo, sin el sistema de links dinámicos vía schema (que solo tenía 1 link real: Simposio → `/presentacion`) — con 2-3 links fijos no hace falta que sean data-driven.

## Pregunta abierta

¿El listado de `/recursos` es nuevo (hoy no existe como pantalla — el repo viejo solo tiene acceso por slug directo, sin índice/listado)? Asumido que sí hace falta un listado para que "repositorio" tenga sentido como navegación real. Confirmar en [03-recursos.md](03-recursos.md).
