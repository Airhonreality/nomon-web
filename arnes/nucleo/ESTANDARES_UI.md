# ESTÁNDARES UI — NOMON

**Contrato vivo.** Estándares de diseño responsivo, UX y código para el proyecto NOMON. **Regla:** Todo componente UI debe cumplir con estos estándares. Si hay conflicto con otro documento, **gana este**.

**Fuentes:**
- `INS_Pantallas responsive y CSS.md` (estándares técnicos de grid, tipografía, rendimiento).
- `Practicas de codivo UX y responisve.md` (tokens de diseño, ergonomía táctil).

---

## 1. Principios de Diseño Responsivo

### 1.1 Mobile-First Indexing
- **Contexto:** Google usa la versión móvil como referencia principal para indexación y posicionamiento (completado el **31 de octubre de 2023**).
- **Implicación:** El diseño móvil **no es opcional**; es la base. El desktop es una mejora progresiva.
- **Regla para NOMON:** Todas las pantallas deben validarse primero en **320px de ancho** (iPhone SE).

### 1.2 Core Web Vitals
Los estándares de rendimiento de Google que impactan el SEO:

| Métrica | Umbral (Bueno) | Umbral (Necesita mejora) | Umbral (Malo) |
|---------|----------------|--------------------------|---------------|
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | 2.5s – 4.0s | > 4.0s |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |
| **INP (Interaction to Next Paint)** | ≤ 200ms | 200ms – 500ms | > 500ms |

**Optimizaciones para NOMON:**
- **LCP:**
  - Usar `fetchpriority="high"` en la imagen hero.
  - Formatos de última generación: **WebP** (fallback a JPEG).
  - Preload de fuentes críticas:
    ```html
    <link rel="preload" href="/fonts/futura.woff2" as="font" type="font/woff2" crossorigin />
    ```
- **CLS:**
  - Definir `aspect-ratio` en contenedores de imágenes:
    ```css
    .render-container {
      aspect-ratio: 16 / 9;
      width: 100%;
    }
    ```
- **INP:**
  - Evitar JavaScript bloqueante en el thread principal.
  - Usar `defer` en scripts no críticos.

---

## 2. Sistemas de Grid

### 2.1 Grid Fluido
**Patrón base para layouts en NOMON:**
```css
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: var(--spacing-md);
}
```
- **`min(100%, 320px)`:** Evita desborde en pantallas < 320px.

**Ejemplo (listado de recursos):**
```css
.recursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: var(--spacing-md);
}
```

### 2.2 Container Queries
**Permite que componentes se adapten a su contenedor padre:**
```css
.contenedor {
  container-type: inline-size;
  container-name: panel;
}

@container panel (width > 450px) {
  .tarjeta-interna {
    grid-template-columns: 1fr 2fr;
  }
}
```

**Degradación elegante:**
```css
.tarjeta-interna { display: flex; flex-direction: column; }
@supports (container-type: inline-size) {
  @container panel (width > 450px) {
    .tarjeta-interna { display: grid; grid-template-columns: 1fr 2fr; }
  }
}
```

### 2.3 CSS Subgrid
**Alineación de elementos internos en grids anidados:**
```css
.tarjetero-global {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-template-rows: repeat(3, auto);
}
.tarjeta-item {
  grid-row: span 3;
  display: grid;
  grid-template-rows: subgrid;
}
```

---

## 3. Tipografía Fluida

### 3.1 Función `clamp()`
**Fórmula general:** `clamp(V_min, V_pref, V_max)`

**Tokens para NOMON:**
```css
:root {
  --font-h1: clamp(2rem, calc(1.5rem + 1.5625vw), 3.5rem);
  --font-h2: clamp(1.75rem, calc(1.2955rem + 2.273vw), 3rem);
  --font-body: clamp(1rem, calc(0.8rem + 1vw), 1.25rem);
  
  --spacing-xs: clamp(0.5rem, calc(0.386rem + 0.57vw), 0.75rem);
  --spacing-sm: clamp(0.75rem, calc(0.522rem + 1.14vw), 1.25rem);
  --spacing-md: clamp(1.25rem, calc(0.909rem + 1.7vw), 2rem);
  --spacing-lg: clamp(2rem, calc(1.09rem + 4.55vw), 4rem);
}
```

---

## 4. Ergonomía Táctil

### 4.1 Hit Targets
| Proveedor | Tamaño mínimo | Separación mínima |
|-----------|---------------|-------------------|
| Apple | 44x44pt | 8px |
| Google | 48x48dp | 8px |
| **NOMON** | **48x48px** | **8px** |

**Ejemplo:**
```css
.boton {
  min-height: 48px;
  min-width: 48px;
  padding: 1rem 2rem;
  margin: 0.5rem;
}
```

### 4.2 Zonas del Pulgar
- **Zona verde (alta precisión):** Centro inferior.
- **Zona roja (baja precisión):** Esquinas.
- **Recomendación:** Botones primarios (CTA) en **zona verde**.

**Ejemplo:**
```css
.boton-descargar {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
```

### 4.3 Media Queries para Interacción
**Hover condicional:**
```css
@media not all and (hover: none) {
  .boton:hover { transform: translateY(-2px); }
}
```

**Pointer coarse (táctil):**
```css
@media (pointer: coarse) {
  .boton { padding: 1.25rem 2.25rem; }
}
```

### 4.4 Focus Visible
```css
.boton:focus-visible {
  outline: 2px solid var(--color-wood-raw);
  outline-offset: 2px;
}
```

---

## 5. Optimización de Imágenes

### 5.1 Formatos
| Formato | Uso en NOMON |
|---------|--------------|
| WebP | ✅ Imágenes generales |
| JPEG | Fallback para WebP |
| PNG | ✅ Logos, iconos |

**Ejemplo (fallback):**
```html
<picture>
  <source srcset="/assets/hero.webp" type="image/webp" />
  <img src="/assets/hero.jpg" alt="NOMON" fetchpriority="high" />
</picture>
```

### 5.2 Atributos Clave
```html
<img 
  src="/assets/recurso.jpg" 
  alt="Guía de Ética Empresarial" 
  width="800" 
  height="600" 
  fetchpriority="high"
  loading="lazy"
/>
```

---

## 6. Tokens de Diseño para NOMON

### 6.0 Sistema de Íconos (alto estándar)
**Librería:** `lucide-react` (tree-shaking por ícono, `currentColor`).

**Reglas:**
1. **Cero emojis hardcodeados en la UI.** Los emojis renderizan distinto por plataforma/SO y no heredan color ni peso tipográfico. Se reemplazan por íconos lucide.
2. **El color del ícono siempre es `currentColor`** — nunca se hardcodea color en el ícono; lo hereda del texto del control padre.
3. **El tamaño sale de la escala de tokens** (`--size-icon-*` en `globals.css` → utilidades `size-icon-*`). Prohibido `width`/`height` inline o tamaños fuera de escala.
4. **Accesibilidad:** ícono decorativo → `aria-hidden="true"`; ícono que comunica solo (sin texto acompañante) → `role="img"` + `aria-label`. El botón contenedor siempre lleva `aria-label`.

| Token | Valor | Uso |
|-------|-------|-----|
| `--size-icon-sm` | `0.875rem` (14px) | Indicadores densos: chips, badges, inline |
| `--size-icon-md` | `1rem` (16px) | Controles de toolbar, botones con texto |
| `--size-icon-lg` | `1.25rem` (20px) | Botones de ícono solo, controles de ventana |
| `--size-icon-xl` | `1.5rem` (24px) | Íconos prominentes |
| `--size-icon-hero` | `3rem` (48px) | Estados vacíos |

**Verificación:** `rg "[\x{1F000}-\x{1FAFF}\x{2190}-\x{27BF}]" app/src` no debe arrojar hits fuera de comentarios.

### 6.1 Paleta de Colores
| Token | Valor (HEX) | Valor (HSL) | Uso |
|-------|-------------|-------------|-----|
| `--color-bg-light` | `#FCFBF9` | `hsl(40, 30%, 98%)` | Fondo principal |
| `--color-bg-alt` | `#F3EFE9` | `hsl(38, 26%, 93%)` | Fondo alterno |
| `--color-wood-raw` | `#D7C4A5` | `hsl(37, 39%, 75%)` | Acento (madera) |
| `--color-text-main` | `#2B2B2B` | `hsl(0, 0%, 17%)` | Texto principal |
| `--color-text-sub` | `#7A7873` | `hsl(43, 4%, 46%)` | Texto secundario |
| `--color-contrast-luxury` | `#0A0A0A` | `hsl(0, 0%, 4%)` | Contraste (negro premium) |

### 6.2 Tipografía
| Token | Familia | Uso |
|-------|---------|-----|
| `--font-family` | `Futura BT, Century Gothic, Avenir Next, sans-serif` | Títulos y cuerpo |

---

## 7. Media Queries Estratégicas

### 7.1 Breakpoints
| Dispositivo | Ancho (px) | Columnas | Márgenes | Gutters |
|------------|-----------|----------|---------|---------|
| Smartphone | 0–479 | 4 | 16px | 16px |
| Tablet | 768–1023 | 8 | 32–40px | 16–24px |
| Desktop | 1280–1919 | 12 | 80–120px | 20–24px |

**Ejemplo:**
```css
@media (min-width: 768px) {
  .contenedor { max-width: 1140px; }
}
```

### 7.2 Altura de Filas en Tablas
| Tipo | Altura | Uso |
|------|--------|-----|
| Cómoda | 48–52px | Lectura detallada |
| Densa | 36–40px | Gran volumen de datos |

**Alineación:**
- **Izquierda:** Textos descriptivos.
- **Derecha:** Números, fechas, importes.
- **Centro:** Badges, iconos de estado.

---

## 8. Checklist de Verificación

### 8.1 Antes de Mergear a `dev`
- [ ] `npx lighthouse` → LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms.
- [ ] Todas las imágenes tienen `width`, `height`, y `alt`.
- [ ] Botones tienen `min-height: 48px` y `min-width: 48px`.
- [ ] Separación entre botones contiguos ≥ `8px`.
- [ ] `aspect-ratio` definido en contenedores de imágenes/videos.

### 8.2 Antes de Deploy a Producción
- [ ] Validar en **320px** (iPhone SE).
- [ ] Validar en **768px** (iPad).
- [ ] Validar en **1280px** (Desktop).
- [ ] Prueba de teclado: todos los elementos interactivos son accesibles.
- [ ] Prueba de lector de pantalla: contenido es legible.
