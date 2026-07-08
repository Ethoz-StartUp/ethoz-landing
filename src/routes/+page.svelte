<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { BRAND, LEGAL_NAME } from '$lib/brand';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import SectionDark from '$lib/components/cal/SectionDark.svelte';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { goto } from '$app/navigation';
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
    Play
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
  const heroStudents: Array<{
    photo: string;
    nameKey: TranslationKey;
    gradeKey: TranslationKey;
    hasAlert: boolean;
    alertKey?: TranslationKey;
    timeline: Array<{
      type: 'alert' | 'pickup' | 'observation' | 'update';
      textKey: TranslationKey;
      metaKey: TranslationKey;
    }>;
  }> = [
    {
      photo: '/images/students/kid-14.webp',
      nameKey: 'hero.student1.name',
      gradeKey: 'hero.student1.grade',
      hasAlert: true,
      alertKey: 'hero.student1.alert',
      timeline: [
        { type: 'alert', textKey: 'hero.student1.timeline1.text', metaKey: 'hero.student1.timeline1.meta' },
        { type: 'pickup', textKey: 'hero.student1.timeline2.text', metaKey: 'hero.student1.timeline2.meta' },
        { type: 'update', textKey: 'hero.student1.timeline3.text', metaKey: 'hero.student1.timeline3.meta' },
      ],
    },
    {
      photo: '/images/students/girl-12.webp',
      nameKey: 'hero.student2.name',
      gradeKey: 'hero.student2.grade',
      hasAlert: false,
      timeline: [
        { type: 'pickup', textKey: 'hero.student2.timeline1.text', metaKey: 'hero.student2.timeline1.meta' },
        { type: 'observation', textKey: 'hero.student2.timeline2.text', metaKey: 'hero.student2.timeline2.meta' },
        { type: 'update', textKey: 'hero.student2.timeline3.text', metaKey: 'hero.student2.timeline3.meta' },
      ],
    },
    {
      photo: '/images/students/girl-15.webp',
      nameKey: 'hero.student3.name',
      gradeKey: 'hero.student3.grade',
      hasAlert: true,
      alertKey: 'hero.student3.alert',
      timeline: [
        { type: 'alert', textKey: 'hero.student3.timeline1.text', metaKey: 'hero.student3.timeline1.meta' },
        { type: 'observation', textKey: 'hero.student3.timeline2.text', metaKey: 'hero.student3.timeline2.meta' },
        { type: 'pickup', textKey: 'hero.student3.timeline3.text', metaKey: 'hero.student3.timeline3.meta' },
      ],
    },
    {
      photo: '/images/students/kid-11.webp',
      nameKey: 'hero.student4.name',
      gradeKey: 'hero.student4.grade',
      hasAlert: false,
      timeline: [
        { type: 'pickup', textKey: 'hero.student4.timeline1.text', metaKey: 'hero.student4.timeline1.meta' },
        { type: 'update', textKey: 'hero.student4.timeline2.text', metaKey: 'hero.student4.timeline2.meta' },
        { type: 'observation', textKey: 'hero.student4.timeline3.text', metaKey: 'hero.student4.timeline3.meta' },
      ],
    },
  ];

  let currentStudent = $state(0);
  let carouselPaused = $state(false);
  let carouselCycles = $state(0);
  const activeStudent = $derived(heroStudents[currentStudent]);

  // Auto-advance carousel — pauses on hover/focus, respects reduced-motion, and
  // auto-stops after one full cycle so touch/keyboard-only users aren't trapped
  // in indefinite auto-advance (WCAG 2.2.2 Level A).
  $effect(() => {
    if (carouselPaused) return;
    if (carouselCycles >= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      const next = (currentStudent + 1) % heroStudents.length;
      currentStudent = next;
      if (next === 0) carouselCycles += 1;
    }, 5000);
    return () => clearInterval(interval);
  });

  // Hide the mobile sticky CTA while the closing CTA band is on screen (two
  // identical primary buttons in one viewport otherwise).
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
    titleKey: TranslationKey;
    descKey: TranslationKey;
  }> = [
    {
      href: '/features/student-profile',
      titleKey: 'home.feature.record.title',
      descKey: 'home.feature.record.desc',
    },
    {
      href: '/demo',
      titleKey: 'home.feature.summary.title',
      descKey: 'home.feature.summary.desc',
    },
    {
      href: '/features/access-control',
      titleKey: 'home.feature.access.title',
      descKey: 'home.feature.access.desc',
    },
    {
      href: '/features/smart-search',
      titleKey: 'home.feature.search.title',
      descKey: 'home.feature.search.desc',
    },
  ];
</script>

<!-- Scroll listener (guarded to avoid no-op reactivity writes) -->
<svelte:window onscroll={() => {
  const c = window.scrollY > 120;
  if (c !== showStickyCta) showStickyCta = c;
}} />

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
        "url": "https://ethoz.cl/contact"
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

<div class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — visible on focus, WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#hero-cta"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>

  <NavBar />

  <main id="main-content" class="flex flex-1 flex-col">

  <!-- ═══════════════════════════════════════════
       SECTION 2: HERO — editorial
       ═══════════════════════════════════════════ -->
  <section class="relative isolate overflow-hidden bg-background pt-24 sm:pt-28">
    <div class="pointer-events-none absolute inset-0 bg-grid-fine opacity-70 [mask-image:linear-gradient(to_bottom,#000_0%,transparent_78%)]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute right-0 top-28 h-80 w-80 rounded-full bg-accent-tint blur-3xl" aria-hidden="true"></div>

    <div class="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,5.2fr)_minmax(0,6.8fr)] lg:items-start lg:gap-12 lg:px-8 lg:py-14">
      <div class="flex flex-col items-center text-center sm:items-start sm:text-left">
        <div class="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-card">
          <span class="relative inline-flex size-2 shrink-0 rounded-full bg-primary"></span>
          <span>{t('hero.pilot_badge')}</span>
        </div>

        <h1 class="animate-fade-in-up animate-delay-100 w-full max-w-[15ch] text-balance text-foreground">
          {t('hero.title')}
        </h1>

        <p class="animate-fade-in-up animate-delay-200 mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
          {t('hero.subtitle')}
        </p>

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
          <Button variant="outline" size="xl" onclick={() => { trackEvent('hero_cta_clicked', { cta: 'watch_video', location: 'hero' }); void openPitch(); }} class="w-full justify-center sm:w-auto">
            <Play class="size-5" />
            {t('hero.video_short')}
          </Button>
        </div>

        <!-- Decorative compact mockup — duplicated fake-UI, hidden from AT -->
        <div class="animate-fade-in-up animate-delay-400 mt-8 hidden w-full max-w-sm rounded-xl border border-hairline bg-card p-4 text-left shadow-card sm:block lg:hidden" aria-hidden="true">
          <div class="flex items-center gap-3">
            <img
              src={activeStudent.photo}
              alt={t(activeStudent.nameKey)}
              width="48"
              height="48"
              class="size-12 rounded-full object-cover ring-2 ring-background"
              loading="eager"
              decoding="async"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-foreground">{t('hero.panel.chrome_title')}</p>
              <p class="truncate text-xs text-muted-foreground">{t('hero.panel.compact_status')}</p>
            </div>
            <Shield class="size-5 shrink-0 text-primary" />
          </div>
          <div class="mt-4 grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
            <div class="pr-3 text-center">
              <p class="text-sm font-semibold text-foreground">{t('hero.panel.fact1_value')}</p>
              <p class="mt-1 text-xs text-muted-foreground">{t('hero.panel.fact1_label')}</p>
            </div>
            <div class="px-3 text-center">
              <p class="text-sm font-semibold text-foreground">{t('hero.panel.fact2_value')}</p>
              <p class="mt-1 text-xs text-muted-foreground">{t('hero.panel.fact2_label')}</p>
            </div>
            <div class="pl-3 text-center">
              <p class="text-sm font-semibold text-foreground">{t('hero.panel.fact3_value')}</p>
              <p class="mt-1 text-xs text-muted-foreground">{t('hero.panel.fact3_label')}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="animate-fade-in-up animate-delay-400 hidden w-full lg:block">
        <div
          class="relative mx-auto w-full max-w-2xl"
          role="region"
          aria-roledescription={t('home.carousel_roledescription')}
          aria-label={t('home.carousel_label')}
          onmouseenter={() => (carouselPaused = true)}
          onmouseleave={() => (carouselPaused = false)}
          onfocusin={() => (carouselPaused = true)}
          onfocusout={() => (carouselPaused = false)}
        >
          <div class="pointer-events-none absolute inset-0 rounded-full bg-accent-tint blur-3xl" aria-hidden="true"></div>

          <div class="relative overflow-hidden rounded-2xl border border-hairline bg-card shadow-mockup">
            <div class="flex items-center justify-between gap-4 border-b border-border bg-surface-soft px-4 py-3">
              <div class="flex items-center gap-2" aria-hidden="true">
                <span class="size-2.5 rounded-full bg-destructive"></span>
                <span class="size-2.5 rounded-full bg-warning"></span>
                <span class="size-2.5 rounded-full bg-success"></span>
              </div>
              <p class="truncate text-sm font-semibold text-foreground">{t('hero.panel.chrome_title')}</p>
              <span class="rounded-full border border-primary/20 bg-accent-tint px-2.5 py-1 text-xs font-semibold text-primary-active">
                {t('home.demo_data_badge_short')}
              </span>
            </div>

            <div class="p-5 sm:p-6">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase text-primary">{t('hero.panel.kicker')}</p>
                  <p class="mt-2 max-w-md font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                    {t('hero.panel.title')}
                  </p>
                </div>
                <div class="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground">
                  <Shield class="size-4 text-primary" />
                  {t('hero.panel.ready_label')}
                </div>
              </div>

              <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                <div>
                  {#key currentStudent}
                    <div class="carousel-fade flex items-center gap-3 border-b border-border pb-4">
                      <img
                        src={activeStudent.photo}
                        alt={t(activeStudent.nameKey)}
                        width="56"
                        height="56"
                        class="size-14 rounded-full object-cover ring-2 ring-background"
                        loading="eager"
                        decoding="async"
                      />
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-base font-semibold text-foreground">{t(activeStudent.nameKey)}</p>
                        <p class="text-sm text-muted-foreground">{t(activeStudent.gradeKey)}</p>
                      </div>
                      {#if activeStudent.hasAlert}
                        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-foreground">
                          <AlertTriangle class="size-3.5 text-destructive" />
                          {activeStudent.alertKey ? t(activeStudent.alertKey) : ''}
                        </span>
                      {:else}
                        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-foreground">
                          <Check class="size-3.5 text-success" />
                          {t('hero.no_alerts')}
                        </span>
                      {/if}
                    </div>
                  {/key}

                  <div class="mt-4 space-y-3">
                    {#each activeStudent.timeline as entry}
                      <div class="flex items-start gap-3">
                        {#if entry.type === 'alert'}
                          <AlertTriangle class="mt-0.5 size-4 shrink-0 text-destructive" />
                        {:else if entry.type === 'pickup'}
                          <UserCheck class="mt-0.5 size-4 shrink-0 text-primary" />
                        {:else if entry.type === 'observation'}
                          <MessageSquare class="mt-0.5 size-4 shrink-0 text-primary" />
                        {:else}
                          <Eye class="mt-0.5 size-4 shrink-0 text-primary" />
                        {/if}
                        <div class="min-w-0">
                          <p class="truncate text-sm font-medium text-foreground">{t(entry.textKey)}</p>
                          <p class="truncate text-xs text-muted-foreground">{t(entry.metaKey)}</p>
                        </div>
                      </div>
                    {/each}
                  </div>

                  <div class="mt-4 flex items-center gap-1">
                    {#each heroStudents as student, i}
                      <button
                        onclick={() => { currentStudent = i; }}
                        class="flex min-h-[40px] min-w-[40px] items-center justify-center"
                        aria-label={`${t('home.carousel_dot_label')} ${t(student.nameKey)}`}
                        aria-current={currentStudent === i ? 'true' : undefined}
                      >
                        <span class="block size-2 rounded-full transition-all {currentStudent === i ? 'w-6 bg-primary' : 'bg-border hover:bg-muted-foreground'}"></span>
                      </button>
                    {/each}
                  </div>
                </div>

                <!-- Static fake-UI step rows — decorative, hidden from AT -->
                <div class="divide-y divide-border border-y border-border" aria-hidden="true">
                  {#each [
                    { icon: UserCheck, title: 'hero.panel.step1_title', desc: 'hero.panel.step1_desc', status: 'hero.panel.step1_status' },
                    { icon: FileCheck, title: 'hero.panel.step2_title', desc: 'hero.panel.step2_desc', status: 'hero.panel.step2_status' },
                    { icon: Shield, title: 'hero.panel.step3_title', desc: 'hero.panel.step3_desc', status: 'hero.panel.step3_status' },
                  ] as row}
                    {@const RowIcon = row.icon}
                    <div class="grid gap-3 py-4 sm:grid-cols-[auto_minmax(0,1fr)]">
                      <RowIcon class="mt-0.5 size-5 text-primary" />
                      <div>
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p class="font-semibold text-foreground">{t(row.title as TranslationKey)}</p>
                          <span class="text-xs font-semibold text-primary">{t(row.status as TranslationKey)}</span>
                        </div>
                        <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{t(row.desc as TranslationKey)}</p>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>

              <div class="mt-6 grid grid-cols-3 divide-x divide-border border-t border-border pt-4" aria-hidden="true">
                <div class="px-3 text-center first:pl-0">
                  <p class="text-lg font-semibold text-foreground">{t('hero.panel.fact1_value')}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{t('hero.panel.fact1_label')}</p>
                </div>
                <div class="px-3 text-center">
                  <p class="text-lg font-semibold text-foreground">{t('hero.panel.fact2_value')}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{t('hero.panel.fact2_label')}</p>
                </div>
                <div class="px-3 text-center last:pr-0">
                  <p class="text-lg font-semibold text-foreground">{t('hero.panel.fact3_value')}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{t('hero.panel.fact3_label')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 3: TRUST BAR — editorial facts strip (no icons, no template feel).
       Label → fact pattern with hairline divisions. Reads like a spec sheet,
       not a badge row.
       ═══════════════════════════════════════════ -->
  <section class="reveal border-y border-border bg-background py-6" aria-label={t('home.trust_section_label')}>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-center text-xs font-semibold uppercase text-muted-foreground">
        {t('trust.attribution')}
      </p>
      <dl class="mt-5 grid grid-cols-2 gap-y-5 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
        <div class="flex flex-col items-center px-4 text-center lg:px-6">
          <span class="mb-2 block h-px w-6 bg-foreground" aria-hidden="true"></span>
          <dt class="text-xs font-semibold uppercase text-foreground">{t('trust.label.data')}</dt>
          <dd class="mt-2 text-balance text-sm font-medium leading-snug text-foreground">{t('trust.servers')}</dd>
        </div>
        <div class="flex flex-col items-center px-4 text-center lg:px-6">
          <span class="mb-2 block h-px w-6 bg-foreground" aria-hidden="true"></span>
          <dt class="text-xs font-semibold uppercase text-foreground">{t('trust.label.encryption')}</dt>
          <dd class="mt-2 text-balance text-sm font-medium leading-snug text-foreground">{t('trust.encryption')}</dd>
        </div>
        <div class="flex flex-col items-center px-4 text-center lg:px-6">
          <span class="mb-2 block h-px w-6 bg-foreground" aria-hidden="true"></span>
          <dt class="text-xs font-semibold uppercase text-foreground">{t('trust.label.integration')}</dt>
          <dd class="mt-2 text-balance text-sm font-medium leading-snug text-foreground">{t('trust.integration')}</dd>
        </div>
        <div class="flex flex-col items-center px-4 text-center lg:px-6">
          <span class="mb-2 block h-px w-6 bg-foreground" aria-hidden="true"></span>
          <dt class="text-xs font-semibold uppercase text-foreground">{t('trust.label.compliance')}</dt>
          <dd class="mt-2 text-balance text-sm font-medium leading-snug text-foreground">{t('trust.compliance')}</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       EDITORIAL ANCHOR — the thesis before the problem.
       Anti-AI-slop moment: an institutional declaration in DM Sans display
       paired with three verified stats from Mineduc + Law 21.719.
       No card grid, no stock-template rhythm.
       ═══════════════════════════════════════════ -->
  <section class="reveal py-10 sm:py-12" aria-labelledby="editorial-heading">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <p class="eyebrow">{t('editorial.eyebrow')}</p>
      <h2 id="editorial-heading" class="mx-auto mt-4 max-w-3xl text-balance text-foreground">
        {t('editorial.statement')}
      </h2>
    </div>

    <div class="mx-auto mt-7 max-w-7xl px-4 sm:px-6 lg:px-8">
      <dl class="mx-auto grid max-w-5xl grid-cols-1 border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
        <div class="px-6 py-5 text-center">
          <dt class="sr-only">{t('editorial.stat1_label')}</dt>
          <dd data-numeric class="font-mono text-2xl font-semibold leading-none text-foreground sm:text-3xl">
            {t('editorial.stat1_number')}
          </dd>
          <p class="mt-2 text-xs font-semibold uppercase text-muted-foreground">
            {t('editorial.stat1_label')}
          </p>
        </div>
        <div class="border-t border-border px-6 py-5 text-center sm:border-t-0">
          <dt class="sr-only">{t('editorial.stat2_label')}</dt>
          <dd data-numeric class="font-mono text-2xl font-semibold leading-none text-foreground sm:text-3xl">
            {t('editorial.stat2_number')}
          </dd>
          <p class="mt-2 text-xs font-semibold uppercase text-muted-foreground">
            {t('editorial.stat2_label')}
          </p>
        </div>
        <div class="border-t border-border px-6 py-5 text-center sm:border-t-0">
          <dt class="sr-only">{t('editorial.stat3_label')}</dt>
          <dd data-numeric class="font-mono text-2xl font-semibold leading-none text-foreground sm:text-3xl">
            {t('editorial.stat3_number')}
          </dd>
          <p class="mt-2 text-xs font-semibold uppercase text-muted-foreground">
            {t('editorial.stat3_label')}
          </p>
        </div>
      </dl>
      <p class="mt-4 text-center text-xs text-muted-foreground">
        {t('editorial.source')}
      </p>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 4: PROBLEM
       ═══════════════════════════════════════════ -->
  <section class="reveal scroll-mt-28 py-10 sm:py-12 lg:py-14" id="problem">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow mb-4">{t('home.problem_meta')}</p>
        <h2 class="text-balance text-foreground">
          {t('problem.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('problem.subtitle')}
        </p>
      </div>

      <div class="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-start lg:gap-6">
        <div class="rounded-xl border border-hairline bg-card p-7 shadow-card sm:p-8">
          <p class="text-xs font-semibold uppercase text-muted-foreground">{t('problem.snapshot.label')}</p>
          <h3 class="mt-5 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{t('problem.snapshot.title')}</h3>
          <p class="mt-4 text-base leading-relaxed text-body">{t('problem.snapshot.desc')}</p>
        </div>
        <div class="divide-y divide-border rounded-xl border border-hairline bg-card shadow-card">
          {#each [
            { icon: AlertTriangle, title: 'problem.card1.title', desc: 'problem.card1.desc' },
            { icon: Shield, title: 'problem.card2.title', desc: 'problem.card2.desc' },
            { icon: FileCheck, title: 'problem.card3.title', desc: 'problem.card3.desc' },
          ] as item}
            {@const Icon = item.icon}
            <div class="grid gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6">
              <div class="flex items-center gap-3 sm:items-start">
                <Icon class="size-5 shrink-0 text-primary" />
                <h3 class="font-heading text-lg leading-tight text-foreground sm:hidden">{t(item.title as TranslationKey)}</h3>
              </div>
              <div>
                <h3 class="hidden font-heading text-lg leading-tight text-foreground sm:block">{t(item.title as TranslationKey)}</h3>
                <p class="mt-2 text-sm leading-relaxed text-body">{t(item.desc as TranslationKey)}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 5: SOLUTION / FEATURES
       ═══════════════════════════════════════════ -->
  <section class="reveal scroll-mt-28 bg-secondary py-10 sm:py-12 lg:py-14" id="features">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow mb-4">{t('home.solution_meta')}</p>
        <h2 class="text-balance text-foreground">
          {t('solution.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('solution.subtitle')}
        </p>
      </div>

      <div class="mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each featureCards as feat (feat.href)}
          <a href={feat.href} class="group flex flex-col rounded-xl border border-hairline bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-[160ms] hover:-translate-y-[1px] hover:border-foreground/25 hover:shadow-card-hover sm:min-h-[220px]">
            <h3 class="font-heading text-xl leading-tight text-foreground">{t(feat.titleKey)}</h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-body">{t(feat.descKey)}</p>
            <span class="mt-5 inline-flex items-center gap-1 self-start border-b border-foreground pb-0.5 text-sm font-semibold text-foreground transition-all group-hover:gap-1.5 group-hover:border-b-2">
              {t('home.feature.learn_more')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        {/each}
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 5b: PARA QUIÉN — role navigation cards.
       Link-cards, not CTAs: they route each audience to its persona page
       without competing with the primary action.
       ═══════════════════════════════════════════ -->
  <section class="reveal scroll-mt-28 py-10 sm:py-12 lg:py-14" id="forwho" aria-labelledby="forwho-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow mb-4">{t('home.forwho.eyebrow')}</p>
        <h2 id="forwho-heading" class="text-balance text-foreground">
          {t('home.forwho.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('home.forwho.subtitle')}
        </p>
      </div>

      <div class="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-3">
        {#each [
          { href: '/para-sostenedores', icon: Building2, title: 'home.forwho.card_sostenedores_title', desc: 'home.forwho.card_sostenedores_desc' },
          { href: '/para-directores', icon: ClipboardList, title: 'home.forwho.card_directores_title', desc: 'home.forwho.card_directores_desc' },
          { href: '/para-porteros', icon: DoorOpen, title: 'home.forwho.card_porteros_title', desc: 'home.forwho.card_porteros_desc' },
        ] as card (card.href)}
          {@const CardIcon = card.icon}
          <a href={card.href} class="group flex flex-col rounded-xl border border-hairline bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-[160ms] hover:-translate-y-[1px] hover:border-foreground/25 hover:shadow-card-hover">
            <div class="flex items-center gap-3">
              <CardIcon class="size-5 shrink-0 text-primary" />
              <h3 class="font-heading text-xl leading-tight text-foreground">{t(card.title as TranslationKey)}</h3>
            </div>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-body">{t(card.desc as TranslationKey)}</p>
            <span class="mt-5 inline-flex items-center gap-1 self-start text-sm font-semibold text-foreground transition-all group-hover:gap-1.5">
              {t('home.forwho.card_link_label')} <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 6: COMPLIANCE + COUNTDOWN
       ═══════════════════════════════════════════ -->
  <SectionDark variant="compliance" id="compliance">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-balance text-foreground">
        {t('compliance.title')}
      </h2>
      <p class="mt-4 text-lg text-muted-foreground">
        {t('compliance.subtitle')}
      </p>
    </div>

    <!-- Countdown — dramatic editorial treatment -->
    <div class="mx-auto mt-8 max-w-3xl">
      <p class="mb-6 flex items-center justify-center gap-2.5 text-center text-xs font-semibold uppercase text-muted-foreground">
        <span class="relative flex size-2">
          <span class="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70"></span>
          <span class="relative inline-flex size-2 rounded-full bg-destructive"></span>
        </span>
        {t('compliance.countdown.label')}
      </p>
      <!-- Visually hidden live region announces the countdown to screen readers without flooding on every minute tick -->
      <p class="sr-only" aria-live="polite" aria-atomic="true">
        {t('home.countdown_live_prefix')} {countdownDays} {t('home.countdown_live_days')} {countdownHours} {t('home.countdown_live_hours')} {countdownMinutes} {t('home.countdown_live_suffix')}
      </p>
      <div
        class="mx-auto max-w-xs"
        role="group"
        aria-hidden="true"
      >
        <div class="group relative rounded-xl border border-hairline bg-card p-5 text-center shadow-card transition-colors hover:border-foreground sm:p-6" aria-hidden="true">
          <div class="pointer-events-none absolute inset-x-4 top-0 h-[2px] bg-foreground"></div>
          <span data-numeric class="block text-6xl font-semibold leading-none tracking-normal text-foreground sm:text-8xl">
            {countdownDays}
          </span>
          <span class="mt-3 block text-xs font-semibold uppercase text-muted-foreground">
            {t(countdownDays === 1 ? 'compliance.countdown.day' : 'compliance.countdown.days')}
          </span>
        </div>
      </div>
    </div>

    <!-- Compliance items — before the CTA so the checklist reads as the band's
         argument and the button closes it (mobile order matches desktop). -->
    <div class="mx-auto mt-8 grid max-w-3xl gap-x-8 gap-y-4 sm:grid-cols-2">
      {#each ['compliance.item1', 'compliance.item2', 'compliance.item3'] as item}
        <div class="flex items-start gap-3">
          <Check class="mt-0.5 size-5 shrink-0 text-primary" />
          <span class="text-sm leading-relaxed text-muted-foreground">{t(item as TranslationKey)}</span>
        </div>
      {/each}
    </div>

    <!-- CTA closes the band — standard Cal primary on the light band -->
    <div class="mt-8 text-center">
      <Button
        size="xl"
        onclick={async () => {
          trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'compliance_countdown' });
          await goto('/demo');
        }}
      >
        {t('hero.cta.primary')}
        <ArrowRight class="size-5" />
      </Button>
    </div>
  </SectionDark>

  <!-- ═══════════════════════════════════════════
       SECTION 8: HOW IT WORKS — visual progression with icons + connector
       ═══════════════════════════════════════════ -->
  <section class="reveal scroll-mt-28 py-10 sm:py-12 lg:py-14" id="how">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow mb-4">{t('home.how_meta')}</p>
        <h2 class="text-balance text-foreground">
          {t('how.title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground sm:text-lg">
          {t('home.how.subtitle')}
        </p>
      </div>

      <!-- Steps — editorial chapter style: big DM Sans numbers, no icon circles.
           Each step reads as "01 · [time]" then title + description. -->
      <div class="mx-auto mt-10 max-w-5xl">
        <ol class="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
          <!-- Step 1 -->
          <li class="px-0 sm:px-8">
            <div class="flex items-baseline gap-4">
              <span data-numeric class="text-4xl font-semibold leading-none text-foreground">01</span>
              <span class="text-xs font-semibold uppercase text-muted-foreground">{t('home.how.step1.time')}</span>
            </div>
            <h3 class="mt-5 font-heading text-xl leading-tight text-foreground">{t('how.step1.title')}</h3>
            <p class="mt-3 text-sm leading-relaxed text-body">{t('how.step1.desc')}</p>
          </li>

          <!-- Step 2 -->
          <li class="px-0 sm:px-8">
            <div class="flex items-baseline gap-4">
              <span data-numeric class="text-4xl font-semibold leading-none text-foreground">02</span>
              <span class="text-xs font-semibold uppercase text-muted-foreground">{t('home.how.step2.time')}</span>
            </div>
            <h3 class="mt-5 font-heading text-xl leading-tight text-foreground">{t('how.step2.title')}</h3>
            <p class="mt-3 text-sm leading-relaxed text-body">{t('how.step2.desc')}</p>
          </li>

          <!-- Step 3 -->
          <li class="px-0 sm:px-8">
            <div class="flex items-baseline gap-4">
              <span data-numeric class="text-4xl font-semibold leading-none text-foreground">03</span>
              <span class="text-xs font-semibold uppercase text-muted-foreground">{t('home.how.step3.time')}</span>
            </div>
            <h3 class="mt-5 font-heading text-xl leading-tight text-foreground">{t('how.step3.title')}</h3>
            <p class="mt-3 text-sm leading-relaxed text-body">{t('how.step3.desc')}</p>
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
            {t('hero.cta.primary')}
            <ArrowRight class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 9: FAQ
       ═══════════════════════════════════════════ -->
  <section class="reveal scroll-mt-28 bg-secondary py-10 sm:py-12 lg:py-14" id="faq">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="eyebrow mb-4">{t('home.faq_meta')}</p>
        <h2 class="text-balance text-foreground">
          {t('faq.title')}
        </h2>
      </div>

      <div class="mt-8 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
        {#each [1, 2, 3, 15, 4, 12] as n, i}
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
                <p class="text-sm leading-relaxed text-body">
                  {t(`faq.a${n}` as TranslationKey)}
                </p>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Inline contact link — no /faq page yet, route to /contact for unanswered questions -->
      <div class="mt-6 text-center">
        <a href="/contact" class="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:text-body hover:underline">
          {t('faq.contact_link')}
          <ArrowRight class="size-3.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 10: FINAL CTA — dark navy editorial closing.
       Per McK: "Deep-blue surfaces for hero, quote slides, section
       dividers — used like a conductor's rest." The page has worked
       the reader through urgency, context, product, proof — this is
       the inverted moment that earns the decisive click.
       ═══════════════════════════════════════════ -->
  <!-- Final CTA — full-bleed navy SectionDark. Mirrors compliance band treatment.
       Pacing: navy → deeper-navy footer closes the editorial dark passage. -->
  <SectionDark variant="cta" id="cta" aria-labelledby="final-cta-heading">
    <div class="text-center">
      <p class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold uppercase text-on-dark-soft">
        <span class="text-on-dark">{t('cta.urgency_eyebrow')}</span>
        <span aria-hidden="true" class="text-on-dark-soft/40">·</span>
        <span><span data-numeric class="font-semibold text-on-dark">{countdownDays}</span> {t('home.cta_days_suffix')}</span>
      </p>
      <h2 id="final-cta-heading" class="mt-5 text-balance text-on-dark">
        {t('cta.title')}
      </h2>
      <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-dark-soft">
        {t('cta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <Button
          size="xl"
          href="/demo"
          class="bg-on-dark text-surface-dark hover:bg-on-dark/90"
          onclick={() => trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'final_cta' })}
        >
          {t('cta.primary')}
          <ArrowRight class="size-5" />
        </Button>
      </div>
    </div>
  </SectionDark>

  </main>

  <div class="bg-surface-dark pb-24 md:pb-0">
    <Footer />
  </div>

  <!-- Mobile sticky CTA — hidden while the closing band's own CTA is on screen -->
  {#if showStickyCta && !ctaBandInView}
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
</div>

{#if showPitch && PitchModal}
  <PitchModal onclose={() => showPitch = false} />
{/if}

<style>
  /* Starts at 35% opacity so the swap never flashes an empty card. */
  .carousel-fade {
    animation: fadeIn 0.25s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0.35; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
