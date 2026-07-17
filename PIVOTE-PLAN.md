# PIVOTE-PLAN.md — Ethoz Landing · Reposicionamiento "Escudo Legal de Convivencia"

> **Fecha:** 2026-07-17 · **Origen:** sesión estratégica en Vault (7 investigaciones, 60+ fuentes)
> **Evidencia completa:** `/Volumes/External Drive/Vault/Output/reports/ethoz-evaluacion/evaluacion-vc-ethoz.html`
> **Para el agente ejecutor:** lee este archivo + `CLAUDE.md` + `PRODUCT.md` + `.impeccable.md` antes de tocar nada. El design system (Cal.com aesthetic, Cal black, dark bands solo al final) NO cambia — esto es un cambio de **mensaje y arquitectura de contenido**, no de diseño. Todo texto vía `t()` (es/en). Ejecutar por paquetes (L0 → …).
> **Prioridad:** este repo va ANTES que ethoz-app — el landing soporta el experimento de venta de agosto–octubre (Fase 0).

---

## 1. El cambio de mensaje (por qué)

La investigación jul-2026 mató el mensaje "retiro seguro / seguridad" (sin demanda declarada, cero casos de prensa, sustituto gratis) y validó otro dolor, con números duros:

**Jerarquía nueva de mensajes:**
1. **PRIMARIO — Convivencia con evidencia legal:** "Cuando llegue la denuncia, tu colegio tendrá el expediente completo." Dolor #1 declarado de los directores (27,7%) + sobrecarga administrativa #2 (27,1%) + condena real de $45,6M por protocolo mal ejecutado + 17.000–22.700 denuncias/año que exigen descargos.
2. **SECUNDARIO — Ley 21.719:** vigente 1-dic-2026, datos de menores con protección reforzada. **Honestidad obligatoria:** la Agencia fiscalizadora aún no se constituye — el copy dice "la ley exige" y "prepárate a tiempo", NUNCA "te van a multar mañana" ni urgencia falsa de fiscalización inminente.
3. **TERCIARIO — Retiros y seguridad operativa:** pasa a ser una feature del expediente (retiros conflictivos con órdenes de restricción), no la promesa. Se despromociona de la navegación principal.

### Números aprobados para copy (única fuente de verdad)
Crear `src/lib/data/claims.ts` con cada cifra + fuente + fecha; TODO uso en páginas importa de ahí (evita drift):

| Claim | Valor | Fuente |
|---|---|---|
| Denuncias convivencia 2025 | 17.076 (+22,2% interanual) | Emol 10-feb-2026 / Superintendencia |
| Denuncias totales sistema | 75% son convivencia | Emol feb-2026 |
| Condena a sostenedor | $45.651.947 + $10.000.000 | PJUD, 17° Juzgado Civil de Santiago |
| Encuesta directores | Convivencia 27,7% / sobrecarga admin 27,1% (n=5.734) | La Tercera 16-jun-2026 |
| Multas Ley 21.719 | hasta 20.000 UTM | Ley 21.719, BCN |
| Colegios en Chile | 12.038 / 5.777 sostenedores | ya en PRODUCT.md |

### Reglas de honestidad (bloqueantes en review)
- Sin testimonios ni logos de clientes inventados. Sin métricas de producto inventadas ("X colegios confían…" prohibido hasta que sea verdad).
- Nunca "garantizamos la seguridad / prevención del bullying" — el producto da **trazabilidad, plazos y expediente**.
- "Complementa a Napsis/Lirmi/Syscol", jamás reemplaza (regla existente, se mantiene).
- Regla 8020 vigente: sin em/en-dashes en copy; `·` como separador.

---

## 2. Trabajo por paquete

### L0 — Home re-aim (`src/routes/+page.svelte` + `src/lib/i18n/translations/es-home.ts` / `en-home.ts`)
El hero actual ("El contexto de cada estudiante, listo cuando importa" + panel "Preparar una entrevista sin partir de cero") ya está a medio camino — se re-apunta, no se rehace:
1. **Hero:** título dirección "La denuncia va a llegar. Tu expediente decide cómo termina." (o variante aprobada por el dueño; tono institucional, no amarillista). Subtítulo: ejecución de protocolos + evidencia. **Panel mockup:** cambiar los 3 pasos a: `Denuncia registrada (plazo: 10 días hábiles)` → `Protocolo activado: 7 pasos, 2 vencen esta semana` → `Descargo borrador listo: 12 evidencias citadas`.
2. **#problem:** reescribir con 3 stats de `claims.ts` (denuncias, condena, sobrecarga) en `StatCard`/JetBrains Mono.
3. **#features:** 5 cards nuevas → Expediente del caso · Motor de protocolos con plazos · Actas y descargos asistidos por IA (siempre con revisión humana) · Continuidad entre años · Panel de riesgo del sostenedor.
4. **#forwho:** reordenar → Encargado de Convivencia (usuario), Director (sponsor), Sostenedor (comprador, mensaje patrimonial).
5. **Banda compliance (SectionDark):** mantener, re-copy a 21.719 honesto (secundario).
6. **#how:** 3 pasos = Importa tus casos y reglamento → El sistema ejecuta plazos y genera documentos → Exporta el expediente cuando lo necesites.
7. **#faq:** 6 nuevas — ¿Reemplaza a Lirmi/Napsis? (no, complementa) · ¿La IA decide sola? (no, todo con aprobación humana) · ¿Dónde viven los datos? (Chile/región, RLS, auditoría) · ¿Sirve si ya tenemos protocolos en papel? (sí, los importa) · ¿Qué pasa con años anteriores? · ¿Cuánto demora implementar?
8. **CTA dual:** primario "Solicitar Auditoría de Protocolos" (→ `/auditoria`), secundario "Ver demo" (existente).

### L1 — NUEVA página `/auditoria` (la oferta del experimento de venta — máxima prioridad junto a L0)
Oferta: **"Auditoría de Ejecución de Protocolos + Expediente Ley 21.719"** — entregable en 2 semanas por colegio.
- Secciones: qué incluye (revisión de protocolos vs normativa y plazos, simulación de descargo sobre un caso histórico anonimizado, gap report del expediente, checklist 21.719 para datos de alumnos) · para quién (sostenedores y particulares pagados) · entregable de ejemplo (mock de informe, sin datos reales) · "Cupos limitados agosto–octubre" (verdadero: capacidad concierge) · form/agenda.
- Precio: dejar `claims.ts`-style constante `AUDIT_PRICE_DISPLAY` con placeholder "desde $[X]00.000 por colegio" — **el dueño fija el número antes del deploy** (bloqueante de publicación, no de desarrollo).
- CTA de esta página se vuelve el destino primario de todo el sitio.

### L2 — Funcionalidades: 4 páginas nuevas + 2 reframes (patrón existente `funcionalidades/*`)
- **NUEVAS:** `/funcionalidades/expediente-legal` · `/funcionalidades/protocolos-y-plazos` · `/funcionalidades/actas-y-descargos` · `/funcionalidades/panel-sostenedor`. Estructura espejo de las páginas existentes (hero corto, 3-4 bloques, CTA). En `actas-y-descargos`, sección explícita "La IA redacta, tú apruebas" (confianza).
- **REFRAME:** `retiros-seguros` (recontextualizar como feature del expediente para casos con medidas de protección; quitar promesas absolutas tipo "ningún alumno sale jamás…" si existen) y `emergencias` (bajar de nav, mantener página).
- **Nav:** `funcionalidades` reordena con las 4 nuevas primero.

### L3 — Páginas de contenido/argumento
- `/ley-21719`: actualizar al estado real (vigencia firme 1-dic-2026; Agencia en formación; obligaciones concretas RAT/consentimientos/ARCO para colegios; "sin guía oficial del Mineduc — esta es la guía"). La honestidad regulatoria ES el diferenciador de confianza.
- `/comparativa`: tabla "Registrar vs Ejecutar" — Lirmi/Napsis/Colegium registran casos (bien); Ethoz ejecuta protocolos y produce expediente (columna propia). Mantener tono complemento, cero ataques.
- `/calculadora-roi`: recalibrar inputs → horas/mes del Encargado de Convivencia en papeleo + n° de denuncias/año + exposición (condena de referencia $45,6M). Output: horas ahorradas + riesgo documentado.
- `/demo/[rbd]`: conservar el mecanismo (personalización por RBD — activo clave para el outreach a los 401 sostenedores); actualizar el guion interno al pitch nuevo.
- `/agendar`: bifurcar — "Auditoría (recomendado, cupos ago–oct)" vs "Demo del software".

### L4 — Blog SEO (6 posts, `src/routes/blog/`)
Keywords objetivo con casi cero competencia seria:
1. "Descargos ante la Superintendencia de Educación: guía paso a paso (con plazos)" — kw: *descargos superintendencia educación*.
2. "Protocolo de actuación frente al bullying: los plazos que tu colegio debe cumplir" — kw: *protocolo bullying plazos colegio*.
3. "La condena de $45 millones que todo sostenedor debería leer" — análisis del fallo, kw: *responsabilidad civil colegio convivencia*.
4. "Del reglamento interno al protocolo ejecutable: cómo digitalizar sin rehacer nada" — kw: *reglamento interno convivencia escolar*.
5. "Ley 21.719 y colegios: checklist de datos de estudiantes antes de diciembre" — kw: *ley 21719 colegios*.
6. "Encargado de Convivencia: cómo recuperar 10 horas al mes" — kw: *encargado convivencia escolar funciones sobrecarga*.
Cada post: 1.200–1.800 palabras, es-CL profesional, cifras solo desde `claims.ts`, CTA a `/auditoria`, meta/OG completos.

### L5 — SEO técnico y housekeeping
- Sitemap + meta descriptions de páginas nuevas; OG images (usar assets de marca existentes en `media/`).
- Redirects si cambia alguna URL de nav (mantener URLs existentes; las páginas reframed conservan su slug).
- Revisión completa de strings: buscar y neutralizar cualquier promesa absoluta de seguridad en TODO el sitio (grep "garantiz", "jamás", "nunca sale", "100%").

---

## 3. Orden y gates

| Orden | Paquete | Gate |
|---|---|---|
| 1 | L0 + L1 | Ninguno — soportan la venta de agosto. Publicación de `/auditoria` requiere precio fijado por el dueño |
| 2 | L2 | Ninguno |
| 3 | L3 + L4 | Ninguno (L4 puede ir publicándose 1-2 posts/semana) |
| 4 | L5 | Con lo anterior |

## 4. Definition of Done (todo paquete)
- `npm run test:ci` verde (lint + lint:i18n + check + audit:security + unit + Playwright).
- Cero strings hardcodeados (todo vía `t()`, es + en completos — `scripts/check-i18n.js` lo valida).
- Design system intacto: Cal black CTAs, dark solo en cierre+footer, sin gradientes/glows, AAA donde aplica, sin em-dashes.
- Cifras solo importadas desde `claims.ts` con fuente y fecha.
- Copy revisado contra las Reglas de honestidad (§1) — cualquier promesa absoluta de seguridad es defecto bloqueante.

## 5. Fuera de alcance — NO hacer
- No rediseñar el sistema visual ni tocar `.impeccable.md`.
- No crear páginas de pricing del software (solo la oferta de auditoría).
- No testimonios/logos/casos de éxito ficticios ni "social proof" inventado.
- No eliminar `/demo/[rbd]`, `/blog`, `/glosario` ni la infraestructura de i18n.
- No prometer integraciones API con Lirmi/Napsis (v1 del producto importa CSV).
