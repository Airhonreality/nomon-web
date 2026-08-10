# Inicio (`/`)

Doc vivo — copy y estructura tomados tal cual del `LandingPage.jsx` real del repo viejo (contenido validado, no placeholder).

## Contenido real a preservar

- **Header**: logo oficial "Sociedad BIC" (Beneficio e Interés Colectivo) — SVG de marca, no imagen rasterizada.
- **Marca**: wordmark NOMON (SVG propio).
- **Tagline**: "Ideas que echan raíces, acciones que transforman."
- **Manifiesto** (párrafo con letra capital editorial): "Impulsamos la evolución de organizaciones y comunidades a través de una consultoría estratégica de alto impacto fundamentada en la integridad, programas de formación humana que trascienden el aula para fortalecer un liderazgo ético consciente, y la creación artística como motor de cohesión social."
- **CTAs**: "Únete a NOMON →" (abre `AuthModal` en modo registro si no hay sesión) / "Conoce más" (hoy navega a `/somos-nomon`, ruta que no existe en el mapa actual — ver pregunta abierta).

## Sección "Nuestros Nodos de Acción" (4 tarjetas)

| Nodo | Descripción |
|---|---|
| Gubernamental | Fortalecimiento institucional y políticas públicas basadas en integridad técnica. |
| Corporativo | Transformación de la cultura organizacional hacia la tecnología de la ética. |
| Académico | Investigación aplicada para la construcción de modelos de futuro sostenibles. |
| Jurídico | Blindaje legal y estatutario para la protección del propósito organizacional. |

## Decisión de diseño

Página 100% estática/hardcodeada en el componente — **no necesita schema ni CMS**. No hay hoy un segundo caso de uso de "inicio dinámico" que justifique modelarlo como dato. Si en el futuro aparece un segundo caso (ej. inicio distinto por campaña), se revisa esta decisión.

## Pregunta abierta

El CTA "Conoce más" apunta a `/somos-nomon`, que no está en el mapa de rutas confirmado (`00-estructura-del-sitio.md`). ¿Se agrega una página "Quiénes somos", se quita el botón, o se enlaza a otra sección existente (ej. `/simposio`)?
