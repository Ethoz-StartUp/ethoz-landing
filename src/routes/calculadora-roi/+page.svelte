<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { getLocale, t } from '$lib/i18n/index.svelte';
  import { CLAIMS, type Claim } from '$lib/data/claims';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    Calculator,
    Clock,
    Banknote,
    FileSearch,
    Gavel,
    ArrowRight,
    Info,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('page_viewed', { page: 'roi-calculator' });
  });

  // Claims render per-locale display values (single source of truth: claims.ts).
  const claimValue = (claim: Claim) => (getLocale() === 'en' ? (claim.valueEn ?? claim.value) : claim.value);
  const claimDetail = (claim: Claim) => (getLocale() === 'en' ? (claim.detailEn ?? claim.detail) : claim.detail);

  // ── Inputs (PIVOTE-PLAN L3: horas del Encargado + denuncias/año) ──
  let hoursMonth = $state(30);
  let complaintsYear = $state(12);

  // ── Declared assumptions (mirrored in the methodology note) ──
  const PAPERWORK_REDUCTION = 0.5;
  const HOURLY_RATE_CLP = 15000;
  const EVIDENCE_HOURS_PER_COMPLAINT = 6;
  const HOURS_MIN = 5;
  const HOURS_MAX = 100;

  // ── Derived outputs: horas ahorradas + riesgo documentado ──
  let hoursSavedYear = $derived(Math.round(hoursMonth * 12 * PAPERWORK_REDUCTION));
  let hoursSavedCost = $derived(hoursSavedYear * HOURLY_RATE_CLP);
  let evidenceHoursAvoided = $derived(complaintsYear * EVIDENCE_HOURS_PER_COMPLAINT);

  // Format helpers
  function formatCLP(value: number): string {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M CLP`;
    }
    return `$${value.toLocaleString('es-CL')} CLP`;
  }

  // ── Debounced screen-reader announcement of computed results ──
  let resultsAnnouncement = $state('');
  $effect(() => {
    const summary = `${t('roiCalculator.results_announced')} ${t('roiCalculator.result_hours_saved_label')}: ${hoursSavedYear} h. ${t('roiCalculator.result_hours_cost_label')}: ${formatCLP(hoursSavedCost)}. ${t('roiCalculator.result_evidence_label')}: ${evidenceHoursAvoided} h.`;
    const timer = setTimeout(() => {
      resultsAnnouncement = summary;
    }, 500);
    return () => clearTimeout(timer);
  });

  // One-shot ROI calc used tracking
  let roiTracked = $state(false);
  function handleCTAClick() {
    if (!roiTracked) {
      roiTracked = true;
      trackEvent('roi_calc_used', { hours_month: hoursMonth, complaints_year: complaintsYear });
    }
  }
</script>

<svelte:head>
  <title>{t('roiCalculator.meta_title')}</title>
  <meta name="description" content={t('roiCalculator.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/calculadora-roi" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('roiCalculator.meta_title')} />
  <meta property="og:description" content={t('roiCalculator.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('roiCalculator.meta_title')} />
  <meta name="twitter:description" content={t('roiCalculator.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/calculadora-roi" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Calculadora de papeleo" }
    ]
  })}</script>`}
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content">

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-20 pb-8 sm:pt-24 sm:pb-10 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
        <Calculator class="size-3.5" />
        {t('roiCalculator.hero_eyebrow')}
      </div>
      <h1 class="page-title">
        {t('roiCalculator.hero_title')}
      </h1>
      <p class="mt-3 text-lg font-semibold text-primary">{t('roiCalculator.hero_subtitle')}</p>
      <p class="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {t('roiCalculator.hero_lead')}
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CALCULATOR
       ══════════════════════════════════════ -->
  <section class="py-10 sm:py-12 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">

        <!-- LEFT: Inputs -->
        <div>
          <h2 class="text-xl text-foreground mb-6">{t('roiCalculator.inputs_heading')}</h2>

          <!-- Horas al mes del Encargado de Convivencia -->
          <div class="mb-8">
            <div class="mb-2 flex items-center justify-between">
              <label for="hours-slider" class="text-sm font-semibold text-foreground">
                {t('roiCalculator.input_hours_label')}
              </label>
              <span class="text-sm font-bold text-primary">{hoursMonth} h</span>
            </div>
            <div class="py-2">
              <input
                id="hours-slider"
                type="range"
                min={HOURS_MIN}
                max={HOURS_MAX}
                step="5"
                bind:value={hoursMonth}
                class="roi-slider w-full"
              />
            </div>
            <div class="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span>{HOURS_MIN} h</span>
              <span>{HOURS_MAX} h</span>
            </div>
            <p class="mt-1 text-xs text-muted-foreground">{t('roiCalculator.input_hours_help')}</p>
          </div>

          <!-- Denuncias de convivencia al año -->
          <div class="mb-8">
            <div class="mb-2 flex items-center justify-between">
              <label for="complaints-slider" class="text-sm font-semibold text-foreground">
                {t('roiCalculator.input_complaints_label')}
              </label>
              <span class="text-sm font-bold text-primary">{complaintsYear}</span>
            </div>
            <div class="py-2">
              <input
                id="complaints-slider"
                type="range"
                min="1"
                max="60"
                step="1"
                bind:value={complaintsYear}
                class="roi-slider w-full"
              />
            </div>
            <div class="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>60</span>
            </div>
            <p class="mt-1 text-xs text-muted-foreground">{t('roiCalculator.input_complaints_help')}</p>
          </div>
        </div>

        <!-- RIGHT: Results -->
        <div>
          <h2 class="text-xl text-foreground mb-6">{t('roiCalculator.results_heading')}</h2>

          <!-- Debounced live region for assistive tech -->
          <div class="sr-only" aria-live="polite">{resultsAnnouncement}</div>

          <!-- Hours saved -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <Clock class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-semibold text-foreground">{t('roiCalculator.result_hours_saved_label')}</p>
            </div>
            <p data-numeric class="text-3xl font-heading text-foreground">{hoursSavedYear} h</p>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {hoursMonth} {t('roiCalculator.result_hours_saved_formula')}
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              {t('roiCalculator.result_hours_saved_note')}
            </p>
          </div>

          <!-- Cost equivalent -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <Banknote class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-semibold text-foreground">{t('roiCalculator.result_hours_cost_label')}</p>
            </div>
            <p data-numeric class="text-3xl font-heading text-foreground">{formatCLP(hoursSavedCost)}</p>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {hoursSavedYear} {t('roiCalculator.result_hours_cost_formula')}
            </p>
          </div>

          <!-- Evidence hours avoided -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <FileSearch class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-semibold text-foreground">{t('roiCalculator.result_evidence_label')}</p>
            </div>
            <p data-numeric class="text-3xl font-heading text-foreground">{evidenceHoursAvoided} h</p>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {complaintsYear} {t('roiCalculator.result_evidence_formula')}
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              {t('roiCalculator.result_evidence_note')}
            </p>
          </div>

          <!-- Documented risk: the real ruling as reference (figure from claims.ts) -->
          <div class="rounded-xl border border-destructive/20 bg-destructive/5 p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <Gavel class="size-5 shrink-0 text-destructive" />
              <p class="text-sm font-bold text-foreground">{t('roiCalculator.result_ruling_label')}</p>
            </div>
            <p data-numeric class="text-4xl font-heading text-destructive">{claimValue(CLAIMS.courtRuling)}</p>
            <p class="mt-1 text-xs text-muted-foreground">
              {claimDetail(CLAIMS.courtRuling)} · {CLAIMS.courtRuling.source}
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              {t('roiCalculator.result_ruling_note')}
            </p>
            <p class="mt-2 text-xs font-semibold text-foreground">
              {complaintsYear} {t('roiCalculator.result_cases_suffix')}
            </p>
          </div>
        </div>
      </div>

      <!-- Methodology note -->
      <div class="mt-10 flex items-start gap-3 rounded-xl border border-border bg-secondary p-5">
        <Info class="size-4 shrink-0 text-muted-foreground mt-0.5" />
        <p class="text-xs leading-relaxed text-muted-foreground">
          <strong class="text-foreground">{t('roiCalculator.methodology_label')}</strong> {t('roiCalculator.methodology_body')}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-10 sm:py-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <Calculator class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl text-foreground sm:text-4xl">
        {t('roiCalculator.cta_heading')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('roiCalculator.cta_body')}
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/auditoria" onclick={handleCTAClick}>
          {t('roiCalculator.cta_primary')}
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/demo"
          class="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t('roiCalculator.cta_secondary')}
        </a>
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>

<style>
  /* Range sliders: visible 8px track + size-5 thumb for a real hit area.
     Colors come from design tokens via CSS vars (no hex). */
  .roi-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 8px;
    border-radius: 9999px;
    background: var(--border);
    cursor: pointer;
  }
  .roi-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    background: var(--primary);
    border: none;
  }
  .roi-slider::-moz-range-thumb {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    background: var(--primary);
    border: none;
  }
  .roi-slider:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
</style>
