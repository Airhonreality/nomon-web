# Diseño: Perfil (P06)

**ID:** P06
**Pantalla:** `/perfil`
**Línea:** web-publico
**Prioridad:** Media (pantalla de usuario autenticado)
**Estado:** En diseño

---

## 1. Entidades que consume

| Entidad | § en REGISTRO_DE_ENTIDADES | Uso en esta pantalla | Campos usados |
|---------|-----------------------------|----------------------|---------------|
| `Usuario` | §1 | Mostrar y editar datos del usuario autenticado | `nombre`, `email`, `telefono`, `area_interes`, `rol`, `bio`, `tags`, `fecha_registro` |
| `Sesion` | §1 | Validar sesión activa (gate E-02) | `token`, `user_id` |

**Verificación:**
```bash
grep -n "Usuario\|Sesion" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 2. Estados que transiciona

| Origen | Acción | Destino | Gate | § en REGISTRO_DE_ENTIDADES |
|--------|--------|---------|------|-----------------------------|
| `no_autenticado` | Navegar a `/perfil` | Redirige a `/` + abre `AuthModal` | E-02 | §1 |
| `autenticado` | Navegar a `/perfil` | Muestra datos del usuario | E-02 | §1 |
| `autenticado` | Click "Cerrar sesión" | `no_autenticado`, redirige a `/` | — | §1 |
| `autenticado` | Editar bio/tags y guardar | Actualiza `Usuario` en DB | — | §1 |
| `autenticado` | Cancelar edición | Descarta cambios, vuelve a modo lectura | — | — |

**Verificación:**
```bash
grep -n "autenticado\|no_autenticado" arnes/nucleo/glosario.md
```

---

## 3. Vocabulario H07

| Label natural (UI) | Código interno | § en glosario |
|--------------------|----------------|---------------|
| "Nombre completo" | `nombre` | §4.1 (Usuario) |
| "Correo electrónico" | `email` | §4.1 |
| "Teléfono" | `telefono` | §4.1 |
| "Área de interés" | `area_interes` | §4.1 |
| "Rol" | `rol` | §4.1 |
| "Biografía" | `bio` | §4.1 |
| "Etiquetas" | `tags` | §4.1 |
| "Fecha de registro" | `fecha_registro` | §4.1 |
| "Cerrar sesión" | `cerrar_sesion` | §3 (Verbos) |
| "Editar perfil" | `editar` | — |
| "Guardar cambios" | `guardar` | — |
| "Cancelar" | `cancelar` | — |
| "Aliado" | `ALIADO` | §4.1 |
| "Administrador" | `ADMIN` | §4.1 |

**Verificación:**
```bash
grep -n "nombre\|email\|bio\|tags\|rol\|cerrar_sesion" arnes/nucleo/glosario.md
```

---

## 4. Reglas de negocio

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | `/perfil` solo accesible con sesión válida | `middleware` verifica `Sesion` activa | Test: navegar a `/perfil` sin sesión redirige a `/` |
| R2 | `email` y `rol` son de solo lectura (no editables por el usuario) | `disabled` en campos | Test: `expect(emailInput).toBeDisabled()` |
| R3 | `nombre`, `telefono`, `bio`, `tags` son editables | Campos habilitados en modo edición | Test: `expect(nombreInput).not.toBeDisabled()` en modo edición |
| R4 | `bio` máximo 500 caracteres | `z.string().max(500)` | Test: `expect(schema.parse({ bio: 'x'.repeat(501) })).toThrow()` |
| R5 | `tags` es un array de strings, máximo 10 tags | `z.array(z.string()).max(10)` | Test: `expect(schema.parse({ tags: Array(11).fill('tag') })).toThrow()` |
| R6 | "Cerrar sesión" destruye la sesión y redirige a `/` | `DELETE /api/auth/session` + `cookies.delete` | Test: tras logout, `expect(session).toBeUndefined()` |
| R7 | Guardar cambios actualiza `Usuario` en DB | `PATCH /api/usuarios/:id` | Test: `expect(usuarioActualizado.bio).toBe(nuevaBio)` |
| R8 | Badge de rol visible: "Aliado" o "Administrador" | Renderiza `Badge` con `usuario.rol` | Inspección visual |
| R9 | Si `usuario.rol === 'ADMIN'`, muestra link a `/correo` en la página | `rol === 'ADMIN'` | Test: `expect(screen.getByText('Correo corporativo')).toBeInTheDocument()` solo para ADMIN |

---

## 5. Componentes UI

| Componente | Props | Entidad asociada | § en REGISTRO_DE_ENTIDADES |
|-----------|-------|------------------|-----------------------------|
| `PerfilHeader` | `{ usuario: Usuario }` | `Usuario` | §1 |
| `PerfilDatos` | `{ usuario: Usuario, modoEdicion: boolean, onChange: (campo: string, valor: string) => void }` | `Usuario` | §1 |
| `PerfilTags` | `{ tags: string[], modoEdicion: boolean, onAdd: (tag: string) => void, onRemove: (tag: string) => void }` | `Usuario` | §1 |
| `PerfilActions` | `{ modoEdicion: boolean, onEditar: () => void, onGuardar: () => void, onCancelar: () => void, onCerrarSesion: () => void }` | — | — |
| `RolBadge` | `{ rol: 'ALIADO' | 'ADMIN' }` | `Usuario` | §1 |
| `LinkAdmin` | `{ href: string, label: string }` | — | — (solo visible para ADMIN) |

**Tipos:**
```typescript
interface PerfilFormData {
  nombre: string;
  telefono?: string;
  bio?: string;
  tags: string[];
}
```

---

## 6. Comportamiento

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `load` | Navegar a `/perfil` | Middleware valida sesión. Si válida: fetch `Usuario` | Renderiza perfil o redirige | Perfil visible o redirect a `/` |
| `click` | Botón "Editar perfil" | Cambia a `modoEdicion = true` | Campos editables habilitados | `expect(nombreInput).not.toBeDisabled()` |
| `click` | Botón "Guardar cambios" | `PATCH /api/usuarios/:id` con `PerfilFormData` | Si éxito: `modoEdicion = false`, toast "Perfil actualizado". Si error: toast de error | `expect(toast).toHaveTextContent('Perfil actualizado')` |
| `click` | Botón "Cancelar" | `modoEdicion = false`, descarta cambios | Campos vuelven a solo lectura | `expect(nombreInput).toBeDisabled()` |
| `click` | Botón "Cerrar sesión" | `DELETE /api/auth/session` | Destruye sesión, redirige a `/` | `expect(window.location.pathname).toBe('/')` |
| `click` | Link "Correo corporativo" (solo ADMIN) | Navega a `/correo` | URL cambia | `expect(window.location.pathname).toBe('/correo')` |
| `add_tag` | Input de tag + Enter (en modo edición) | Añade tag al array si < 10 tags | Nuevo chip visible | `expect(screen.getByText(nuevoTag)).toBeInTheDocument()` |
| `remove_tag` | Click en X del chip (en modo edición) | Elimina tag del array | Chip desaparece | `expect(screen.queryByText(tagEliminado)).not.toBeInTheDocument()` |

---

## 7. Criterios de aceptación

1. **Schema válido:**
   - `PerfilFormData` valida con `npx tsc --noEmit`.
   - **Verificación:** `npx tsc --noEmit` (sin errores).

2. **Gate E-02:**
   - Sin sesión: redirige a `/` y abre `AuthModal`.
   - Con sesión: muestra perfil.
   - **Verificación:** Prueba manual con/sin sesión.

3. **Datos visibles:**
   - Nombre, email, teléfono, área de interés, rol, bio, tags, fecha de registro.
   - **Verificación:** Inspección visual.

4. **Modo edición:**
   - Click "Editar perfil" habilita campos editables (nombre, teléfono, bio, tags).
   - Email y rol permanecen de solo lectura.
   - **Verificación:** Prueba manual.

5. **Guardar cambios:**
   - Datos válidos → actualización en DB, toast de éxito, vuelve a modo lectura.
   - Datos inválidos (bio > 500 chars) → error inline.
   - **Verificación:** Prueba manual + verificar en DB.

6. **Cerrar sesión:**
   - Destruye sesión, redirige a `/`.
   - **Verificación:** Prueba manual + verificar que navbar muestra "Ingresar".

7. **Link ADMIN:**
   - Solo visible para usuarios con `rol === 'ADMIN'`.
   - Navega a `/correo`.
   - **Verificación:** Prueba manual con usuario ADMIN y ALIADO.

8. **Responsive:**
   - Layout de 1 columna en mobile, 2 columnas en desktop (datos + acciones).
   - **Verificación:** Inspección visual en 320px, 768px, 1280px.

---

## 8. Estándares de UI/UX

**Referencia:** `arnes/nucleo/ESTANDARES_UI.md`.

| Estándar | Aplicación en esta pantalla | § en ESTANDARES_UI.md | Verificación |
|-----------|-------------------------------|-----------------------|--------------|
| Grid fluido | Layout `grid-template-columns: 1fr minmax(240px, 280px)` (datos + panel lateral) | §2.1 | Inspección visual en 1280px |
| Tipografía fluida | Nombre del usuario con `clamp(1.25rem, 2.5vw, 1.75rem)` | §3.1 | Inspección visual |
| Hit targets | Botones ≥ 48px alto, chips de tags ≥ 32px alto | §4.1 | Medición con DevTools |
| Separación táctil | ≥ 16px entre secciones del perfil | §4.1 | Medición con DevTools |
| Focus visible | Todos los inputs editables tienen `:focus-visible` | §4.1 | Tabulación con teclado |
| Media Queries | 1 columna en < 768px, 2 columnas en ≥ 768px | §7.1 | Inspección visual |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/perfil --output=json | grep -E "(lcp|cls|inp)"
```

---

## 9. Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`.

| Principio | Aplicación en esta pantalla | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|-------------------------------|-------------------------------|--------------|
| Affordances | Botón "Editar perfil" con icono de lápiz sugiere edición | §1.1 | Inspección visual |
| Ley de Fitts | Botón "Cerrar sesión" en posición accesible (panel lateral) | §1.2 | Medición de posición |
| Patrón Layer-Cake | Header (nombre/rol) → Datos → Tags → Acciones | §2.2 | Inspección visual |
| Carga cognitiva | ≤ 7 campos visibles a la vez | §4.1 | Conteo de campos |
| Jerarquía visual | Nombre > Rol > Datos > Tags > Acciones | §5.1 | Inspección visual |
| Feedback inmediato | Toast de éxito/error tras guardar en < 200ms | §4.3 | Prueba manual |
| Modo lectura vs edición | Cambio visual claro entre modos (campos deshabilitados vs habilitados, botones cambian) | §4.3 | Inspección visual |

**Verificación general:**
- Prueba de usuario: ¿5 usuarios pueden encontrar "Cerrar sesión" en ≤ 5 segundos?
- Prueba de usuario: ¿5 usuarios pueden editar su bio en ≤ 20 segundos?

---

## 10. SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`.

| Requisito | Aplicación en esta pantalla | § en SEO_TECNICO.md | Verificación |
|-----------|-------------------------------|---------------------|--------------|
| Meta robots | `<meta name="robots" content="noindex, nofollow" />` (página privada) | §4.1 | Inspección de DOM |
| Semántica HTML | `h1`: nombre del usuario, `section` para datos, `aside` para acciones | §4.1 | Inspección de DOM |
| JSON-LD | No aplica (página privada, no indexable) | — | — |

**Verificación general:**
```bash
curl http://localhost:3000/perfil | grep -i "noindex"
```

---

## 📌 Notas

### Decisiones de diseño:
1. **Gate E-02:** Middleware de Next.js protege `/perfil`. Sin sesión → redirect a `/` + apertura de `AuthModal`.
2. **Modo lectura por defecto:** Los datos se muestran en modo lectura. El usuario debe hacer click en "Editar perfil" para modificar.
3. **Campos de solo lectura:** `email` y `rol` no son editables por el usuario (el rol lo asigna el sistema).
4. **Tags como chips:** Los tags se muestran como chips con botón de eliminar en modo edición.
5. **Link ADMIN condicional:** Solo usuarios con `rol === 'ADMIN'` ven el link a `/correo`.
6. **Toast de feedback:** Notificación temporal tras guardar cambios o cerrar sesión.

### Prioridades de implementación:
1. **MVP:** Visualización de datos + cerrar sesión.
2. **V1:** Añadir modo edición (bio, tags, nombre, teléfono).
3. **V2:** Añadir avatar de usuario (subida a R2).

### Dependencias:
- **`AuthModal` (P05):** Para el redirect cuando no hay sesión.
- **better-auth:** Para la gestión de sesión y logout.
- **Drizzle + Neon:** Tabla `Usuario` para lectura/escritura de datos.
- **Middleware:** `/app/middleware.ts` para gate E-02.

---

## 📄 Estructura de Archivos

```
app/
├── (private)/
│   └── perfil/
│       └── page.tsx                # P06: Perfil
lib/
├── validations/
│   └── perfil.ts                   # Schema Zod para PerfilFormData
├── api/
│   └── usuarios/
│       └── [id]/
│           └── route.ts            # PATCH para actualizar perfil
└── components/
    ├── PerfilHeader.tsx
    ├── PerfilDatos.tsx
    ├── PerfilTags.tsx
    ├── PerfilActions.tsx
    ├── RolBadge.tsx
    └── LinkAdmin.tsx
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
