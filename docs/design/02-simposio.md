# Simposio (`/simposio`)

Doc vivo. El Simposio Internacional de Ética es el producto insignia actual de NOMON — el deck ya tiene contenido real y completo (no placeholder), tomado de `InteractiveDeck.jsx` / `local_database.json` del repo viejo.

## Contenido real (12 slides, todos con copy final)

1. **Portada**: "SIMPOSIO INTERNACIONAL DE ÉTICA" — "Protocolos de Integridad para la Supervivencia multi especie y la Sustentabilidad Sistémica."
2. **Marco Teórico**
3. **Justificación**
4. **Objetivo General**
5. **Sector Empresarial** (3 objetivos específicos)
6. **Sector Público** (3 objetivos específicos)
7. **Jurídico-Penal** (3 objetivos específicos + 4 escarapelas/badges con foto de panelistas reales)
8. **Sector Académico** (3 objetivos específicos)
9. **Fuerza Pública** (2 objetivos específicos)
10. **Metodología** (investigación-creación)
11. **Hub de Profesionales (I)** — 6 personas/entidades reales con rol y descripción
12. **Hub de Profesionales (II)** — 6 personas/entidades reales con rol y descripción
13. **Galería** — 5 fotos del evento en Barranquilla

Todos los textos completos (incluyendo los "Leer más" extendidos) ya existen y se migran literal — no hay que redactar contenido nuevo, solo transportarlo.

## Schema de una slide

```
Slide {
  id: string
  title: string
  subtitle?: string
  content?: string            // texto corto de la columna derecha
  readMoreTitle?: string       // título del modal "leer más"
  readMoreContent?: string     // texto largo del modal
  bullets?: string[]           // viñetas (soportan **negrita** en markdown simple)
  nodes?: { role: string, desc: string }[]   // hub de profesionales
  badges?: { name: string, role: string, image: string }[]  // escarapelas
  gallery?: string[]           // rutas de imágenes
  accent: string                // color hex de acento de la slide
}
```

## Pantalla

Layout de 2 columnas (izquierda: título grande + índice desplegable + navegación; derecha: contenido de la slide activa). Navegación por click, teclado (flechas) y swipe táctil. Modal para el contenido "Leer más". Reproduce el comportamiento ya validado del deck actual — es una pantalla que ya funciona bien, se migra el comportamiento, no se rediseña desde cero.

## Decisión pendiente: ¿estático o editable?

Hoy el deck es editable in-app (un botón oculto permite a usuarios logueados o en localhost editar texto/viñetas/actores y guardar de vuelta al backend). Esto añade la complejidad de un editor completo dentro del componente de vista.

**Pregunta abierta**: ¿se necesita seguir editando el deck sin re-deploy (justifica el editor en vivo), o el contenido del Simposio ya está prácticamente cerrado y conviene versionarlo como datos estáticos en el repo (más simple, sin necesidad de backend ni editor)? Esto decide si "recursos/repositorio" (el sistema de contenido dinámico real, ver `03-recursos.md`) es la única parte del sitio con contenido editable en vivo, o si el Simposio también lo necesita.
