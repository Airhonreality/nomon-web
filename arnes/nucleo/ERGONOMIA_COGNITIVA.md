# ERGONOMÍA COGNITIVA — NOMON

**Contrato vivo.** Principios de diseño centrado en el usuario para minimizar la carga cognitiva y maximizar la usabilidad. **Regla:** Todo flujo de usuario debe alinearse con estos principios.

**Fuentes:**
- `INS_ergonomía cognitiva para el diseño de experiencia.md` (teoría base, ley de Fitts, conciencia de la situación).
- `Practicas de codivo UX y responisve.md` (patrón Layer-Cake, geometría de interacción).

---

## 1. Teoría Base

### 1.1 Affordances (James J. Gibson, 1966)
**Definición:** Las propiedades de un objeto (físico o digital) que **sugieren** su modo de uso.

**Aplicación en UI:**
- Un botón debe **parecer clickeable** (sombra, color de acento, cursor `pointer`).
- Un campo de texto debe **parecer editable** (borde, placeholder).
- Un enlace debe **parecer naveggable** (subrayado, color diferente).

**Ejemplo para NOMON:**
- **✅ Bueno:** Botón con `background-color: var(--color-wood-raw)`, `cursor: pointer`, y `box-shadow`.
- **❌ Malo:** Texto plano sin indicación visual de que es interactivo.

### 1.2 Ley de Fitts (Paul Fitts, 1954)
**Fórmula:**
```
MT = a + b * log₂(D / W + 1)
```
- `MT`: Tiempo de movimiento (ms).
- `D`: Distancia al objetivo (píxeles).
- `W`: Ancho del objetivo (píxeles).
- `a`, `b`: Constantes empíricas (≈ 50ms y 150ms para mouse).

**Implicaciones para NOMON:**
1. **Minimizar `D`:** Botones importantes deben estar **cerca** del cursor/pulgar.
2. **Maximizar `W`:** Botones importantes deben ser **grandes** (ver `ESTANDARES_UI.md` §4.1).
3. **Zonas de alta precisión:**
   - **Desktop:** Centro de la pantalla (cursor).
   - **Móvil:** Centro inferior (pulgar).

**Ejemplo (menú de navegación):**
```css
/* ❌ Malo: Botones pequeños y lejanos */
.nav-link {
  padding: 0.25rem 0.5rem;
  margin: 0 2rem; /* Gran distancia entre botones */
}

/* ✅ Bueno: Botones grandes y cercanos */
.nav-link {
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem; /* Pequeña distancia */
}
```

### 1.3 Teoría de la Conciencia de la Situación (Endsley, 1995)
**Niveles:**
1. **Percepción:** ¿Qué elementos están en la pantalla?
2. **Comprensión:** ¿Qué significan esos elementos?
3. **Proyección:** ¿Qué pasará si interactúo con ellos?

**Aplicación en NOMON:**
- **Nivel 1 (Percepción):**
  - Usar **contraste suficiente** (WCAG AA: 4.5:1).
  - Evitar **sobrecarga visual** (máximo 7 elementos por pantalla).
- **Nivel 2 (Comprensión):**
  - **Labels claros** (usar `glosario.md`).
  - **Iconos + texto** (nunca solo iconos).
- **Nivel 3 (Proyección):**
  - **Feedback visual** (ej: `:hover`, `:active`).
  - **Confirmación explícita** (ej: toast después de enviar formulario).

---

## 2. Patrón Layer-Cake (Evitar Patrón en F)

### 2.1 El Problema: Patrón en F
- **Definición:** Los usuarios escanean la pantalla en forma de **F** (izquierda a derecha, arriba a abajo).
- **Resultado:** El **70% del contenido** en la parte derecha/inferior es **ignorado**.

### 2.2 La Solución: Patrón Layer-Cake
**Estructura en capas** que guía al usuario de forma natural:

1. **Capa 1 (Encabezado):**
   - Título principal (`h1`).
   - Subtítulo descriptivo.
   - CTA primario (ej: "Únete a NOMON").

2. **Capa 2 (Cuerpo):**
   - Contenido principal en **bloques visualmente distintos**.
   - **Subtítulos jerárquicos** (`h2`, `h3`).
   - **Palabras clave en negrita** (`font-semibold`).

3. **Capa 3 (Pie):**
   - Resumen o CTA secundario.
   - Links relacionados.

**Ejemplo para NOMON (`/`):**
```markdown
# NOMON (h1)
Ideas que echan raíces, acciones que transforman. (subtítulo)
[Únete a NOMON] (CTA primario)

---

## Nuestros Nodos de Acción (h2)
- **Gubernamental** (negrita) → Fortalecimiento institucional...
- **Corporativo** (negrita) → Transformación de la cultura...
- **Académico** (negrita) → Investigación aplicada...
- **Jurídico** (negrita) → Blindaje legal...

---

[Conoce más sobre el Simposio] (CTA secundario)
```

### 2.3 Técnicas para Implementar Layer-Cake
| Técnica | Descripción | Ejemplo en NOMON |
|---------|-------------|------------------|
| **Subtítulos jerárquicos** | `h1` > `h2` > `h3` | `/recursos` |
| **Palabras clave en negrita** | Destacar términos importantes | `glosario.md` |
| **Listas con iconos** | Romper fatiga visual | `disenio_P01_inicio.md` |
| **Bloques visuales distintos** | Tarjetas, secciones con fondo alterno | `/simposio` |
| **CTA en capas clave** | Primario en encabezado, secundario en pie | Todas las pantallas |

---

## 3. Geometría de Interacción

### 3.1 Zonas del Pulgar (Mobile Thumb Zone)
**Distribución de precisión táctil en móviles:**

```
+---------------------+
|         ROJO         |  (Baja precisión)    |
|  Esquina superior    |  Evitar botones      |
+----------+----------+
| AMARILLO | AMARILLO |  (Precisión media)   |
|  Izquierda | Derecha  |  Botones secundarios |
+----------+----------+
|         VERDE        |  (Alta precisión)    |
|  Centro inferior     |  Botones primarios   |
+---------------------+
```

**Recomendaciones para NOMON:**
- **Botones primarios (CTA):** **Zona verde** (centro inferior).
  - Ejemplo: Botón "Descargar PDF" en `/recursos/:slug`.
- **Botones secundarios:** **Zona amarilla** (centro).
  - Ejemplo: Botón "Compartir" en `/simposio`.
- **Evitar:** **Zona roja** (esquinas superiores).

**Ejemplo (pantalla de recurso):**
```css
/* Botón primario (CTA) en zona verde */
.boton-descargar {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

/* Botón secundario en zona amarilla */
.boton-compartir {
  position: fixed;
  top: 50%;
  right: 1rem;
}
```

### 3.2 Tamaño del Objetivo de Toque
**Estándares (ver `ESTANDARES_UI.md` §4.1):**
- **Mínimo:** `48x48px` (Google/Material Design).
- **Separación:** `8px` entre elementos contiguos.

**Regla para NOMON:**
- **Botones:** `min-width: 48px`, `min-height: 48px`.
- **Enlaces:** `padding: 0.5rem` (para alcanzar 48px de área clickeable).
- **Iconos:** `font-size: 1.5rem` + `padding: 0.75rem` (total: 48px).

### 3.3 Media Queries para Interacción
**Adaptar el comportamiento según el dispositivo de entrada.**

#### Hover Condicional
**Problema:** Los efectos `:hover` no son útiles en pantallas táctiles.
**Solución:** Encapsular `:hover` en una media query que detecte soporte.

```css
/* Base (sin hover) */
.boton {
  background-color: var(--color-wood-raw);
}

/* Hover solo para dispositivos con soporte */
@media not all and (hover: none) {
  .boton:hover {
    background-color: var(--color-contrast-luxury);
    transform: translateY(-2px);
  }
}
```

#### Pointer Coarse (Dispositivos Táctiles)
**Aumentar el tamaño de los objetivos en pantallas táctiles.**

```css
/* Base (desktop) */
.boton {
  padding: 0.75rem 1.5rem;
}

/* Táctil (móvil/tablet) */
@media (pointer: coarse) {
  .boton {
    padding: 1.25rem 2.25rem; /* +50% de tamaño */
  }
}
```

---

## 4. Carga Cognitiva

### 4.1 Regla de los 7 ± 2 (George A. Miller, 1956)
**Definición:** La memoria de trabajo humana puede retener **7 ± 2 elementos** (5–9) simultáneamente.

**Aplicación en NOMON:**
- **Menús:** Máximo **7 ítems** (ej: navbar).
- **Listas:** Máximo **9 ítems** por página (usar paginación).
- **Formularios:** Máximo **7 campos** por sección (agrupar en pasos).

**Ejemplo (navbar de NOMON):**
```markdown
# Menú principal (máximo 7 ítems)
1. Inicio
2. Simposio
3. Recursos
4. Perfil (si autenticado)
5. Correo (si ADMIN)
```

### 4.2 Minimizar Distractores
**Regla:** Eliminar elementos que no contribuyan a la tarea principal.

**Ejemplo (pantalla de login):**
- **✅ Bueno:** Solo formulario de login + logo.
- **❌ Malo:** Formulario + banner + noticias + enlaces a redes sociales.

### 4.3 Feedback Inmediato
**Regla:** El usuario debe recibir confirmación visual en **< 100ms** para acciones críticas.

**Ejemplo para NOMON:**
- **Login:** Spinner + mensaje "Iniciando sesión..." al enviar formulario.
- **Descarga:** Toast "Descargando..." al hacer click en botón de PDF.
- **Error:** Mensaje claro en rojo (ej: "Email o contraseña incorrectos").

**Implementación:**
```tsx
// Ejemplo con React + Toast
const handleLogin = async () => {
  const toastId = toast.loading("Iniciando sesión...");
  try {
    await loginUser(email, password);
    toast.success("¡Bienvenido!", { id: toastId });
  } catch (error) {
    toast.error("Email o contraseña incorrectos", { id: toastId });
  }
};
```

### 4.4 Progresión Visual
**Regla:** Guiar al usuario con **señales visuales** (flechas, breadcrumbs, progreso).

**Ejemplo (formulario de registro):**
```tsx
// Paso 1: Datos básicos
// Paso 2: Área de interés
// Paso 3: Confirmación

const [step, setStep] = useState(1);
return (
  <div>
    <div className="steps">
      {[1, 2, 3].map((s) => (
        <div key={s} className={s <= step ? "active" : "pending"}>
          Paso {s}
        </div>
      ))}
    </div>
    {step === 1 && <DatosBasicos onNext={() => setStep(2)} />}
    {step === 2 && <AreaInteres onNext={() => setStep(3)} />}
    {step === 3 && <Confirmacion />}
  </div>
);
```

---

## 5. Arquitectura de Lectura

### 5.1 Jerarquía Visual
**Regla:** El usuario debe poder **escanean** la pantalla en **< 3 segundos** y entender su propósito.

**Técnicas:**
1. **Tamaño:** `h1` > `h2` > `h3` > `p`.
2. **Color:** Texto principal (`--color-text-main`) > texto secundario (`--color-text-sub`).
3. **Espaciado:** Más espacio entre secciones, menos dentro de una sección.
4. **Alineación:**
   - **Izquierda:** Textos descriptivos.
   - **Derecha:** Números, fechas, importes.
   - **Centro:** Títulos, badges de estado.

**Ejemplo (tarjeta de recurso):**
```tsx
<div className="recurso-card">
  <h3 className="titulo">Guía de Ética Empresarial 2026</h3> {/* Izquierda */}
  <p className="autor">Ana López</p> {/* Izquierda */}
  <div className="meta">
    <span className="anio">2026</span> {/* Derecha */}
    <span className="acceso">Público</span> {/* Centro */}
  </div>
</div>
```

### 5.2 Alineación de Datos
**Regla:** Facilitar la comparación visual.

| Tipo de dato | Alineación | Ejemplo |
|-------------|------------|---------|
| Texto descriptivo | Izquierda | "Guía de Ética Empresarial" |
| Números | Derecha | "2026" |
| Fechas | Derecha | "15/11/2026" |
| Importes | Derecha | "$100.00" |
| Badges/Estados | Centro | "Público" |

**Ejemplo (tabla de recursos):**
```css
.tabla-recursos th.numerico,
.tabla-recursos td.numerico {
  text-align: right;
}
```

### 5.3 Tablas de Datos
**Recomendaciones:**
- **Altura de filas:**
  - **Cómoda:** 48–52px (lectura detallada).
  - **Densa:** 36–40px (gran volumen de datos).
- **Scroll horizontal:** Usar `overflow-x: auto` en lugar de colapsar filas en tarjetas.
  ```css
  .tabla-container {
    overflow-x: auto;
  }
  .tabla-recursos {
    min-width: 600px; /* Ancho mínimo para evitar colapso */
  }
  ```
- **Fija primera columna:**
  ```css
  .tabla-recursos th:first-child,
  .tabla-recursos td:first-child {
    position: sticky;
    left: 0;
    background: var(--color-bg-light);
    z-index: 1;
  }
  ```

---

## 6. Checklist de Ergonomía Cognitiva

### 6.1 Antes de Diseñar una Pantalla
- [ ] **Affordances:** ¿Los elementos interactivos sugieren su función?
- [ ] **Ley de Fitts:** ¿Los botones importantes están cerca y son grandes?
- [ ] **Patrón Layer-Cake:** ¿El contenido está organizado en capas claras?
- [ ] **Carga cognitiva:** ¿Hay ≤ 7 elementos principales por pantalla?
- [ ] **Jerarquía visual:** ¿El usuario puede escanear la pantalla en < 3 segundos?

### 6.2 Antes de Implementar
- [ ] **Hit targets:** ¿Todos los botones/enlaces tienen ≥ 48x48px?
- [ ] **Separación:** ¿Hay ≥ 8px entre elementos interactivos contiguos?
- [ ] **Zonas del pulgar:** ¿Los botones primarios están en la zona verde?
- [ ] **Feedback:** ¿Todas las acciones críticas tienen confirmación visual?
- [ ] **Teclado:** ¿Todos los elementos son accesibles vía teclado?

### 6.3 Antes de Deploy
- [ ] **Prueba de usuario:** ¿5 usuarios pueden completar la tarea principal sin ayuda?
- [ ] **Prueba de tiempo:** ¿El tiempo promedio para completar la tarea es ≤ 30 segundos?
- [ ] **Prueba de error:** ¿La tasa de error es ≤ 5%?
