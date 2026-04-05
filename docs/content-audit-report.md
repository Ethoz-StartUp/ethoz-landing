# Ethoz — Auditoría de Contenido del Sitio
**Fecha:** 2026-04-04
**Metodología:** Lectura manual de todos los archivos fuente + análisis Kimi CLI (4 auditorías separadas)
**Archivos auditados:** `es.ts`, `en.ts`, `/+page.svelte`, `/about`, `/compliance`, `/get-started`, `/productos`, `/contact`, `/src/lib/components/NavBar.svelte`, `static/llms.txt`, 13 blog posts en `src/lib/data/posts/`

---

## 1. Contradicciones & Hipocresías

### CRÍTICO — El Módulo "Libro de Clases Digital" contradice el posicionamiento central

**Severidad: Roja. Es la hipocresía más grave del sitio.**

El FAQ de la landing y el blog repiten explícitamente que Ethoz NO reemplaza el libro de clases:

> *"Ethoz no reemplaza tu plataforma actual de libro de clases o gestión académica. La complementa."*
> — `es.ts` línea 188, `faq.a11`

> *"Ethoz no reemplaza la plataforma de gestión que su establecimiento ya usa. No hay por qué migrar el libro de clases."*
> — `src/lib/data/posts/gestion-escolar-vs-proteccion-escolar.ts`

Sin embargo, la página `/productos` lista exactamente eso como Módulo 6:

> *"Libro de Clases Digital — Conforme a Circular N°30: integridad de datos, trazabilidad y verificación."*
> — `src/routes/productos/+page.svelte` línea 55-58

Y el pricing (`/get-started`) lista entre los módulos disponibles: **"Libro de clases digital"** — `src/routes/get-started/+page.svelte` línea 30.

**El problema:** No se puede decir "no reemplazamos el libro de clases" y al mismo tiempo venderlo como módulo propio. Esto genera desconfianza inmediata si un prospecto lee ambas páginas.

**Fix requerido:** Elegir una posición y mantenerla en todo el sitio. Opciones:
- Opción A: Renombrar el módulo a "Cumplimiento Circular N°30" y describir claramente que *complementa* el libro de clases existente, no lo reemplaza.
- Opción B: Actualizar el FAQ y el blog para reflejar que Ethoz sí puede reemplazar el libro de clases si el colegio lo desea.

---

### CRÍTICO — Tres versiones incompatibles de los límites de matrícula

**Severidad: Roja. Cualquier prospecto que compare páginas detecta esto.**

| Fuente | Plan básico | Plan medio | Plan avanzado |
|--------|-------------|------------|---------------|
| `es.ts` `faq.a5` (línea 170) | "500+ alumnos" (mínimo, no tope) | — | — |
| `en.ts` pricing tiers (líneas 261-289) | "Up to 500 students" | "500–1,500 students" | "1,500+ students" |
| `static/llms.txt` (líneas 48-50) | "Hasta 300 alumnos" | "Hasta 800 alumnos" | "Sin límite" |
| `en.ts` `pricing.faq.a6` (línea 317) | "From schools with 200 students" | — | "multiple locations" |

El FAQ dice que el público objetivo son colegios de **500+ alumnos**, pero el plan Esencial acepta colegios de **hasta 300** (llms.txt) o **hasta 500** (en.ts). Son números directamente contradictorios en el mismo sitio.

**Fix requerido:** Decidir los límites reales y actualizarlos en los 4 lugares simultáneamente: `es.ts` faq.a5, `en.ts` pricing tiers, `llms.txt`, y `en.ts` pricing.faq.a6.

---

### ALTA — El título del blog "ninguna plataforma está preparada" se contradice con el CTA de la landing

**Severidad: Naranja.**

> *"Por qué ninguna plataforma escolar en Chile está preparada para la Ley 21.719"*
> — `src/lib/data/posts/ninguna-plataforma-cumple-ley-21719.ts` línea 4, fecha 2026-04-04

> *"Sé de los primeros colegios en cumplir con la Ley 21.719."*
> — `es.ts` línea 116-117, `cta.subtitle`

Si "ninguna plataforma está preparada", ¿cómo van los colegios a "ser de los primeros en cumplir" usando Ethoz? La premisa del blog invalida el CTA. Ethoz es al mismo tiempo quien dice que nadie está listo y quien promete que sí está listo.

**Fix requerido:** Cambiar el título del blog a "Por qué las plataformas *existentes* no están preparadas" — diferenciando claramente el mercado legacy de Ethoz como nueva solución.

---

### ALTA — Roadmap dice 5 módulos operativos; pricing lista 10

**Severidad: Naranja.**

> *"Ethoz ya tiene cinco módulos funcionando... Ficha, Retiros, Privacidad, RBAC, Búsqueda. No son una promesa: son funcionalidad operando en producción."*
> — `src/lib/data/posts/roadmap-ethoz-2026.ts` líneas 22-31

La página `/get-started` lista 10 módulos disponibles (`src/routes/get-started/+page.svelte` líneas 21-31):
Perfil integral, Control de acceso, Retiros, Búsqueda, **Alertas**, **Convivencia**, **Dashboard**, **Auditoría**, **Ley 21.719**, **Libro de clases digital**.

Los 5 en negrita no aparecen en el roadmap como operativos. Además, el roadmap clasifica el "Dashboard de cumplimiento normativo" como **"Coming soon"** — pero pricing lo lista como disponible hoy.

**Fix requerido:** Actualizar el pricing para marcar claramente qué módulos están disponibles hoy vs. en desarrollo. O actualizar el roadmap para que refleje el estado real de cada módulo.

---

### ALTA — "Sin reemplazar sistemas existentes" vs. "migramos desde sistemas anteriores"

**Severidad: Naranja.**

> *"sin reemplazar los sistemas existentes, sin procesos complicados ni dejar a nadie atrás."*
> — `en.ts` línea 357, `about.mission_desc`

> *"Migramos tus datos sin costo... Traemos tu información desde Excel, sistemas anteriores o registros en papel."*
> — `src/routes/get-started/+page.svelte` líneas 143-144

Migrar desde "sistemas anteriores" implica que el colegio *dejará* esos sistemas para usar Ethoz. Eso es reemplazar, por definición. El lenguaje es contradictorio.

**Fix requerido:** Ser preciso: "Complementamos tu sistema académico (Napsis, SIGE). Reemplazamos el Excel de convivencia y los cuadernos de portería."

---

### MEDIA — "Compliant from day one" vs. certificaciones pendientes hasta 2027

**Severidad: Amarilla.**

> *"Cumplimos con la Ley 21.719 hoy, no mañana."*
> — `en.ts` línea 364, `about.value3_desc`

> *"ISO/IEC 27001 — Certification in progress"*
> *"SOC 2 Type II — Planned for 2027"*
> — `en.ts` líneas 447-450, `compliance_page.certs.cert2/cert3`

ISO 27001 y SOC 2 no son decorativos — son los estándares de seguridad que respaldan el claim de "grado bancario". Decir que el cumplimiento es total hoy cuando las certificaciones clave están planificadas para 2027 es una inconsistencia que afecta la credibilidad ante equipos legales y sostenedores exigentes.

**Fix requerido:** Cambiar `about.value3_desc` a algo más preciso: "Diseñado para cumplir la Ley 21.719 desde el primer día de código." Y agregar una nota en la compliance page explicando que las certificaciones internacionales (ISO 27001, SOC 2) complementarán el cumplimiento normativo chileno ya operativo.

---

### MEDIA — "Primeros colegios" vs. "12.038 colegios en directorio"

**Severidad: Amarilla.**

> *"El piloto 2026 tiene cupos limitados. Sé de los primeros colegios en cumplir."*
> — `es.ts` líneas 115-116, `cta.subtitle`

> *"12.038 colegios en directorio"*
> — `es.ts` línea 27, `trust.directory`

Un trust badge que muestra 12.038 colegios comunica escala masiva. Un CTA que dice "sé de los primeros" comunica escasez/exclusividad. Son señales opuestas. El usuario no sabe si Ethoz es un producto masivo o una startup en piloto.

**Nota importante:** El directorio de 12.038 colegios es la base de datos de búsqueda para el demo — no son clientes. Esta distinción no está explicada en ningún lugar del sitio. Un visitante puede interpretar fácilmente que Ethoz ya opera en 12.038 colegios.

**Fix requerido:** Cambiar el trust badge a: "Directorio de 12.038 colegios disponible" o "Búsqueda entre 12.038 establecimientos." Agregar la distinción directorio vs. clientes.

---

## 2. Inconsistencias de Messaging

### La promesa de valor cambia según la página

Cada página tiene una promesa de valor diferente, sin un hilo conductor visible:

| Página | Mensaje central | Tono |
|--------|-----------------|------|
| Landing `/` | "El escudo digital de tu comunidad escolar" | Protección / seguridad física |
| `/about` | "Construido en Chile, para colegios chilenos" | Origen / confianza local |
| `/compliance` | "Cumplimiento normativo construido desde cero" | Técnico-legal |
| `/productos` | "Seis módulos, un solo objetivo" | Funcional / modular |
| `/get-started` | "Fácil de contratar, fácil de implementar" | Comercial / sin fricción |

Un director que navega de la landing a productos a compliance experimenta tres posicionamientos distintos sin que quede claro cuál es la promesa principal.

**Fix requerido:** Definir una promesa central única (ej: "La única plataforma construida desde cero para cumplir la Ley 21.719 y proteger a tus alumnos") y asegurarse de que aparezca — adaptada al contexto de cada página, pero reconocible — en todas las páginas principales.

---

### La Ley 21.719 desaparece en las páginas más comerciales

La ley es el driver de urgencia principal, pero su presencia es inconsistente:

| Página | Mención de Ley 21.719 en zona alta |
|--------|-------------------------------------|
| `/` Landing | Sí — badge + countdown + subtítulo |
| `/about` | Sí — sección compliance dedicada |
| `/compliance` | Sí — es toda la página |
| `/productos` | No — no aparece en H1 ni subtítulo |
| `/get-started` | No — ausente completamente |

Un director que llega directo a `/get-started` desde Google no ve ninguna mención al plazo de diciembre 2026 ni al riesgo de multas. La urgencia normativa — el principal motivador de compra — no existe en la página de conversión.

**Fix requerido:** Agregar mención breve a la Ley 21.719 y al plazo en los heroes de `/productos` y `/get-started`.

---

### Público objetivo definido de tres formas incompatibles

- `faq.a5` (`es.ts` línea 170): "Colegios particulares subvencionados y pagados de 500+ alumnos" — excluye municipales, requiere 500+
- `pricing.faq.a6` (`en.ts` línea 317): "Any educational institution in Chile: private, subsidized, municipal, and multi-campus networks. From schools with 200 students." — incluye municipales, acepta desde 200 alumnos
- `llms.txt` línea 48: "Esencial: Hasta 300 alumnos" — acepta colegios de 300

**Fix requerido:** Definir una sola versión del público objetivo y aplicarla consistentemente en FAQ, pricing y llms.txt.

---

### Los CTAs tienen 5 tonos distintos a lo largo del funnel

| Ubicación | CTA | Tono |
|-----------|-----|------|
| Landing hero | "Postular al Piloto 2026" | Exclusivo / proceso de selección |
| Landing CTA section | "El piloto tiene cupos limitados" | Urgencia / escasez |
| Compliance page | "Solicitar informe de cumplimiento" | Formal / burocrático |
| Get-started hero | "Agendar Demo gratuita" | Comercial / accesible |
| Pricing final | "O escríbenos por WhatsApp" | Informal / startup |

Un usuario que recorre el sitio no sabe si está tratando de "postular" a algo exclusivo, "solicitar un informe" formal, o simplemente "agendar una demo gratis". El funnel no tiene coherencia de tono.

**Fix requerido:** Unificar en un CTA principal ("Agendar Demo gratuita") con un secundario consistente ("Hablar por WhatsApp" o "Contactar al equipo") en todas las páginas.

---

### Los blogs tienen 4 voces distintas

| Blog | Rol de Ethoz en ese blog |
|------|--------------------------|
| `ninguna-plataforma-cumple-ley-21719` | Crítico agresivo del mercado |
| `gestion-escolar-vs-proteccion-escolar` | Colaborador y complementario |
| `roadmap-ethoz-2026` | Startup humilde y transparente |
| `excel-no-cumple-normativa-datos` | Reemplazo de Excel, tono alarmista |

Un lector que consume varios artículos no reconoce la misma empresa hablando. El tono oscila entre "somos un complemento amigable" y "nadie más está preparado".

---

## 3. SEO Issues

### Títulos H1 sin keywords de búsqueda

Todos los H1 principales son creativos pero inútiles para SEO:

| Página | H1 Actual | Fuerza SEO | H1 Recomendado |
|--------|-----------|------------|----------------|
| `/` | "El escudo digital de tu comunidad escolar" | 2/10 — 0 keywords | "Software de Gestión Escolar para Colegios Chilenos" |
| `/productos` | "Seis módulos, un solo objetivo" | 1/10 — no describe el producto | "Módulos de Gestión y Seguridad Escolar" |
| `/compliance` | "Cumplimiento normativo construido desde cero" | 4/10 — vago | "Cumplimiento de la Ley 21.719 para Colegios" |
| `/get-started` | "Fácil de contratar, fácil de implementar" | 3/10 — sin keywords | "Contrata el Software Escolar Ethoz" |
| `/contact` | "Hablemos" | 1/10 — demasiado casual | "Contacta al Equipo de Ethoz" |
| `/about` | "Construido en Chile, para colegios chilenos" | 3/10 — genérico | Puede mantenerse si el H2 introduce keywords |

---

### Meta descriptions faltantes o subóptimas

- `/contact` (`src/routes/contact/+page.svelte` línea 44-53): No tiene `<meta name="description">`. Solo tiene OG description. Google no lo muestra en SERPs.
- `/about` (`src/routes/about/+page.svelte` línea 27): Meta description genérica: "Ethoz: plataforma de seguimiento integral y seguridad escolar construida en Chile." No incluye keywords primarias como "Ley 21.719" ni "colegios Chile".
- `/` homepage: Meta description (`src/routes/+page.svelte` línea 145) no incluye "Ley 21.719" — el término de búsqueda más valioso para el producto.

---

### Keyword cannibalization entre páginas

**Conflicto 1 — `/` vs `/compliance`:** Ambas páginas atacan "protección de datos colegios Chile" y "Ley 21.719 colegios". La homepage debería enfocarse en keywords transaccionales ("software gestión escolar Chile"), dejando los informativos a compliance.

**Conflicto 2 — Blog 1 vs Blog 8:** El blog "Ley 21.719: Lo que todo colegio debe saber" y el blog "Multas de hasta 20.000 UTM: Guía de cumplimiento para sostenedores" atacan las mismas queries: "multas Ley 21.719 colegios", "cumplimiento protección datos colegios". Están compitiendo entre sí.

**Conflicto 3 — Naming inconsistente del módulo libro de clases:**
- `src/lib/components/NavBar.svelte` línea 28: **"Integración Libro Digital"**
- `src/routes/productos/+page.svelte` línea 54: **"Libro de Clases Digital"**
- `src/routes/get-started/+page.svelte` línea 30: **"Libro de clases digital"**
- Blog slug: `/blog/circular-n30-libro-clases-digital`

Google indexa cuatro nombres distintos para el mismo módulo. Elige uno y úsalo en todos lados.

---

### Keywords de alto valor ausentes en páginas clave

Keywords que un director chileno buscaría y que no aparecen en los H1 o meta descriptions:

- "software gestión escolar Chile" — ausente en H1 de homepage
- "plataforma datos alumnos Chile" — ausente en todo el sitio excepto blogs
- "retiros escolares seguros sistema" — ausente en homepage
- "cumplimiento Ley 21.719 colegios" — ausente en H1 de `/compliance`
- "control acceso datos colegios" — ausente en H1 de `/productos`
- "precio software escolar Chile" — ausente en `/get-started`

---

### Título de página `/get-started` es una pregunta

`<title>¿Cómo contratar? — Ethoz</title>` — `src/routes/get-started/+page.svelte` línea 46.

Las preguntas como títulos de página rankean peor que afirmaciones con keywords. "Cómo contratar Ethoz — Software Escolar Chile" sería más efectivo.

---

## 4. Blog Quality

### Blogs genuinamente buenos (mantener y potenciar)

**Blog: "Ley 21.719: Lo que todo colegio debe saber"**
(`src/lib/data/posts/ley-21719-que-deben-saber-los-colegios.ts`)
— El mejor del sitio. Tabla de multas real (1.000 / 5.000 / 20.000 UTM), artículos específicos de la ley (Art. 11, 14 quáter, 16 bis, 20), plazos concretos (30 días hábiles ARCO+P). Esto es lo que un director necesita leer.

**Blog: "Por qué Excel ya no cumple con la normativa"**
(`src/lib/data/posts/excel-no-cumple-normativa-datos.ts`)
— Argumento técnico sólido. Las 4 fallas de Excel son estructurales, bien explicadas. El link al caso de convivencia escolar (11.091 casos) le da contexto real.

**Blog: "Gestión escolar vs. protección escolar"**
(`src/lib/data/posts/gestion-escolar-vs-proteccion-escolar.ts`)
— El cierre con pregunta retórica ("¿Su plataforma puede demostrar quién autorizó el retiro de cada alumno en los últimos seis meses?") es el copy más efectivo del sitio.

---

### Blogs problemáticos (requieren intervención)

**PROBLEMA GRAVE — Blog IA sin disclaimer de producto no disponible**

`src/lib/data/posts/inteligencia-artificial-desercion-escolar.ts`
— Título: "IA en educación: Cómo predecir la deserción escolar en 14 días"

El producto **no tiene un módulo de IA activo**. El roadmap (`roadmap-ethoz-2026.ts`) menciona "alertas tempranas con IA" solo como visión futura en la sección de "protección escolar" del blog de gestión vs. protección, pero no como módulo en construcción activa.

Un director que lee este blog espera una funcionalidad que no existe. Si agenda una demo basándose en este blog, quedará defraudado. **Esto genera leads no calificados y daña la confianza.**

**Fix:** Agregar disclaimer prominente al inicio: "Esta funcionalidad está en nuestro roadmap para 2026-2027. Hoy Ethoz no predice deserción con IA — pero sí centraliza los datos que harían posible ese análisis."

---

**PROBLEMA GRAVE — Blog "ninguna plataforma está preparada": Ethoz es juez y parte**

`src/lib/data/posts/ninguna-plataforma-cumple-ley-21719.ts`
— "Analizamos las plataformas de gestión escolar más usadas en Chile: ninguna menciona la Ley 21.719."

La tabla comparativa hace claims específicos sobre competidores sin nombrarlos. Ethoz, que vende la solución, evalúa al mercado y concluye que solo Ethoz está preparado. No hay metodología visible, no hay fuentes citadas, no hay fecha del análisis.

Un director técnico o un abogado verá esto como FUD (Fear, Uncertainty, Doubt) corporativo. **Daña la credibilidad precisamente con la audiencia que más importa.**

**Fix:** Cambiar el enfoque a un "checklist de cumplimiento técnico" que los colegios pueden usar para evaluar CUALQUIER plataforma (incluyendo Ethoz). Eso genera más valor y más confianza que "ninguno sirve".

---

**PROBLEMA MEDIO — Dato "11.091 denuncias" sin fuente citada explícitamente**

`src/lib/data/posts/crisis-convivencia-escolar-2025.ts`
— La descripción del blog dice "un aumento del 25% respecto al año anterior" y el contenido incluye tabla regional con porcentajes específicos (+68% Arica, +57% Atacama).

El blog tiene los datos pero la fuente no está visible en el extracto inicial del post. Si la fuente es la Superintendencia de Educación o el MINEDUC, debe estar citada con enlace. Sin fuente citada, el dato parece inventado.

**Fix:** Agregar fuente con enlace en el primer párrafo donde aparece el número: "(Superintendencia de Educación, Informe de Convivencia Escolar 2025)" o equivalente.

---

**PROBLEMA MEDIO — Roadmap como blog: autopromoción disfrazada de transparencia**

`src/lib/data/posts/roadmap-ethoz-2026.ts`
— El tono es honesto ("somos transparentes sobre lo que falta"), pero el contenido es esencialmente una ficha de producto con fecha de publicación. No aporta valor educativo independiente a un director que no está evaluando Ethoz.

**Fix:** Convertirlo en una pieza de pensamiento más amplia: "Qué debería hacer una plataforma escolar en 2026 para cumplir la Ley 21.719" — con el roadmap de Ethoz como ejemplo, no como tema central.

---

### Naming inconsistente del módulo en NavBar vs. Productos

**NavBar** (`src/lib/components/NavBar.svelte` línea 28-29):
- Nombre: "Integración Libro Digital"
- Descripción: "Conecta con tu proveedor actual"

**Página /productos** (`src/routes/productos/+page.svelte` línea 54-58):
- Nombre: "Libro de Clases Digital"
- Descripción: "Conforme a Circular N°30: integridad de datos, trazabilidad y verificación."

Son dos propuestas de valor completamente distintas para el mismo módulo. El NavBar lo presenta como integración (complemento), la página de productos lo presenta como producto propio. Esto amplifica la contradicción del punto 1 de este reporte.

---

## 5. Recomendaciones — Prioritizadas

### P0 — Crítico (esta semana)

1. **Resolver la hipocresía del Libro de Clases Digital.** Elegir: complemento o producto propio. Actualizar FAQ `faq.a11`, blog `gestion-escolar-vs-proteccion-escolar`, NavBar y `/productos` para que digan lo mismo. Archivos: `es.ts`, `en.ts`, `NavBar.svelte`, `productos/+page.svelte`, `get-started/+page.svelte`, `posts/gestion-escolar-vs-proteccion-escolar.ts`.

2. **Unificar los límites de matrícula.** Decidir los números reales y actualizarlos en `es.ts` (faq.a5), `en.ts` (pricing tiers + pricing.faq.a6), y `static/llms.txt`. Los cuatro archivos deben decir lo mismo.

3. **Agregar disclaimer al blog de IA** (`posts/inteligencia-artificial-desercion-escolar.ts`). El módulo de IA no existe hoy — el blog no puede implicar que sí. Agregar recuadro al inicio del post.

4. **Aclarar el trust badge de 12.038 colegios.** Cambiar el label en `es.ts` línea 27 de `'trust.directory': '12.038 colegios en directorio'` a algo como `'12.038 establecimientos en el directorio de búsqueda'` para evitar la interpretación de que son clientes.

### P1 — Alto (próximas 2 semanas)

5. **Estandarizar el nombre del módulo libro de clases** en los 4 lugares donde aparece con nombres distintos: NavBar, `/productos`, `/get-started`, y el slug del blog `/blog/circular-n30-libro-clases-digital`.

6. **Optimizar H1 y meta descriptions de páginas clave.** Prioridad: `/productos` (H1 sin keywords), `/contact` (falta meta description), `/` homepage (meta description sin "Ley 21.719"), `/get-started` (título con pregunta).

7. **Agregar mención a Ley 21.719 en `/productos` y `/get-started`.** El driver de urgencia principal no aparece en las páginas de conversión.

8. **Unificar el CTA principal.** Elegir entre "Agendar Demo gratuita" y "Postular al Piloto 2026" — y usarlo consistentemente en toda la landing. Eliminar la ambigüedad entre producto masivo vs. piloto exclusivo.

9. **Agregar fuente citada al dato 11.091** en `posts/crisis-convivencia-escolar-2025.ts`. Si la fuente es la Superintendencia de Educación u otro organismo oficial, debe aparecer con enlace.

### P2 — Medio (próximo mes)

10. **Cambiar el ángulo del blog "ninguna plataforma está preparada"** de FUD corporativo a "checklist de cumplimiento técnico para evaluar cualquier plataforma." Más útil, más creíble, menos agresivo.

11. **Resolver la inconsistencia de tono en los blogs.** Definir una voz editorial para Ethoz y revisitar los blogs del roadmap y el de Excel para que no suenen como empresas distintas.

12. **Diferenciar keywords entre `/` y `/compliance`** para evitar cannibalization. Homepage: keywords transaccionales. Compliance: keywords informativas sobre la ley.

13. **Unificar la definición del público objetivo** en todos los FAQs: ¿incluye municipales? ¿Desde cuántos alumnos? Actualizar `faq.a5` (ES), `pricing.faq.a6` (EN) y `llms.txt` para que coincidan.

14. **Actualizar `llms.txt`** para que refleje el estado actual del producto (módulos operativos vs. en desarrollo) y los límites de precios correctos. Los agentes de IA consumen este archivo para responder preguntas sobre Ethoz — los datos desactualizados generan respuestas incorrectas.

---

## Resumen ejecutivo

El sitio de Ethoz tiene contenido de calidad en sus mejores blogs y una arquitectura técnica creíble en la compliance page. Los problemas no son de fondo — son de consistencia editorial. Cada página fue escrita en aislamiento sin una guía de voz, posicionamiento o datos unificados.

Los tres problemas que más dañan la credibilidad hoy:

1. **Hipocresía del libro de clases:** Negar reemplazar algo que explícitamente se vende como módulo.
2. **Límites de matrícula en tres versiones:** Cualquier prospecto que compare páginas detectará los números incompatibles.
3. **Blog de IA sin disclaimer:** Genera expectativas de una funcionalidad que no existe.

El resto de los issues son correcciones de consistencia que no requieren reescribir el producto — solo alinear los mensajes que ya existen.
