# MODELOS — Registro de modelos (contrato vivo del stack agéntico)

**Estado:** PROMOVIDO 2026-08-08 (contrato vivo). Este registro es la fuente única de verdad para la **rotación / intercalación de modelos** de los agentes OpenCode del arnés.

**Regla:** Si este documento difiere de cualquier otra fuente sobre qué modelo usar, gana este.

**Por qué existe:** Este documento define qué modelos free están desbloqueados hoy, en qué proveedor, y cómo intercalarlos. **NOMON usa múltiples modelos de IA** para evitar la "ansiedad de contexto" y garantizar diversidad de perspectivas.

---

## 0. Cómo se usa (regla de rotación, no negociable)

- **Nunca el mismo modelo dos veces seguidas** para tareas encadenadas (§ARIES Diseño / roles).
- Cada subagente usa UNA identidad de modelo; el `ejecutor` y su `verificador` usan modelos distintos.
- **Intercalamos entre dos proveedores free**: capa `opencode` (zen) + capa `OpenRouter`.
- En el bucle agéntico vigente se fija **6 OpenRouter : 3 opencode** (por defecto).
- Si un modelo falla en runtime o devuelve salida no verificable, se marca `bloqueado` y se reemplaza por el siguiente **desbloqueado** de la misma capa.

---

## 1. Inventario completo de modelos free (verificado 2026-08-08)

### 1.1 Capa `opencode` (proveedor zen, nativo de OpenCode)

| model_id (opencode/...) | rol sugerido | consumo |
|-------------------------|--------------|---------|
| `big-pickle` | razonamiento general | medio |
| `deepseek-v4-flash-free` | liviano/transcribe | bajo |
| `laguna-s-2.1-free` | lectura/rastreo medio | bajo |
| `ling-3.0-tiny-free` | muy liviano, clasificación | muy bajo |
| `longcat-2.0-free` | contexto largo, resúmenes | medio |
| `mimo-v2.5-free` | medio/texto | medio |
| `nemotron-3-ultra-free` | razonamiento fuerte | alto |
| `north-mini-code-free` | código/JSON estricto | bajo |

### 1.2 Capa OpenRouter (free tier, `:free`, precio $0)

| model_id (openrouter/...) | ctx | rol sugerido |
|---------------------------|-----|--------------|
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1M | razonamiento fuerte (análisis trazabilidad pesada) |
| `nvidia/nemotron-3-super-120b-a12b:free` | 262k | razonamiento pesado |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 256k | razonamiento acotado |
| `nvidia/nemotron-3-nano-30b-a3b:free` | 256k | razonamiento ligero |
| `google/gemma-4-31b-it:free` | 262k | razonamiento sólido |
| `google/gemma-4-26b-a4b-it:free` | 262k | multilingüe razonable |
| `openai/gpt-oss-20b:free` | 131k | clínico/razonamiento |
| `cohere/north-mini-code:free` | 256k | código/JSON estricto |

---

## 2. Intercalación inteligente OPENROUTER vs OPENCODE (política)

**Regla de equilibrio en cada bucle de subagentes (por defecto 6 OpenRouter : 3 opencode):**

- **OpenRouter** para las tareas de razonamiento/profundidad (saltos R1-R4, reconciliación de naming, trazado al punto-0): por su mayor contexto (256k-1M) y razonamiento fuerte (Nemotron-3, Gemma-4).
- **opencode/zen** para tareas de acoplamiento/transcripción/verificación rápida (salida JSON estándar, checks mecánicos livianos): por economía de rate y respuesta rápida.

**Encadenado:** Nunca el mismo proveedor-modelo dos veces; alternar capa cuando el lote lo permita.

---

## 3. Importancia de mantener actualizado el stack preferido / desbloqueado

- Los modelos **free tier cambian**: entradas/salidas de `:free`, se desbloquean/reenuevan tasas, y el catálogo OpenRouter muta.
- La **reevaluación del registro** hay que hacerla con evidencia real:
  - `opencode models` (capa opencode).
  - `GET /api/v1/models` con credenciales OpenRouter (capa OpenRouter).
- **Actualizar este archivo** en el MISMO commit en que se cambia el stack (living documentación §2.C de ARNES_AGENTICO).

---

## 4. Estado por modelo (desbloqueado / bloqueado)

**Verificado al PROMOCIÓN 2026-08-08.**

| model_id | estado | nota |
|----------|--------|------|
| `openrouter/nvidia/nemotron-3-ultra-550b-a55b:free` | desbloqueado | — |
| `openrouter/nvidia/nemotron-3-super-120b-a12b:free` | desbloqueado | — |
| `openrouter/google/gemma-4-31b-it:free` | desbloqueado | — |
| `openrouter/openai/gpt-oss-20b:free` | desbloqueado | — |
| `opencode/deepseek-v4-flash-free` | desbloqueado | — |
| `opencode/big-pickle` | desbloqueado | — |
| `opencode/laguna-s-2.1-free` | desbloqueado | — |

**Nota:** Los modelos `:free` de menor capacidad (ej: `nvidia/nemotron-nano-9b-v2:free`) quedan en el inventario completo de §1, pero la rotación activa del proyecto usa la matriz de §2.
