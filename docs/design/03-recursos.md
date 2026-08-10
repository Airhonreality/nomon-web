# Recursos / Repositorio (`/recursos`, `/recursos/:slug`)

Doc vivo. Es la parte del sitio con contenido genuinamente dinámico — el único lugar donde un sistema de datos (no JSX hardcodeado) tiene sentido, porque el catálogo de recursos crece con el tiempo.

## Qué es

Una biblioteca de recursos (documentos, artículos, materiales) con ficha bibliográfica y, opcionalmente, acceso restringido. Viene de `MateriaDetail.jsx` del repo viejo — el patrón ya es sólido, se simplifica la implementación (sin el sistema genérico "Materia" que servía cualquier tipo de contenido, aquí solo modelamos recursos de biblioteca).

## Schema de un Recurso

```
Recurso {
  slug: string                 // identificador en la URL
  titulo: string
  imagen?: string
  metadata: {
    autor?: string
    editorial?: string
    anio?: string
    doi_isbn?: string
    licencia?: string          // ej. "CC BY-NC"
    idioma?: string
    curador?: string           // quién lo seleccionó
    razon_nomon?: string       // por qué NOMON lo incluye
  }
  pdf_url?: string              // enlace al recurso digital, almacenado en Cloudflare R2
  acceso: {
    estrategia: 'PUBLICO' | 'SOLO_REGISTRADOS' | 'LISTA_BLANCA'
    lista_blanca_ref?: string   // si estrategia = LISTA_BLANCA, referencia a la lista de emails autorizados
    titulo_restringido?: string
    mensaje_restringido?: string
  }
  contenido?: Bloque[]          // cuerpo compuesto (texto, imágenes) — ver nota abajo
  relaciones?: { slug: string, label: string }[]  // recursos relacionados
}
```

## Control de acceso (comportamiento real a preservar)

- `PUBLICO`: cualquiera lo ve.
- `SOLO_REGISTRADOS`: cualquier usuario con sesión iniciada lo ve.
- `LISTA_BLANCA`: solo usuarios cuyo email (hasheado) esté en una lista específica — hoy usado para contenido de alta sensibilidad.

Si no está autorizado, se muestra un mensaje de "contenido reservado" en vez del recurso.

## Pantallas

1. **Listado `/recursos`** — grilla/lista de recursos disponibles (título, autor, año, badge si está restringido). **Es pantalla nueva** — hoy el repo viejo no tiene un índice, solo acceso directo por slug. Necesaria para que "repositorio" sea navegable, no solo enlazable.
2. **Detalle `/recursos/:slug`** — ficha bibliográfica completa + botón de acceso al PDF si aplica + contenido compuesto + recursos relacionados. Reproduce `MateriaDetail.jsx`.

## Decisión de diseño

Se elimina el "Materia Composer" genérico capaz de renderizar cualquier tipo de bloque (texto, markdown, radial, workflow, etc. — era el motor detrás del panel Forja). Un recurso de biblioteca necesita: texto descriptivo + imágenes + PDF. Eso se modela directo, sin motor de bloques genérico, salvo que aparezca un segundo tipo de contenido real que lo justifique.

## Backend confirmado

Ficha de cada recurso en Postgres; PDFs e imágenes en Cloudflare R2 (la app guarda solo la URL/key del objeto en R2, no el archivo). Ver `../06-stack-y-proceso.md`.

## Pregunta abierta

¿Quién carga nuevos recursos al repositorio — un formulario simple dentro del sitio (admin, que suba el archivo a R2 y cree la fila en Postgres), o se edita directamente la base de datos? Afecta si hace falta una pantalla de administración además de listado+detalle.
