# Diseño: Correo Corporativo (P07)

**ID:** P07
**Pantalla:** `/correo`
**Línea:** web-publico
**Prioridad:** Alta (bandeja corporativa, solo ADMIN)
**Estado:** En diseño

---

## 1. Entidades que consume

| Entidad | § en REGISTRO_DE_ENTIDADES | Uso en esta pantalla | Campos usados |
|---------|-----------------------------|----------------------|---------------|
| `Mensaje` | §4 | Listado, detalle y envío de correos | `id`, `direccion`, `de`, `para`, `asunto`, `cuerpo`, `fecha`, `aliado_ref`, `adjuntos` |
| `Usuario` | §1 | Validar rol `ADMIN` (gate E-03) y vincular `aliado_ref` | `email`, `rol`, `nombre` |
| `Sesion` | §1 | Validar sesión activa | `token`, `user_id` |

**Verificación:**
```bash
grep -n "Mensaje\|Usuario" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 2. Estados que transiciona

| Origen | Acción | Destino | Gate | § en REGISTRO_DE_ENTIDADES |
|--------|--------|---------|------|-----------------------------|
| `no_autenticado` | Navegar a `/correo` | Redirige a `/` + abre `AuthModal` | E-02, E-03 | §1 |
| `autenticado` (ALIADO) | Navegar a `/correo` | Redirige a `/` + mensaje "Permisos insuficientes" | E-03 | §1 |
| `autenticado` (ADMIN) | Navegar a `/correo` | Muestra bandeja | E-03 | §4 |
| ADMIN | Click en mensaje de la lista | Muestra detalle en panel derecho | — | §4 |
| ADMIN | Click "Nuevo mensaje" | Abre compositor | — | §4 |
| ADMIN | Enviar mensaje | `POST /api/correo/enviar` → Resend → guarda en DB como `ENVIADO` | — | §4 |
| ADMIN | Subir adjunto | Upload a R2 → URL en `Mensaje.adjuntos` | — | §4 |

**Verificación:**
```bash
grep -n "ENVIADO\|RECIBIDO\|ADMIN" arnes/nucleo/glosario.md
```

---

## 3. Vocabulario H07

| Label natural (UI) | Código interno | § en glosario |
|--------------------|----------------|---------------|
| "Enviado" | `ENVIADO` | §2.3 (Estados de Mensaje) |
| "Recibido" | `RECIBIDO` | §2.3 |
| "De" | `de` | §4.3 (Mensaje) |
| "Para" | `para` | §4.3 |
| "Asunto" | `asunto` | §4.3 |
| "Cuerpo" | `cuerpo` | §4.3 |
| "Fecha" | `fecha` | §4.3 |
| "Adjuntos" | `adjuntos` | §4 |
| "Enviar" | `enviar` | §3 (Verbos) |
| "Responder" | `responder` | §3 (Verbos) |
| "Nuevo mensaje" | `componer` | — |
| "Bandeja de entrada" | `inbox` | — |
| "Bandeja de salida" | `outbox` | — |
| "Destinatario" | `destinatario` | — |

**Verificación:**
```bash
grep -n "enviar\|responder\|ENVIADO\|RECIBIDO" arnes/nucleo/glosario.md
```

---

## 4. Reglas de negocio

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | `/correo` solo accesible con `rol === 'ADMIN'` | Middleware verifica `usuario.rol` | Test: navegar a `/correo` con ALIADO redirige a `/` |
| R2 | Todos los mensajes son del buzón único `contacto@rednomon.com` | `de` o `para` siempre contiene `contacto@rednomon.com` | Test: `expect(mensajes.every(m => m.de.includes('contacto@') \|\| m.para.includes('contacto@'))).toBe(true)` |
| R3 | Envío usa Resend API con `RESEND_API_KEY` | `POST https://api.resend.com/emails` | Test mock: `expect(resendMock).toHaveBeenCalledWith({ from, to, subject, html })` |
| R4 | Tras envío exitoso, se guarda `Mensaje` con `direccion = 'ENVIADO'` en DB | `INSERT INTO mensaje` | Test: `expect(db.query(mensajes)).toContainEqual(nuevoMensaje)` |
| R5 | Adjuntos se suben a R2 y se guarda URL en `Mensaje.adjuntos[]` | `s3.putObject` + `mensaje.adjuntos.push(url)` | Test: `expect(mensaje.adjuntos).toContain(r2Url)` |
| R6 | Adjuntos máximo 10MB por archivo, 5 archivos por mensaje | Validación en cliente + servidor | Test: `expect(upload({ size: 11_000_000 })).toThrow('size_exceeded')` |
| R7 | Tipos de archivo permitidos: pdf, jpg, png, docx, xlsx | Validación MIME | Test: `expect(upload({ type: 'exe' })).toThrow('type_not_allowed')` |
| R8 | Listado ordenado por `fecha` descendente (más reciente primero) | `ORDER BY fecha DESC` | Test: `expect(mensajes[0].fecha).toBeGreaterThanOrEqual(mensajes[1].fecha)` |
| R9 | Filtro por dirección: "Todos", "Recibidos", "Enviados" | `WHERE direccion = ?` | Test: filtro aplicado muestra solo mensajes del tipo seleccionado |
| R10 | Si `aliado_ref` coincide con un `Usuario.email`, se muestra el nombre del aliado | `JOIN Usuario ON email = aliado_ref` | Inspección visual |

---

## 5. Componentes UI

| Componente | Props | Entidad asociada | § en REGISTRO_DE_ENTIDADES |
|-----------|-------|------------------|-----------------------------|
| `CorreoLayout` | `{ children }` | — | — |
| `BandejaLista` | `{ mensajes: Mensaje[], seleccionadoId?: string, onSelect: (id: string) => void, filtro: FiltroCorreo }` | `Mensaje` | §4 |
| `MensajeItem` | `{ mensaje: Mensaje, seleccionado: boolean, onClick: () => void }` | `Mensaje` | §4 |
| `MensajeDetalle` | `{ mensaje: Mensaje, onResponder: () => void }` | `Mensaje` | §4 |
| `MensajeComposer` | `{ isOpen: boolean, onClose: () => void, replyTo?: Mensaje, onSend: (data: ComposerData) => void }` | `Mensaje` | §4 |
| `AdjuntoUploader` | `{ onUpload: (urls: string[]) => void, maxFiles: number, maxSize: number }` | — | §4 |
| `FiltrosCorreo` | `{ activo: FiltroCorreo, onChange: (filtro: FiltroCorreo) => void }` | — | — |
| `DireccionBadge` | `{ direccion: 'ENVIADO' | 'RECIBIDO' }` | `Mensaje` | §2.3 |

**Tipos:**
```typescript
type FiltroCorreo = 'todos' | 'ENVIADO' | 'RECIBIDO';

interface ComposerData {
  para: string;
  asunto: string;
  cuerpo: string;
  adjuntos: string[]; // URLs de R2
}
```

---

## 6. Comportamiento

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `load` | Navegar a `/correo` | Middleware valida ADMIN. Si OK: fetch mensajes de DB | Bandeja visible o redirect | Bandeja renderizada o redirect a `/` |
| `click` | Item de la lista | Selecciona mensaje, muestra detalle en panel derecho | Detalle visible | `expect(detalle).toBeVisible()` |
| `click` | Botón "Nuevo mensaje" | Abre `MensajeComposer` vacío | Composer visible | `expect(composer).toBeVisible()` |
| `click` | Botón "Responder" (en detalle) | Abre `MensajeComposer` con `replyTo` prellenado | Composer visible con `para` y `asunto` prellenados | `expect(paraInput.value).toBe(mensaje.de)` |
| `submit` | Enviar desde composer | `POST /api/correo/enviar` → Resend → guarda en DB | Si éxito: toast "Mensaje enviado", cierra composer, nuevo mensaje en lista. Si error: toast de error | `expect(toast).toHaveTextContent('Mensaje enviado')` |
| `upload` | Seleccionar archivo en `AdjuntoUploader` | Upload a R2, añade URL al array de adjuntos | Chip con nombre de archivo visible | `expect(screen.getByText(filename)).toBeInTheDocument()` |
| `remove_adjunto` | Click en X del chip | Elimina URL del array | Chip desaparece | `expect(screen.queryByText(filename)).not.toBeInTheDocument()` |
| `change_filtro` | Click en pestaña de filtro | Actualiza `filtroActivo`, re-renderiza lista | Lista filtrada | Solo mensajes del tipo seleccionado visibles |

---

## 7. Criterios de aceptación

1. **Schema válido:**
   - `ComposerData` y tipos de `Mensaje` validan con `npx tsc --noEmit`.
   - **Verificación:** `npx tsc --noEmit` (sin errores).

2. **Gate E-03:**
   - Sin sesión: redirige a `/` + abre `AuthModal`.
   - Con sesión ALIADO: redirige a `/` + mensaje "Permisos insuficientes".
   - Con sesión ADMIN: muestra bandeja.
   - **Verificación:** Prueba manual con usuarios de cada rol.

3. **Bandeja visible:**
   - Lista de mensajes ordenada por fecha descendente.
   - Badge "Enviado" / "Recibido" en cada item.
   - Nombre del aliado si `aliado_ref` coincide con un `Usuario`.
   - **Verificación:** Inspección visual.

4. **Detalle del mensaje:**
   - Click en item muestra: De, Para, Asunto, Fecha, Cuerpo, Adjuntos.
   - Botón "Responder" visible.
   - **Verificación:** Inspección visual + click manual.

5. **Envío de mensaje:**
   - Composer con campos: Para, Asunto, Cuerpo, Adjuntos.
   - Envío exitoso → toast + mensaje aparece en lista como `ENVIADO`.
   - Envío fallido → toast de error.
   - **Verificación:** Prueba manual de envío real (con email de prueba).

6. **Adjuntos:**
   - Upload a R2 funciona.
   - Máximo 5 archivos, 10MB cada uno.
   - Tipos permitidos: pdf, jpg, png, docx, xlsx.
   - **Verificación:** Prueba manual con archivos válidos e inválidos.

7. **Filtros:**
   - "Todos", "Recibidos", "Enviados" funcionan correctamente.
   - **Verificación:** Prueba manual.

8. **Responsive:**
   - Layout 3 paneles en desktop (lista + detalle + composer modal).
   - Layout apilado en mobile (lista → detalle → composer fullscreen).
   - **Verificación:** Inspección visual en 320px, 768px, 1280px.

---

## 8. Estándares de UI/UX

**Referencia:** `arnes/nucleo/ESTANDARES_UI.md`.

| Estándar | Aplicación en esta pantalla | § en ESTANDARES_UI.md | Verificación |
|-----------|-------------------------------|-----------------------|--------------|
| Grid fluido | Layout 3 columnas en desktop: `280px 1fr 400px` (lista + detalle + composer) | §2.1 | Inspección visual en 1280px |
| Tipografía fluida | Asunto del mensaje con `clamp(1rem, 2vw, 1.25rem)` | §3.1 | Inspección visual |
| Hit targets | Items de lista ≥ 48px alto, botones ≥ 48px | §4.1 | Medición con DevTools |
| Separación táctil | ≥ 8px entre items de la lista | §4.1 | Medición con DevTools |
| Focus visible | Inputs del composer con `:focus-visible` | §4.1 | Tabulación con teclado |
| Optimización de imágenes | Thumbnails de adjuntos de imagen en WebP, `loading="lazy"` | §5.1 | Lighthouse |
| Media Queries | 1 columna en < 768px, 2 columnas en 768-1279px, 3 columnas en ≥ 1280px | §7.1 | Inspección visual |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/correo --output=json | grep -E "(lcp|cls|inp)"
```

---

## 9. Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`.

| Principio | Aplicación en esta pantalla | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|-------------------------------|-------------------------------|--------------|
| Affordances | Items de lista con hover sugieren selección | §1.1 | Inspección visual |
| Ley de Fitts | Botón "Nuevo mensaje" prominente y grande | §1.2 | Medición de tamaño/posición |
| Patrón Layer-Cake | Filtros → Lista → Detalle → Composer | §2.2 | Inspección visual |
| Carga cognitiva | Lista muestra solo remitente + asunto + fecha (3 datos por item) | §4.1 | Conteo de datos por item |
| Jerarquía visual | Asunto (grande) > De/Para > Fecha > Cuerpo | §5.1 | Inspección visual |
| Alineación de datos | Fecha alineada a la derecha en la lista, remitente a la izquierda | §5.2 | Inspección visual |
| Feedback inmediato | Toast de envío en < 200ms, spinner durante envío | §4.3 | Prueba manual |
| Estado vacío | Lista vacía muestra "No hay mensajes" con CTA "Nuevo mensaje" | §4.1 | Inspección visual |

**Verificación general:**
- Prueba de usuario: ¿5 usuarios ADMIN pueden enviar un mensaje en ≤ 30 segundos?
- Prueba de tiempo: ¿Tiempo para encontrar un mensaje específico ≤ 10 segundos?

---

## 10. SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`.

| Requisito | Aplicación en esta pantalla | § en SEO_TECNICO.md | Verificación |
|-----------|-------------------------------|---------------------|--------------|
| Meta robots | `<meta name="robots" content="noindex, nofollow" />` (página privada) | §4.1 | Inspección de DOM |
| Semántica HTML | `h1`: "Correo corporativo", `nav` para filtros, `main` para lista+detalle | §4.1 | Inspección de DOM |
| JSON-LD | No aplica (página privada, no indexable) | — | — |
| Accesibilidad | `aria-label` en iconos de bandeja, `role="listbox"` en lista de mensajes | §4.1 | Auditoría con axe-core |

**Verificación general:**
```bash
curl http://localhost:3000/correo | grep -i "noindex"
npx axe-core http://localhost:3000/correo
```

---

## 📌 Notas

### Decisiones de diseño:
1. **Buzón único:** No hay un correo por usuario. El buzón es `contacto@rednomon.com` y lo administra un ADMIN.
2. **Gate E-03 estricto:** Solo `rol === 'ADMIN'` puede acceder. ALIADO ve mensaje de permisos insuficientes.
3. **Layout tipo cliente de correo:** Lista a la izquierda, detalle en el centro, composer como modal/slide-in.
4. **Resend para envío:** API sencilla, compatible con Vercel serverless.
5. **Adjuntos en R2:** No se guardan en DB, solo la URL.
6. **Recepción futura:** Cloudflare Email Routing → Gmail hoy; webhook a Vercel en el futuro.

### Actualización UI del Compositor (2026-08-10 — benchmark Proton Mail):
El `MensajeComposer` se rediseñó como **ventana flotante tipo dock** (no modal centrado):
- **Header oscuro** (`bg-zinc-900 text-white`) con drag handle `⠿`, título, y controles Minimizar/Maximizar/Cerrar (hit targets 48px).
- **Campos seamless** (Desde estático = buzón único, Para, Asunto) sin cajas: solo separadores `border-b border-zinc-100`.
- **Editor TipTap** con barra de formato flotante (B/I/U/S, listas, blockquote, link, limpiar) y placeholder.
- **Footer** con iconos de acción (descartar, adjuntar, toggle formato), indicador "Sin guardar" y **split button Enviar** (Enviar ahora / Programar envío).
- **Fix crítico:** `.ProseMirror` colapsaba a altura 0 y el cuerpo quedaba bloqueado sin admitir escritura → CSS estructural en `globals.css` (`.mail-editor .tiptap { min-height; outline }`) + `focus()` al click. Solo layout, sin tokens nuevos.
- **Gaps pendientes:** CC/BCC (la API aún no los soporta), programar envío (backend), plantillas/IA, cifrado.

### Prioridades de implementación:
1. **MVP:** Bandeja (lista + detalle) + envío básico sin adjuntos.
2. **V1:** Añadir adjuntos (upload a R2).
3. **V2:** Añadir búsqueda por texto en asunto/cuerpo.

### Dependencias:
- **`AuthModal` (P05):** Para el redirect cuando no hay sesión.
- **Resend API:** `RESEND_API_KEY` en variables de entorno de Vercel.
- **Cloudflare R2:** `CF_R2_*` en variables de entorno de Vercel.
- **Drizzle + Neon:** Tabla `Mensaje` para lectura/escritura.
- **Middleware:** `/app/middleware.ts` para gates E-02 y E-03.

### Tareas `[SOLO_HUMANO]`:
- Configurar `RESEND_API_KEY` en Vercel.
- Configurar `CF_R2_*` en Vercel.
- Verificar dominio `contacto@rednomon.com` en Resend.

---

## 📄 Estructura de Archivos

```
app/
├── (private)/
│   └── correo/
│       └── page.tsx                # P07: Correo corporativo
├── api/
│   └── correo/
│       ├── route.ts                # GET: listar mensajes
│       └── enviar/
│           └── route.ts            # POST: enviar mensaje vía Resend
lib/
├── validations/
│   └── correo.ts                   # Schema Zod para ComposerData
├── r2.ts                           # Cliente S3 para Cloudflare R2
└── components/
    ├── CorreoLayout.tsx
    ├── BandejaLista.tsx
    ├── MensajeItem.tsx
    ├── MensajeDetalle.tsx
    ├── MensajeComposer.tsx
    ├── AdjuntoUploader.tsx
    ├── FiltrosCorreo.tsx
    └── DireccionBadge.tsx
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
