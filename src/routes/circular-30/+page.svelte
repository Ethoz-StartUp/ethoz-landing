<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    CheckCircle,
    XCircle,
    ArrowRight,
    Lock,
    Database,
    FileText,
    Clock,
    AlertTriangle,
    Users,
    Eye,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'circular-30' });
  });

  const requirements = [
    { req: 'Audit log inmutable por registro', why: 'Trazabilidad exigida — quién modificó qué y cuándo' },
    { req: 'Autenticación con Clave Única del Estado', why: 'Vincula cada acción al RUT del docente' },
    { req: 'Control de acceso por rol', why: 'Docente ve su libro; inspector ve asistencia global' },
    { req: 'Respaldo automático diario', why: 'Disponibilidad garantizada para fiscalización' },
    { req: 'Inmutabilidad retroactiva', why: 'Registros no modificables sin traza visible' },
    { req: 'Exportación para Superintendencia', why: 'Acceso on-demand para fiscalizadores' },
  ];

  const nonCompliant = [
    { system: 'Google Sheets compartido', reason: 'Sin trazabilidad, cualquier editor puede modificar retroactivamente sin rastro' },
    { system: 'PDF firmado en servidor local', reason: 'Documento estático, no permite consulta dinámica ni audit log' },
    { system: 'ERP escolar sin módulo de trazabilidad', reason: 'Registra asistencia pero no el historial de modificaciones por entrada' },
    { system: 'Planilla Excel en red compartida', reason: 'Sin control de versiones, sin autenticación individual por registro' },
  ];

  const selfAssessment = [
    { question: '¿Puede saber quién modificó una nota específica y cuándo?', critical: true },
    { question: '¿Puede demostrar que un registro de asistencia no fue alterado retroactivamente?', critical: true },
    { question: '¿Está integrado con Clave Única u otro mecanismo de verificación de identidad?', critical: true },
    { question: '¿Puede exportar el libro de clases completo para la Superintendencia en menos de 24 horas?', critical: false },
    { question: '¿Tiene respaldos automáticos con recuperación point-in-time?', critical: false },
    { question: '¿Cada docente accede solo a su propio libro de clases, no al de colegas?', critical: true },
    { question: '¿Los apoderados pueden solicitar el historial de su hijo y recibirlo en 30 días hábiles?', critical: false },
  ];
</script>

<svelte:head>
  <title>Circular N°30: libro de clases digital obligatorio — guía completa | Ethoz</title>
  <meta name="description" content="Circular N°30 libro de clases digital: qué exige, qué sistemas cumplen, autodiagnóstico para colegios chilenos. Trazabilidad, Clave Única y Ley 21.719." />
  <meta property="og:title" content="Circular N°30: libro de clases digital — Ethoz" />
  <meta property="og:description" content="Circular N°30 libro de clases digital: qué exige, qué sistemas cumplen, autodiagnóstico para colegios chilenos." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/circular-30" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/circular-30" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Circular N°30: libro de clases digital obligatorio en Chile",
      "description": "Circular N°30 libro de clases digital: qué exige, qué sistemas cumplen, autodiagnóstico para colegios chilenos.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": "Ethoz" },
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/circular-30",
      "mainEntityOfPage": "https://ethoz.cl/circular-30",
      "keywords": "circular 30, libro de clases digital chile, libro digital colegio, superintendencia educacion"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Circular N°30", "item": "https://ethoz.cl/circular-30" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- HERO -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">Documento normativo · 02</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Superintendencia de Educación</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>6 min de lectura</span>
      </p>

      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>

      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        Un libro sin testigos no es un libro — es un borrador.
      </h1>

      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        La Circular N°30 de la Superintendencia de Educación formaliza los requisitos que debe cumplir cualquier libro de clases digital en Chile. Trazabilidad, autenticación con Clave Única e integración con la Ley 21.719 son los ejes centrales. Sin esos tres, un sistema no reemplaza el libro físico: lo debilita.
      </p>

      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-3">
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Autoridad</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">Superintendencia</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Estándar identidad</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">Clave Única</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ejes</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>04</dd>
        </div>
      </dl>
    </div>
  </section>

  <div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <article class="mx-auto max-w-[68ch] space-y-20">

      <!-- SECCIÓN 1: QUÉ EXIGE -->
      <section id="que-exige">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>01 · Marco</p>
        <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">¿Qué exige la Circular N°30?</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          La Circular N°30 no prescribe una plataforma específica, pero establece estándares técnicos precisos que cualquier sistema de libro de clases digital debe cumplir. Los cuatro pilares son:
        </p>

        <dl class="mt-8 divide-y divide-border border-y border-border">
          {#each [
            { title: 'Integridad de datos', icon: Database, desc: 'Los registros no pueden modificarse retroactivamente sin dejar traza. Un registro de asistencia marcado el lunes no puede desaparecer el martes sin que esa eliminación quede documentada.' },
            { title: 'Trazabilidad completa', icon: Eye, desc: 'Cada acción —creación, modificación, eliminación, consulta— debe quedar asociada a un usuario identificado, con marca de tiempo exacta. No basta saber que algo cambió: el sistema debe registrar quién, cuándo y desde qué dispositivo.' },
            { title: 'Verificación de identidad', icon: Users, desc: 'La circular exige mecanismos robustos de autenticación. La integración con Clave Única del Estado es el estándar de referencia, porque vincula la acción al RUT del docente de forma auditable ante cualquier fiscalizador.' },
            { title: 'Disponibilidad y respaldo', icon: ShieldCheck, desc: 'Los registros deben estar disponibles para consulta por la Superintendencia en el momento que se requiera, con respaldos que garanticen continuidad ante fallas técnicas.' },
          ] as item, i}
            {@const Icon = item.icon}
            <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8">
              <dt>
                <div class="flex items-center gap-2.5">
                  <Icon class="size-4 shrink-0 text-primary" />
                  <span class="font-semibold text-foreground">{item.title}</span>
                </div>
                <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary" data-numeric>Pilar 0{i + 1}</p>
              </dt>
              <dd class="text-sm leading-relaxed text-muted-foreground">{item.desc}</dd>
            </div>
          {/each}
        </dl>

        <!-- Pull-quote moment -->
        <blockquote class="mt-10 border-l-2 border-primary pl-6 font-heading text-[1.5rem] font-normal italic leading-[1.4] text-foreground sm:text-[1.75rem]">
          La Superintendencia no verifica solo que los datos existan — verifica que sean confiables.
        </blockquote>

        <p class="mt-6 text-sm leading-relaxed text-muted-foreground">Sin trazabilidad, un libro de clases no puede responder preguntas críticas cuando más importan:</p>
        <ul class="mt-4 space-y-3 border-l border-border pl-6">
          <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">Accidente escolar.</strong> ¿Estaba el alumno presente? ¿Se registró en tiempo real o después del incidente?</li>
          <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">Reclamo de apoderado.</strong> ¿Cuándo se ingresó la nota? ¿Fue modificada, y por quién?</li>
          <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">Denuncia por maltrato.</strong> ¿Los registros de conducta son contemporáneos a los hechos?</li>
        </ul>
      </section>

      <!-- SECCIÓN 2: QUÉ SISTEMAS CUMPLEN -->
      <section id="que-sistemas-cumplen">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>02 · Verificación</p>
        <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">¿Qué sistemas cumplen los requisitos?</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          Lista de verificación técnica. Un sistema que no cumpla los primeros cuatro requisitos —los críticos— no cumple la Circular N°30, independientemente de otras funcionalidades que ofrezca.
        </p>

        <!-- Requirements table -->
        <div class="mt-8 border-y border-border">
          <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-4 py-3 border-b border-border">
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Requisito</p>
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Por qué importa</p>
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ethoz</p>
          </div>
          {#each requirements as r, i}
            <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-4 py-4 {i !== requirements.length - 1 ? 'border-b border-border' : ''}">
              <p class="text-sm font-medium text-foreground">{r.req}</p>
              <p class="text-sm leading-relaxed text-muted-foreground">{r.why}</p>
              <div class="flex items-start justify-end">
                <CheckCircle class="size-5 text-primary" />
              </div>
            </div>
          {/each}
        </div>

        <h3 class="mt-12 font-heading text-xl font-medium tracking-tight text-foreground">Sistemas que <em>no</em> cumplen la Circular N°30</h3>
        <ul class="mt-6 divide-y divide-border border-y border-border">
          {#each nonCompliant as nc}
            <li class="grid gap-3 py-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8">
              <div class="flex items-center gap-2.5">
                <XCircle class="size-4 shrink-0 text-destructive" />
                <span class="font-semibold text-foreground">{nc.system}</span>
              </div>
              <p class="text-sm leading-relaxed text-muted-foreground">{nc.reason}</p>
            </li>
          {/each}
        </ul>
      </section>

      <!-- SECCIÓN 3: AUTODIAGNÓSTICO -->
      <section id="autodiagnostico">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>03 · Diagnóstico</p>
        <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">¿Cumple su libro de clases actual?</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          Responda estas preguntas sobre el sistema que usa hoy. Si no puede responder "sí" con certeza a las marcadas como críticas, su libro de clases no cumple la Circular N°30.
        </p>
        <ol class="mt-8 divide-y divide-border border-y border-border">
          {#each selfAssessment as item, i}
            <li class="flex items-start gap-4 py-4">
              <span class="font-heading text-xs font-medium text-primary tabular-nums pt-0.5 w-6 shrink-0" data-numeric>{(i + 1).toString().padStart(2, '0')}</span>
              <span class="size-5 shrink-0 mt-0.5 border {item.critical ? 'border-destructive/50' : 'border-muted-foreground/40'} rounded-[4px]"></span>
              <p class="flex-1 text-sm text-foreground">
                {item.question}
                {#if item.critical}
                  <span class="ml-2 inline-block align-middle text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive">Crítico</span>
                {/if}
              </p>
            </li>
          {/each}
        </ol>
        <p class="mt-6 text-sm leading-relaxed text-muted-foreground">
          Si respondió "no" o "no sé" a cualquier pregunta crítica, su establecimiento está expuesto ante una visita de la Superintendencia. <a href="/demo" class="border-b border-primary pb-0.5 font-semibold text-primary hover:border-b-2">Solicite una revisión gratuita</a>.
        </p>
      </section>

      <!-- SECCIÓN 4: INTEGRACIÓN CON ETHOZ -->
      <section id="integracion-ethoz">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>04 · Integración</p>
        <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Integración con Ethoz</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          Ethoz no reemplaza el sistema de gestión que usa su colegio hoy. Agrega la capa de trazabilidad, control de acceso y cumplimiento normativo que le falta al libro de clases existente.
        </p>
        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          {#each [
            { title: 'Audit log nativo', desc: 'Cada registro pedagógico queda inmutablemente documentado: quién lo creó, quién lo modificó y cuándo. Compatible con los requisitos de la Circular N°30.' },
            { title: 'Control de acceso granular', desc: 'Los docentes acceden solo a su propio libro de clases. Inspectores y directivos ven solo lo que su rol permite. Sin excepciones.' },
            { title: 'Integración con sistemas actuales', desc: 'Ethoz se conecta con Napsis, Syscol y Lirmi mediante API. No migra datos — los complementa con la capa de seguridad que falta.' },
            { title: 'Cumplimiento cruzado Ley 21.719', desc: 'Cada dato del libro de clases es un dato personal protegido por la Ley 21.719. Ethoz garantiza que ambas normativas se cumplan simultáneamente.' },
          ] as item}
            <div class="group rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover rounded-lg">
              <h3 class="font-semibold text-foreground">{item.title}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          {/each}
        </div>
      </section>

    </article>
  </div>

  <!-- FINAL CTA — dark navy -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-circular">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/85">Informe de brechas</p>
      <h2 id="final-cta-circular" class="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-tight text-background sm:text-4xl">
        ¿Cumple su libro de clases la Circular N°30?
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        Revisamos su sistema actual y entregamos un informe de brechas sin costo. En 30 minutos sabe exactamente dónde está.
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Solicitar revisión gratuita
          <ArrowRight class="size-5" />
        </a>
        <a href="/ley-21719" class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background">
          Ver guía Ley 21.719
        </a>
      </div>
    </div>
  </section>

  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">También puede interesarle</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/ley-21719', label: 'Ley 21.719 — guía completa' },
          { href: '/seguridad-datos', label: 'Seguridad de datos en Ethoz' },
          { href: '/glosario', label: 'Glosario normativo' },
          { href: '/comparativa', label: 'Comparativa de plataformas' },
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
