<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { BRAND, LEGAL_NAME } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import { ArrowRight, ChevronDown } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  const faqs = [
    { q: 'about.faq.q1' as const, a: 'about.faq.a1' as const },
    { q: 'about.faq.q2' as const, a: 'about.faq.a2' as const },
    { q: 'about.faq.q3' as const, a: 'about.faq.a3' as const },
    { q: 'about.faq.q4' as const, a: 'about.faq.a4' as const },
  ];

  let openFaq = $state<number | null>(null);

  function toggleFaq(i: number) {
    openFaq = openFaq === i ? null : i;
  }

  $effect(() => { trackEvent('about_page_viewed'); });

  // Institutional roadmap — quarters in which the thesis manifests
  const roadmap = [
    { period: '2026 · Q2', label: 'about.roadmap_q2_label' as const, body: 'about.roadmap_q2_body' as const, state: 'done' as const },
    { period: '2026 · Q3', label: 'about.roadmap_q3_label' as const, body: 'about.roadmap_q3_body' as const, state: 'active' as const },
    { period: '2026 · Q4', label: 'about.roadmap_q4_label' as const, body: 'about.roadmap_q4_body' as const, state: 'upcoming' as const },
    { period: '2027 · H1', label: 'about.roadmap_h1_label' as const, body: 'about.roadmap_h1_body' as const, state: 'upcoming' as const },
  ];
</script>

<svelte:head>
  <title>{BRAND} · {t('about.title')}</title>
  <meta name="description" content={`${BRAND}: plataforma de seguimiento integral y seguridad escolar construida en Chile.`} />
  <meta property="og:url" content="https://ethoz.cl/about" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${BRAND} · Construido en Chile, para colegios chilenos`} />
  <meta property="og:description" content={`Conoce ${BRAND}, la plataforma de gestión y protección de datos escolares para Chile.`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${BRAND} · Construido en Chile, para colegios chilenos`} />
  <meta name="twitter:description" content={`Conoce ${BRAND}, la plataforma de gestión y protección de datos escolares para Chile.`} />
  <link rel="canonical" href="https://ethoz.cl/about" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Nosotros"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- HERO — thesis declaration -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span class="text-primary">{t('about.hero_eyebrow')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{LEGAL_NAME}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('about.hero_founded')}</span>
      </p>
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <h1 class="mt-6 font-heading text-[2rem] leading-[1.15] text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        {t('about.title')}
      </h1>
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('about.intro')}
      </p>
    </div>
  </section>

  <!-- EDITORIAL ANCHOR — the thesis, institutional declaration -->
  <section class="border-y border-border py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('about.thesis_eyebrow')}</p>
      <blockquote class="mt-5 font-heading text-2xl leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
        {t('about.thesis_quote')}
      </blockquote>
    </div>
    <div class="mx-auto mt-12 max-w-7xl px-4 sm:mt-14 sm:px-6 lg:px-8">
      <dl class="grid grid-cols-1 border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
        <div class="px-6 py-6 text-center sm:py-8">
          <dt class="sr-only">{t('about.stat_schools_sr')}</dt>
          <dd class="font-heading text-5xl leading-none text-foreground sm:text-6xl" data-numeric>
            12.038
          </dd>
          <p class="mt-3 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {t('about.stat_schools_label')}
          </p>
        </div>
        <div class="border-t border-border px-6 py-6 text-center sm:border-t-0 sm:py-8">
          <dt class="sr-only">{t('about.stat_sostenedores_sr')}</dt>
          <dd class="font-heading text-5xl leading-none text-foreground sm:text-6xl" data-numeric>
            5.777
          </dd>
          <p class="mt-3 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {t('about.stat_sostenedores_label')}
          </p>
        </div>
        <div class="border-t border-border px-6 py-6 text-center sm:border-t-0 sm:py-8">
          <dt class="sr-only">{t('about.stat_enforcement_sr')}</dt>
          <dd class="font-heading text-5xl leading-none text-foreground sm:text-6xl" data-numeric>
            Dic 2026
          </dd>
          <p class="mt-3 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {t('about.stat_enforcement_label')}
          </p>
        </div>
      </dl>
      <p class="mt-4 text-center text-xs text-muted-foreground">
        {t('about.stat_sources')}
      </p>
    </div>
  </section>

  <!-- MISSION — what Ethoz is NOT, and what it IS -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('about.mission_eyebrow')}</p>
      <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">
        {t('about.mission_title')}
      </h2>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('about.mission_desc')}
      </p>

      <!-- Contrast: what Ethoz complements vs. what it is -->
      <div class="mt-10 grid gap-6 border-y border-border py-10 sm:grid-cols-2 sm:gap-10">
        <div>
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('about.is_not_title')}</p>
          <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
            <li class="flex gap-3"><span class="text-border" aria-hidden="true">—</span><span>{t('about.is_not_1')}</span></li>
            <li class="flex gap-3"><span class="text-border" aria-hidden="true">—</span><span>{t('about.is_not_2')}</span></li>
            <li class="flex gap-3"><span class="text-border" aria-hidden="true">—</span><span>{t('about.is_not_3')}</span></li>
          </ul>
        </div>
        <div>
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('about.is_title')}</p>
          <ul class="mt-4 space-y-3 text-sm text-foreground">
            <li class="flex gap-3"><span class="text-primary" aria-hidden="true">→</span><span>{t('about.is_1')}</span></li>
            <li class="flex gap-3"><span class="text-primary" aria-hidden="true">→</span><span>{t('about.is_2')}</span></li>
            <li class="flex gap-3"><span class="text-primary" aria-hidden="true">→</span><span>{t('about.is_3')}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ROADMAP — institutional transparency replaces "values" AI slop -->
  <section class="border-t border-border py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('about.roadmap_eyebrow')}</p>
      <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">
        {t('about.roadmap_title')}
      </h2>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
        {t('about.roadmap_intro')}
      </p>

      <ol class="mt-10 divide-y divide-border border-y border-border">
        {#each roadmap as item, i}
          <li class="grid gap-4 py-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
            <div>
              <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{item.period}</p>
              <p class="mt-1 font-heading text-xs text-muted-foreground tabular-nums" data-numeric>0{i + 1}</p>
            </div>
            <div>
              <p class="font-semibold text-foreground">{t(item.label)}</p>
              <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(item.body)}</p>
            </div>
            <div class="sm:text-right">
              {#if item.state === 'done'}
                <span class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-success">{t('about.roadmap_state_done')}</span>
              {:else if item.state === 'active'}
                <span class="inline-flex items-center gap-1.5 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">
                  <span class="relative flex size-1.5">
                    <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70"></span>
                    <span class="relative inline-flex size-1.5 rounded-full bg-primary"></span>
                  </span>
                  {t('about.roadmap_state_active')}
                </span>
              {:else}
                <span class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('about.roadmap_state_upcoming')}</span>
              {/if}
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- FAQ — subtle, editorial -->
  <section class="border-t border-border py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('about.faq_eyebrow')}</p>
      <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">
        {t('about.faq.title')}
      </h2>

      <div class="mt-10 divide-y divide-border border-y border-border">
        {#each faqs as faq, i}
          <div>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
              onclick={() => toggleFaq(i)}
              aria-expanded={openFaq === i}
            >
              <span class="flex items-baseline gap-4">
                <span class="font-heading text-xs text-primary tabular-nums" data-numeric>0{i + 1}</span>
                <span>{t(faq.q)}</span>
              </span>
              <ChevronDown class="size-4 shrink-0 text-muted-foreground transition-transform {openFaq === i ? 'rotate-180' : ''}" />
            </button>
            {#if openFaq === i}
              <div class="pl-10 pb-5 text-sm leading-relaxed text-muted-foreground">
                {t(faq.a)}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- FINAL CTA — dark navy -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-about">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-background/85">{t('about.cta_eyebrow')}</p>
      <h2 id="final-cta-about" class="mt-5 font-heading text-3xl leading-[1.15] text-background sm:text-4xl">
        {t('pricing.cta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('pricing.cta.primary')}
          <ArrowRight class="size-5" />
        </a>
        <a
          href="/compliance"
          class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background"
        >
          {t('about.cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
