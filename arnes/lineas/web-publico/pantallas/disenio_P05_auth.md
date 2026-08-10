# Diseño: Auth — Modal Login/Registro (P05)

**ID:** P05
**Pantalla:** Modal (overlay sobre cualquier ruta)
**Línea:** web-publico
**Prioridad:** Alta (puerta de entrada a funcionalidades autenticadas)
**Estado:** En diseño

---

## 1. Entidades que consume

| Entidad | § en REGISTRO_DE_ENTIDADES | Uso en esta pantalla | Campos usados |
|---------|-----------------------------|----------------------|---------------|
| `Usuario` | §1 | Crear nuevo usuario (registro) / validar credenciales (login) | `nombre`, `email`, `telefono`, `area_interes`, `rol`, `password_hash` |
| `Sesion` | §1 | Crear sesión tras login/registro exitoso | `token`, `user_id`, `expiracion` |

**Verificación:**
```bash
grep -n "Usuario\|Sesion" arnes/nucleo/REGISTRO_DE_ENTIDADES.md
```

---

## 2. Estados que transiciona

| Origen | Acción | Destino | Gate | § en REGISTRO_DE_ENTIDADES |
|--------|--------|---------|------|-----------------------------|
| `no_autenticado` | Login exitoso | `autenticado` | E-01 | §1 |
| `no_autenticado` | Registro exitoso | `autenticado` | E-01 | §1 |
| `no_autenticado` | Login fallido | `no_autenticado` + error | — | §1 |
| `no_autenticado` | Registro fallido (email duplicado) | `no_autenticado` + error | — | §1 |
| `autenticado` | Cerrar modal | `autenticado` (sin cambio) | — | §1 |

**Verificación:**
```bash
grep -n "no_autenticado\|autenticado" arnes/nucleo/glosario.md
```

---

## 3. Vocabulario H07

| Label natural (UI) | Código interno | § en glosario |
|--------------------|----------------|---------------|
| "Iniciar sesión" | `autenticar` | §3 (Verbos) |
| "Registrarse" / "Únete a NOMON" | `registrar` | §3 (Verbos) |
| "Correo electrónico" | `email` | §4.1 (Usuario) |
| "Contraseña" | `password` | — |
| "Confirmar contraseña" | `password_confirm` | — |
| "Nombre completo" | `nombre` | §4.1 |
| "Teléfono" | `telefono` | §4.1 |
| "Área de interés" | `area_interes` | §4.1 |
| "Iniciar sesión" (botón) | `login` | §3 |
| "Crear cuenta" (botón) | `register` | §3 |
| "¿Olvidaste tu contraseña?" | `forgot_password` | — |
| "¿No tienes cuenta?" | `no_account` | — |
| "¿Ya tienes cuenta?" | `has_account` | — |

**Verificación:**
```bash
grep -n "autenticar\|registrar\|email\|nombre\|telefono\|area_interes" arnes/nucleo/glosario.md
```

---

## 4. Reglas de negocio

| ID | Regla | Validación | Criterio ejecutable |
|----|-------|------------|---------------------|
| R1 | Email debe ser válido | `z.string().email()` | Test: `expect(schema.parse({ email: 'invalid' })).toThrow()` |
| R2 | Contraseña mínimo 8 caracteres | `z.string().min(8)` | Test: `expect(schema.parse({ password: '123' })).toThrow()` |
| R3 | Confirmación de contraseña debe coincidir | `password === password_confirm` | Test: `expect(schema.parse({ password: 'a', password_confirm: 'b' })).toThrow()` |
| R4 | Email no duplicado en registro | `!existeUsuario(email)` | Test: `expect(register({ email: existente })).toThrow('email_duplicado')` |
| R5 | Login valida credenciales contra `password_hash` (scrypt/bcrypt) | `bcrypt.compare(password, hash)` | Test: `expect(login({ email, password: 'wrong' })).toThrow('credenciales_invalidas')` |
| R6 | Registro crea usuario con rol `ALIADO` por defecto | `rol = 'ALIADO'` | Test: `expect(nuevoUsuario.rol).toBe('ALIADO')` |
| R7 | Login exitoso crea `Sesion` y redirige a la página anterior o `/perfil` | `cookies.set(session_token)` | Test: `expect(response.headers.get('set-cookie')).toContain('session')` |
| R8 | Modal se cierra con ESC o click fuera | `onKeyDown('Escape')` / `onClick(overlay)` | Test: `expect(modal).not.toBeVisible()` tras ESC |
| R9 | Área de interés es opcional en registro | `z.string().optional()` | Test: `expect(schema.parse({ area_interes: undefined })).not.toThrow()` |
| R10 | Teléfono es opcional en registro | `z.string().optional()` | Test: `expect(schema.parse({ telefono: undefined })).not.toThrow()` |

---

## 5. Componentes UI

| Componente | Props | Entidad asociada | § en REGISTRO_DE_ENTIDADES |
|-----------|-------|------------------|-----------------------------|
| `AuthModal` | `{ isOpen: boolean, onClose: () => void, initialMode?: 'login' | 'register' }` | — | — |
| `LoginForm` | `{ onSuccess: (usuario: Usuario) => void, onError: (error: string) => void, onSwitchToRegister: () => void }` | `Usuario`, `Sesion` | §1 |
| `RegisterForm` | `{ onSuccess: (usuario: Usuario) => void, onError: (error: string) => void, onSwitchToLogin: () => void }` | `Usuario` | §1 |
| `FormField` | `{ label: string, name: string, type: 'text' | 'email' | 'password' | 'tel' | 'select', error?: string, required?: boolean, options?: { value: string, label: string }[] }` | — | — |
| `AuthError` | `{ mensaje: string }` | — | §5 (Mensajes) |

**Tipos:**
```typescript
type AuthMode = 'login' | 'register';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  nombre: string;
  email: string;
  telefono?: string;
  area_interes?: string;
  password: string;
  password_confirm: string;
}
```

---

## 6. Comportamiento

| Evento | Gatillo | Acción | Side effect | Verificación |
|--------|---------|--------|-------------|--------------|
| `open` | Click en "Ingresar" (navbar) o "Únete a NOMON" (Hero) | Abre `AuthModal` con `initialMode` correspondiente | Modal visible, overlay oscuro | `expect(modal).toBeVisible()` |
| `close` | Click en X, ESC, o click fuera del modal | Cierra `AuthModal` | Modal oculto | `expect(modal).not.toBeVisible()` |
| `switch_tab` | Click en pestaña "Iniciar sesión" / "Registrarse" | Cambia entre `LoginForm` y `RegisterForm` | Formulario correspondiente visible | `expect(loginForm).toBeVisible()` o `expect(registerForm).toBeVisible()` |
| `submit_login` | Submit de `LoginForm` | `POST /api/auth/login` con `{ email, password }` | Si éxito: crear sesión, cerrar modal, redirigir. Si error: mostrar `AuthError` | `expect(session).toBeDefined()` o `expect(error).toBeVisible()` |
| `submit_register` | Submit de `RegisterForm` | `POST /api/auth/register` con `RegisterData` | Si éxito: crear usuario + sesión, cerrar modal, redirigir a `/perfil`. Si error: mostrar `AuthError` | `expect(usuario).toBeDefined()` o `expect(error).toBeVisible()` |
| `validation_error` | Campo inválido al blur o submit | Muestra error inline en `FormField` | Borde rojo + mensaje de error | `expect(fieldError).toBeVisible()` |
| `forgot_password` | Click en "¿Olvidaste tu contraseña?" | Navega a `/auth/recuperar` (futuro) | — | — |

---

## 7. Criterios de aceptación

1. **Schema válido:**
   - Los tipos `LoginData`, `RegisterData` validan con `npx tsc --noEmit`.
   - Validación Zod para todos los campos.
   - **Verificación:** `npx tsc --noEmit` (sin errores).

2. **UI funcional:**
   - Modal se abre/cierra correctamente.
   - Pestañas de login/registro funcionan.
   - **Verificación:** `npm run dev` + inspección visual.

3. **Login exitoso:**
   - Email + password correctos → sesión creada, modal cerrado, redirección.
   - **Verificación:** Prueba manual con credenciales válidas.

4. **Login fallido:**
   - Email + password incorrectos → mensaje de error "Credenciales inválidas".
   - **Verificación:** Prueba manual con credenciales inválidas.

5. **Registro exitoso:**
   - Datos válidos → usuario creado con rol `ALIADO`, sesión creada, modal cerrado, redirección a `/perfil`.
   - **Verificación:** Prueba manual + verificar en base de datos.

6. **Registro fallido:**
   - Email duplicado → mensaje de error "Este email ya está registrado".
   - Contraseñas no coinciden → error inline en campo.
   - **Verificación:** Prueba manual con email existente y contraseñas distintas.

7. **Validación de campos:**
   - Email inválido → error inline.
   - Contraseña < 8 caracteres → error inline.
   - Campos requeridos vacíos → error inline.
   - **Verificación:** Prueba manual con datos inválidos.

8. **Cierre del modal:**
   - ESC cierra el modal.
   - Click fuera del modal cierra el modal.
   - Botón X cierra el modal.
   - **Verificación:** Prueba manual.

9. **Responsive:**
   - Modal centrado en desktop, fullscreen en mobile (< 768px).
   - **Verificación:** Inspección visual en 320px, 768px, 1280px.

---

## 8. Estándares de UI/UX

**Referencia:** `arnes/nucleo/ESTANDARES_UI.md`.

| Estándar | Aplicación en esta pantalla | § en ESTANDARES_UI.md | Verificación |
|-----------|-------------------------------|-----------------------|--------------|
| Grid fluido | Modal con `max-width: 480px`, centrado con `place-items: center` | §2.1 | Inspección visual |
| Tipografía fluida | Títulos del modal con `clamp(1.25rem, 2.5vw, 1.75rem)` | §3.1 | Inspección visual |
| Hit targets | Inputs ≥ 48px alto, botones ≥ 48px alto | §4.1 | Medición con DevTools |
| Separación táctil | ≥ 12px entre campos del formulario | §4.1 | Medición con DevTools |
| Focus visible | Todos los inputs tienen `:focus-visible` con outline visible | §4.1 | Tabulación con teclado |
| Optimización de imágenes | Sin imágenes (modal de formulario) | — | — |
| Media Queries | Modal fullscreen en < 768px, centrado en ≥ 768px | §7.1 | Inspección visual |

**Verificación general:**
```bash
npx lighthouse http://localhost:3000/ --output=json | grep -E "(accessibility)"
```

---

## 9. Ergonomía Cognitiva

**Referencia:** `arnes/nucleo/ERGONOMIA_COGNITIVA.md`.

| Principio | Aplicación en esta pantalla | § en ERGONOMIA_COGNITIVA.md | Verificación |
|-----------|-------------------------------|-------------------------------|--------------|
| Affordances | Inputs se ven como inputs (borde, padding), botones se ven como botones | §1.1 | Inspección visual |
| Ley de Fitts | Botón "Iniciar sesión" / "Crear cuenta" grande y centrado | §1.2 | Medición de tamaño |
| Patrón Layer-Cake | Título → Pestañas → Formulario → Botón → Links secundarios | §2.2 | Inspección visual |
| Carga cognitiva | Login: 2 campos (email, password). Registro: 6 campos (agrupados lógicamente) | §4.1 | Conteo de campos |
| Jerarquía visual | Título > Pestañas > Campos > Botón > Links | §5.1 | Inspección visual |
| Feedback inmediato | Validación inline al blur, error de submit al enviar | §4.3 | Prueba manual |
| Progreso visible | En registro, los campos se muestran en orden lógico (nombre → email → teléfono → área → password → confirmar) | §4.1 | Inspección visual |
| Reducción de fricción | Link "¿No tienes cuenta? Regístrate" / "¿Ya tienes cuenta? Inicia sesión" para cambiar entre modos sin cerrar | §4.3 | Inspección visual |

**Verificación general:**
- Prueba de usuario: ¿5 usuarios pueden completar login en ≤ 15 segundos?
- Prueba de usuario: ¿5 usuarios pueden completar registro en ≤ 45 segundos?

---

## 10. SEO Técnico

**Referencia:** `arnes/nucleo/SEO_TECNICO.md`.

| Requisito | Aplicación en esta pantalla | § en SEO_TECNICO.md | Verificación |
|-----------|-------------------------------|---------------------|--------------|
| JSON-LD | No aplica (modal, no página independiente) | — | — |
| Meta tags | No aplica (modal overlay) | — | — |
| Semántica HTML | `<dialog>` para el modal, `<form>` para formularios, `<label>` para cada campo | §4.1 | Inspección de DOM |
| Accesibilidad | `aria-modal="true"`, `role="dialog"`, `aria-labelledby`, focus trap dentro del modal | §4.1 | Auditoría con axe-core |
| Formularios | `autocomplete="email"`, `autocomplete="current-password"`, `autocomplete="new-password"` en campos correspondientes | §4.1 | Inspección de DOM |

**Verificación general:**
```bash
npx axe-core http://localhost:3000/
```

---

## 📌 Notas

### Decisiones de diseño:
1. **Modal, no página:** Auth es un modal overlay, no una ruta independiente. Esto permite abrirlo desde cualquier pantalla sin perder contexto.
2. **Pestañas login/registro:** Dos pestañas dentro del mismo modal, no dos modales separados.
3. **Validación con Zod:** Toda validación de campos se hace con Zod en el cliente y en el servidor.
4. **better-auth:** Autenticación manejada por better-auth (adaptador Drizzle + Next.js). No se implementa auth casera.
5. **Password hashing:** scrypt o bcrypt (según better-auth). Nunca SHA-256 sin sal (lección del repo viejo).
6. **Focus trap:** El foco del teclado queda atrapado dentro del modal mientras está abierto.
7. **Campos opcionales:** Teléfono y área de interés son opcionales en registro para reducir fricción.

### Prioridades de implementación:
1. **MVP:** Login + Registro con validación básica.
2. **V1:** Añadir "¿Olvidaste tu contraseña?" (flujo de recuperación).
3. **V2:** Añadir login con OAuth (Google, GitHub).

### Dependencias:
- **better-auth:** Configurado en `lib/auth.ts`.
- **Drizzle + Neon:** Tabla `Usuario` y `Sesion` en la base de datos.
- **Middleware:** `/app/middleware.ts` para redirección post-login.
- **Consumido por:** P01 (navbar, Hero), P03 (tarjetas restringidas), P04 (contenido reservado).

---

## 📄 Estructura de Archivos

```
app/
├── api/
│   └── auth/
│       └── [...path]/
│           └── route.ts            # better-auth handler
lib/
├── auth.ts                         # Configuración de better-auth
├── validations/
│   └── auth.ts                     # Schemas Zod para login/registro
└── components/
    ├── AuthModal.tsx
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    ├── FormField.tsx
    └── AuthError.tsx
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
