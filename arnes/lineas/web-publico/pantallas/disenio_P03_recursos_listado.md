# Diseño: Recursos — Listado (P03)

**ID:** P03
**Pantalla:** `/recursos`
**Línea:** web-publico
**Prioridad:** Alta (biblioteca pública de NOMON)
**Estado:** En diseño

---

## 1. Entidades que consume

| Entidad | § en REGISTRO_DE_ENTIDADES | Uso en esta pantalla | Campos usados |
|---------|-----------------------------|----------------------|---------------|
| `Recurso` | §2 | Listado de ítems de la biblioteca | `id`, `slug`, `titulo`, `imagen`, `acceso.estrategia` |
| `RecursoMetadata` | §2 | Datos bibliográficos mostrados en cada tarjeta | `autor`, `anio`, `editorial`, `idioma` |
| `RecursoAcceso` | §2 | Validación de acceso para `LISTA_BLANCA` | `email` (solo backend) |
| `Usuario` / `Sesion` | §1 | Filtrar visibilidad según sesión activa | `email`, `rol` |

**Verificación:**
```bash
grep -n "Recurso\|RecursoMetadata\|RecursoAcceso" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 2. Estados que transiciona

| Origen | Acción | Destino | Gate | § en REGISTRO_DE_ENTIDADES |
|--------|--------|---------|------|-----------------------------|
| `no_autenticado` | Ver listado | Muestra solo `PUBLICO` (los demás con badge "Requiere sesión") | — | §2 |
| `autenticado` | Ver listado | Muestra `PUBLICO` + `SOLO_REGISTRADOS` + `LISTA_BLANCA` (si email autorizado) | E-02 | §2 |
| Cualquiera | Click en tarjeta | Navega a `/recursos/:slug` (P04) | — | §2 |
| Cualquiera | Aplicar filtro | Lista filtrada por `acceso.estrategia` | — | §2 |

**Verificación:**
```bash
grep -n "PUBLICO\|SOLO_REGISTRADOS\|LISTA_BLANCA" arnes/nucleo/glosario.md
```

---

## 3. Vocabulario H07

| Label natural (UI) | Código interno | § en glosario |
|--------------------|----------------|---------------|
| "Público" | `PUBLICO` | §2.2 (Estados de Recurso) |
| "Solo registrados" | `SOLO_REGISTRADOS` | §2.2 |
| "Lista blanca" | `LISTA_BLANCA` | §2.2 |
| "Título" | `titulo` | §4.2 (Recurso) |
| "Autor" | `metadata.autor` | §4.2 |
| "Año" | `metadata.anio` | §4.2 |
| "Ver detalle" | `detallar` | §3 (Verbos) |
| "Descargar PDF" | `descargar` | §3 (Verbos) |
| "Todos" | `all` | — |
| "Filtrar por acceso" | `filtro_acceso` | — |

**Verificación:**
```bash
grep -n "PUBLICO\|SOLO_REGISTRADOS\|LISTA_BLANCA\|autor\|anio" arnes/nucleo/glosario.md
```

---

## 4. Reglas de negocio

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | Recursos `PUBLICO` son visibles para todos | `acceso.estrategia === 'PUBLICO'` | Test: `expect(recursosFiltrados).toContainEqual(recursoPublico)` sin sesión |
| R2 | Recursos `SOLO_REGISTRADOS` visibles solo con sesión válida | `sesionValida(usuario) && acceso.estrategia === 'SOLO_REGISTRADOS'` | Test: `expect(recursosFiltrados).not.toContainEqual(recursoSoloRegistrados)` sin sesión |
| R3 | Recursos `LISTA_BLANCA` visibles solo si `Usuario.email` está en `RecursoAcceso` | `emailEnListaBlanca(usuario.email, recurso.id)` | Test: `expect(recursosFiltrados).toContainEqual(recursoListaBlanca)` con email autorizado |
| R4 | Cada tarjeta muestra un badge de color según `acceso.estrategia` | `PUBLICO` = verde, `SOLO_REGISTRADOS` = amarillo, `LISTA_BLANCA` = rojo | Inspección visual |
| R5 | Sin sesión, los recursos `SOLO_REGISTRADOS` y `LISTA_BLANCA` muestran badge "Requiere sesión" en vez de ocultarse | `!sesionValida && acceso !== 'PUBLICO'` | Inspección visual |
| R6 | El filtro "Todos" muestra todos los recursos accesibles según sesión | `filtro === 'all'` | Test: `expect(recursosFiltrados.length).toBe(totalAccesibles)` |

---

## 5. Componentes UI

| Componente | Props | Entidad asociada | § en REGISTRO_DE_ENTIDADES |
|-----------|-------|------------------|-----------------------------|
| `RecursoCard` | `{ recurso: Recurso, metadata: RecursoMetadata, requiereSesion: boolean, onClick: () => void }` | `Recurso`, `RecursoMetadata` | §2 |
| `RecursoGrid` | `{ recursos: Recurso[], usuario?: Usuario }` | `Recurso` | §2 |
| `Filtros` | `{ opciones: FiltroOpcion[], activo: string, onChange: (valor: string) => void }` | — | — |
| `AccesoBadge` | `{ estrategia: 'PUBLICO' | 'SOLO_REGISTRADOS' | 'LISTA_BLANCA', requiereSesion: boolean }` | `Recurso` | §2 |
| `EstadoVacio` | `{ mensaje: string, accion?: { label: string, onClick: () => void } }` | — | — |

**Tipos:**
```typescript
interface FiltroOpcion {
  valor: 'all' | 'PUBLICO' | 'SOLO_REGISTRADOS' | 'LISTA_BLANCA';
  label: string;
}
```

---

## 6. Comportamiento

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `load` | Carga de `/recursos` | Fetch de recursos desde `lib/data/recursos.ts` (hardcodeado) | Renderiza `RecursoGrid` | Grid visible con tarjetas |
| `click` | Botón de filtro | Actualiza estado `filtroActivo` | Re-renderiza grid filtrado | Solo tarjetas del filtro seleccionado visibles |
| `click` | Tarjeta de recurso | Navega a `/recursos/:slug` | URL cambia | `expect(window.location.pathname).toBe('/recursos/<slug>')` |
| `click` | Tarjeta con `requiereSesion = true` | Abre `AuthModal` (mode: 'login') | Modal visible | `expect(authModal).toBeVisible()` |
| `session_change` | Login/logout | Re-evalúa visibilidad de recursos | Grid actualizado | Tarjetas `SOLO_REGISTRADOS` aparecen/desaparecen |

---

## 7. Criterios de aceptación

1. **Schema válido:**
   - Los tipos `Recurso`, `RecursoMetadata`, `RecursoAcceso` validan con `npx tsc --noEmit`.
   - **Verificación:** `npx tsc --noEmit` (sin errores).

2. **UI funcional:**
   - La pantalla `/recursos` renderiza sin errores.
   - **Verificación:** `npm run dev` + inspección visual.

3. **Filtrado correcto:**
   - Sin sesión: solo `PUBLICO` visible, los demás muestran badge "Requiere sesión".
   - Con sesión: `PUBLICO` + `SOLO_REGISTRADOS` + `LISTA_BLANCA` (si autorizado).
   - **Verificación:** Prueba manual con/sin sesión.

4. **Badges de acceso:**
   - `PUBLICO` = badge verde con texto "Público".
   - `SOLO_REGISTRADOS` = badge amarillo con texto "Solo registrados".
   - `LISTA_BLANCA` = badge rojo con texto "Lista blanca".
   - **Verificación:** Inspección visual.

5. **Navegación:**
   - Click en tarjeta navega a `/recursos/:slug`.
   - Click en tarjeta con `requiereSesion` abre modal de login.
   - **Verificación:** Inspección visual + consola (sin errores 404).

6. **Estado vacío:**
   - Si el filtro no devuelve resultados, muestra `EstadoVacio` con mensaje "No hay recursos que coincidan con este filtro".
   - **Verificación:** Inspección visual.

7. **Responsive:**
   - Grid de 1 columna en mobile (320px), 2 columnas en tablet (768px), 3 columnas en desktop (1280px).
   - **Verificación:** Inspección visual en diferentes resoluciones.

---

## 8. Estándares de UI/UX

**Referencia:** `arnes/nucleo/ESTANDARES_UI.md`.

| Estándar | Aplicación en esta pantalla | § en ESTANDARES_UI.md | Verificación |
|-----------|-------------------------------|-----------------------|--------------|
| Grid fluido | `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` para `RecursoGrid` | §2.1 | Inspección visual en 320px |
| Tipografía fluida | Títulos de tarjeta con `clamp(1rem, 2vw, 1.25rem)` | §3.1 | Inspección visual |
| Hit targets | Tarjetas completas clickeables, área ≥ 48x48px | §4.1 | Medición con DevTools |
| Separación táctil | ≥ 16px entre tarjetas | §4.1 | Medición con DevTools |
| Container Queries | `RecursoCard` se adapta a su contenedor en el grid | §2.2 | Inspección visual |
| Optimización de imágenes | Imágenes de portada en WebP con fallback, `loading="lazy"` | §5.1 | Lighthouse (LCP) |
| Media Queries | Breakpoints en 768px (2 columnas) y 1280px (3 columnas) | §7.1 | Inspección visual |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/recursos --output=json | grep -E "(lcp|cls|inp)"
```

---

## 9. Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`.

| Principio | Aplicación en esta pantalla | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|-------------------------------|-------------------------------|--------------|
| Affordances | Tarjetas con sombra sutil y cursor pointer sugieren clickeabilidad | §1.1 | Inspección visual |
| Ley de Fitts | Tarjetas grandes (≥ 320px ancho) fáciles de alcanzar | §1.2 | Medición de tamaño |
| Patrón Layer-Cake | Filtros arriba, grid en el medio, paginación abajo | §2.2 | Inspección visual |
| Carga cognitiva | ≤ 9 tarjetas visibles por página (3x3 en desktop) | §4.1 | Conteo de elementos |
| Jerarquía visual | Título > Autor > Año > Badge (tamaño y peso decreciente) | §5.1 | Inspección visual |
| Alineación de datos | Año alineado a la derecha, título a la izquierda | §5.2 | Inspección visual |
| Feedback inmediato | Tarjeta tiene efecto `:hover` (sombra elevada) en < 100ms | §4.3 | Prueba manual |
| Agrupación | Tarjetas del mismo filtro se agrupan visualmente | §4.1 | Inspección visual |

**Verificación general:**
- Prueba de usuario: ¿5 usuarios pueden encontrar un recurso específico en ≤ 15 segundos?
- Prueba de tiempo: ¿Tiempo promedio para aplicar un filtro ≤ 3 segundos?

---

## 10. SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`.

| Requisito | Aplicación en esta pantalla | § en SEO_TECNICO.md | Verificación |
|-----------|-------------------------------|---------------------|--------------|
| JSON-LD | Schema `CollectionPage` + `ItemList` con los recursos | §2 | Schema Markup Validator |
| Meta tags | `title`: "Recursos — Biblioteca NOMON" (≤ 60 caracteres) | §4.1 | `npx seo-check` |
| Meta tags | `description`: "Biblioteca de recursos sobre ética aplicada para sectores gubernamentales, corporativos, académicos y jurídicos." (≤ 160 caracteres) | §4.1 | `npx seo-check` |
| Open Graph | `og:title`, `og:description`, `og:image` (imagen genérica de biblioteca) | §4.2 | Facebook Sharing Debugger |
| Twitter Cards | `twitter:card=summary_large_image`, `twitter:title`, `twitter:description` | §4.3 | Twitter Card Validator |
| Semántica HTML | `h1`: "Biblioteca de Recursos", `h2`: nombre de cada recurso en la tarjeta | §4.1 | Inspección de DOM |
| Imágenes | Cada portada tiene `alt="Portada de <titulo>"`, `width`, `height` | §4.1 | Inspección de DOM |
| Enlaces | Cada tarjeta es un `<a>` con texto descriptivo (no "haz clic aquí") | §4.1 | Inspección de DOM |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/recursos --output=json | grep -E "(seo|score)"
```

---

## 📌 Notas

### Decisiones de diseño:
1. **Datos hardcodeados:** Los recursos se cargan desde `lib/data/recursos.ts` (mismo patrón que Simposio). Se incluyen 3-5 recursos de ejemplo cubriendo las 3 estrategias de acceso.
2. **Filtrado por estrategia:** El usuario puede filtrar por "Todos", "Público", "Solo registrados", "Lista blanca".
3. **Badge de acceso:** Cada tarjeta muestra un badge de color según la estrategia de acceso del recurso.
4. **Recursos restringidos sin sesión:** En vez de ocultar los recursos `SOLO_REGISTRADOS` y `LISTA_BLANCA` cuando no hay sesión, se muestran con un badge "Requiere sesión" y al hacer click abren el modal de login. Esto genera curiosidad y conversión.
5. **Grid responsivo:** 1 columna en mobile, 2 en tablet, 3 en desktop.

### Prioridades de implementación:
1. **MVP:** Grid + tarjetas + filtrado básico.
2. **V1:** Añadir paginación si hay más de 9 recursos.
3. **V2:** Añadir búsqueda por texto en título/autor.

### Dependencias:
- **`AuthModal`:** Requiere que la pantalla `P05_auth.md` esté implementada (para el click en tarjeta restringida).
- **`/recursos/:slug`:** Requiere que la pantalla `P04_recursos_detalle.md` esté implementada (para la navegación).

---

## 📄 Estructura de Archivos

```
app/
├── (public)/
│   └── recursos/
│       └── page.tsx                # P03: Listado de Recursos
lib/
├── data/
│   └── recursos.ts                 # Datos hardcodeados (3-5 recursos)
└── components/
    ├── RecursoCard.tsx
    ├── RecursoGrid.tsx
    ├── Filtros.tsx
    ├── AccesoBadge.tsx
    └── EstadoVacio.tsx
```

---

## 🔗 Referencias
- [PLANTILLA_PANTALLA.md](./PLANTILLA_PANTALLA.md)
- [ESTANDARES_PANTALLA.md](./ESTANDARES_PANTALLA.md)
- [REGISTRO_DE_ENTIDADES.md](../../nucleo/REGISTRO_DE_ENTIDADES.md)
- [glosario.md](../../nucleo/glosario.md)
- [ESTANDARES_UI.md](../../nucleo/ESTANDARES_UI.md)
- [ERGONOMIA_COGNITIVA.md](../../nucleo/ERGONOMIA_COGNITIVA.md)
- [SEO_TECNICO.md](../../nucleo/SEO_TECNICO.md)
