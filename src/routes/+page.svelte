<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { goto } from '$app/navigation';
  import { trackEvent } from '$lib/utils/analytics';
  import { CONTACT } from '$lib/config';
  import { slide } from 'svelte/transition';
  import { env } from '$env/dynamic/public';
  import PitchModal from '$lib/components/PitchModal.svelte';
  import {
    Shield,
    Users,
    Bell,
    FileCheck,
    Clock,
    ArrowRight,
    Check,
    ChevronRight,
    Lock,
    Zap,
    Building,
    UserCheck,
    ClipboardList,
    AlertTriangle,
    Eye,
    Search,
    Fingerprint,
    MessageSquare,
    ChevronDown,
    Plus,
    Minus,
    Play,
    Plug,
    Database,
    Rocket
  } from '@lucide/svelte';

  // ── Reactive state ──
  let showStickyCta = $state(false);
  let showPitch = $state(false);

  // ── FAQ accordion state ──
  let openFaq = $state<number | null>(null);
  function toggleFaq(index: number) {
    openFaq = openFaq === index ? null : index;
  }

  // ── Countdown state ── (initialized synchronously so SSR + first paint show real values)
  function computeCountdown() {
    const target = new Date('2026-12-01T00:00:00-03:00');
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    };
  }
  const initial = computeCountdown();
  let countdownDays = $state(initial.days);
  let countdownHours = $state(initial.hours);
  let countdownMinutes = $state(initial.minutes);

  $effect(() => {
    const tick = () => {
      const c = computeCountdown();
      countdownDays = c.days;
      countdownHours = c.hours;
      countdownMinutes = c.minutes;
    };
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  });



  // ── Student carousel for hero mockup ──
  const heroStudents = [
    {
      photo: '/images/students/kid-14.webp',
      name: 'Diego Fernández',
      grade: '8° Básico A',
      hasAlert: true,
      alertText: 'Alerta Activa',
      timeline: [
        { type: 'alert' as const, text: 'Orden de alejamiento registrada', meta: 'Hace 2 horas — Orientadora M. López' },
        { type: 'pickup' as const, text: 'Retiro autorizado — Madre', meta: 'Ayer 15:30 — Portería Central' },
        { type: 'update' as const, text: 'Ficha actualizada — datos familiares', meta: '02 abr — Prof. jefe R. Soto' },
      ],
    },
    {
      photo: '/images/students/girl-12.webp',
      name: 'Isabella Rojas',
      grade: '6° Básico A',
      hasAlert: false,
      alertText: '',
      timeline: [
        { type: 'pickup' as const, text: 'Retiro autorizado — Padre', meta: 'Hoy 13:45 — Portería Sur' },
        { type: 'observation' as const, text: 'Observación conductual positiva', meta: 'Ayer — Prof. A. Martínez' },
        { type: 'update' as const, text: 'Contacto de emergencia actualizado', meta: '01 abr — Admin' },
      ],
    },
    {
      photo: '/images/students/girl-15.webp',
      name: 'Catalina Morales',
      grade: '1° Medio A',
      hasAlert: true,
      alertText: 'Retiro Restringido',
      timeline: [
        { type: 'alert' as const, text: 'Retiro no autorizado detectado', meta: 'Hace 1 hora — Portería Norte' },
        { type: 'observation' as const, text: 'Derivación a orientación', meta: 'Hoy 09:00 — Prof. C. Ruiz' },
        { type: 'pickup' as const, text: 'Retiro autorizado — Abuela', meta: 'Ayer 16:00 — Portería Central' },
      ],
    },
    {
      photo: '/images/students/kid-11.webp',
      name: 'Tomás Herrera',
      grade: '5° Básico B',
      hasAlert: false,
      alertText: '',
      timeline: [
        { type: 'pickup' as const, text: 'Retiro autorizado — Madre', meta: 'Hoy 13:00 — Portería Central' },
        { type: 'update' as const, text: 'Evaluación semestral registrada', meta: '31 mar — Prof. jefe L. Vera' },
        { type: 'observation' as const, text: 'Participación en acto cívico', meta: '28 mar — Inspector J. Muñoz' },
      ],
    },
  ];

  let currentStudent = $state(0);
  let carouselPaused = $state(false);
  const activeStudent = $derived(heroStudents[currentStudent]);

  // Auto-advance carousel — pauses on hover/focus and respects reduced-motion (WCAG 2.2.2)
  $effect(() => {
    if (carouselPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      currentStudent = (currentStudent + 1) % heroStudents.length;
    }, 5000);
    return () => clearInterval(interval);
  });

  // Compact countdown label for hero badge
  const heroCountdownLabel = $derived(
    countdownDays > 0
      ? `Faltan ${countdownDays} días para Ley 21.719`
      : `Ley 21.719 en vigencia`
  );
</script>

<!-- Scroll listener (guarded to avoid no-op reactivity writes) -->
<svelte:window onscroll={() => {
  const c = window.scrollY > 120;
  if (c !== showStickyCta) showStickyCta = c;
}} />

<svelte:head>
  <title>{t('home.meta.title')}</title>
  <meta name="description" content="Ethoz — Software de gestión y protección de datos escolares para colegios de Chile. Cumple con la Ley 21.719 antes del plazo de diciembre 2026." />
  <meta property="og:url" content="https://ethoz.cl/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Gestión y cumplimiento para colegios" />
  <meta property="og:description" content="Plataforma de gestión y cumplimiento normativo para colegios en Chile. Control de acceso, protección de datos y seguridad escolar." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Gestión y cumplimiento para colegios" />
  <meta name="twitter:description" content="Plataforma de gestión y cumplimiento normativo para colegios en Chile. Control de acceso, protección de datos y seguridad escolar." />
  <link rel="canonical" href="https://ethoz.cl/" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Ethoz",
      "legalName": "ETHOZ SpA",
      "url": "https://ethoz.cl",
      "logo": "https://ethoz.cl/favicon.svg",
      "description": "Plataforma de gestión y protección de datos escolares para colegios de Chile",
      "foundingDate": "2026-04-06",
      "areaServed": { "@type": "Country", "name": "Chile" },
      "sameAs": [
        "https://www.linkedin.com/company/ethozcl/",
        "https://web.facebook.com/profile.php?id=1083964671464526",
        "https://www.instagram.com/ethoz.cl/",
        "https://www.youtube.com/channel/UCYeWEdqonYWKvja78_HM2TA",
        "https://share.google/kmwkmo8To6711zCgB"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Santiago",
        "addressCountry": "CL"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "url": "https://ethoz.cl/contact"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Ethoz",
      "url": "https://ethoz.cl",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ethoz.cl/demo?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Ethoz",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Plataforma de gestión y protección de datos escolares para colegios de Chile. Cumplimiento Ley 21.719.",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "CLP",
        "availability": "https://schema.org/OnlineOnly",
        "url": "https://ethoz.cl/get-started"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [1,2,11,3,15,4,12].map(n => ({
        "@type": "Question",
        "name": t(`faq.q${n}` as TranslationKey),
        "acceptedAnswer": { "@type": "Answer", "text": t(`faq.a${n}` as TranslationKey) }
      }))
    }
  ])}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — visible on focus, WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#hero-cta"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>

  <!-- Urgency ribbon — McKinsey-editorial, deep-blue anchor, surfaces Ley 21.719 deadline above the fold -->
  <div class="border-b border-border bg-foreground text-background" role="complementary" aria-label="Plazo de cumplimiento Ley 21.719">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[13px] sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Ley 21.719</span>
        <span class="hidden text-background/50 sm:inline" aria-hidden="true">·</span>
        <span class="text-background/90">
          Faltan <span data-numeric class="font-semibold text-background">{countdownDays}</span> días ·
          Multas hasta <span data-numeric class="font-semibold text-background">20.000 UTM</span>
        </span>
      </p>
      <a href="/demo" class="inline-flex items-center gap-1 border-b border-background text-[13px] font-semibold text-background hover:border-b-2">
        Agendar demo <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>

  <NavBar />

  <!-- ═══════════════════════════════════════════
       SECTION 2: HERO — editorial, McKinsey-style
       ═══════════════════════════════════════════ -->
  <section class="relative pt-20 sm:pt-24">
    <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:px-8">

      <!-- Left column: headline + CTAs -->
      <div class="flex flex-col items-center text-center sm:items-start sm:text-left">
        <!-- Live urgency badge — pulsing dot + countdown -->
        <div
          class="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-xs font-medium text-foreground"
          aria-label={heroCountdownLabel}
        >
          <span class="relative flex size-2 shrink-0">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60"></span>
            <span class="relative inline-flex size-2 rounded-full bg-primary"></span>
          </span>
          <span aria-hidden="true">{heroCountdownLabel}</span>
        </div>

        <!-- Headline -->
        <h1 class="animate-fade-in-up animate-delay-100 w-full text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[3.25rem] lg:leading-[1.05]">
          {t('hero.title')}
        </h1>

        <!-- Subtitle -->
        <p class="animate-fade-in-up animate-delay-200 mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t('hero.subtitle')}
        </p>

        <!-- Inline countdown — editorial text density, not a widget -->
        <p class="animate-fade-in-up animate-delay-200 mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span class="inline-flex items-center gap-1.5">
            <span class="relative flex size-1.5">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70"></span>
              <span class="relative inline-flex size-1.5 rounded-full bg-destructive"></span>
            </span>
            <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">Cuenta regresiva</span>
          </span>
          <span data-numeric class="text-foreground">
            <span class="font-semibold">{countdownDays}</span> días
            · <span class="font-semibold">{countdownHours.toString().padStart(2, '0')}</span> h
            · <span class="font-semibold">{countdownMinutes.toString().padStart(2, '0')}</span> min
          </span>
        </p>

        <!-- CTAs -->
        <div class="animate-fade-in-up animate-delay-300 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-start sm:gap-4">
          <Button
            id="hero-cta"
            size="xl"
            onclick={async () => {
              trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'hero' });
              await goto('/demo');
            }}
            class="w-full justify-center sm:w-auto"
          >
            {t('hero.cta.primary')}
            <ArrowRight class="size-5" />
          </Button>
          <Button variant="outline" size="xl" onclick={() => { trackEvent('hero_cta_clicked', { cta: 'watch_video', location: 'hero' }); showPitch = true; }} class="w-full justify-center sm:w-auto">
            <Play class="size-5" />
            <span class="hidden sm:inline">{t('hero.video_long')}</span>
            <span class="sm:hidden">{t('hero.video_short')}</span>
          </Button>
        </div>
      </div>

      <!-- Right column: dashboard mockup — flat, hairline 1px border, McK style -->
      <div class="animate-fade-in-up animate-delay-400 w-full">
        <div
          class="overflow-hidden border border-border bg-card shadow-mockup"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Vista del panel Ethoz"
          onmouseenter={() => (carouselPaused = true)}
          onmouseleave={() => (carouselPaused = false)}
          onfocusin={() => (carouselPaused = true)}
          onfocusout={() => (carouselPaused = false)}
        >
          <!-- Title bar with LIVE indicator -->
          <div class="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
            <div class="size-3 rounded-full bg-destructive/60"></div>
            <div class="size-3 rounded-full bg-warning/60"></div>
            <div class="size-3 rounded-full bg-success/60"></div>
            <span class="ml-3 text-xs font-medium text-muted-foreground">{t('hero.mockup_title')}</span>
            <span class="ml-auto inline-flex items-center gap-1.5 border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span class="relative flex size-1.5">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70"></span>
                <span class="relative inline-flex size-1.5 rounded-full bg-success"></span>
              </span>
              Datos ficticios · Demo
            </span>
          </div>

          <!-- Dashboard content — carousel -->
          {#key currentStudent}
            <div class="carousel-fade p-4 sm:p-6">
              <div class="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <!-- Student profile column -->
                <div class="flex flex-col items-center gap-3 sm:w-48 sm:shrink-0 sm:items-start">
                  <img
                    src={activeStudent.photo}
                    alt={activeStudent.name}
                    width="64"
                    height="64"
                    class="size-16 rounded-full object-cover ring-2 ring-border"
                    loading="eager"
                  />
                  <div class="text-center sm:text-left">
                    <p class="text-sm font-semibold text-foreground">{activeStudent.name}</p>
                    <p class="text-xs text-muted-foreground">{activeStudent.grade}</p>
                  </div>
                  {#if activeStudent.hasAlert}
                    <span class="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                      <AlertTriangle class="size-3" />
                      {activeStudent.alertText}
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                      <Check class="size-3" />
                      {t('hero.no_alerts')}
                    </span>
                  {/if}
                </div>

                <!-- Timeline column -->
                <div class="flex-1 border-t border-border pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                  <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('hero.recent_history')}
                  </p>
                  <div class="flex flex-col gap-3">
                    {#each activeStudent.timeline as entry}
                      <div class="flex items-start gap-3">
                        <div class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full {entry.type === 'alert' ? 'bg-destructive/10' : 'bg-primary/10'}">
                          {#if entry.type === 'alert'}
                            <AlertTriangle class="size-3 text-destructive" />
                          {:else if entry.type === 'pickup'}
                            <UserCheck class="size-3 text-primary" />
                          {:else if entry.type === 'observation'}
                            <MessageSquare class="size-3 text-primary" />
                          {:else}
                            <Eye class="size-3 text-primary" />
                          {/if}
                        </div>
                        <div>
                          <p class="text-xs font-medium text-foreground">{entry.text}</p>
                          <p class="text-xs text-muted-foreground">{entry.meta}</p>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/key}

          <!-- Carousel dots -->
          <div class="flex items-center justify-center gap-2 border-t border-border px-4 py-3">
            {#each heroStudents as student, i}
              <button
                onclick={() => { currentStudent = i; }}
                class="flex items-center justify-center p-2"
                aria-label={`Ver ${student.name}`}
                aria-current={currentStudent === i ? 'true' : undefined}
              >
                <span class="block size-2 rounded-full transition-all {currentStudent === i ? 'w-6 bg-primary' : 'bg-border hover:bg-muted-foreground'}"></span>
              </button>
            {/each}
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 3: TRUST BAR — provable facts, not generic badges
       ═══════════════════════════════════════════ -->
  <section class="reveal border-y border-border bg-secondary py-8" aria-label="Por qué confiar en Ethoz">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {t('trust.attribution')}
      </p>
      <div class="mt-5 flex flex-col items-center justify-center gap-5 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-3">
        <div class="trust-item flex items-center gap-2.5">
          <Building class="size-4 shrink-0 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.servers')}</p>
        </div>
        <div class="hidden h-4 w-px bg-border sm:block"></div>
        <div class="trust-item flex items-center gap-2.5">
          <Lock class="size-4 shrink-0 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.encryption')}</p>
        </div>
        <div class="hidden h-4 w-px bg-border sm:block"></div>
        <div class="trust-item flex items-center gap-2.5">
          <Zap class="size-4 shrink-0 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.integration')}</p>
        </div>
        <div class="hidden h-4 w-px bg-border sm:block"></div>
        <div class="trust-item flex items-center gap-2.5">
          <Shield class="size-4 shrink-0 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.compliance')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 4: PROBLEM
       ═══════════════════════════════════════════ -->
  <section class="reveal py-12 sm:py-14" id="problem">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('problem.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('problem.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('problem.subtitle')}
        </p>
      </div>

      <!-- Problem items — 3 columns, icon + title always inline -->
      <div class="mx-auto mt-8 grid gap-5 sm:grid-cols-3">
        <div class="group border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <div class="flex items-center gap-2.5">
            <AlertTriangle class="size-5 shrink-0 text-warning transition-transform group-hover:-rotate-6" />
            <h3 class="text-base font-semibold text-foreground">{t('problem.card1.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('problem.card1.desc')}</p>
        </div>

        <div class="group border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <div class="flex items-center gap-2.5">
            <Shield class="size-5 shrink-0 text-destructive transition-transform group-hover:-rotate-6" />
            <h3 class="text-base font-semibold text-foreground">{t('problem.card2.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('problem.card2.desc')}</p>
        </div>

        <div class="group border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <div class="flex items-center gap-2.5">
            <FileCheck class="size-5 shrink-0 text-primary transition-transform group-hover:-rotate-6" />
            <h3 class="text-base font-semibold text-foreground">{t('problem.card3.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('problem.card3.desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 5: SOLUTION / FEATURES
       ═══════════════════════════════════════════ -->
  <section class="reveal bg-secondary py-12 sm:py-14" id="features">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('solution.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('solution.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('solution.subtitle')}
        </p>
      </div>

      <!-- Feature cards — 2×2 grid, numbered headings (no icon boxes) -->
      <div class="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
        <!-- Feature 1: Ficha 360° -->
        <a href="/features/student-profile" class="group relative border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <span class="font-heading block text-4xl font-medium tabular-nums leading-none tracking-tight text-primary/80 transition-colors group-hover:text-foreground">01</span>
          <h3 class="mt-3 text-base font-semibold text-foreground">{t('features.record.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.record.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 border-b border-primary pb-0.5 text-sm font-semibold text-primary transition-all group-hover:gap-1.5 group-hover:border-b-2">
            {t('features.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>

        <!-- Feature 2: Retiros Seguros -->
        <a href="/features/safe-pickups" class="group relative border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <span class="font-heading block text-4xl font-medium tabular-nums leading-none tracking-tight text-primary/80 transition-colors group-hover:text-foreground">02</span>
          <h3 class="mt-3 text-base font-semibold text-foreground">{t('features.pickup.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.pickup.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 border-b border-primary pb-0.5 text-sm font-semibold text-primary transition-all group-hover:gap-1.5 group-hover:border-b-2">
            {t('features.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>

        <!-- Feature 3: Permisos por Cargo -->
        <a href="/features/access-control" class="group relative border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <span class="font-heading block text-4xl font-medium tabular-nums leading-none tracking-tight text-primary/80 transition-colors group-hover:text-foreground">03</span>
          <h3 class="mt-3 text-base font-semibold text-foreground">{t('features.rbac.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.rbac.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 border-b border-primary pb-0.5 text-sm font-semibold text-primary transition-all group-hover:gap-1.5 group-hover:border-b-2">
            {t('features.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>

        <!-- Feature 4: Búsqueda Instantánea -->
        <a href="/features/smart-search" class="group relative border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <span class="font-heading block text-4xl font-medium tabular-nums leading-none tracking-tight text-primary/80 transition-colors group-hover:text-foreground">04</span>
          <h3 class="mt-3 text-base font-semibold text-foreground">{t('features.search.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.search.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 border-b border-primary pb-0.5 text-sm font-semibold text-primary transition-all group-hover:gap-1.5 group-hover:border-b-2">
            {t('features.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>

      <!-- Cross-cutting: privacy is not a product, it's how everything works -->
      <div class="mx-auto mt-8 max-w-4xl">
        <a href="/compliance" class="group flex items-center gap-4 border border-border bg-card px-6 py-4 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <Shield class="size-5 shrink-0 text-primary transition-transform group-hover:rotate-6" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-foreground">{t('home.compliance_banner.title')}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">{t('home.compliance_banner.desc')}</p>
          </div>
          <ChevronRight class="size-4 shrink-0 text-foreground transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 6: COMPLIANCE + COUNTDOWN
       ═══════════════════════════════════════════ -->
  <section class="reveal py-12 sm:py-14" id="compliance">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('compliance.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('compliance.subtitle')}
        </p>
      </div>

      <!-- Countdown — dramatic editorial treatment -->
      <div class="mx-auto mt-10 max-w-3xl">
        <p class="mb-8 flex items-center justify-center gap-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70"></span>
            <span class="relative inline-flex size-2 rounded-full bg-destructive"></span>
          </span>
          {t('compliance.countdown.label')}
        </p>
        <!-- Visually hidden live region announces the countdown to screen readers without flooding on every minute tick -->
        <p class="sr-only" aria-live="polite" aria-atomic="true">
          Faltan {countdownDays} días, {countdownHours} horas y {countdownMinutes} minutos para que la Ley 21.719 entre plenamente en vigencia.
        </p>
        <div
          class="grid grid-cols-3 gap-2 sm:gap-4"
          role="group"
          aria-hidden="true"
        >
          <div class="group relative border border-border bg-card p-5 text-center transition-colors hover:border-foreground sm:p-8" aria-hidden="true">
            <div class="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-primary"></div>
            <span class="font-heading block text-6xl font-medium tabular-nums leading-none tracking-[-0.03em] text-foreground sm:text-8xl">
              {countdownDays}
            </span>
            <span class="mt-3 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              {t('compliance.countdown.days')}
            </span>
          </div>
          <div class="group relative border border-border bg-card p-5 text-center transition-colors hover:border-foreground sm:p-8" aria-hidden="true">
            <div class="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-primary"></div>
            <span class="font-heading block text-6xl font-medium tabular-nums leading-none tracking-[-0.03em] text-foreground sm:text-8xl">
              {countdownHours}
            </span>
            <span class="mt-3 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              {t('compliance.countdown.hours')}
            </span>
          </div>
          <div class="group relative border border-border bg-card p-5 text-center transition-colors hover:border-foreground sm:p-8" aria-hidden="true">
            <div class="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-primary"></div>
            <span class="font-heading block text-6xl font-medium tabular-nums leading-none tracking-[-0.03em] text-foreground sm:text-8xl">
              {countdownMinutes}
            </span>
            <span class="mt-3 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              {t('compliance.countdown.minutes')}
            </span>
          </div>
        </div>
        <!-- CTA under countdown -->
        <div class="mt-10 text-center">
          <Button size="xl" href="/demo">
            {t('hero.cta.primary')}
            <ArrowRight class="size-5" />
          </Button>
          <p class="mt-4 text-xs text-muted-foreground">{t('home.countdown.cta_hint')}</p>
        </div>
      </div>

      <!-- Compliance items -->
      <div class="mx-auto mt-12 grid max-w-3xl gap-x-8 gap-y-4 sm:grid-cols-2">
        {#each ['compliance.item1', 'compliance.item2', 'compliance.item3', 'compliance.item4', 'compliance.item5', 'compliance.item6'] as item}
          <div class="flex items-start gap-3">
            <Check class="mt-0.5 size-5 shrink-0 text-primary" />
            <span class="text-sm leading-relaxed text-muted-foreground">{t(item as TranslationKey)}</span>
          </div>
        {/each}
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 8: HOW IT WORKS — visual progression with icons + connector
       ═══════════════════════════════════════════ -->
  <section class="reveal py-12 sm:py-14" id="how">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('how.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('how.title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground sm:text-lg">
          {t('home.how.subtitle')}
        </p>
      </div>

      <!-- Steps with connecting line -->
      <div class="relative mx-auto mt-10 max-w-5xl">
        <!-- Desktop connector — solid hairline, McKinsey style -->
        <div class="pointer-events-none absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-border sm:block" aria-hidden="true"></div>

        <ol class="relative grid gap-8 sm:grid-cols-3 sm:gap-6">
          <!-- Step 1 -->
          <li class="flex flex-col items-center text-center">
            <div class="relative z-10 flex size-14 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <Plug class="size-6 text-primary" />
            </div>
            <span class="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t('home.how.step_label')} 1 · {t('home.how.step1.time')}
            </span>
            <h3 class="mt-3 text-base font-semibold text-foreground">{t('how.step1.title')}</h3>
            <p class="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{t('how.step1.desc')}</p>
          </li>

          <!-- Step 2 -->
          <li class="flex flex-col items-center text-center">
            <div class="relative z-10 flex size-14 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <Database class="size-6 text-primary" />
            </div>
            <span class="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t('home.how.step_label')} 2 · {t('home.how.step2.time')}
            </span>
            <h3 class="mt-3 text-base font-semibold text-foreground">{t('how.step2.title')}</h3>
            <p class="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{t('how.step2.desc')}</p>
          </li>

          <!-- Step 3 -->
          <li class="flex flex-col items-center text-center">
            <div class="relative z-10 flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/[0.06] shadow-sm">
              <Rocket class="size-6 text-primary" />
            </div>
            <span class="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {t('home.how.step_label')} 3 · {t('home.how.step3.time')}
            </span>
            <h3 class="mt-3 text-base font-semibold text-foreground">{t('how.step3.title')}</h3>
            <p class="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{t('how.step3.desc')}</p>
          </li>
        </ol>

        <!-- Inline CTA right after step 3 -->
        <div class="mt-10 text-center">
          <Button
            size="lg"
            onclick={async () => {
              trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'how_it_works' });
              await goto('/demo');
            }}
            class=""
          >
            {t('home.how.cta')}
            <ArrowRight class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 9: FAQ
       ═══════════════════════════════════════════ -->
  <section class="reveal bg-secondary py-12 sm:py-14" id="faq">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('faq.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('faq.title')}
        </h2>
      </div>

      <div class="mt-10 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
        {#each [1, 2, 11, 3, 15, 4, 12] as n, i}
          <div>
            <button
              id={`faq-trigger-${i}`}
              onclick={() => toggleFaq(i)}
              class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-muted"
              aria-expanded={openFaq === i}
              aria-controls={`faq-panel-${i}`}
            >
              <span class="pr-8 text-sm font-semibold text-foreground">{t(`faq.q${n}` as TranslationKey)}</span>
              {#if openFaq === i}
                <Minus class="size-4 shrink-0 text-muted-foreground" />
              {:else}
                <Plus class="size-4 shrink-0 text-muted-foreground" />
              {/if}
            </button>
            {#if openFaq === i}
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                transition:slide={{ duration: 200 }}
                class="px-6 pb-5"
              >
                <p class="text-sm leading-relaxed text-muted-foreground">
                  {t(`faq.a${n}` as TranslationKey)}
                </p>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Inline contact link — no /faq page yet, route to /contact for unanswered questions -->
      <div class="mt-6 text-center">
        <a href="/contact" class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80">
          {t('faq.contact_link')}
          <ArrowRight class="size-3.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 10: FINAL CTA
       ═══════════════════════════════════════════ -->
  <section class="reveal py-12 sm:py-14" id="cta">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {t('cta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        {t('cta.subtitle')}
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          size="xl"
          onclick={async () => {
            trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'hero' });
            await goto('/demo');
          }}
        >
          {t('cta.primary')}
          <ArrowRight class="size-5" />
        </Button>
        <Button
          variant="outline"
          size="xl"
          onclick={() => showPitch = true}
        >
          <Play class="size-5" />
          {t('hero.video_short')}
        </Button>
      </div>
    </div>
  </section>

  <Footer />

  <!-- Mobile sticky CTA -->
  {#if showStickyCta}
    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background px-4 pb-[max(env(safe-area-inset-bottom,0px),1rem)] pt-3 md:hidden">
      <Button
        size="xl"
        onclick={async () => {
          trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'sticky' });
          await goto('/demo');
        }}
        class="w-full"
      >
        {t('hero.cta.primary')}
        <ArrowRight class="size-5" />
      </Button>
    </div>
  {/if}
</main>

{#if showPitch}
  <PitchModal onclose={() => showPitch = false} />
{/if}

<style>
  .carousel-fade {
    animation: fadeIn 0.4s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .trust-item {
    animation: fadeInUp 0.5s ease-out both;
  }

  .trust-item:nth-child(3) { animation-delay: 0.1s; }
  .trust-item:nth-child(5) { animation-delay: 0.2s; }
  .trust-item:nth-child(7) { animation-delay: 0.3s; }
</style>
