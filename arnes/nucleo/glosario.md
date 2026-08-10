# Glosario — NOMON

**Contrato vivo.** Vocabulario de UI: entidades, estados, verbos y mapeo campo-schema → nombre natural. **Regla:** Consumir este documento **ANTES** de escribir labels en cualquier pantalla.

---

## 1. Entidades

| Entidad | Nombre natural | Descripción | § en REGISTRO_DE_ENTIDADES |
|---------|----------------|-------------|-----------------------------|
| `Usuario` | Aliado / Administrador | Persona registrada en el sistema. Puede ser `ALIADO` o `ADMIN`. | §1 |
| `Sesion` | Sesión activa | Token de autenticación asociado a un usuario. | §1 |
| `Recurso` | Documento / Material | Ítem en la biblioteca de NOMON (PDF, artículo, material). | §2 |
| `RecursoMetadata` | Metadatos del recurso | Información bibliográfica (autor, editorial, año, etc.). | §2 |
| `RecursoAcceso` | Lista blanca | Emails autorizados para acceder a un recurso restringido. | §2 |
| `Slide` | Diapositiva | Contenido del Simposio Internacional de Ética. | §3 |
| `Mensaje` | Correo | Mensaje en la bandeja corporativa (`contacto@rednomon.com`). | §4 |
| `Tarea` | Tarea | Ítem de trabajo en el OS interno (futuro). | §5 |
| `Proyecto` | Proyecto | Conjunto de tareas en el OS interno (futuro). | §5 |
| `Cronograma` | Cronograma | Línea de tiempo de un proyecto (futuro). | §5 |
| `Etapa` | Etapa | Fase de un cronograma (futuro). | §5 |

---

## 2. Estados

### 2.1 Estados de Usuario

| Estado | Descripción | Transiciones | § en REGISTRO_DE_ENTIDADES |
|--------|-------------|--------------|-----------------------------|
| `no_autenticado` | Usuario sin sesión activa. | → `autenticado` (login/registro) | §1 |
| `autenticado` | Usuario con sesión válida. | → `no_autenticado` (logout) | §1 |

### 2.2 Estados de Recurso (Acceso)

| Estado | Descripción | Requisito | § en REGISTRO_DE_ENTIDADES |
|--------|-------------|-----------|-----------------------------|
| `PUBLICO` | Accesible a todos. | Ninguno. | §2 |
| `SOLO_REGISTRADOS` | Accesible solo con sesión. | `Sesion` válida (E-02). | §2 |
| `LISTA_BLANCA` | Accesible solo para emails autorizados. | `Usuario.email` en `RecursoAcceso` (E-04). | §2 |

### 2.3 Estados de Mensaje

| Estado | Descripción | Transiciones | § en REGISTRO_DE_ENTIDADES |
|--------|-------------|--------------|-----------------------------|
| `ENVIADO` | Mensaje enviado por NOMON. | — | §4 |
| `RECIBIDO` | Mensaje recibido en `contacto@rednomon.com`. | — | §4 |

### 2.4 Estados de Tarea (OS Interno)

| Estado | Descripción | Transiciones | § en REGISTRO_DE_ENTIDADES |
|--------|-------------|--------------|-----------------------------|
| `pendiente` | Tarea creada, no iniciada. | → `en_progreso` | §5 |
| `en_progreso` | Tarea en trabajo. | → `completada` / `cancelada` | §5 |
| `completada` | Tarea finalizada. | — | §5 |
| `cancelada` | Tarea descartada. | — | §5 |

---

## 3. Verbos

| Verbo | Acción | Contexto | Ejemplo de UI |
|-------|--------|----------|---------------|
| `registrar` | Crear un nuevo usuario. | Auth | "Registrarse" / "Únete a NOMON" |
| `autenticar` | Iniciar sesión. | Auth | "Iniciar sesión" / "Ingresar" |
| `cerrar_sesion` | Finalizar sesión. | Auth | "Cerrar sesión" / "Salir" |
| `autorizar` | Verificar acceso a un recurso. | Recursos | — (backend) |
| `listar` | Mostrar múltiples ítems. | Recursos, Mensajes | "Listado de recursos" |
| `detallar` | Mostrar información completa de un ítem. | Recursos, Mensajes | "Ver detalle" |
| `descargar` | Obtener el PDF de un recurso. | Recursos | "Descargar PDF" |
| `enviar` | Enviar un mensaje. | Correo | "Enviar" |
| `responder` | Responder un mensaje. | Correo | "Responder" |
| `asignar` | Asignar una tarea a un usuario. | OS Interno | "Asignar a..." |
| `completar` | Marcar una tarea como finalizada. | OS Interno | "Marcar como completada" |

---

## 4. Campos → Labels (Mapeo para UI)

### 4.1 Usuario

| Campo (Schema) | Label (UI) | Tipo | Ejemplo |
|---------------|------------|------|---------|
| `nombre` | Nombre completo | Text | "Juan Pérez" |
| `email` | Correo electrónico | Email | "juan@ejemplo.com" |
| `telefono` | Teléfono | Tel | "+57 300 1234567" |
| `area_interes` | Área de interés | Select | "Gubernamental" |
| `rol` | Rol | Badge | "Administrador" / "Aliado" |
| `bio` | Biografía | Textarea | "Especialista en ética corporativa..." |
| `tags` | Etiquetas | Chips | "Ética", "Compliance" |
| `fecha_registro` | Fecha de registro | Date | "01/01/2026" |

### 4.2 Recurso

| Campo (Schema) | Label (UI) | Tipo | Ejemplo |
|---------------|------------|------|---------|
| `slug` | — | Hidden | "etica-empresarial-2026" |
| `titulo` | Título | Text | "Guía de Ética Empresarial 2026" |
| `imagen` | Imagen | Image | URL de R2 |
| `metadata.autor` | Autor | Text | "NOMON" |
| `metadata.editorial` | Editorial | Text | "Editorial NOMON" |
| `metadata.anio` | Año | Text | "2026" |
| `metadata.doi_isbn` | DOI/ISBN | Text | "978-1234567890" |
| `metadata.licencia` | Licencia | Text | "CC BY-NC" |
| `metadata.idioma` | Idioma | Text | "Español" |
| `metadata.curador` | Curador | Text | "Ana López" |
| `metadata.razon_nomon` | ¿Por qué está en NOMON? | Text | "Documento base para el Simposio 2026" |
| `pdf_url` | PDF | Link | "Descargar" |
| `acceso.estrategia` | Visibilidad | Select | "Público" / "Solo registrados" / "Lista blanca" |
| `contenido` | Contenido | Rich Text | "Este documento aborda..." |

### 4.3 Mensaje (Correo)

| Campo (Schema) | Label (UI) | Tipo | Ejemplo |
|---------------|------------|------|---------|
| `direccion` | Tipo | Badge | "Enviado" / "Recibido" |
| `de` | De | Text | "contacto@rednomon.com" |
| `para` | Para | Text | "juan@aliado.com" |
| `asunto` | Asunto | Text | "Invitación al Simposio 2026" |
| `cuerpo` | Cuerpo | Textarea | "Estimado Juan,..." |
| `fecha` | Fecha | Date | "01/01/2026 10:00 AM" |
| `aliado_ref` | Aliado | Text | "Juan Pérez" (si `de`/`para` coincide con un `Usuario`) |

### 4.4 Slide (Simposio)

| Campo (Schema) | Label (UI) | Tipo | Ejemplo |
|---------------|------------|------|---------|
| `title` | Título | Heading | "Marco Teórico" |
| `subtitle` | Subtítulo | Subheading | "Fundamentos de la ética aplicada" |
| `content` | Contenido | Text | "La ética es..." |
| `readMoreTitle` | Título (Leer más) | Text | "Profundizando en el marco" |
| `readMoreContent` | Contenido (Leer más) | Rich Text | "En este apartado..." |
| `bullets` | Viñetas | List | ["Punto 1", "Punto 2"] |
| `accent` | Color de acento | Color | "#FF5722" |

---

## 5. Mensajes de Sistema

| Código | Mensaje | Contexto | Acción |
|--------|---------|----------|--------|
| `AUTH_REQUIRED` | "Debes iniciar sesión para acceder a este contenido." | Middleware | Redirigir a `/` + abrir modal de login |
| `ADMIN_REQUIRED` | "Esta sección requiere permisos de administrador." | Middleware (`/correo`) | Redirigir a `/` |
| `RESOURCE_RESERVED` | "Contenido reservado. Si crees que deberías tener acceso, contacta a un administrador." | Recurso (LISTA_BLANCA) | Mostrar mensaje + botón "Contactar" |
| `NOT_FOUND` | "No se encontró el recurso solicitado." | 404 | Mostrar página de error |
| `SERVER_ERROR` | "Ocurrió un error. Por favor, inténtalo de nuevo más tarde." | 500 | Mostrar página de error |
| `EMAIL_SENT` | "Mensaje enviado correctamente." | Correo | Mostrar toast + limpiar formulario |
| `EMAIL_FAILED` | "No se pudo enviar el mensaje. Verifica los datos e inténtalo de nuevo." | Correo | Mostrar error en formulario |

---

## 6. Nomenclatura de Rutas

| Ruta | Nombre (UI) | Descripción |
|------|-------------|-------------|
| `/` | Inicio | Página principal con 4 nodos de acción |
| `/simposio` | Simposio | Deck del Simposio Internacional de Ética |
| `/recursos` | Recursos | Listado de la biblioteca |
| `/recursos/:slug` | Detalle de Recurso | Ficha completa de un recurso |
| `/perfil` | Perfil | Datos del usuario autenticado |
| `/correo` | Correo | Bandeja corporativa (solo ADMIN) |

---

## 7. Reglas de UI

1. **Nombres descriptivos:** Usar términos del glosario. **Prohibido:** "soberano", "resonancia", "materia" (ver `CLAUDE.md` §3).
2. **Singular > Plural:** "Recurso" (no "Recursos") en labels de formularios.
3. **Verbos en infinitivo:** "Registrar", "Iniciar sesión", "Descargar".
4. **Mayúsculas en botones:** "Registrarse", "Iniciar Sesión", "Enviar".
5. **Minúsculas en labels:** "Correo electrónico", "Contraseña".
6. **Badges para estados:** Usar badges para `PUBLICO`, `SOLO_REGISTRADOS`, `LISTA_BLANCA`, `ENVIADO`, `RECIBIDO`.
7. **Tooltips para iconos:** Siempre incluir `aria-label` o `title` en iconos.

---

## 8. Ejemplos de Uso en Componentes

### 8.1 Botón de Login/Logout
```tsx
// Si NO hay sesión:
<Button variant="primary" onClick={openAuthModal}>
  Iniciar sesión
</Button>

// Si hay sesión:
<Button variant="secondary" onClick={logout}>
  Cerrar sesión
</Button>
```

### 8.2 Badge de Acceso (Recurso)
```tsx
const accesoLabels = {
  PUBLICO: "Público",
  SOLO_REGISTRADOS: "Solo registrados",
  LISTA_BLANCA: "Lista blanca",
};

<Badge variant={recurso.acceso.estrategia === "PUBLICO" ? "success" : "warning"}>
  {accesoLabels[recurso.acceso.estrategia]}
</Badge>
```

### 8.3 Mensaje de Error (Recurso Reservado)
```tsx
if (recurso.acceso.estrategia === "LISTA_BLANCA" && !tieneAcceso) {
  return (
    <Alert variant="warning">
      <Alert.Title>Contenido reservado</Alert.Title>
      <Alert.Description>
        Si crees que deberías tener acceso, contacta a un administrador.
      </Alert.Description>
    </Alert>
  );
}
```
