<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { BRAND, LEGAL_NAME } from '$lib/brand';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import HeroLaunchMockup from '$lib/components/home/HeroLaunchMockup.svelte';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { slide } from 'svelte/transition';
  import type { Component } from 'svelte';
  import {
    Shield,
    FileCheck,
    ArrowRight,
    Building2,
    Check,
    ChevronRight,
    ClipboardList,
    DoorOpen,
    UserCheck,
    AlertTriangle,
    Eye,
    MessageSquare,
    Plus,
    Minus,
    Play,
    Landmark,
    LockKeyhole,
    MapPin
  } from '@lucide/svelte';

  // ── Reactive state ──
  let showStickyCta = $state(false);
  let showPitch = $state(false);
  let PitchModal = $state<Component<{ onclose: () => void }> | null>(null);

  async function openPitch() {
    if (!PitchModal) {
      PitchModal = (await import('$lib/components/PitchModal.svelte')).default;
    }
    showPitch = true;
  }

  // ── FAQ accordion state ──
  let openFaq = $state<number | null>(null);
  function toggleFaq(index: number) {
    openFaq = openFaq === index ? null : index;
  }

  // ── Countdown state ──
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

  // ── Scroll listener ──
  const handleScroll = () => {
    const c = window.scrollY > 120;
    if (c !== showStickyCta) showStickyCta = c;
  };

  // ── Hide mobile sticky CTA while closing band is in view ──
  let ctaBandInView = $state(false);
  $effect(() => {
    const band = document.getElementById('cta');
    if (!band || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      ctaBandInView = entry.isIntersecting;
    });
    observer.observe(band);
    return () => observer.disconnect();
  });

  const featureCards: Array<{
    href: string;
    icon: typeof Shield;
    titleKey: TranslationKey;
    descKey: TranslationKey;
  }> = [
    {
      href: '/funcionalidades/ficha-alumno',
      icon: ClipboardList,
      titleKey: 'home.feature.record.title',
      descKey: 'home.feature.record.desc',
    },
    {
      href: '/demo',
      icon: MessageSquare,
      titleKey: 'home.feature.summary.title',
      descKey: 'home.feature.summary.desc',
    },
    {
      href: '/funcionalidades/acceso-por-rol',
      icon: Shield,
      titleKey: 'home.feature.access.title',
      descKey: 'home.feature.access.desc',
    },
    {
      href: '/funcionalidades/busqueda-contextual',
      icon: Eye,
      titleKey: 'home.feature.search.title',
      descKey: 'home.feature.search.desc',
    },
  ];

  const complianceBadges = [
    { icon: Landmark, label: 'home.compliance_badges.law', status: 'home.compliance_badges.status_ready' },
    { icon: LockKeyhole, label: 'home.compliance_badges.encryption', status: 'home.compliance_badges.status_active' },
    { icon: MapPin, label: 'home.compliance_badges.hosting', status: 'home.compliance_badges.status_local' },
    { icon: FileCheck, label: 'home.compliance_badges.arco', status: 'home.compliance_badges.status_supported' },
  ];

  const howSteps = [
    { time: 'home.how.step1.time', title: 'how.step1.title', desc: 'how.step1.desc' },
    { time: 'home.how.step2.time', title: 'how.step2.title', desc: 'how.step2.desc' },
    { time: 'home.how.step3.time', title: 'how.step3.title', desc: 'how.step3.desc' },
  ];

  const forWhoCards = [
    { href: '/para-sostenedores', icon: Building2, title: 'home.forwho.card_sostenedores_title', desc: 'home.forwho.card_sostenedores_desc' },
    { href: '/para-directores', icon: ClipboardList, title: 'home.forwho.card_directores_title', desc: 'home.forwho.card_directores_desc' },
    { href: '/para-porteros', icon: DoorOpen, title: 'home.forwho.card_porteros_title', desc: 'home.forwho.card_porteros_desc' },
  ];
</script>

<svelte:window onscroll={handleScroll} />

<svelte:head>
  <title>{t('home.meta.title')}</title>
  <meta name="description" content={t('home.meta.description')} />
  <meta property="og:url" content="https://ethoz.cl/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('home.meta.og_title')} />
  <meta property="og:description" content={t('home.meta.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('home.meta.og_title')} />
  <meta name="twitter:description" content={t('home.meta.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": BRAND,
      "legalName": LEGAL_NAME,
      "url": "https://ethoz.cl",
      "logo": "https://ethoz.cl/favicon.svg",
      "description": t('home.meta.schema_org_description'),
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
        "url": "https://ethoz.cl/contacto"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": BRAND,
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
      "name": BRAND,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": t('home.meta.schema_app_description'),
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "CLP",
        "availability": "https://schema.org/OnlineOnly",
        "url": "https://ethoz.cl/como-contratar"
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

<div class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>

  <NavBar />

  <main id="main-content" class="flex flex-1 flex-col" tabindex="-1">

    <!-- HERO -->
    <section class="relative isolate overflow-hidden bg-background pt-24 sm:pt-28 lg:pt-32">
      <div class="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/10 blur-[90px]" aria-hidden="true"></div>
      <div class="pointer-events-none absolute bottom-0 left-0 h-[320px] w-[320px] translate-y-1/4 -translate-x-1/4 rounded-full bg-primary/5 blur-[70px]" aria-hidden="true"></div>

      <div class="relative mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-12 lg:px-8 lg:py-8">
        <div class="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div class="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-xs font-medium text-primary">
            <span class="relative inline-flex size-2">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex size-2 rounded-full bg-primary"></span>
            </span>
            <span>{t('hero.pilot_badge')}</span>
          </div>

          <h1 class="page-title animate-fade-in-up animate-delay-100 w-full max-w-[16ch] text-balance">
            {t('hero.title')}
          </h1>

          <p class="animate-fade-in-up animate-delay-200 mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('hero.subtitle')}
          </p>

          <div class="animate-fade-in-up animate-delay-300 mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-start sm:gap-4">
            <Button
              id="hero-cta"
              size="xl"
              href="/demo"
              onclick={() => {
                trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'hero' });
              }}
              class="w-full justify-center sm:w-auto"
            >
              {t('hero.cta.primary')}
              <ArrowRight class="size-5" />
            </Button>
            <Button variant="outline" size="xl" onclick={() => { trackEvent('hero_cta_clicked', { cta: 'watch_video', location: 'hero' }); void openPitch(); }} class="w-full justify-center sm:w-auto">
              <Play class="size-5" />
              {t('hero.video_short')}
            </Button>
          </div>

          <!-- Social proof -->
          <div class="animate-fade-in-up animate-delay-400 mt-5 flex items-center justify-center gap-2 sm:justify-start">
            <div class="inline-flex size-6 items-center justify-center rounded-full bg-primary/10">
              <Check class="size-3.5 text-primary" aria-hidden="true" />
            </div>
            <p class="text-sm text-text-tertiary">{t('home.social_proof')}</p>
          </div>
        </div>

        <div class="animate-fade-in-up animate-delay-500 relative flex items-center justify-center">
          <HeroLaunchMockup />
        </div>
      </div>
    </section>

    <!-- TRUST BAR -->
    <section class="border-y border-foreground/5 bg-background py-2.5 sm:py-3" aria-label={t('home.trust_section_label')}>
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p class="mb-3 text-sm text-text-tertiary">{t('home.trusted_by')}</p>
        <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {#each ['Napsis', 'SIGE', 'Lirmi', 'Syscol'] as name}
            <span class="text-sm font-semibold text-text-tertiary">{name}</span>
          {/each}
        </div>
      </div>
    </section>

    <!-- EDITORIAL THESIS -->
    <section class="section-editorial bg-background" aria-labelledby="editorial-heading">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p class="eyebrow">{t('editorial.eyebrow')}</p>
        <h2 id="editorial-heading" class="mx-auto mt-3 max-w-4xl text-balance text-foreground">
          {t('editorial.statement')}
        </h2>
      </div>

      <div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-5xl">
        <dl class="grid grid-cols-1 divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div class="px-5 py-4 text-center sm:px-6 sm:py-5">
            <dt class="sr-only">{t('editorial.stat1_label')}</dt>
            <dd data-numeric class="font-heading text-2xl font-medium text-foreground sm:text-3xl lg:text-4xl">{t('editorial.stat1_number')}</dd>
            <p class="mt-1.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t('editorial.stat1_label')}</p>
          </div>
          <div class="px-5 py-4 text-center sm:px-6 sm:py-5">
            <dt class="sr-only">{t('editorial.stat2_label')}</dt>
            <dd data-numeric class="font-heading text-2xl font-medium text-foreground sm:text-3xl lg:text-4xl">{t('editorial.stat2_number')}</dd>
            <p class="mt-1.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t('editorial.stat2_label')}</p>
          </div>
          <div class="px-5 py-4 text-center sm:px-6 sm:py-5">
            <dt class="sr-only">{t('editorial.stat3_label')}</dt>
            <dd data-numeric class="font-heading text-2xl font-medium text-foreground sm:text-3xl lg:text-4xl">{t('editorial.stat3_number')}</dd>
            <p class="mt-1.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t('editorial.stat3_label')}</p>
          </div>
        </dl>
        <p class="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-text-tertiary">
          <span>{t('editorial.source_intro')}</span>
          <a href="https://bibliotecadigital.mineduc.cl/handle/20.500.12365/21939" class="font-medium text-muted-foreground underline decoration-foreground/10 underline-offset-4 hover:text-primary hover:decoration-current">{t('editorial.source_mineduc')}</a>
          <span aria-hidden="true">·</span>
          <a href="https://www.bcn.cl/leychile/navegar?idNorma=1209272" class="font-medium text-muted-foreground underline decoration-foreground/10 underline-offset-4 hover:text-primary hover:decoration-current">{t('editorial.source_law')}</a>
        </p>
        </div>
      </div>
    </section>

    <!-- PROBLEM -->
    <section class="section-editorial bg-background" id="problem">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <p class="eyebrow mb-4">{t('home.problem_meta')}</p>
          <h2 class="text-balance text-foreground">{t('problem.title')}</h2>
          <p class="mt-4 text-lg text-muted-foreground">{t('problem.subtitle')}</p>
        </div>

        <div class="mx-auto mt-6 sm:mt-8 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-start">
          <div class="rounded-2xl border border-foreground/10 bg-card p-5 shadow-card-dark sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t('problem.snapshot.label')}</p>
            <h3 class="mt-3 font-heading text-2xl font-medium leading-tight text-foreground sm:text-3xl">{t('problem.snapshot.title')}</h3>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t('problem.snapshot.desc')}</p>
          </div>
          <div class="divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card shadow-card-dark">
            {#each [
              { icon: AlertTriangle, title: 'problem.card1.title', desc: 'problem.card1.desc' },
              { icon: Shield, title: 'problem.card2.title', desc: 'problem.card2.desc' },
              { icon: FileCheck, title: 'problem.card3.title', desc: 'problem.card3.desc' },
            ] as item}
              {@const Icon = item.icon}
              <div class="grid gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-5">
                <div class="flex items-center gap-3 sm:items-start">
                  <Icon class="size-5 shrink-0 text-primary" />
                  <h3 class="font-heading text-base leading-tight text-foreground sm:hidden">{t(item.title as TranslationKey)}</h3>
                </div>
                <div>
                  <h3 class="hidden font-heading text-base leading-tight text-foreground sm:block">{t(item.title as TranslationKey)}</h3>
                  <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{t(item.desc as TranslationKey)}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- SOLUTION / FEATURES -->
    <section class="section-editorial bg-background" id="features">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <p class="eyebrow mb-4">{t('home.solution_meta')}</p>
          <h2 class="text-balance text-foreground">{t('solution.title')}</h2>
          <p class="mt-4 text-lg text-muted-foreground">{t('solution.subtitle')}</p>
        </div>

        <div class="mx-auto mt-6 sm:mt-8 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each featureCards as feat, index (feat.href)}
            {@const FeatureIcon = feat.icon}
            <a
              href={feat.href}
              class="group flex flex-col rounded-2xl border border-foreground/10 bg-card p-5 shadow-card-dark transition-all duration-200 hover:-translate-y-px hover:border-foreground/20 hover:bg-surface-card-hover hover:shadow-card-dark-hover focus-visible:-translate-y-px"
            >
              <div class="flex items-center gap-3">
                <FeatureIcon class="size-5 shrink-0 text-primary" />
                <h3 class="font-heading text-lg leading-tight text-foreground">{t(feat.titleKey)}</h3>
              </div>
              <p class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(feat.descKey)}</p>
              <span class="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-foreground/80 transition-all group-hover:gap-1.5 group-hover:text-foreground">
                {t('home.feature.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          {/each}

          <!-- Extra feature cards to fill grid -->
          <a href="/funcionalidades/retiros-seguros" class="group flex flex-col rounded-2xl border border-foreground/10 bg-card p-5 shadow-card-dark transition-all duration-200 hover:-translate-y-px hover:border-foreground/20 hover:bg-surface-card-hover hover:shadow-card-dark-hover">
            <div class="flex items-center gap-3">
              <UserCheck class="size-5 shrink-0 text-primary" />
              <h3 class="font-heading text-lg leading-tight text-foreground">{t('features.pickup.title')}</h3>
            </div>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t('features.pickup.desc')}</p>
            <span class="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-foreground/80 transition-all group-hover:gap-1.5 group-hover:text-foreground">
              {t('home.feature.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>

          <a href="/funcionalidades/privacidad-datos" class="group flex flex-col rounded-2xl border border-foreground/10 bg-card p-5 shadow-card-dark transition-all duration-200 hover:-translate-y-px hover:border-foreground/20 hover:bg-surface-card-hover hover:shadow-card-dark-hover">
            <div class="flex items-center gap-3">
              <LockKeyhole class="size-5 shrink-0 text-primary" />
              <h3 class="font-heading text-lg leading-tight text-foreground">{t('features.privacy.title')}</h3>
            </div>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t('features.privacy.desc')}</p>
            <span class="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-foreground/80 transition-all group-hover:gap-1.5 group-hover:text-foreground">
              {t('home.feature.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>

        </div>
      </div>
    </section>

    <!-- FOR WHO -->
    <section class="section-editorial bg-background" id="forwho" aria-labelledby="forwho-heading">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <p class="eyebrow mb-4">{t('home.forwho.eyebrow')}</p>
          <h2 id="forwho-heading" class="text-balance text-foreground">{t('home.forwho.title')}</h2>
          <p class="mt-4 text-lg text-muted-foreground">{t('home.forwho.subtitle')}</p>
        </div>

        <div class="mx-auto mt-6 sm:mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
          {#each forWhoCards as card (card.href)}
            {@const CardIcon = card.icon}
            <a href={card.href} class="group flex flex-col rounded-2xl border border-foreground/10 bg-card p-5 shadow-card-dark transition-all duration-200 hover:-translate-y-px hover:border-foreground/20 hover:bg-surface-card-hover">
              <div class="flex items-center gap-3">
                <CardIcon class="size-5 shrink-0 text-primary" />
                <h3 class="font-heading text-lg leading-tight text-foreground">{t(card.title as TranslationKey)}</h3>
              </div>
              <p class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(card.desc as TranslationKey)}</p>
              <span class="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-foreground/80 transition-all group-hover:gap-1.5 group-hover:text-foreground">
                {t('home.forwho.card_link_label')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          {/each}
        </div>
      </div>
    </section>

    <!-- COMPLIANCE + COUNTDOWN -->
    <section class="section-editorial relative isolate overflow-hidden bg-card" id="compliance">
      <div class="pointer-events-none absolute inset-0 bg-primary/5" aria-hidden="true"></div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-balance text-foreground">{t('compliance.title')}</h2>
          <p class="mt-4 text-lg text-muted-foreground">{t('compliance.subtitle')}</p>
        </div>

        <div class="mx-auto mt-6 sm:mt-8 grid max-w-5xl items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
          <div>
            <p class="mb-4 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70"></span>
                <span class="relative inline-flex size-2 rounded-full bg-primary"></span>
              </span>
              {t('compliance.countdown.label')}
            </p>
            <p class="sr-only" aria-live="polite" aria-atomic="true">
              {t('home.countdown_live_prefix')} {countdownDays} {t('home.countdown_live_days')} {countdownHours} {t('home.countdown_live_hours')} {countdownMinutes} {t('home.countdown_live_suffix')}
            </p>
            <div class="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-hidden="true">
              {#each [
                { value: countdownDays, singular: 'compliance.countdown.day', plural: 'compliance.countdown.days' },
                { value: countdownHours, singular: 'compliance.countdown.hour', plural: 'compliance.countdown.hours' },
                { value: countdownMinutes, singular: 'compliance.countdown.minute', plural: 'compliance.countdown.minutes' },
              ] as unit}
                <div class="relative rounded-xl border border-foreground/10 bg-background px-2 py-3 text-center shadow-card-dark sm:py-4">
                  <div class="pointer-events-none absolute inset-x-3 top-0 h-0.5 bg-primary"></div>
                  <span data-numeric class="block text-2xl font-medium leading-none tracking-normal text-foreground sm:text-4xl lg:text-5xl">{unit.value}</span>
                  <span class="mt-2 block text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t((unit.value === 1 ? unit.singular : unit.plural) as TranslationKey)}</span>
                </div>
              {/each}
            </div>

            <div class="mt-4 grid gap-2">
              {#each ['compliance.item1', 'compliance.item2', 'compliance.item3'] as item}
                <div class="flex items-start gap-3">
                  <Check class="mt-0.5 size-5 shrink-0 text-primary" />
                  <span class="text-sm leading-relaxed text-muted-foreground">{t(item as TranslationKey)}</span>
                </div>
              {/each}
            </div>
          </div>

          <!-- Compliance badges -->
          <div>
            <ul class="grid gap-1.5 sm:grid-cols-2" aria-label={t('home.compliance_badges.label')}>
              {#each complianceBadges as badge}
                {@const BadgeIcon = badge.icon}
                <li class="flex min-h-12 items-center gap-3 rounded-xl border border-foreground/10 bg-background px-3 py-2.5 shadow-card-dark">
                  <BadgeIcon class="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold leading-tight text-foreground">{t(badge.label as TranslationKey)}</p>
                    <span class="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">
                      {t(badge.status as TranslationKey)}
                    </span>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        </div>

        <div class="mt-6 text-center">
          <Button
            size="xl"
            href="/demo"
            onclick={() => {
              trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'compliance_countdown' });
            }}
          >
            {t('hero.cta.primary')}
            <ArrowRight class="size-5" />
          </Button>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section-editorial bg-background" id="how">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <p class="eyebrow mb-4">{t('home.how_meta')}</p>
          <h2 class="text-balance text-foreground">{t('how.title')}</h2>
          <p class="mt-4 text-base text-muted-foreground sm:text-lg">{t('home.how.subtitle')}</p>
        </div>

        <div class="mx-auto mt-8 max-w-5xl">
          <ol class="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-foreground/10">
            {#each howSteps as step, i}
              <li class="px-0 sm:px-6">
                <div class="flex items-baseline gap-3">
                  <span data-numeric class="text-3xl font-medium leading-none text-foreground/30">0{i + 1}</span>
                  <span class="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t(step.time as TranslationKey)}</span>
                </div>
                <h3 class="mt-4 font-heading text-lg leading-tight text-foreground">{t(step.title as TranslationKey)}</h3>
                <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(step.desc as TranslationKey)}</p>
              </li>
            {/each}
          </ol>

          <div class="mt-8 text-center">
            <Button
              size="lg"
              href="/demo"
              onclick={() => {
                trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'how_it_works' });
              }}
            >
              {t('hero.cta.primary')}
              <ArrowRight class="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section-editorial bg-card" id="faq">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl">
          <div class="text-center">
            <p class="eyebrow mb-4">{t('home.faq_meta')}</p>
            <h2 class="text-balance text-foreground">{t('faq.title')}</h2>
          </div>

          <div class="mt-8 divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-background shadow-card-dark">
          {#each [1, 2, 3, 15, 4, 12] as n, i}
            <div>
              <button
                id={`faq-trigger-${i}`}
                onclick={() => toggleFaq(i)}
                class="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-foreground/[0.03]"
                aria-expanded={openFaq === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span class="pr-6 text-sm font-semibold text-foreground">{t(`faq.q${n}` as TranslationKey)}</span>
                <span class="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-text-tertiary" aria-hidden="true">
                  {#if openFaq === i}
                    <Minus class="size-4" />
                  {:else}
                    <Plus class="size-4" />
                  {/if}
                </span>
              </button>
              {#if openFaq === i}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  transition:slide={{ duration: 200 }}
                  class="px-5 pb-4"
                >
                  <p class="text-sm leading-relaxed text-muted-foreground">
                    {t(`faq.a${n}` as TranslationKey)}
                  </p>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <div class="mt-5 text-center">
          <a href="/contacto" class="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {t('faq.contact_link')}
            <ArrowRight class="size-3.5" />
          </a>
        </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="relative isolate overflow-hidden bg-background py-8 md:py-10" id="cta" aria-labelledby="final-cta-heading">
      <div class="pointer-events-none absolute inset-0 bg-primary/5 blur-[80px]" aria-hidden="true"></div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary">{t('cta.urgency_eyebrow')}</p>
        <h2 id="final-cta-heading" class="mt-3 text-balance text-foreground">{t('cta.title')}</h2>
        <p class="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t('cta.subtitle')}</p>
        <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="xl"
            href="/demo"
            onclick={() => trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'final_cta' })}
          >
            {t('cta.primary')}
            <ArrowRight class="size-5" />
          </Button>
        </div>
        </div>
      </div>
    </section>

  </main>

  <Footer />

  <!-- Mobile sticky CTA -->
  {#if showStickyCta && !ctaBandInView}
    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-foreground/10 bg-background px-4 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)] pt-2.5 md:hidden">
      <Button
        size="lg"
        href="/demo"
        onclick={() => {
          trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'sticky' });
        }}
        class="w-full"
      >
        {t('hero.cta.primary')}
        <ArrowRight class="size-4" />
      </Button>
    </div>
  {/if}
</div>

{#if showPitch && PitchModal}
  <PitchModal onclose={() => showPitch = false} />
{/if}
