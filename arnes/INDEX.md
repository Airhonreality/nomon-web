# Índice de contexto — Arnés

Este índice se mantiene corto a propósito. Existe para que un agente sepa qué leer al arrancar, sin cargar el proyecto entero a su memoria de trabajo.

**Regla de oro:** Borrar lo obsoleto, no acumularlo. Cuando algo deja de ser cierto, se borra. No se marca obsoleto y se deja ahí.

---

## Contexto activo

Lee en este orden:

1. **AGENTS.md** — Zonas, prohibiciones, comandos de verificación. **La ley del arnés.**
2. **estado.md** — Dashboard del estado actual del proyecto.
3. **ARNES_AGENTICO.md** — Principios agnósticos del arnés (documento maestro).
4. **nucleo/REGISTRO_DE_ENTIDADES.md** — Schema canónico (~4 entidades iniciales: Usuario, Recurso, Mensaje, Slide).
5. **nucleo/logica_de_negocio.md** — Mapa maestro del negocio (flujos de auth, acceso a recursos, correo).
6. **nucleo/glosario.md** — Vocabulario de UI (labels, estados, verbos).
7. **lineas/REGISTRO_LINEAS.md** — Índice de líneas de trabajo activas.

---

## Estructura del arnés (Matryoshka por línea de trabajo)

```
arnes/
├── ARNES_AGENTICO.md           # Principios agnósticos (documento maestro)
├── AGENTS.md                  # Zonas, prohibiciones, comandos (fuente de verdad)
├── INDEX.md                   # Este documento
├── estado.md                  # Dashboard del estado actual
├── MODELOS.md                 # Stack de modelos de IA (rotación/intercalación)
│
├── nucleo/                    # Verdad de negocio compartida (contratos vivos)
│   ├── REGISTRO_DE_ENTIDADES.md  # Schema canónico
│   ├── logica_de_negocio.md     # Mapa maestro del negocio
│   └── glosario.md             # Vocabulario de UI
│
├── lineas/                    # Líneas de trabajo paralelas
│   ├── REGISTRO_LINEAS.md       # Índice de líneas
│   ├── _plantilla/              # Plantilla para nuevas líneas
│   │   └── LEEME.md
│   ├── web-publico/             # Línea 1: Web público (6 pantallas)
│   │   ├── estado_web-publico.md
│   │   ├── plan_web-publico.md
│   │   ├── pantallas/           # Diseños de pantallas (F2–F7)
│   │   │   ├── PLANTILLA_PANTALLA.md
│   │   │   └── disenio_PXX.md
│   │   ├── tecnico/              # Schema/Lógica (F0/F1) + Hardening/QA (F8/F9)
│   │   │   ├── PLANTILLA_HARDENING.md
│   │   │   └── PLANTILLA_QA.md
│   │   └── archivo/             # Histórico
│   │
│   └── os-interno/              # Línea 2: OS interno (futuro)
│       ├── estado_os-interno.md
│       ├── plan_os-interno.md
│       └── archivo/
│
├── roles/                     # Contratos de los 5 roles
│   ├── orquestador.md
│   ├── iniciador.md
│   ├── codigo.md
│   ├── qa.md
│   └── supervisor.md
│
└── tareas/                    # Ledger compartido (t-001, t-002, ...)
```

---

## Documentos de referencia externa

- **Stack técnico:** `docs/06-stack-y-proceso.md` (stack propuesto) + `docs/09-auditoria-completa-stack.md` (auditoría ponderada).
- **Diseño de pantallas:** `docs/design/` (00–05).
- **Decisiones del proyecto:** `CLAUDE.md` (reglas del repo).

---

## Archivado

Vacío. Cuando algo deja de ser relevante, se borra de esta lista, no se marca "obsoleto".
