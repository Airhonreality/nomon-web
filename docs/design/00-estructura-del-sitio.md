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
| `/correo` | Bandeja del correo corporativo | Requiere login + rol admin — ver [05-correo-aliados.md](05-correo-aliados.md) |

Login/registro no tiene ruta propia — es un modal (`AuthModal`) que se abre desde el botón "Ingresar" / "Únete a NOMON" en cualquier página. Se mantiene ese patrón porque ya funciona bien en el sitio actual.

**Fuera de alcance** (no se migra): rutas comerciales `/comercialFilbo`, `/comercialAuditoria` y todo lo asociado a pagos/feria del libro.

## Navegación (Navbar)

- Logo NOMON (SVG, marca) a la izquierda, navega a `/`.
- Links: Simposio, Recursos.
- A la derecha: toggle de tema claro/oscuro, y estado de sesión (botón "Ingresar" si no hay sesión, o email + botón "Salir" si la hay).

Esto reproduce el comportamiento real de `Navbar.jsx` del repo viejo, sin el sistema de links dinámicos vía schema (que solo tenía 1 link real: Simposio → `/presentacion`) — con 2-3 links fijos no hace falta que sean data-driven.

## Pregunta abierta

¿El listado de `/recursos` es nuevo (hoy no existe como pantalla — el repo viejo solo tiene acceso por slug directo, sin índice/listado)? Asumido que sí hace falta un listado para que "repositorio" tenga sentido como navegación real. Confirmar en [03-recursos.md](03-recursos.md).
