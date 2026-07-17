<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    Calculator,
    ShieldAlert,
    Clock,
    Banknote,
    AlertTriangle,
    ArrowRight,
    Info,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('page_viewed', { page: 'roi-calculator' });
  });

  // ── Inputs ──
  let students = $state(800);
  let sedes = $state(1);
  let dailyPickups = $state(40);
  let hasSensitiveData = $state(false);

  // ── Constants ──
  const UTM_CLP = 67000; // CLP per UTM (2025 reference)
  const MAX_UTM = 20000;
  const HOURLY_RATE_CLP = 15000;
  const WEEKS_PER_YEAR = 40;
  const MANUAL_MINUTES_PER_PICKUP = 2;

  // ── Derived outputs ──
  // Max fine exposure: base is up to 20,000 UTM, multiplied by sedes factor for multi-school operators
  let maxFineUTM = $derived(Math.min(MAX_UTM, 2000 + Math.floor(students / 50) * 200 + sedes * 500));
  let maxFineCLP = $derived(maxFineUTM * UTM_CLP);

  // Weekly hours on manual verification
  let weeklyHours = $derived(
    Math.round(((dailyPickups * MANUAL_MINUTES_PER_PICKUP * 5) / 60) * 10) / 10
  );

  // Annual operational cost (hours × rate × weeks)
  let annualOpCost = $derived(Math.round(weeklyHours * HOURLY_RATE_CLP * WEEKS_PER_YEAR));

  // Sensitive data multiplier: if they handle clinical/judicial data, exposure is higher
  let sensitiveMultiplier = $derived(hasSensitiveData ? 1.5 : 1.0);

  // Total value at risk: fine exposure (modeled fraction) + operational cost
  let valueAtRisk = $derived(
    Math.round((maxFineCLP * 0.15 * sensitiveMultiplier) + annualOpCost)
  );

  // Format helpers
  function formatCLP(value: number): string {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M CLP`;
    }
    return `$${value.toLocaleString('es-CL')} CLP`;
  }

  function formatUTM(value: number): string {
    return `${value.toLocaleString('es-CL')} UTM`;
  }

  // Demo URL with prefilled params
  let demoUrl = $derived(
    `/demo?students=${students}&sedes=${sedes}&pickups=${dailyPickups}&sensitive=${hasSensitiveData}`
  );

  // ── Debounced screen-reader announcement of computed results ──
  let resultsAnnouncement = $state('');
  $effect(() => {
    const summary = `${t('roiCalculator.results_announced')} ${t('roiCalculator.result_fine_label')}: ${formatUTM(maxFineUTM)} (≈ ${formatCLP(maxFineCLP)}). ${t('roiCalculator.result_hours_label')}: ${weeklyHours} h. ${t('roiCalculator.result_cost_label')}: ${formatCLP(annualOpCost)}. ${t('roiCalculator.result_total_label')}: ${formatCLP(valueAtRisk)}.`;
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
      trackEvent('roi_calc_used', { students });
    }
  }
</script>

<svelte:head>
  <title>Calculadora de ROI · {BRAND} | Calcula tu exposición al riesgo Ley 21.719</title>
  <meta name="description" content={`Calcula en 30 segundos tu exposición real al riesgo de la Ley 21.719 y el costo operacional actual de verificación manual en tu colegio. Herramienta gratuita de ${BRAND}.`} />
  <meta property="og:url" content="https://ethoz.cl/calculadora-roi" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`Calculadora de ROI · ${BRAND}`} />
  <meta property="og:description" content="Calcula tu exposición al riesgo Ley 21.719 y costo operacional actual en tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Calculadora de ROI · ${BRAND}`} />
  <meta name="twitter:description" content="Calcula en 30 segundos tu exposición al riesgo Ley 21.719." />
  <link rel="canonical" href="https://ethoz.cl/calculadora-roi" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Calculadora de ROI" }
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
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
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

          <!-- Número de alumnos -->
          <div class="mb-8">
            <div class="mb-2 flex items-center justify-between">
              <label for="students-slider" class="text-sm font-semibold text-foreground">
                {t('roiCalculator.input_students_label')}
              </label>
              <span class="text-sm font-bold text-primary">{students.toLocaleString('es-CL')}</span>
            </div>
            <div class="py-2">
              <input
                id="students-slider"
                type="range"
                min="100"
                max="5000"
                step="50"
                bind:value={students}
                class="roi-slider w-full"
              />
            </div>
            <div class="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>5.000</span>
            </div>
          </div>

          <!-- Número de sedes -->
          <div class="mb-8">
            <label for="sedes-input" class="mb-2 flex items-center justify-between">
              <span class="text-sm font-semibold text-foreground">{t('roiCalculator.input_sedes_label')}</span>
              <span class="text-sm font-bold text-primary">{sedes}</span>
            </label>
            <input
              id="sedes-input"
              type="number"
              min="1"
              max="50"
              bind:value={sedes}
              class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t('roiCalculator.input_sedes_placeholder')}
            />
            <p class="mt-1 text-xs text-muted-foreground">{t('roiCalculator.input_sedes_help')}</p>
          </div>

          <!-- Retiros diarios -->
          <div class="mb-8">
            <div class="mb-2 flex items-center justify-between">
              <label for="pickups-slider" class="text-sm font-semibold text-foreground">
                {t('roiCalculator.input_pickups_label')}
              </label>
              <span class="text-sm font-bold text-primary">{dailyPickups}</span>
            </div>
            <div class="py-2">
              <input
                id="pickups-slider"
                type="range"
                min="10"
                max="500"
                step="5"
                bind:value={dailyPickups}
                class="roi-slider w-full"
              />
            </div>
            <div class="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>500</span>
            </div>
          </div>

          <!-- Datos sensibles -->
          <div class="rounded-xl border border-border bg-card p-4">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={hasSensitiveData}
                class="mt-0.5 size-4 rounded border-border accent-primary cursor-pointer"
              />
              <div>
                <p class="text-sm font-semibold text-foreground">{t('roiCalculator.input_sensitive_label')}</p>
                <p class="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {t('roiCalculator.input_sensitive_help')}
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- RIGHT: Results -->
        <div>
          <h2 class="text-xl text-foreground mb-6">{t('roiCalculator.results_heading')}</h2>

          <!-- Debounced live region for assistive tech -->
          <div class="sr-only" aria-live="polite">{resultsAnnouncement}</div>

          <!-- Fine exposure -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <ShieldAlert class="size-5 shrink-0 text-destructive" />
              <p class="text-sm font-semibold text-foreground">{t('roiCalculator.result_fine_label')}</p>
            </div>
            <p class="text-3xl font-heading text-foreground">{formatUTM(maxFineUTM)}</p>
            <p class="mt-0.5 text-sm text-muted-foreground">≈ {formatCLP(maxFineCLP)}</p>
            <p class="mt-2 text-xs font-medium text-foreground">
              {t('roiCalculator.legal_ceiling_note')}
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              {t('roiCalculator.result_fine_note')}
            </p>
            {#if hasSensitiveData}
              <p class="mt-2 text-xs font-semibold text-error-text">
                {t('roiCalculator.result_fine_multiplier')}
              </p>
            {/if}
          </div>

          <!-- Operational hours -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <Clock class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-semibold text-foreground">{t('roiCalculator.result_hours_label')}</p>
            </div>
            <p class="text-3xl font-heading text-foreground">{weeklyHours} h</p>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {dailyPickups} {t('roiCalculator.result_hours_formula')}
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              {t('roiCalculator.result_hours_note')}
            </p>
          </div>

          <!-- Operational cost -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <Banknote class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-semibold text-foreground">{t('roiCalculator.result_cost_label')}</p>
            </div>
            <p class="text-3xl font-heading text-foreground">{formatCLP(annualOpCost)}</p>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {weeklyHours} {t('roiCalculator.result_cost_formula')}
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              {t('roiCalculator.result_cost_note')}
            </p>
          </div>

          <!-- Total value at risk -->
          <div class="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <AlertTriangle class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-bold text-foreground">{t('roiCalculator.result_total_label')}</p>
            </div>
            <p class="text-4xl font-heading text-primary">{formatCLP(valueAtRisk)}</p>
            <p class="mt-1 text-xs text-muted-foreground">
              {t('roiCalculator.result_total_note')}
            </p>
          </div>
        </div>
      </div>

      <!-- Methodology note -->
      <div class="mt-10 flex items-start gap-3 rounded-xl border border-border bg-secondary p-5">
        <Info class="size-4 shrink-0 text-muted-foreground mt-0.5" />
        <p class="text-xs leading-relaxed text-muted-foreground">
          <strong class="text-foreground">{t('roiCalculator.methodology_label')}</strong> {t('roiCalculator.methodology_body')} {t('roiCalculator.utm_note')}
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
        <Button size="xl" href={demoUrl} onclick={handleCTAClick}>
          {t('roiCalculator.cta_primary')}
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/proyecciones"
          class="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t('roiCalculator.cta_secondary')}
        </a>
      </div>
      <p class="mt-6 text-xs text-muted-foreground">
        {t('roiCalculator.cta_footnote')}
      </p>
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
