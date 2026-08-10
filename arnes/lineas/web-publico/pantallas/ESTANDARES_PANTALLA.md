# ESTANDARES_PANTALLA — Checklist de UI/UX/SEO

**Contrato vivo.** Este documento define el **checklist mínimo obligatorio** que toda pantalla (P-XX) debe cumplir antes de ser aprobada. Basado en:
- `ESTANDARES_UI.md` (UI/UX técnico)
- `ERGONOMIA_COGNITIVA.md` (usabilidad)
- `SEO_TECNICO.md` (optimización para motores de búsqueda)

**Regla:** Si una pantalla no pasa **todos** los checks de este documento, **no se aprueba**.

---

## 📋 Checklist General (Pre-Flight)

**Ejecutar antes de cualquier revisión:**

- [ ] **TypeScript:** `npx tsc --noEmit` (sin errores).
- [ ] **Biome:** `npx biome check .` (sin errores).
- [ ] **Build:** `npx next build` (sin errores).
- [ ] **Tests:** `npx vitest run` (todos pasan).
- [ ] **Lighthouse:** Score ≥ 90 en Performance, Accessibility, Best Practices, SEO.

**Comando rápido:**
```bash
npx tsc --noEmit && npx biome check . && npx next build && npx vitest run
```

---

## 🎨 Sección 8: Estándares de UI/UX

**Referencia:** `arnes/nucleo/ESTANDARES_UI.md`

### 8.1 Layout y Grid
- [ ] **Grid fluido:** Usar `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` para layouts de tarjetas.
- [ ] **Container Queries:** Componentes se adaptan a su contenedor padre (ej: `@container (min-width: 400px)`).
- [ ] **Subgrid:** Elementos internos heredan alineación del grid padre (ej: `grid-template-columns: subgrid`).
- [ ] **Breakpoints estratégicos:** Solo 2 breakpoints principales (768px y 1280px).
- [ ] **Mobile-first:** Estilos base para mobile, media queries para desktop.

**Verificación:**
```bash
# Inspeccionar en Chrome DevTools (Ctrl+Shift+M para toggle device toolbar)
# Probar en: 320px, 768px, 1280px
```

### 8.2 Tipografía
- [ ] **Tipografía fluida:** Títulos usan `clamp(min, preferred, max)` (ej: `clamp(1.5rem, 4vw, 2.5rem)`).
- [ ] **Tokens de espaciado:** Usar variables CSS para espaciado (ej: `--space-sm: 0.5rem`).
- [ ] **Jerarquía tipográfica:** `h1` > `h2` > `h3` > `p` con tamaños y pesos diferenciados.
- [ ] **Line-height:** ≥ 1.5 para texto cuerpo, ≥ 1.2 para títulos.
- [ ] **Contraste:** Texto tiene ratio de contraste ≥ 4.5:1 (WCAG AA).

**Verificación:**
```bash
# Usar DevTools > Accessibility > Contrast ratio
```

### 8.3 Elementos Interactivos
- [ ] **Hit targets:** Todos los botones/enlaces tienen ≥ 48x48px (área táctil).
- [ ] **Separación táctil:** ≥ 8px entre elementos interactivos contiguos.
- [ ] **Cursor:** Elementos clickeables tienen `cursor: pointer`.
- [ ] **Feedback visual:** Botones/enlaces tienen estado `:hover`, `:focus`, `:active`.
- [ ] **Focus visible:** Todos los elementos interactivos tienen estilo `:focus-visible`.

**Verificación:**
```bash
# Usar DevTools para medir tamaños y distancias
# Tabular en modo mobile para probar hit targets
```

### 8.4 Imágenes y Medios
- [ ] **Formato WebP:** Imágenes estáticas usan formato WebP con fallback a JPEG/PNG.
- [ ] **Atributos `width` y `height`:** Todas las imágenes tienen `width` y `height` explícitos.
- [ ] **`fetchpriority`:** Imágenes críticas (LCP) tienen `fetchpriority="high"`.
- [ ] **`loading="lazy"`:** Imágenes no críticas tienen `loading="lazy"`.
- [ ] **`alt` descriptivo:** Todas las imágenes tienen texto alternativo descriptivo.
- [ ] **`srcset`:** Imágenes responsivas usan `srcset` con múltiples resoluciones.

**Verificación:**
```bash
npx lighthouse http://localhost:3000/<ruta> --output=json | grep -E "(lcp|cls)"
```

### 8.5 Animaciones y Transiciones
- [ ] **`prefers-reduced-motion`:** Animaciones respetan `@media (prefers-reduced-motion: reduce)`.
- [ ] **Duración:** Transiciones ≤ 300ms, animaciones ≤ 500ms.
- [ ] **Easing:** Usar `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out estándar).
- [ ] **Rendimiento:** Animaciones usan `transform` y `opacity` (no `top`, `left`, `width`, `height`).

**Verificación:**
```bash
# Probar en Chrome con "Prefers reduced motion" habilitado en DevTools
```

---

## 🧠 Sección 9: Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`

### 9.1 Affordances y Feedback
- [ ] **Affordances:** Los elementos interactivos sugieren su función (ej: botones se ven como botones).
- [ ] **Feedback inmediato:** Confirmación visual en < 100ms para acciones críticas (ej: spinner, toast).
- [ ] **Feedback de error:** Mensajes de error son claros, específicos y sugieren cómo resolver el problema.
- [ ] **Feedback de éxito:** Confirmación visual para acciones exitosas (ej: toast, cambio de estado).

**Verificación:**
```bash
# Prueba manual: ¿El usuario sabe qué hacer sin instrucciones?
```

### 9.2 Ley de Fitts y Proximidad
- [ ] **Tamaño de botones:** Botones principales tienen ≥ 48x48px.
- [ ] **Proximidad:** Botones relacionados están cerca (ej: "Guardar" y "Cancelar" juntos).
- [ ] **Accesibilidad:** Botones importantes están en los bordes o cerca del cursor (Ley de Fitts).

**Verificación:**
```bash
# Medir distancia desde el cursor a los botones en DevTools
```

### 9.3 Patrón Layer-Cake
- [ ] **Estructura clara:** Contenido organizado en capas (encabezado, cuerpo, pie).
- [ ] **Jerarquía visual:** Títulos > subtítulos > cuerpo > detalles.
- [ ] **Alineación:** Elementos relacionados están alineados vertical u horizontalmente.

**Verificación:**
```bash
# Inspección visual: ¿El contenido fluye lógicamente?
```

### 9.4 Carga Cognitiva
- [ ] **Número de elementos:** ≤ 7 elementos principales por pantalla (Regla de Miller).
- [ ] **Agrupación:** Elementos relacionados están agrupados (Ley de la Gestalt).
- [ ] **Enfoque:** Solo 1 llamada a la acción (CTA) principal por pantalla.
- [ ] **Simplicidad:** Eliminar elementos no esenciales (principio de Ockham).

**Verificación:**
```bash
# Contar elementos principales en la pantalla
# Prueba de usuario: ¿Puede completar la tarea principal en ≤ 30 segundos?
```

### 9.5 Jerarquía Visual
- [ ] **Tamaño:** Elementos importantes son más grandes.
- [ ] **Color:** Elementos importantes usan colores llamativos (pero accesibles).
- [ ] **Posición:** Elementos importantes están en posiciones destacadas (ej: arriba a la derecha).
- [ ] **Contraste:** Elementos importantes tienen mayor contraste con el fondo.

**Verificación:**
```bash
# Inspección visual: ¿Qué elemento atrae primero la atención?
```

### 9.6 Alineación de Datos
- [ ] **Números:** Alineados a la derecha (para comparación fácil).
- [ ] **Texto:** Alineado a la izquierda (para lectura natural).
- [ ] **Tabular:** Datos en tablas tienen alineación consistente.

**Verificación:**
```bash
# Inspección visual en tablas o listas de datos
```

---

## 🔍 Sección 10: SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`

### 10.1 JSON-LD (Schema Markup)
- [ ] **Schema válido:** La página incluye JSON-LD válido (usar `next/head` o `app/layout.tsx`).
- [ ] **Tipo de schema:** Usar el schema apropiado:
  - `Organization` (página principal)
  - `Event` (Simposio)
  - `Article` (Recursos)
  - `BreadcrumbList` (Navegación)
- [ ] **Campos obligatorios:** Todos los campos obligatorios del schema están presentes.
- [ ] **Validación:** Schema pasa el validador de [schema.org](https://validator.schema.org/).

**Verificación:**
```bash
curl http://localhost:3000/<ruta> | grep -o '<script type="application/ld+json">.*</script>' | npx jsonlint
```

### 10.2 Meta Tags
- [ ] **`title`:** Único, descriptivo, ≤ 60 caracteres.
- [ ] **`description`:** Único, descriptivo, ≤ 160 caracteres.
- [ ] **`viewport`:** `width=device-width, initial-scale=1`.
- [ ] **`charset`:** `utf-8`.
- [ ] **`canonical`:** URL canónica definida (evitar duplicados).

**Verificación:**
```bash
npx seo-check http://localhost:3000/<ruta>
```

### 10.3 Open Graph (OG)
- [ ] **`og:title`:** Igual o similar al `title`.
- [ ] **`og:description`:** Igual o similar a la `description`.
- [ ] **`og:url`:** URL absoluta de la página.
- [ ] **`og:type`:** `website` o tipo específico (ej: `article`).
- [ ] **`og:image`:** Imagen de 1200x630px (ratio 1.91:1), ≤ 300KB.
- [ ] **`og:locale`:** `es_ES` (o locale apropiado).

**Verificación:**
```bash
# Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
```

### 10.4 Twitter Cards
- [ ] **`twitter:card`:** `summary_large_image` (para imágenes grandes).
- [ ] **`twitter:title`:** Igual al `title`.
- [ ] **`twitter:description`:** Igual a la `description`.
- [ ] **`twitter:image`:** Igual a `og:image`.

**Verificación:**
```bash
# Twitter Card Validator: https://cards-dev.twitter.com/validator
```

### 10.5 Semántica HTML
- [ ] **Headings jerárquicos:** Solo 1 `h1` por página, `h2` > `h3` > `h4`.
- [ ] **Landmarks:** Usar `header`, `main`, `footer`, `nav`, `aside`, `section`, `article`.
- [ ] **Listas:** Usar `ul`/`ol` para listas (no `div`).
- [ ] **Enlaces:** Usar `a` para navegación, `button` para acciones.

**Verificación:**
```bash
# Inspección de DOM en DevTools
```

### 10.6 Imágenes (SEO)
- [ ] **`alt` descriptivo:** Todas las imágenes tienen `alt` descriptivo (no genérico como "imagen").
- [ ] **Nombres de archivo:** Descriptivos (ej: `simposio-2026-eticas.jpg`, no `IMG_1234.jpg`).
- [ ] **Compresión:** Imágenes optimizadas (usar `squoosh` o similar).

**Verificación:**
```bash
# Lighthouse > SEO > Image alt attributes
```

### 10.7 Enlaces
- [ ] **Texto descriptivo:** Enlaces usan texto descriptivo (no "haz clic aquí").
- [ ] **`rel="noopener noreferrer"`:** Enlaces externos tienen este atributo.
- [ ] **`target="_blank"`:** Enlaces externos abren en nueva pestaña (opcional, pero recomendado).

**Verificación:**
```bash
# Inspección de DOM: buscar <a> sin rel="noopener"
```

### 10.8 Rendimiento (Core Web Vitals)
- [ ] **LCP (Largest Contentful Paint):** ≤ 2.5s.
- [ ] **CLS (Cumulative Layout Shift):** ≤ 0.1.
- [ ] **INP (Interaction to Next Paint):** ≤ 200ms.

**Verificación:**
```bash
npx lighthouse http://localhost:3000/<ruta> --output=json | grep -E "(lcp|cls|inp)"
```

---

## 📝 Checklist de Revisión Final

**Antes de aprobar una pantalla, verificar:**

### UI/UX
- [ ] Pasa todas las verificaciones de la **Sección 8**.
- [ ] Lighthouse score ≥ 90 en Accessibility y Best Practices.

### Ergonomía Cognitiva
- [ ] Pasa todas las verificaciones de la **Sección 9**.
- [ ] Prueba de usuario: 5 usuarios pueden completar la tarea principal sin ayuda.

### SEO
- [ ] Pasa todas las verificaciones de la **Sección 10**.
- [ ] Lighthouse score ≥ 90 en SEO.
- [ ] Schema válido en [schema.org](https://validator.schema.org/).

### Código
- [ ] `npx tsc --noEmit` (sin errores).
- [ ] `npx biome check .` (sin errores).
- [ ] `npx next build` (sin errores).
- [ ] `npx vitest run` (todos los tests pasan).

---

## 📌 Notas

### Reglas no negociables:
1. **Si un check falla, la pantalla no se aprueba.**
2. **Todos los checks deben ser verificables mecánicamente** (comando, test, herramienta).
3. **No se aceptan excusas como:** "Es difícil", "No es importante", "Lo haremos después".

### Herramientas recomendadas:
- **Lighthouse:** `npx lighthouse http://localhost:3000/<ruta>`
- **Schema Markup Validator:** [https://validator.schema.org/](https://validator.schema.org/)
- **SEO Check:** `npx seo-check http://localhost:3000/<ruta>`
- **Facebook Sharing Debugger:** [https://developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)
- **Twitter Card Validator:** [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
- **WebPageTest:** [https://www.webpagetest.org/](https://www.webpagetest.org/)

### Plantilla para informes de verificación:
```markdown
## Informe de Verificación: P-XX <Nombre>

**Fecha:** YYYY-MM-DD
**Revisor:** @rol

### UI/UX
- [x] Grid fluido
- [ ] Container Queries
- [x] Tipografía fluida
... (resto de checks)

**Lighthouse Scores:**
- Performance: 95
- Accessibility: 98
- Best Practices: 100
- SEO: 92

### Ergonomía Cognitiva
- [x] Affordances
- [x] Feedback inmediato
... (resto de checks)

**Prueba de usuario:**
- Tarea completada en 25s (promedio de 5 usuarios).

### SEO
- [x] JSON-LD válido
- [x] Meta tags completos
... (resto de checks)

**Schema Validator:** [Enlace a validación]

### Código
- [x] TypeScript
- [x] Biome
- [x] Build
- [x] Tests

**Estado:** ✅ Aprobado / ❌ Rechazado (razones: ...)
```

---

## 🔗 Referencias
- [ESTANDARES_UI.md](../../nucleo/ESTANDARES_UI.md)
- [ERGONOMIA_COGNITIVA.md](../../nucleo/ERGONOMIA_COGNITIVA.md)
- [SEO_TECNICO.md](../../nucleo/SEO_TECNICO.md)
- [PLANTILLA_PANTALLA.md](./PLANTILLA_PANTALLA.md)