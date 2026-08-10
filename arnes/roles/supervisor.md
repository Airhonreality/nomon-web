# Supervisor — Tú

Tú eres el **Supervisor**. Eres el único que decide. Los otros cuatro roles —**Orquestador, Iniciador, Código, QA**— proponen, planean y ejecutan. **Tú apruebas o rechazas.**

---

## La regla central

**Decides mirando el resultado mecánico, no lo que te cuenta el agente.**

Un agente puede decirte "listo, ya funciona" con toda la seguridad del mundo. **Eso no es evidencia.**

La evidencia es el resultado de una verificación automática. Es un archivo, un número, un test que corrió, un resultado que se ve funcionando. **Algo que existe independientemente de lo que el agente crea.**

**Ejemplo concreto para NOMON:**
Un agente dice "el login funciona perfecto con better-auth". **No apruebes.** Pedile que te muestre:
- El test automático que prueba login corriendo (`npx vitest run`).
- Una pantalla con alguien usando login y entrando (screenshot o video).
- El output de `npx tsc --noEmit` y `npx biome check .`.

Si el agente no te puede mostrar eso, **no está listo**, aunque esté completamente seguro.

**Nunca apruebes porque el agente suene seguro. Aprueba porque tú viste funcionar.**

---

## ¿En qué vamos?

Dices: *"¿en qué vamos?"*

El sistema lee sus archivos de estado y te responde. **No depende de la memoria de la conversación.**

Por eso funciona igual si te vas tres semanas y vuelves: le preguntas de nuevo y la respuesta es la misma. **Los archivos son la verdad.**

Si el agente se olvida, los archivos no. Por eso es importante que todo quede grabado: cuál es el plan, qué ya se hizo, qué falta, en qué paso quedó.

---

## Sigue

Dices: *"sigue"*

El sistema arranca el ciclo de trabajo:

1. **Se planifica**: el Iniciador escribe un plan legible, paso a paso, sin código todavía.
2. **Se ejecuta en un espacio aislado**: los cambios no tocan el código vivo hasta que tú digas sí.
3. **Se verifica**: el QA prueba el plan y te reporta si funciona o qué falló.
4. **Te muestra el resultado**: dice "listo, acá está la verificación, mira esto".

**Recién ahí decides si apruebas.**

---

## Volvé al último punto bueno

Dices: *"volvé al último punto bueno"*

El sistema restaura el respaldo anterior. Es tu **botón de deshacer**.

Cuando algo sale mal, no es desastre: siempre hay un respaldo guardado del último estado que tú aprobaste. Vuelves ahí, y arrancas de nuevo.

**No pierdes trabajo.** Simplemente descartas los pasos que no funcionaron.

---

## Cuándo el sistema se frena y por qué

El sistema frena el trabajo en ciertos casos y te pide aprobación antes de seguir. **No te frena en todo.** Acá está la política:

- **Bajo riesgo** — Configura un servidor, organiza carpetas, instala dependencias:
  - El sistema ejecuta, verifica, y te reporta agrupado. **No te para.**
  - Riesgo bajo: si algo sale mal, se arregla fácil.

- **Riesgo alto** — Toca dinero, datos, integraciones externas, o cambia las reglas del propio arnés:
  - El sistema **se detiene.** Te muestra el plan. Te pide aprobación explícita **antes de ejecutar o integrar.**
  - Riesgo alto: si algo sale mal, es caro.

**Por qué no te frena en todo:** Si tuvieras que aprobar cada cosa, terminarías aprobando sin leer. Eso es peor que no tener control. El sistema asume que tú confías en la verificación de lo simple, y reserva el freno para lo que importa.

---

## Cómo aprobar sin leer código

**No necesitas ser programador para dar el visto bueno.** Mira estas cuatro cosas:

1. **¿Qué se pidió?** — Está escrito el objetivo en lenguaje llano (ej: "que el login funcione con better-auth").
2. **¿Qué dice la verificación automática?** — El QA corrió las pruebas. **¿Pasó verde o rojo?**
3. **¿Tocó una zona sensible?** — ¿Se modificó algo que dijo que no toques (ej: `CLAUDE.md`, `AGENTS.md`, `.env`)?
4. **¿Se ve funcionando?** — Si es una característica visual o un flujo de usuario, **¿funciona así de verdad en la pantalla?**

Si alguna de esas cuatro no tiene respuesta clara, **no apruebes.** Pide que te la muestren mejor:
- "Mostrá la prueba ejecutándose."
- "¿Qué zona modificó exactamente?"
- "Pantallazos de cómo se ve ahora."

**Aprueba cuando las cuatro tengan respuesta clara. Rechaza cuando alguna no.**

---

## Cuándo desconfiar

Estas son **señales de alarma.** No significan que el agente sea malo. Significan que su memoria de trabajo se saturó y necesita reiniciarse:

- **Se repite**: el agente intenta lo mismo dos, tres veces y no avanza.
- **Contradice lo que decidieron**: hace lo opuesto a algo que tú ya le dijiste (ej: usa `SHA-256` para contraseñas después de que decidiste usar `scrypt`).
- **Declara terminado algo sin prueba**: dice "listo" pero tú sabes que no se verificó (ej: "el login funciona" sin mostrar el test).
- **No entiende el estado actual**: pregunta cosas que ya pasaron (ej: "¿qué base de datos usamos?" cuando ya está decidido en `docs/09-auditoria-completa-stack.md`).

Si ves esto, **no apruebes que continúe.** Di: *"reinicia contexto"*.

El sistema guarda el estado en un archivo y arranca una sesión limpia. El agente lee el archivo, se reorienta, y sigue. **No se pierde progreso; simplemente se limpia la memoria saturada.**

---

## Lo que nunca deberías hacer

- **Aprobar sin ver la verificación automática.** Si no hay prueba de que funciona (output de `npx vitest run`, `npx tsc --noEmit`, etc.), **no apruebes.**
- **Dejar que el mismo agente que hizo el trabajo sea el único que lo verifique.** Por eso existe el QA como rol separado.
- **Guardar contraseñas, claves, o secretos en archivos que los agentes pueden editar.** Los agentes no son un lugar seguro. Usa:
  - Variables de entorno de Vercel.
  - `.env.local` (nunca versionado).
  - Gestores de secretos (ej: Vercel Secrets).
- **Cambiar el arnés directamente sin pasar por el ciclo plan → dry → confirmación → backup.** Si modificas `AGENTS.md`, `CLAUDE.md`, o `arnes/`, sigue el ciclo de mutación del arnés (§8 en `ARNES_AGENTICO.md`).

---

## Comandos útiles para el Supervisor

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `git status` | Ver cambios pendientes | `git status` |
| `git diff` | Ver diff de cambios | `git diff` |
| `git log --oneline -10` | Ver últimos 10 commits | `git log --oneline -10` |
| `npx tsc --noEmit` | Validar tipos (TypeScript) | `npx tsc --noEmit` |
| `npx biome check .` | Validar lint (Biome) | `npx biome check .` |
| `npx vitest run` | Ejecutar tests | `npx vitest run` |
| `npx next build` | Build de Next.js | `npx next build` |
| `npx drizzle-kit generate` | Validar schema (Drizzle) | `npx drizzle-kit generate` |
| `vercel --prod` | Deploy a producción | `vercel --prod` |

---

## Checkpoints obligatorios para NOMON

El sistema **siempre te pedirá aprobación explícita** antes de:

1. **Mergear `dev` → `main`** (corte final de producción).
2. **Modificar `AGENTS.md` o `CLAUDE.md`** (mutación del arnés).
3. **Tocar la base de datos de producción** (Neon real).
4. **Configurar variables de entorno sensibles** (ej: `DATABASE_URL`, `RESEND_API_KEY`).
5. **Cambiar el stack técnico** (ej: reemplazar Drizzle por Prisma).

---

## Flujo de trabajo recomendado

1. **Preguntar estado:** *"¿en qué vamos?"* → Revisar `arnes/estado.md`.
2. **Revisar tareas pendientes:** *"¿qué falta?"* → Revisar `arnes/tareas/` y `arnes/lineas/web-publico/estado_web-publico.md`.
3. **Aprobar tareas:** *"aprueba t-030"* → Revisar veredicto de QA en `arnes/tareas/t-030.json`.
4. **Rechazar tareas:** *"rechaza t-030"* → Explicar motivo (ej: "falta output de `npx vitest run`").
5. **Siguiente paso:** *"sigue"* → El sistema avanza a la siguiente tarea.
6. **Reiniciar contexto:** *"reinicia contexto"* → Si el agente se repite o contradice decisiones.
7. **Volver atrás:** *"volvé al último punto bueno"* → Restaurar respaldo.

---

## Resumen: Tu rol en una frase

**Tú eres el dueño del proyecto. Los agentes trabajan para ti, no al revés.**

Tu trabajo es:
1. **Definir el qué** (objetivos, decisiones).
2. **Aprobar el cómo** (planes, ejecuciones).
3. **Garantizar la calidad** (verificación mecánica).

El arnés existe para que tú **no tengas que microgestionar cada línea de código**, pero **siempre tengas el control final.**
