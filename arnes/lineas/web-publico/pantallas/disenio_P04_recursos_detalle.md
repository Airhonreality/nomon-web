# Diseño: Recursos — Detalle (P04)

**ID:** P04
**Pantalla:** `/recursos/:slug`
**Línea:** web-publico
**Prioridad:** Alta (ficha completa de cada recurso)
**Estado:** En diseño

---

## 1. Entidades que consume

| Entidad | § en REGISTRO_DE_ENTIDADES | Uso en esta pantalla | Campos usados |
|---------|-----------------------------|----------------------|---------------|
| `Recurso` | §2 | Ficha completa del recurso | `slug`, `titulo`, `imagen`, `pdf_url`, `contenido`, `acceso.estrategia` |
| `RecursoMetadata` | §2 | Datos bibliográficos completos | `autor`, `editorial`, `anio`, `doi_isbn`, `licencia`, `idioma`, `curador`, `razon_nomon` |
| `RecursoAcceso` | §2 | Validación de acceso para `LISTA_BLANCA` | `email` (solo backend) |
| `RecursoRelacionado` | §2 | Sección "Recursos relacionados" | `relacionado_id` |
| `Usuario` / `Sesion` | §1 | Validar acceso según sesión | `email`, `rol` |

**Verificación:**
```bash
grep -n "Recurso\|RecursoMetadata\|RecursoRelacionado" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 2. Estados que transiciona

| Origen | Acción | Destino | Gate | § en REGISTRO_DE_ENTIDADES |
|--------|--------|---------|------|-----------------------------|
| Cualquiera | Navegar a `/recursos/:slug` | Muestra ficha completa si tiene acceso | — | §2 |
| `no_autenticado` | Acceder a recurso `SOLO_REGISTRADOS` | Muestra "Contenido reservado" + CTA login | E-02 | §2 |
| `no_autenticado` | Acceder a recurso `LISTA_BLANCA` | Muestra "Contenido reservado" + CTA contactar | E-04 | §2 |
| `autenticado` | Acceder a recurso `LISTA_BLANCA` sin email autorizado | Muestra "Contenido reservado" + CTA contactar | E-04 | §2 |
| `autenticado` | Acceder a recurso `LISTA_BLANCA` con email autorizado | Muestra ficha completa | E-04 | §2 |
| Cualquiera | Click "Descargar PDF" | Abre PDF en nueva pestaña | — | §2 |
| Cualquiera | Click en recurso relacionado | Navega a `/recursos/:slug` del relacionado | — | §2 |

**Verificación:**
```bash
grep -n "PUBLICO\|SOLO_REGISTRADOS\|LISTA_BLANCA" arnes/nucleo/glosario.md
```

---

## 3. Vocabulario H07

| Label natural (UI) | Código interno | § en glosario |
|--------------------|----------------|---------------|
| "Título" | `titulo` | §4.2 (Recurso) |
| "Autor" | `metadata.autor` | §4.2 |
| "Editorial" | `metadata.editorial` | §4.2 |
| "Año" | `metadata.anio` | §4.2 |
| "DOI/ISBN" | `metadata.doi_isbn` | §4.2 |
| "Licencia" | `metadata.licencia` | §4.2 |
| "Idioma" | `metadata.idioma` | §4.2 |
| "Curador" | `metadata.curador` | §4.2 |
| "¿Por qué está en NOMON?" | `metadata.razon_nomon` | §4.2 |
| "Descargar PDF" | `descargar` | §3 (Verbos) |
| "Contenido reservado" | `RESOURCE_RESERVED` | §5 (Mensajes) |
| "Recursos relacionados" | `RecursoRelacionado` | §2 |
| "Público" | `PUBLICO` | §2.2 |
| "Solo registrados" | `SOLO_REGISTRADOS` | §2.2 |
| "Lista blanca" | `LISTA_BLANCA` | §2.2 |

**Verificación:**
```bash
grep -n "RESOURCE_RESERVED\|descargar\|razon_nomon" arnes/nucleo/glosario.md
```

---

## 4. Reglas de negocio

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | Recurso `PUBLICO` muestra ficha completa para todos | `acceso.estrategia === 'PUBLICO'` | Test: `expect(screen.getByText(recurso.titulo)).toBeInTheDocument()` sin sesión |
| R2 | Recurso `SOLO_REGISTRADOS` sin sesión muestra "Contenido reservado" + botón "Iniciar sesión" | `!sesionValida && acceso === 'SOLO_REGISTRADOS'` | Test: `expect(screen.getByText('Contenido reservado')).toBeInTheDocument()` |
| R3 | Recurso `LISTA_BLANCA` sin email autorizado muestra "Contenido reservado" + botón "Contactar" | `!emailEnListaBlanca(usuario.email, recurso.id)` | Test: `expect(screen.getByText('Contenido reservado')).toBeInTheDocument()` |
| R4 | Botón "Descargar PDF" solo visible si tiene acceso | `tieneAcceso === true` | Test: `expect(screen.queryByText('Descargar PDF')).not.toBeInTheDocument()` sin acceso |
| R5 | "Descargar PDF" abre `pdf_url` en nueva pestaña con `rel="noopener noreferrer"` | `window.open(pdf_url, '_blank')` | Inspección de DOM |
| R6 | Sección "Recursos relacionados" muestra hasta 3 recursos relacionados | `relacionados.slice(0, 3)` | Test: `expect(screen.getAllByRole('link', { name: /relacionado/i })).toHaveLength(≤3)` |
| R7 | Si el recurso no existe (slug inválido), muestra 404 | `recurso === undefined` | Test: `expect(screen.getByText('No se encontró')).toBeInTheDocument()` |
| R8 | Metadata completa visible: autor, editorial, año, DOI/ISBN, licencia, idioma, curador, razón NOMON | Todos los campos de `RecursoMetadata` renderizados | Inspección visual |

---

## 5. Componentes UI

| Componente | Props | Entidad asociada | § en REGISTRO_DE_ENTIDADES |
|-----------|-------|------------------|-----------------------------|
| `RecursoHeader` | `{ titulo: string, autor: string, anio: string, imagen: string, acceso: AccesoEstrategia }` | `Recurso`, `RecursoMetadata` | §2 |
| `RecursoContent` | `{ contenido: string }` | `Recurso` | §2 |
| `RecursoMetadataPanel` | `{ metadata: RecursoMetadata }` | `RecursoMetadata` | §2 |
| `RecursoActions` | `{ pdfUrl: string, tieneAcceso: boolean, onLoginClick: () => void, onContactarClick: () => void }` | `Recurso` | §2 |
| `ContenidoReservado` | `{ estrategia: AccesoEstrategia, onLoginClick: () => void, onContactarClick: () => void }` | — | §5 (`RESOURCE_RESERVED`) |
| `RecursosRelacionados` | `{ recursos: Recurso[] }` | `RecursoRelacionado` | §2 |
| `AccesoBadge` | `{ estrategia: AccesoEstrategia, requiereSesion: boolean }` | `Recurso` | §2 |

**Tipos:**
```typescript
type AccesoEstrategia = 'PUBLICO' | 'SOLO_REGISTRADOS' | 'LISTA_BLANCA';
```

---

## 6. Comportamiento

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `load` | Navegar a `/recursos/:slug` | Fetch del recurso desde `lib/data/recursos.ts` | Renderiza ficha o "Contenido reservado" | Ficha visible o mensaje de reservado |
| `click` | Botón "Descargar PDF" | `window.open(pdf_url, '_blank', 'noopener,noreferrer')` | PDF abre en nueva pestaña | Nueva pestaña con PDF |
| `click` | Botón "Iniciar sesión" (en reservado) | Abre `AuthModal` (mode: 'login') | Modal visible | `expect(authModal).toBeVisible()` |
| `click` | Botón "Contactar" (en reservado) | Navega a `mailto:contacto@rednomon.com` | Cliente de correo abre | — |
| `click` | Tarjeta de recurso relacionado | Navega a `/recursos/:slug` del relacionado | URL cambia | `expect(window.location.pathname).toContain('/recursos/')` |
| `session_change` | Login exitoso desde modal reservado | Re-evalúa acceso y re-renderiza | Ficha completa si ahora tiene acceso | Contenido reservado desaparece |
| `error` | Slug no encontrado | Muestra página 404 | — | `expect(screen.getByText(/no se encontró/i)).toBeInTheDocument()` |

---

## 7. Criterios de aceptación

1. **Schema válido:**
   - Los tipos `Recurso`, `RecursoMetadata`, `RecursoRelacionado` validan con `npx tsc --noEmit`.
   - **Verificación:** `npx tsc --noEmit` (sin errores).

2. **UI funcional:**
   - La pantalla `/recursos/:slug` renderiza sin errores para un recurso existente.
   - **Verificación:** `npm run dev` + inspección visual.

3. **Acceso controlado:**
   - `PUBLICO`: ficha completa visible para todos.
   - `SOLO_REGISTRADOS` sin sesión: "Contenido reservado" + botón "Iniciar sesión".
   - `LISTA_BLANCA` sin email autorizado: "Contenido reservado" + botón "Contactar".
   - **Verificación:** Prueba manual con/sin sesión y con diferentes emails.

4. **Descarga de PDF:**
   - Botón "Descargar PDF" visible solo con acceso.
   - Click abre PDF en nueva pestaña con `rel="noopener noreferrer"`.
   - **Verificación:** Inspección visual + click manual.

5. **Metadata completa:**
   - Todos los campos de `RecursoMetadata` visibles: autor, editorial, año, DOI/ISBN, licencia, idioma, curador, razón NOMON.
   - **Verificación:** Inspección visual.

6. **Recursos relacionados:**
   - Sección muestra hasta 3 recursos relacionados como tarjetas clickeables.
   - Click navega al detalle del recurso relacionado.
   - **Verificación:** Inspección visual + click manual.

7. **404:**
   - Slug inválido muestra página de error con mensaje "No se encontró el recurso solicitado".
   - **Verificación:** Navegar a `/recursos/slug-inexistente` + inspección visual.

8. **Responsive:**
   - Layout de 2 columnas en desktop (contenido + metadata), 1 columna en mobile.
   - **Verificación:** Inspección visual en 320px, 768px, 1280px.

---

## 8. Estándares de UI/UX

**Referencia:** `arnes/nucleo/ESTANDARES_UI.md`.

| Estándar | Aplicación en esta pantalla | § en ESTANDARES_UI.md | Verificación |
|-----------|-------------------------------|-----------------------|--------------|
| Grid fluido | Layout 2 columnas: `grid-template-columns: 1fr minmax(280px, 320px)` (contenido + metadata) | §2.1 | Inspección visual en 1280px |
| Tipografía fluida | Título del recurso con `clamp(1.5rem, 3vw, 2.25rem)` | §3.1 | Inspección visual |
| Hit targets | Botón "Descargar PDF" ≥ 48x48px, tarjetas relacionadas ≥ 48px alto | §4.1 | Medición con DevTools |
| Separación táctil | ≥ 16px entre secciones (header, content, metadata, relacionados) | §4.1 | Medición con DevTools |
| Container Queries | `RecursoMetadataPanel` se adapta a su columna | §2.2 | Inspección visual |
| Optimización de imágenes | Imagen de portada en WebP con fallback, `fetchpriority="high"` (LCP) | §5.1 | Lighthouse (LCP) |
| Media Queries | 1 columna en < 768px, 2 columnas en ≥ 768px | §7.1 | Inspección visual |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/recursos/<slug> --output=json | grep -E "(lcp|cls|inp)"
```

---

## 9. Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`.

| Principio | Aplicación en esta pantalla | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|-------------------------------|-------------------------------|--------------|
| Affordances | Botón "Descargar PDF" con icono de descarga sugiere acción | §1.1 | Inspección visual |
| Ley de Fitts | Botón "Descargar PDF" grande y en posición prominente | §1.2 | Medición de tamaño/posición |
| Patrón Layer-Cake | Header (título/imagen) → Contenido → Metadata → Relacionados | §2.2 | Inspección visual |
| Carga cognitiva | Contenido principal + metadata lateral (2 zonas claras) | §4.1 | Conteo de zonas |
| Jerarquía visual | Título > Autor/Año > Contenido > Metadata > Relacionados | §5.1 | Inspección visual |
| Alineación de datos | Metadata en panel lateral con labels alineados a la izquierda, valores a la derecha | §5.2 | Inspección visual |
| Feedback inmediato | Botón "Descargar PDF" tiene efecto `:hover` en < 100ms | §4.3 | Prueba manual |
| "¿Por qué está en NOMON?" | Sección destacada con estilo diferenciado (cita/blockquote) para `razon_nomon` | §5.1 | Inspección visual |

**Verificación general:**
- Prueba de usuario: ¿5 usuarios pueden encontrar el botón "Descargar PDF" en ≤ 3 segundos?
- Prueba de tiempo: ¿Tiempo promedio para leer la metadata completa ≤ 20 segundos?

---

## 10. SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`.

| Requisito | Aplicación en esta pantalla | § en SEO_TECNICO.md | Verificación |
|-----------|-------------------------------|---------------------|--------------|
| JSON-LD | Schema `Article` o `Book` con título, autor, año, DOI/ISBN | §2 | Schema Markup Validator |
| Meta tags | `title`: "<titulo> — Recursos NOMON" (≤ 60 caracteres) | §4.1 | `npx seo-check` |
| Meta tags | `description`: Primeras 160 caracteres del contenido o `razon_nomon` | §4.1 | `npx seo-check` |
| Open Graph | `og:title`, `og:description`, `og:image` (imagen de portada), `og:type=article` | §4.2 | Facebook Sharing Debugger |
| Twitter Cards | `twitter:card=summary_large_image`, `twitter:title`, `twitter:image` | §4.3 | Twitter Card Validator |
| Semántica HTML | `h1`: título del recurso, `h2`: "Ficha bibliográfica", "Recursos relacionados" | §4.1 | Inspección de DOM |
| Imágenes | Portada con `alt="Portada de <titulo>"`, `width`, `height` | §4.1 | Inspección de DOM |
| BreadcrumbList | JSON-LD `BreadcrumbList`: Inicio > Recursos > <titulo> | §2 | Schema Markup Validator |
| Canonical | `<link rel="canonical" href="https://rednomon.com/recursos/<slug>" />` | §4.1 | Inspección de DOM |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/recursos/<slug> --output=json | grep -E "(seo|score)"
```

---

## 📌 Notas

### Decisiones de diseño:
1. **Layout 2 columnas:** Contenido principal a la izquierda, panel de metadata a la derecha. En mobile se apila en 1 columna.
2. **"¿Por qué está en NOMON?"** como sección destacada (blockquote/cita) — es el valor diferencial de la biblioteca.
3. **Contenido reservado con CTA:** En vez de un muro de error, se muestra un mensaje amable con botón de acción (login o contactar).
4. **PDF en nueva pestaña:** `target="_blank"` con `rel="noopener noreferrer"` por seguridad.
5. **Recursos relacionados:** Hasta 3, mostrados como tarjetas compactas al final de la página.

### Prioridades de implementación:
1. **MVP:** Header + Contenido + Metadata + Botón PDF + Acceso controlado.
2. **V1:** Añadir sección de recursos relacionados.
3. **V2:** Añadir breadcrumbs y schema `BreadcrumbList`.

### Dependencias:
- **`AuthModal`:** Requiere que la pantalla `P05_auth.md` esté implementada (para el CTA de login en contenido reservado).
- **`lib/data/recursos.ts`:** Datos hardcodeados compartidos con P03.
- **Cloudflare R2:** `pdf_url` apunta a un objeto en R2 (configuración de bucket pendiente).

---

## 📄 Estructura de Archivos

```
app/
├── (public)/
│   └── recursos/
│       ├── page.tsx                # P03: Listado
│       └── [slug]/
│           └── page.tsx            # P04: Detalle
lib/
├── data/
│   └── recursos.ts                 # Datos hardcodeados (compartido con P03)
└── components/
    ├── RecursoHeader.tsx
    ├── RecursoContent.tsx
    ├── RecursoMetadataPanel.tsx
    ├── RecursoActions.tsx
    ├── ContenidoReservado.tsx
    ├── RecursosRelacionados.tsx
    └── AccesoBadge.tsx             # Compartido con P03
```

---

## 🔗 Referencias
- [PLANTILLA_PANTALLA.md](./PLANTILLA_PANTALLA.md)
- [ESTANDARES_PANTALLA.md](./ESTANDARES_PANTALLA.md)
- [disenio_P03_recursos_listado.md](./disenio_P03_recursos_listado.md)
- [REGISTRO_DE_ENTIDADES.md](../../nucleo/REGISTRO_DE_ENTIDADES.md)
- [glosario.md](../../nucleo/glosario.md)
- [ESTANDARES_UI.md](../../nucleo/ESTANDARES_UI.md)
- [ERGONOMIA_COGNITIVA.md](../../nucleo/ERGONOMIA_COGNITIVA.md)
- [SEO_TECNICO.md](../../nucleo/SEO_TECNICO.md)
