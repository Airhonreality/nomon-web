# Diseño: Inicio (P01)

**ID:** P01
**Pantalla:** `/`
**Línea:** web-publico
**Prioridad:** Alta (primera pantalla del flujo público)
**Estado:** En diseño

---

## 1. Entidades que consume

**Tabla de entidades** que la pantalla usa, con referencia al `REGISTRO_DE_ENTIDADES.md`.

| Entidad | § en REGISTRO_DE_ENTIDADES | Uso en esta pantalla | Campos usados |
|---------|-----------------------------|----------------------|---------------|
| `Usuario` | §1 | Mostrar estado de sesión en navbar (login/logout) | `nombre`, `rol` |

**Verificación:**
```bash
grep -n "Usuario" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 2. Estados que transiciona

**Tabla de estados** que la pantalla maneja, con origen, acción, destino y gate asociado.

| Origen | Acción | Destino | Gate | § en REGISTRO_DE_ENTIDADES |
|--------|--------|---------|------|-----------------------------|
| `no_autenticado` | click en "Ingresar" (navbar) | `autenticado` | E-01 | §1 |
| `no_autenticado` | click en "Únete a NOMON" (Hero) | `autenticado` | E-01 | §1 |
| `autenticado` | click en "Cerrar sesión" (navbar) | `no_autenticado` | — | §1 |

**Verificación:**
```bash
grep -n "no_autenticado\|autenticado" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 3. Vocabulario H07

**Mapeo de labels naturales a código interno** (usar términos de `arnes/nucleo/glosario.md`).

| Label natural (UI) | Código interno | § en glosario |
|--------------------|----------------|---------------|
| "Iniciar sesión" | `autenticar` | §3 (Verbos) |
| "Únete a NOMON" | `registrar` | §3 (Verbos) |
| "Cerrar sesión" | `cerrar_sesion` | §3 (Verbos) |
| "Gubernamental" | `Gubernamental` | §4.1 (Área de interés) |
| "Corporativo" | `Corporativo` | §4.1 (Área de interés) |
| "Académico" | `Académico` | §4.1 (Área de interés) |
| "Jurídico" | `Jurídico` | §4.1 (Área de interés) |
| "Conoce más" | `detallar` | §3 (Verbos) |

**Verificación:**
```bash
grep -n "Gubernamental\|Corporativo\|Académico\|Jurídico" arnes/nucleo/glosario.md
```

---

## 4. Reglas de negocio

**Lista de reglas** que aplican a esta pantalla, con validación y criterio ejecutable.

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | El navbar muestra "Ingresar" si no hay sesión | `!usuario` | Test: `expect(navbar.queryByText("Ingresar")).toBeInTheDocument()` |
| R2 | El navbar muestra "Cerrar sesión" si hay sesión | `usuario` | Test: `expect(navbar.queryByText("Cerrar sesión")).toBeInTheDocument()` |
| R3 | El botón "Únete a NOMON" abre el modal de registro | `click` en botón | Test: `expect(authModal).toBeVisible()` |
| R4 | El botón "Ingresar" abre el modal de login | `click` en botón | Test: `expect(authModal).toBeVisible()` |
| R5 | Las 4 tarjetas de nodos son clickeables | `click` en tarjeta | Test: `expect(onClick).toHaveBeenCalled()` |

---

## 5. Componentes UI

**Lista de componentes** que la pantalla usa, con sus props y entidad asociada.

| Componente | Props | Entidad asociada | § en REGISTRO_DE_ENTIDADES |
|-----------|-------|------------------|-----------------------------|
| `Navbar` | `{ usuario?: Usuario }` | `Usuario` | §1 |
| `Hero` | `{ onLoginClick: () => void, onRegisterClick: () => void }` | — | — |
| `NodoCard` | `{ titulo: string, descripcion: string, icono: ReactNode, onClick: () => void }` | — | — |
| `NodosDeAccion` | `{ nodos: Nodo[] }` | — | — |
| `Footer` | `{ links: { label: string, href: string }[] }` | — | — |

**Tipos:**
```typescript
interface Nodo {
  id: string;
  titulo: string;
  descripcion: string;
  icono: ReactNode;
  href?: string; // Opcional: para navegación futura
}
```

---

## 6. Comportamiento

**Tabla de eventos**, con gatillo, acción y side effects.

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `click` | Botón "Ingresar" (navbar) | Abrir `AuthModal` (mode: 'login') | Modal visible | `expect(authModal).toBeVisible()` |
| `click` | Botón "Únete a NOMON" (Hero) | Abrir `AuthModal` (mode: 'register') | Modal visible | `expect(authModal).toBeVisible()` |
| `click` | Botón "Cerrar sesión" (navbar) | Cerrar sesión (`/api/auth/logout`) | Redirigir a `/` | `expect(window.location.pathname).toBe("/")` |
| `click` | Tarjeta "Gubernamental" | Navegar a `/simposio?sector=gubernamental` | URL cambia | `expect(window.location.search).toContain("gubernamental")` |
| `click` | Tarjeta "Corporativo" | Navegar a `/simposio?sector=corporativo` | URL cambia | `expect(window.location.search).toContain("corporativo")` |
| `click` | Tarjeta "Académico" | Navegar a `/simposio?sector=academico` | URL cambia | `expect(window.location.search).toContain("academico")` |
| `click` | Tarjeta "Jurídico" | Navegar a `/simposio?sector=juridico` | URL cambia | `expect(window.location.search).toContain("juridico")` |

---

## 7. Criterios de aceptación

**Lista de criterios verificables mecánicamente** (comando, test o inspección visual).

1. **Schema válido:**
   - El schema de `Usuario` válida con los campos requeridos.
   - **Verificación:** `npx tsc --noEmit` (sin errores).

2. **UI funcional:**
   - La pantalla `/` renderiza sin errores.
   - **Verificación:** `npm run dev` + inspección visual.

3. **Navbar dinámico:**
   - Muestra "Ingresar" si no hay sesión.
   - Muestra "Cerrar sesión" si hay sesión.
   - **Verificación:** Prueba manual con/sin sesión.

4. **Navegación:**
   - Los botones "Ingresar" y "Únete a NOMON" abren el modal de auth.
   - Las 4 tarjetas de nodos navegan a `/simposio` con el parámetro `sector` correcto.
   - **Verificación:** Inspección visual + consola (sin errores 404).

5. **Responsive:**
   - La pantalla se ve correctamente en mobile (320px) y desktop (1280px).
   - **Verificación:** Inspección visual en diferentes resoluciones.

---

## 8. Estándares de UI/UX

**Referencia:** `arnes/nucleo/ESTANDARES_UI.md`.

**Tabla de estándares aplicados en esta pantalla:**

| Estándar | Aplicación en esta pantalla | § en ESTANDARES_UI.md | Verificación |
|-----------|-------------------------------|-----------------------|--------------|
| Grid fluido | Layout principal usa `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` para las tarjetas de nodos | §2.1 | Inspección visual en 320px |
| Tipografía fluida | Títulos usan `clamp(2rem, 5vw, 3rem)` para el Hero | §3.1 | Inspección visual |
| Hit targets | Todos los botones y tarjetas tienen ≥ 48x48px | §4.1 | Medición con DevTools |
| Separación táctil | ≥ 16px entre tarjetas de nodos | §4.1 | Medición con DevTools |
| Container Queries | Componentes `NodoCard` se adaptan a su contenedor | §2.2 | Inspección visual |
| Subgrid | Tarjetas de nodos heredan alineación del grid padre | §2.3 | Inspección visual |
| Optimización de imágenes | Logo NOMON usa WebP con fallback a PNG | §5.1 | Lighthouse (LCP) |
| Media Queries estratégicas | Breakpoints en 768px (navbar) y 1280px (layout) | §7.1 | Inspección visual |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/ --output=json | grep -E "(lcp|cls|inp)"
```

---

## 9. Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`.

**Tabla de principios aplicados:**

| Principio | Aplicación en esta pantalla | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|-------------------------------|-------------------------------|--------------|
| Affordances | Botones "Ingresar" y "Únete a NOMON" se ven como botones (estilo primario) | §1.1 | Inspección visual |
| Ley de Fitts | Botón "Únete a NOMON" está en el centro del Hero (fácil de alcanzar) | §1.2 | Medición de posición |
| Patrón Layer-Cake | Contenido organizado en capas: Navbar (encabezado), Hero (cuerpo principal), Nodos (sección secundaria), Footer (pie) | §2.2 | Inspección visual |
| Carga cognitiva | ≤ 7 elementos principales: Logo, 2 botones (Hero), 4 tarjetas (Nodos), Footer | §4.1 | Conteo de elementos |
| Jerarquía visual | Hero > Nodos > Footer (tamaño de fuente y espaciado) | §5.1 | Inspección visual |
| Alineación de datos | Tarjetas de nodos alineadas en grid | §5.2 | Inspección visual |
| Feedback inmediato | Botones tienen efecto `:hover` (cambio de opacidad) en < 100ms | §4.3 | Prueba manual |

**Verificación general:**
- Prueba de usuario: ¿5 usuarios pueden identificar el propósito de NOMON en ≤ 10 segundos?
- Prueba de tiempo: ¿Tiempo promedio para encontrar el botón "Únete a NOMON" ≤ 2 segundos?

---

## 10. SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`.

**Tabla de requisitos SEO:**

| Requisito | Aplicación en esta pantalla | § en SEO_TECNICO.md | Verificación |
|-----------|-------------------------------|---------------------|--------------|
| JSON-LD | Schema `Organization` con nombre, descripción, logo, URL | §2.1 | Schema Markup Validator |
| Meta tags | `title`: "NOMON — Ética Aplicada para la Transformación Social" (≤ 60 caracteres) | §4.1 | `npx seo-check` |
| Meta tags | `description`: "NOMON es una red de conocimiento en ética aplicada para sectores gubernamentales, corporativos, académicos y jurídicos." (≤ 160 caracteres) | §4.1 | `npx seo-check` |
| Open Graph | `og:title`, `og:description`, `og:image` (logo NOMON), `og:url` | §4.2 | Facebook Sharing Debugger |
| Twitter Cards | `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image` | §4.3 | Twitter Card Validator |
| Semántica HTML | `h1`: "NOMON", `h2`: "Transformando la ética en acción", `h3`: "Nuestros nodos de acción" | §4.1 | Inspección de DOM |
| Imágenes | Logo tiene `alt="Logo NOMON"`, `width`, `height` | §4.1 | Inspección de DOM |
| Enlaces externos | Links a redes sociales tienen `rel="noopener noreferrer"` | §4.1 | Inspección de DOM |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/ --output=json | grep -E "(seo|score)"
npx schema-validator http://localhost:3000/
```

---

## 📌 Notas

### Decisiones de diseño:
1. **Hero minimalista:** Enfocado en el tagline y CTAs principales ("Únete a NOMON", "Conoce más").
2. **Nodos de acción:** 4 tarjetas que representan los sectores objetivo (Gubernamental, Corporativo, Académico, Jurídico). Cada tarjeta navega a `/simposio` con un filtro por sector.
3. **Navbar simple:** Logo + links de navegación (Simposio, Recursos) + botón de auth.
4. **Footer básico:** Información de contacto y links legales.

### Prioridades de implementación:
1. **MVP:** Navbar + Hero + Nodos de Acción (sin Footer).
2. **V1:** Añadir Footer con información de contacto.
3. **V2:** Añadir animaciones sutiles (ej: fade-in en tarjetas).

### Dependencias:
- **`AuthModal`:** Requiere que la pantalla `P05_auth.md` esté implementada.
- **Navegación a `/simposio`:** Requiere que la pantalla `P02_simposio.md` esté implementada.

---

## 📄 Estructura de Archivos

```
app/
├── (public)/
│   ├── layout.tsx          # Layout principal (navbar + footer)
│   ├── page.tsx            # P01: Inicio
│   └── components/
│       ├── Navbar.tsx      # Componente Navbar
│       ├── Hero.tsx        # Componente Hero
│       ├── NodosDeAccion.tsx # Componente NodosDeAccion
│       ├── NodoCard.tsx    # Componente NodoCard
│       └── Footer.tsx      # Componente Footer
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