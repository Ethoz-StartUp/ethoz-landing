<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    Scale,
    Lock,
    Database,
    FileText,
    Clock,
    Users,
    Eye,
    Pencil,
    Trash2,
    Ban,
    Package,
    ExternalLink,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'ley-21719' });
  });

  const toc = [
    { href: '#que-es', label: '¿Qué es la Ley 21.719?', n: '01' },
    { href: '#a-quien-aplica', label: '¿A quién aplica?', n: '02' },
    { href: '#principios', label: 'Principios clave', n: '03' },
    { href: '#derechos-arco', label: 'Derechos ARCO+P', n: '04' },
    { href: '#obligaciones', label: 'Obligaciones para colegios', n: '05' },
    { href: '#multas', label: 'Multas y sanciones', n: '06' },
    { href: '#plazos', label: 'Plazos críticos', n: '07' },
    { href: '#checklist', label: 'Checklist de cumplimiento', n: '08' },
    { href: '#como-ayuda-ethoz', label: '¿Cómo Ethoz ayuda?', n: '09' },
  ];

  const checklist = [
    'Designar un Delegado de Protección de Datos (DPO)',
    'Elaborar inventario de datos personales tratados',
    'Revisar y actualizar formularios de consentimiento',
    'Implementar consentimiento parental para datos de menores',
    'Establecer procedimiento para solicitudes ARCO+P',
    'Definir plazos de respuesta (30 días hábiles)',
    'Crear protocolo de notificación de brechas (72 horas)',
    'Realizar Evaluación de Impacto en Protección de Datos (DPIA)',
    'Revisar contratos con proveedores (encargados de tratamiento)',
    'Implementar cifrado at-rest y en tránsito',
    'Configurar controles de acceso por rol (principio de mínimo privilegio)',
    'Activar audit log para acciones sobre datos sensibles',
    'Capacitar a docentes y administrativos en protección de datos',
    'Publicar política de privacidad actualizada en sitio web',
    'Revisar cumplimiento de sistemas legados (ERP, plataformas externas)',
  ];

  const sanctions = [
    {
      level: 'Leve',
      examples: 'Incumplimiento de formalidades, falta de registro',
      fine: 'hasta 100 UTM',
      approx: '≈ $6,7M CLP',
    },
    {
      level: 'Grave',
      examples: 'Tratamiento sin base de legitimación, incumplimiento de derechos ARCO+P',
      fine: 'hasta 1.000 UTM',
      approx: '≈ $67M CLP',
    },
    {
      level: 'Gravísima',
      examples: 'Datos sensibles sin consentimiento, transferencia internacional ilícita, reincidencia',
      fine: 'hasta 10.000 UTM o 4% facturación anual',
      approx: '≈ $670M–$1.340M CLP',
    },
  ];

  const rights = [
    {
      letter: 'A',
      name: 'Acceso',
      icon: Eye,
      desc: 'El titular puede solicitar qué datos suyos trata el colegio, con qué finalidad y a quién se han comunicado.',
    },
    {
      letter: 'R',
      name: 'Rectificación',
      icon: Pencil,
      desc: 'El titular puede exigir corrección de datos inexactos o incompletos.',
    },
    {
      letter: 'C',
      name: 'Cancelación',
      icon: Trash2,
      desc: 'El titular puede solicitar la supresión de sus datos cuando ya no sean necesarios para la finalidad para la que fueron recogidos.',
    },
    {
      letter: 'O',
      name: 'Oposición',
      icon: Ban,
      desc: 'El titular puede oponerse al tratamiento de sus datos cuando exista causa legítima, en particular para marketing o perfilamiento.',
    },
    {
      letter: '+P',
      name: 'Portabilidad',
      icon: Package,
      desc: 'El titular puede recibir sus datos en formato estructurado, de uso común y lectura mecánica, y transferirlos a otro responsable.',
    },
  ];

  const timeline = [
    { date: '13 dic 2024', event: 'Promulgación de la Ley 21.719', highlight: false },
    { date: 'Dic 2025', event: 'Período de adecuación para responsables de tratamiento', highlight: false },
    { date: 'Jun 2026', event: 'Plazo recomendado para completar adecuaciones internas', highlight: true },
    { date: 'Dic 2026', event: 'Vigencia plena — enforcement completo por el Consejo para la Transparencia', highlight: true },
  ];
</script>

<svelte:head>
  <title>Ley 21.719: Guía completa para colegios — qué es, multas y cómo cumplir | Ethoz</title>
  <meta name="description" content="Ley 21.719 colegios Chile: qué exige, multas hasta 20.000 UTM, derechos ARCO+P, plazos dic 2026. Guía práctica para sostenedores y directivos." />
  <meta property="og:title" content="Ley 21.719: Guía completa para colegios — Ethoz" />
  <meta property="og:description" content="Ley 21.719 colegios Chile: qué exige, multas hasta 20.000 UTM, derechos ARCO+P, plazos dic 2026. Guía práctica para sostenedores y directivos." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/ley-21719" />
  <meta property="og:image" content="https://ethoz.cl/images/og-ley-21719.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ley 21.719: Guía completa para colegios — Ethoz" />
  <meta name="twitter:description" content="Guía práctica Ley 21.719 para colegios chilenos. Multas, plazos, derechos ARCO+P y checklist de cumplimiento." />
  <link rel="canonical" href="https://ethoz.cl/ley-21719" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Ley 21.719: Guía completa para colegios — qué es, multas y cómo cumplir",
      "description": "Ley 21.719 colegios Chile: qué exige, multas hasta 20.000 UTM, derechos ARCO+P, plazos dic 2026. Guía práctica para sostenedores y directivos.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": "Ethoz" },
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/ley-21719",
      "mainEntityOfPage": "https://ethoz.cl/ley-21719",
      "about": { "@type": "Thing", "name": "Ley 21.719 Protección de Datos Personales Chile" },
      "keywords": "ley 21719, proteccion datos personales chile, multa ley 21719, colegios ley datos, ARCO derechos datos chile"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Ley 21.719", "item": "https://ethoz.cl/ley-21719" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- ══════════════════════════════════════
       HERO — editorial, institutional
       ══════════════════════════════════════ -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Eyebrow metadata line -->
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">Documento normativo · 01</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Actualizado abril 2026</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>12 min de lectura</span>
      </p>

      <!-- Short 48px rule -->
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>

      <!-- Editorial italic statement -->
      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        Una ley no reemplaza la intención de proteger — la obliga.
      </h1>

      <!-- Body lede -->
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        La Ley 21.719 entra en vigencia plena en diciembre de 2026. Para un colegio chileno, las obligaciones son concretas: consentimiento, inventario de datos, DPO y capacidad de responder solicitudes ARCO+P. Las multas llegan hasta 20.000 UTM —cerca de 1.340 millones de pesos— o el 4% de la facturación anual, lo que sea mayor.
      </p>

      <!-- Metadata footer, McKinsey-style -->
      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Promulgada</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>13 dic 2024</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Enforcement</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>Dic 2026</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Multa máxima</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>20.000 UTM</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Fiscalizador</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">Cons. Transparencia</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       BODY — article + sticky TOC
       ══════════════════════════════════════ -->
  <div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <div class="grid gap-12 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">

      <!-- Sticky TOC (desktop) / inline (mobile) -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Contenido</p>
        <nav class="mt-4 border-l border-border" aria-label="Índice del artículo">
          <ol class="space-y-1">
            {#each toc as item}
              <li>
                <a
                  href={item.href}
                  class="group flex items-baseline gap-3 -ml-px border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <span class="font-heading text-xs text-primary tabular-nums group-hover:text-primary" data-numeric>{item.n}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            {/each}
          </ol>
        </nav>
      </aside>

      <!-- Article body -->
      <article class="max-w-[68ch] space-y-20">

        <!-- SECCIÓN 1: QUÉ ES -->
        <section id="que-es">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>01 · Contexto</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">¿Qué es la Ley 21.719?</h2>
          <div class="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              La <strong class="text-foreground">Ley 21.719</strong>, publicada en el Diario Oficial el 13 de diciembre de 2024, es la nueva ley de protección de datos personales de Chile. Reemplaza y moderniza la Ley 19.628 de 1999, adaptando el marco legal chileno a estándares internacionales contemporáneos, en línea con el GDPR europeo.
            </p>
            <p>
              Su objetivo central es establecer las condiciones bajo las cuales organizaciones públicas y privadas pueden tratar datos personales: cuándo está permitido, qué derechos tienen los titulares, qué obligaciones tienen los responsables del tratamiento y qué consecuencias tiene el incumplimiento.
            </p>
            <p>
              Para los colegios chilenos —tanto los sostenedores como los establecimientos—, la ley es especialmente relevante porque procesan grandes volúmenes de datos personales de menores de edad, que son considerados <strong class="text-foreground">datos sensibles</strong> bajo la legislación chilena.
            </p>
          </div>

          <!-- Pull quote moment: the thesis of the page -->
          <blockquote class="mt-10 border-l-2 border-primary pl-6 font-heading text-[1.5rem] font-normal italic leading-[1.4] text-foreground sm:text-[1.75rem]">
            El plazo no es diciembre de 2026. Es diciembre de 2026 <em>menos</em> el tiempo que tarda un colegio en reescribir sus formularios, firmar contratos con proveedores y capacitar a su personal.
          </blockquote>

          <!-- Key date footnote -->
          <aside class="mt-10 border-t border-border pt-6">
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Fecha clave</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              Promulgada el <strong class="text-foreground">13 de diciembre de 2024</strong>. El período de adecuación vence en <strong class="text-foreground">diciembre de 2026</strong>, fecha desde la cual el Consejo para la Transparencia tendrá plena facultad fiscalizadora y sancionatoria.<sup class="ml-0.5 text-primary">1</sup>
            </p>
          </aside>
        </section>

        <!-- SECCIÓN 2: A QUIÉN APLICA -->
        <section id="a-quien-aplica">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>02 · Alcance</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">¿A quién aplica?</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            La Ley 21.719 aplica a toda persona natural o jurídica que trate datos personales, sin distinción de tamaño ni sector. En el contexto escolar chileno, esto abarca cuatro tipologías:
          </p>

          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each [
              { title: 'Sostenedores', desc: 'Personas jurídicas (municipios, corporaciones, fundaciones, empresas) que administran uno o más establecimientos. Son los responsables principales del tratamiento.' },
              { title: 'Establecimientos particulares pagados', desc: 'Operan de forma independiente. El director o gerencia general asume la responsabilidad del tratamiento de datos.' },
              { title: 'Colegios subvencionados', desc: 'Incluyendo particulares subvencionados y de administración delegada. La ley no hace distinción por tipo de financiamiento.' },
              { title: 'Establecimientos municipales', desc: 'Gestionados por municipios o corporaciones municipales. También están obligados, aunque aplican reglas adicionales del sector público.' },
            ] as item}
              <div class="grid gap-3 py-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="font-semibold text-foreground">{item.title}</dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{item.desc}</dd>
              </div>
            {/each}
          </dl>

          <p class="mt-6 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            La ley también aplica a los <strong class="text-foreground">encargados del tratamiento</strong>: los proveedores tecnológicos (plataformas de gestión escolar, comunicaciones, apps educativas) que procesan datos por cuenta del colegio. El sostenedor es responsable de que sus proveedores cumplan mediante contratos de encargo de tratamiento.<sup class="ml-0.5 text-primary">2</sup>
          </p>
        </section>

        <!-- SECCIÓN 3: PRINCIPIOS -->
        <section id="principios">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>03 · Marco</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Principios clave</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            La ley organiza el tratamiento de datos en torno a seis principios que deben guiar todas las decisiones del colegio sobre gestión de información personal.
          </p>
          <ol class="mt-8 space-y-6 border-l border-border pl-6">
            {#each [
              { name: 'Licitud', desc: 'Todo tratamiento debe tener una base de legitimación: consentimiento del titular, obligación legal, interés vital, contrato, interés público o interés legítimo. Sin base, el tratamiento es ilícito.' },
              { name: 'Calidad', desc: 'Los datos deben ser exactos, completos y actualizados. El colegio no puede mantener registros desactualizados ni datos que excedan la finalidad original.' },
              { name: 'Proporcionalidad', desc: 'Solo se pueden recoger y tratar los datos estrictamente necesarios para la finalidad declarada. Recopilar más de lo necesario viola este principio.' },
              { name: 'Finalidad', desc: 'Los datos solo pueden usarse para la finalidad que justificó su recolección. Usar datos de matrícula para marketing sin consentimiento adicional es ilícito.' },
              { name: 'Seguridad', desc: 'El responsable debe implementar medidas técnicas y organizativas para proteger los datos contra acceso no autorizado, pérdida o destrucción.' },
              { name: 'Confidencialidad', desc: 'Quienes tratan datos en el colegio tienen deber de confidencialidad, incluso después de terminada su relación laboral.' },
            ] as item, i}
              <li>
                <p class="flex items-baseline gap-3 font-semibold text-foreground">
                  <span class="font-heading text-xs text-primary tabular-nums" data-numeric>0{i + 1}</span>
                  <span>{item.name}</span>
                </p>
                <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </li>
            {/each}
          </ol>
        </section>

        <!-- SECCIÓN 4: DERECHOS ARCO+P -->
        <section id="derechos-arco">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>04 · Titulares</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Derechos ARCO+P</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            Los titulares de datos —apoderados, estudiantes mayores de edad, docentes y administrativos— tienen derechos exigibles ante el colegio. Las solicitudes deben responderse dentro de <strong class="text-foreground">30 días hábiles</strong>. El incumplimiento constituye infracción grave.<sup class="ml-0.5 text-primary">3</sup>
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            {#each rights as right}
              <div class="group rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)] rounded-lg">
                <div class="flex items-baseline gap-3">
                  <span class="font-heading text-2xl font-medium leading-none text-primary group-hover:text-foreground">{right.letter}</span>
                  <h3 class="text-base font-semibold text-foreground">{right.name}</h3>
                </div>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{right.desc}</p>
              </div>
            {/each}
          </div>
          <aside class="mt-8 border-t border-border pt-6">
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Consideración especial: menores de edad</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              Para datos de menores de 14 años, los derechos ARCO+P son ejercidos por los padres o tutores legales. Entre 14 y 18 años, el menor puede ejercerlos directamente en ciertos contextos. El colegio debe tener protocolos claros para cada escenario.
            </p>
          </aside>
        </section>

        <!-- SECCIÓN 5: OBLIGACIONES -->
        <section id="obligaciones">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>05 · Operación</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Obligaciones concretas para colegios</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            Las obligaciones de la Ley 21.719 no son abstractas. Para un establecimiento, se traducen en acciones específicas que deben estar implementadas antes de diciembre de 2026.
          </p>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each [
              { title: 'Consentimiento informado', body: 'Cada tratamiento que no tenga otra base de legitimación requiere consentimiento explícito, libre, específico e informado. Los formularios de matrícula deben desglosar claramente para qué se usarán los datos del estudiante y su familia.', ref: 'Art. 12-14' },
              { title: 'Inventario de datos', body: 'El colegio debe mantener un registro interno de todas las actividades de tratamiento: qué datos recoge, con qué finalidad, quién tiene acceso, cuánto tiempo se conservan y con qué medidas de seguridad.', ref: 'Art. 16' },
              { title: 'Designación de DPO', body: 'Los responsables de tratamiento de gran volumen o datos sensibles deben designar un Delegado de Protección de Datos. Para la mayoría de los sostenedores con múltiples establecimientos, este cargo es obligatorio.', ref: 'Art. 48' },
              { title: 'Notificación de brechas', body: 'Ante una brecha de seguridad (acceso no autorizado, pérdida, filtración), el responsable debe notificar a la autoridad de control dentro de 72 horas desde que toma conocimiento. Si la brecha afecta a titulares, también deben ser notificados.', ref: 'Art. 30' },
              { title: 'Evaluación de Impacto (DPIA)', body: 'Cuando se implementen nuevos sistemas que traten datos a gran escala o datos sensibles —como una nueva plataforma de gestión escolar—, se debe realizar una Evaluación de Impacto antes de la implementación.', ref: 'Art. 17' },
              { title: 'Contratos con encargados', body: 'Todo proveedor externo que trate datos por cuenta del colegio debe firmar un contrato de encargo de tratamiento que garantice el cumplimiento de las obligaciones de la ley.', ref: 'Art. 24' },
            ] as item}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt>
                  <p class="font-semibold text-foreground">{item.title}</p>
                  <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary" data-numeric>{item.ref} · Ley 21.719</p>
                </dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{item.body}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- SECCIÓN 6: MULTAS -->
        <section id="multas">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>06 · Sanciones</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Multas y sanciones</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            El <strong class="text-foreground">Consejo para la Transparencia</strong> es el organismo fiscalizador. Las sanciones se clasifican en tres niveles según la gravedad de la infracción. Los montos se expresan en UTM.
          </p>
          <div class="mt-8 divide-y divide-border border-y border-border">
            {#each sanctions as s, i}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_minmax(0,12rem)] sm:items-baseline sm:gap-8">
                <div>
                  <p class="font-heading text-2xl font-medium leading-none text-foreground tabular-nums" data-numeric>0{i + 1}</p>
                  <p class="mt-2 text-base font-semibold text-foreground">{s.level}</p>
                </div>
                <p class="text-sm leading-relaxed text-muted-foreground">{s.examples}</p>
                <div class="sm:text-right">
                  <p class="text-sm font-semibold text-foreground">{s.fine}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{s.approx}</p>
                </div>
              </div>
            {/each}
          </div>
          <aside class="mt-8 border-t border-border pt-6">
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Nota sobre la multa máxima</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              Para infracciones gravísimas, la multa puede ser el mayor entre 10.000 UTM y el 4% de la facturación anual del infractor. Para sostenedores de redes de colegios con facturación significativa, el 4% puede superar con creces el equivalente en UTM. La reincidencia puede duplicar las sanciones y alcanzar hasta <strong class="text-foreground">20.000 UTM</strong>.
            </p>
          </aside>
        </section>

        <!-- SECCIÓN 7: PLAZOS -->
        <section id="plazos">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>07 · Calendario</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Plazos críticos</h2>
          <ol class="mt-8 divide-y divide-border border-y border-border">
            {#each timeline as item}
              <li class="grid gap-3 py-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8">
                <span class="text-sm font-semibold {item.highlight ? 'text-primary' : 'text-muted-foreground'} tabular-nums" data-numeric>{item.date}</span>
                <p class="text-sm leading-relaxed {item.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}">{item.event}</p>
              </li>
            {/each}
          </ol>
          <p class="mt-6 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            El plazo de adecuación de dos años desde la promulgación es razonable para organizaciones que parten desde cero. Un colegio que recién comience en junio de 2026 tiene seis meses para completar inventario de datos, revisión de contratos, capacitaciones y ajustes técnicos. Empezar antes no es prudencia burocrática: es gestión de riesgo.
          </p>
        </section>

        <!-- SECCIÓN 8: CHECKLIST -->
        <section id="checklist">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>08 · Verificación</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Checklist de cumplimiento</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            Quince acciones concretas que su establecimiento debe completar antes de diciembre de 2026. No es exhaustivo, pero cubre los puntos que la autoridad fiscalizadora verificará primero.
          </p>
          <ol class="mt-8 divide-y divide-border border-y border-border">
            {#each checklist as item, i}
              <li class="flex items-start gap-4 py-3">
                <span class="font-heading text-xs font-medium text-primary tabular-nums pt-0.5 w-6 shrink-0" data-numeric>{(i + 1).toString().padStart(2, '0')}</span>
                <span class="size-5 shrink-0 mt-0.5 border border-muted-foreground/40 rounded-[4px]"></span>
                <p class="text-sm text-foreground">{item}</p>
              </li>
            {/each}
          </ol>
          <p class="mt-6 text-sm text-muted-foreground">
            ¿Quiere una evaluación personalizada? <a href="/demo" class="border-b border-primary pb-0.5 font-semibold text-primary hover:border-b-2">Solicite una revisión gratuita con un especialista Ethoz</a>.
          </p>
        </section>

        <!-- SECCIÓN 9: CÓMO AYUDA ETHOZ -->
        <section id="como-ayuda-ethoz">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>09 · Herramienta</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">¿Cómo Ethoz ayuda con la Ley 21.719?</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            Ethoz no reemplaza el sistema de gestión escolar que ya usa su colegio. Agrega la capa de seguridad, privacidad y compliance que esos sistemas no tienen por diseño.
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            {#each [
              { title: 'Cifrado y RLS por diseño', desc: 'Datos cifrados at-rest y en tránsito. Row-Level Security en cada consulta: cada actor del colegio accede solo a lo que le corresponde.', link: '/seguridad-datos' },
              { title: 'Audit log inmutable', desc: 'Cada acción sensible queda registrada con usuario, timestamp e IP. Trazabilidad exigida por Circular N°30 y necesaria ante brechas.', link: '/seguridad-datos' },
              { title: 'Gestión de derechos ARCO+P', desc: 'Panel para registrar y responder solicitudes de acceso, rectificación y supresión dentro de los plazos legales.', link: '/compliance' },
              { title: 'Integración con sistemas actuales', desc: 'Ethoz se conecta a Napsis, Syscol y Lirmi. No tiene que migrar ni reemplazar su ERP escolar.', link: '/integrations' },
            ] as item}
              <a href={item.link} class="group block border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)] rounded-lg">
                <h3 class="font-semibold text-foreground">{item.title}</h3>
                <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                <span class="mt-4 inline-flex items-center gap-1 border-b border-primary pb-0.5 text-sm font-semibold text-primary group-hover:border-b-2">
                  Conocer más <ArrowRight class="size-3.5" />
                </span>
              </a>
            {/each}
          </div>
        </section>

        <!-- Footnotes -->
        <footer class="border-t border-border pt-8">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Referencias</p>
          <ol class="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li class="flex gap-2"><sup class="text-primary shrink-0">1</sup><span>Ley N° 21.719, publicada en el Diario Oficial el 13 de diciembre de 2024. Texto oficial disponible en el portal de la Biblioteca del Congreso Nacional de Chile (BCN).</span></li>
            <li class="flex gap-2"><sup class="text-primary shrink-0">2</sup><span>Art. 24 — Ley 21.719 sobre encargados del tratamiento y sus obligaciones contractuales.</span></li>
            <li class="flex gap-2"><sup class="text-primary shrink-0">3</sup><span>Art. 40 — Ley 21.719 sobre plazos de respuesta al ejercicio de derechos.</span></li>
          </ol>
          <a
            href="https://www.bcn.cl/leychile/navegar?idNorma=1209272"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-2"
          >
            Texto oficial en BCN <ExternalLink class="size-3" />
          </a>
        </footer>

      </article>
    </div>
  </div>

  <!-- ══════════════════════════════════════
       FINAL CTA — dark navy editorial closing
       ══════════════════════════════════════ -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-law">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/85">Consulta institucional</p>
      <h2 id="final-cta-law" class="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-tight text-background sm:text-4xl lg:text-5xl">
        Evalúe el nivel de exposición de su colegio en 20 minutos.
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        Sesión breve con un especialista. Sin costo, sin compromiso. Identificamos los tres puntos de mayor riesgo y las acciones priorizadas para cerrarlos antes de diciembre de 2026.
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Solicitar evaluación gratuita
          <ArrowRight class="size-5" />
        </a>
        <a
          href="/glosario"
          class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background"
        >
          Ver glosario normativo
        </a>
      </div>
    </div>
  </section>

  <!-- Related pages -->
  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">También puede interesarle</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/circular-30', label: 'Circular N°30 — libro de clases digital' },
          { href: '/seguridad-datos', label: 'Seguridad de datos en Ethoz' },
          { href: '/comparativa', label: 'Comparativa de plataformas' },
          { href: '/glosario', label: 'Glosario normativo' },
          { href: '/compliance', label: 'Cumplimiento normativo' },
        ] as item}
          <a href={item.href} class="border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:border-foreground hover:text-foreground rounded-md">
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <Footer />
</main>
