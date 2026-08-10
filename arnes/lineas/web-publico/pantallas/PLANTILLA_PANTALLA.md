# PLANTILLA_PANTALLA — Diseño de Pantalla

**Contrato vivo.** Toda pantalla (P-XX) se diseña siguiendo esta plantilla. **10 secciones obligatorias** (7 originales + 3 nuevas de UI/UX/SEO).

**Regla:** Si una pantalla no cumple con las 10 secciones, el plan es inválido y no se ejecuta.

**Nota:** Las secciones 8–10 se añadieron tras la destilación de los documentos:
- `INS_Pantallas responsive y CSS.md`
- `Practicas de codivo UX y responisve.md`
- `INS_ergonomía cognitiva para el diseño de experiencia.md`
- `INS_Mejores Prácticas de JSON-LD y SEO Técnico para 2026-2027.md`

---

## 1. Entidades que consume

**Tabla de entidades** que la pantalla usa, con referencia al `REGISTRO_DE_ENTIDADES.md`.

| Entidad | § en REGISTRO_DE_ENTIDADES | Uso en esta pantalla | Campos usados |
|---------|-----------------------------|----------------------|---------------|
| `Usuario` | §1 | Mostrar datos del usuario autenticado | `nombre`, `email`, `rol` |
| `Recurso` | §2 | Listado/detalle de recursos | `slug`, `titulo`, `metadata`, `acceso` |

**Verificación:**
```bash
grep -n "Entidad" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 2. Estados que transiciona

**Tabla de estados** que la pantalla maneja, con origen, acción, destino y gate asociado.

| Origen | Acción | Destino | Gate | § en REGISTRO_DE_ENTIDADES |
|--------|--------|---------|------|-----------------------------|
| `no_autenticado` | login | `autenticado` | E-01 | §1 |
| `autenticado` | logout | `no_autenticado` | — | §1 |

**Verificación:**
```bash
grep -n "Estado" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 3. Vocabulario H07

**Mapeo de labels naturales a código interno** (usar términos de `arnes/nucleo/glosario.md`).

| Label natural (UI) | Código interno | § en glosario |
|--------------------|----------------|---------------|
| "Iniciar sesión" | `login` | §3 (Verbos) |
| "Correo electrónico" | `email` | §4.1 (Usuario) |
| "Público" | `PUBLICO` | §2.2 (Estados de Recurso) |

**Verificación:**
```bash
grep -n "Label natural" arnes/nucleo/glosario.md
```

---

## 4. Reglas de negocio

**Lista de reglas** que aplican a esta pantalla, con validación y criterio ejecutable.

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | Solo usuarios con rol `ADMIN` pueden ver `/correo` | `usuario.rol === 'ADMIN'` | Test: `expect(autorizar('/correo', usuario)).toBe(false)` si `rol !== 'ADMIN'` |
| R2 | Los recursos `SOLO_REGISTRADOS` requieren sesión válida | `sesionValida(usuario)` | Test: `expect(accesoRecurso(recurso, usuario)).toBe(false)` si `!sesionValida` |

---

## 5. Componentes UI

**Lista de componentes** que la pantalla usa, con sus props y entidad asociada.

| Componente | Props | Entidad asociada | § en REGISTRO_DE_ENTIDADES |
|-----------|-------|------------------|-----------------------------|
| `RecursoCard` | `{ recurso: Recurso }` | `Recurso` | §2 |
| `AuthModal` | `{ onClose: () => void, mode: 'login' | 'register' }` | `Usuario` | §1 |
| `Navbar` | `{ usuario?: Usuario }` | `Usuario` | §1 |

---

## 6. Comportamiento

**Tabla de eventos**, con gatillo, acción y side effects.

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `click` | Botón "Login" | Abrir `AuthModal` (mode: 'login') | — | Modal visible |
| `submit` | Formulario de login | `POST /api/auth/login` | Crear `Sesion` | Redirigir a `/perfil` |
| `click` | Tarjeta de recurso | Navegar a `/recursos/:slug` | — | URL cambia |

---

## 7. Criterios de aceptación

**Lista de criterios verificables mecánicamente** (comando, test o inspección visual).

1. **Schema válido:**
    - El schema de la entidad válida con los campos requeridos.
    - **Verificación:** `npx tsc --noEmit` (sin errores).

2. **UI funcional:**
    - La pantalla renderiza sin errores.
    - **Verificación:** `npm run dev` + inspección visual.

3. **Acceso controlado:**
    - Los recursos `PUBLICO` son visibles para todos.
    - Los recursos `SOLO_REGISTRADOS` son visibles solo con sesión.
    - **Verificación:** Prueba manual con/sin sesión.

4. **Navegación:**
    - Los links y botones navegan a las rutas correctas.
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
| Grid fluido | Usar `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` para layouts | §2.1 | Inspección visual en 320px |
| Tipografía fluida | Títulos usan `clamp()`, cuerpo usa tokens de espaciado | §3.1 | Inspección visual |
| Hit targets | Todos los botones/enlaces tienen ≥ 48x48px | §4.1 | Medición con DevTools |
| Separación táctil | ≥ 8px entre elementos interactivos contiguos | §4.1 | Medición con DevTools |
| Container Queries | Componentes se adaptan a su contenedor padre | §2.2 | Inspección visual |
| Subgrid | Elementos internos heredan alineación del grid padre | §2.3 | Inspección visual |
| Optimización de imágenes | Usar WebP con fallback a JPEG, `fetchpriority="high"` | §5.1 | Lighthouse (LCP) |
| Media Queries estratégicas | Breakpoints en 768px y 1280px | §7.1 | Inspección visual |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/<ruta> --output=json | grep -E "(lcp|cls|inp)"
```

---

## 9. Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`.

**Tabla de principios aplicados:**

| Principio | Aplicación en esta pantalla | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|-------------------------------|-------------------------------|--------------|
| Affordances | Los elementos interactivos sugieren su función (ej: botones con `cursor: pointer`) | §1.1 | Inspección visual |
| Ley de Fitts | Botones importantes están cerca y son grandes | §1.2 | Medición de distancia/tamaño |
| Patrón Layer-Cake | Contenido organizado en capas (encabezado, cuerpo, pie) | §2.2 | Inspección visual |
| Carga cognitiva | ≤ 7 elementos principales por pantalla | §4.1 | Conteo de elementos |
| Jerarquía visual | Títulos > subtítulos > cuerpo > detalles | §5.1 | Inspección visual |
| Alineación de datos | Números alineados a la derecha, texto a la izquierda | §5.2 | Inspección visual |
| Feedback inmediato | Confirmación visual en < 100ms para acciones críticas | §4.3 | Prueba manual |

**Verificación general:**
- Prueba de usuario: ¿5 usuarios pueden completar la tarea principal sin ayuda?
- Prueba de tiempo: ¿Tiempo promedio ≤ 30 segundos?

---

## 10. SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`.

**Tabla de requisitos SEO:**

| Requisito | Aplicación en esta pantalla | § en SEO_TECNICO.md | Verificación |
|-----------|-------------------------------|---------------------|--------------|
| JSON-LD | Schema válido (Organization, Event, Article, BreadcrumbList) | §2 | Schema Markup Validator |
| Meta tags | `title` (≤ 60 caracteres), `description` (≤ 160 caracteres) | §4.1 | `npx seo-check` |
| Open Graph | `og:title`, `og:description`, `og:image` | §4.2 | Facebook Sharing Debugger |
| Twitter Cards | `twitter:card`, `twitter:title`, `twitter:image` | §4.3 | Twitter Card Validator |
| Semántica HTML | Headings jerárquicos (`h1` > `h2` > `h3`) | §4.1 | Inspección de DOM |
| Imágenes | `alt` descriptivo, `width`, `height` | §4.1 | Inspección de DOM |
| Enlaces externos | `rel="noopener noreferrer"` | §4.1 | Inspección de DOM |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/<ruta> --output=json | grep -E "(seo|score)"
npx schema-validator http://localhost:3000/<ruta>
```

---

## 📌 Notas

- **Regla de oro:** Si un criterio no es verificable ejecutando algo, no es válido.
- **Prohibido:** "Se ve bien", "funciona", "mejorar X".
- **Obligatorio:** "El comando Y devuelve Z", "El test A pasa", "La URL cambia a /ruta".

---

## 📄 Estructura del Archivo de Diseño

El archivo de diseño para una pantalla `P-XX` debe llamarse `disenio_PXX_<nombre>.md` y vivir en `arnes/lineas/web-publico/pantallas/`.

**Ejemplo de nombre:**
- `disenio_P01_inicio.md` (Inicio).
- `disenio_P02_simposio.md` (Simposio).
- `disenio_P03_recursos_listado.md` (Listado de Recursos).

**Ejemplo de contenido (10 secciones):**
```markdown
# Diseño: Inicio (P01)

**ID:** P01
**Pantalla:** `/`
**Línea:** web-publico

## 1. Entidades que consume

| Entidad | § | Uso | Campos |
|---------|---|-----|-------|
| `Usuario` | §1 | Mostrar estado de sesión en navbar | `nombre`, `rol` |

## 2. Estados que transiciona

| Origen | Acción | Destino | Gate |
|--------|--------|---------|------|
| `no_autenticado` | click en "Ingresar" | `autenticado` | E-01 |

## 3. Vocabulario H07

| Label natural | Código interno | § en glosario |
|----------------|----------------|---------------|
| "Iniciar sesión" | `login` | §3 (Verbos) |

## 4. Reglas de negocio

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | Navbar muestra "Ingresar" si no hay sesión | `!usuario` | Inspección visual |

## 5. Componentes UI

| Componente | Props | Entidad asociada | § |
|-----------|-------|------------------|---|
| `Navbar` | `{ usuario?: Usuario }` | `Usuario` | §1 |

## 6. Comportamiento

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `click` | Botón "Ingresar" | Abrir `AuthModal` | — | Modal visible |

## 7. Criterios de aceptación

1. La página `/` renderiza sin errores (`npx tsc --noEmit`).
2. El navbar muestra "Ingresar" si no hay sesión (prueba manual).

## 8. Estándares de UI/UX

| Estándar | Aplicación | § en ESTANDARES_UI.md | Verificación |
|-----------|------------|-----------------------|--------------|
| Grid fluido | Layout con `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` | §2.1 | Inspección visual |
| Hit targets | Botones de ≥ 48x48px | §4.1 | DevTools |

## 9. Ergonomía Cognitiva

| Principio | Aplicación | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|------------|-------------------------------|--------------|
| Patrón Layer-Cake | Subtítulos jerárquicos | §2.2 | Inspección visual |
| Ley de Fitts | Botones grandes y cercanos | §1.2 | Medición |

## 10. SEO Técnico

| Requisito | Aplicación | § en SEO_TECNICO.md | Verificación |
|-----------|------------|---------------------|--------------|
| JSON-LD | Schema `Organization` | §2.1 | Schema Markup Validator |
| Meta tags | `title` y `description` únicos | §4.1 | `npx seo-check` |
```

---

## 📌 Notas Adicionales

### Sobre las nuevas secciones (8–10):
- **Sección 8 (UI/UX):** Asegura que la pantalla cumpla con los estándares técnicos de diseño responsivo, tipografía fluida y ergonomía táctil.
- **Sección 9 (Ergonomía Cognitiva):** Garantiza que la pantalla minimice la carga cognitiva y maximice la usabilidad.
- **Sección 10 (SEO):** Asegura que la pantalla esté optimizada para motores de búsqueda tradicionales y búsqueda generativa (LLM).

### Reglas actualizadas:
- **Regla de oro:** Si un criterio no es verificable ejecutando algo, no es válido.
- **Prohibido:** "Se ve bien", "funciona", "mejorar X", "es responsivo".
- **Obligatorio:** "El comando Y devuelve Z", "El test A pasa", "La URL cambia a /ruta", "El Lighthouse score es ≥ 90".

### Herramientas recomendadas:
- **Lighthouse:** `npx lighthouse http://localhost:3000/<ruta>` (Core Web Vitals + SEO).
- **Schema Markup Validator:** [https://validator.schema.org/](https://validator.schema.org/).
- **SEO Check:** `npx seo-check http://localhost:3000/<ruta>`.
- **DevTools:** Medir hit targets, contraste, rendimiento.
