<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    TrendingDown,
    Clock,
    ShieldCheck,
    Users,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Info,
    BarChart2,
  } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';

  $effect(() => {
    trackEvent('page_viewed', { page: 'proyecciones' });
  });

  // ── Expandable methodology state ──
  let expandedCards = $state<Record<number, boolean>>({});

  function toggleCard(i: number) {
    expandedCards[i] = !expandedCards[i];
  }

  // ── Projection cards ──
  const projections = [
    {
      icon: ShieldCheck,
      stat: '100%',
      label: 'proyecciones.card_authorized_pickups_label' as const,
      context: 'proyecciones.card_authorized_pickups_context' as const,
      methodology: 'proyecciones.card_authorized_pickups_methodology' as const,
    },
    {
      icon: Clock,
      stat: '<3 seg',
      label: 'proyecciones.card_verification_time_label' as const,
      context: 'proyecciones.card_verification_time_context' as const,
      methodology: 'proyecciones.card_verification_time_methodology' as const,
    },
    {
      icon: BarChart2,
      stat: 'Hasta 20.000 UTM',
      label: 'proyecciones.card_fines_savings_label' as const,
      context: 'proyecciones.card_fines_savings_context' as const,
      methodology: 'proyecciones.card_fines_savings_methodology' as const,
    },
    {
      icon: Users,
      stat: '~12 h/semana',
      label: 'proyecciones.card_recovered_hours_label' as const,
      context: 'proyecciones.card_recovered_hours_context' as const,
      methodology: 'proyecciones.card_recovered_hours_methodology' as const,
    },
  ];

  // ── Scenario table for 800-student school ──
  const scenario = {
    students: 800,
    dailyPickups: 40,
    inspectors: 2,
    rows: [
      { metric: 'proyecciones.row_daily_pickups_metric' as const, before: 'proyecciones.row_daily_pickups_before' as const, after: 'proyecciones.row_daily_pickups_after' as const, savings: 'proyecciones.row_daily_pickups_savings' as const },
      { metric: 'proyecciones.row_inspector_hours_metric' as const, before: 'proyecciones.row_inspector_hours_before' as const, after: 'proyecciones.row_inspector_hours_after' as const, savings: 'proyecciones.row_inspector_hours_savings' as const },
      { metric: 'proyecciones.row_incident_doc_metric' as const, before: 'proyecciones.row_incident_doc_before' as const, after: 'proyecciones.row_incident_doc_after' as const, savings: 'proyecciones.row_incident_doc_savings' as const },
      { metric: 'proyecciones.row_law_exposure_metric' as const, before: 'proyecciones.row_law_exposure_before' as const, after: 'proyecciones.row_law_exposure_after' as const, savings: 'proyecciones.row_law_exposure_savings' as const },
      { metric: 'proyecciones.row_manual_cost_metric' as const, before: 'proyecciones.row_manual_cost_before' as const, after: 'proyecciones.row_manual_cost_after' as const, savings: 'proyecciones.row_manual_cost_savings' as const },
    ],
  };
</script>

<svelte:head>
  <title>{t('proyecciones.head_title_prefix')} {BRAND} {t('proyecciones.head_title_suffix')}</title>
  <meta name="description" content={`Proyecciones modeladas del impacto de ${BRAND} en colegios chilenos: retiros seguros, tiempo de verificación, ahorro en multas Ley 21.719 y horas recuperadas para inspectores.`} />
  <meta property="og:url" content="https://ethoz.cl/proyecciones" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`Proyecciones de impacto — ${BRAND}`} />
  <meta property="og:description" content={`Proyecciones modeladas del impacto de ${BRAND}: retiros, compliance Ley 21.719 y eficiencia operacional.`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Proyecciones de impacto — ${BRAND}`} />
  <meta name="twitter:description" content={`Proyecciones modeladas del impacto de ${BRAND} en colegios chilenos.`} />
  <link rel="canonical" href="https://ethoz.cl/proyecciones" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Proyecciones de impacto" }
    ]
  })}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-24 pb-10 sm:pt-28 sm:pb-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
        <TrendingDown class="size-3.5" />
        {t('proyecciones.hero_eyebrow')}
      </div>
      <h1 class="text-foreground">
        {t('proyecciones.hero_title')}
      </h1>
      <p class="mt-3 text-xl font-semibold text-primary">{t('proyecciones.hero_subtitle')}</p>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {BRAND} {t('proyecciones.hero_description')}
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       FRAMING DISCLAIMER
       ══════════════════════════════════════ -->
  <section class="py-6 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
        <Info class="size-4 shrink-0 text-primary mt-0.5" />
        <div>
          <p class="text-sm font-semibold text-foreground">{t('proyecciones.framing_title')}</p>
          <p class="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t('proyecciones.framing_body')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       PROJECTION CARDS
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.14em] text-primary">{t('proyecciones.metrics_eyebrow')}</p>
        <h2 class="mt-3 text-balance text-3xl text-foreground sm:text-4xl">
          {t('proyecciones.metrics_title_prefix')} {BRAND} {t('proyecciones.metrics_title_suffix')}
        </h2>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        {#each projections as proj, i}
          {@const Icon = proj.icon}
          <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="mb-4 flex items-center gap-2.5">
                <Icon class="size-5 shrink-0 text-primary" />
                <p class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('proyecciones.card_kicker')}</p>
              </div>
              <p class="text-4xl font-bold tracking-tight text-foreground">{proj.stat}</p>
              <p class="mt-2 text-base font-semibold text-foreground">{t(proj.label)}</p>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(proj.context)}</p>
            </div>
            <!-- Expandable methodology -->
            <div class="border-t border-border">
              <button
                onclick={() => toggleCard(i)}
                class="flex w-full items-center justify-between px-6 py-3 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                <span>{t('proyecciones.see_methodology')}</span>
                {#if expandedCards[i]}
                  <ChevronUp class="size-3.5" />
                {:else}
                  <ChevronDown class="size-3.5" />
                {/if}
              </button>
              {#if expandedCards[i]}
                <div class="px-6 pb-5">
                  <p class="text-xs leading-relaxed text-muted-foreground">{t(proj.methodology)}</p>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       SCENARIO TABLE
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.14em] text-primary">{t('proyecciones.scenario_eyebrow')}</p>
        <h2 class="mt-3 text-balance text-3xl text-foreground sm:text-4xl">
          {t('proyecciones.scenario_title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          {t('proyecciones.scenario_subtitle')}
        </p>
      </div>

      <div class="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('proyecciones.table_head_metric')}</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('proyecciones.table_head_without')} {BRAND}</th>
              <th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-primary bg-primary/5">{t('proyecciones.table_head_with')} {BRAND}</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('proyecciones.table_head_diff')}</th>
            </tr>
          </thead>
          <tbody>
            {#each scenario.rows as row, i}
              <tr class="border-b border-border {i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}">
                <td class="px-4 py-3 text-sm font-medium text-foreground">{t(row.metric)}</td>
                <td class="px-4 py-3 text-center text-sm text-muted-foreground">{t(row.before)}</td>
                <td class="px-4 py-3 text-center text-sm font-medium text-primary bg-primary/5">{t(row.after)}</td>
                <td class="px-4 py-3 text-center text-sm font-semibold text-foreground">{t(row.savings)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-xs text-muted-foreground text-center">
        {t('proyecciones.scenario_footnote')}
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       BOTTOM DISCLAIMER
       ══════════════════════════════════════ -->
  <section class="py-10 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-xl border border-border bg-secondary p-5">
        <p class="text-xs leading-relaxed text-muted-foreground text-center">
          <strong class="text-foreground">{t('proyecciones.bottom_disclaimer_label')}</strong> {t('proyecciones.bottom_disclaimer_prefix')} {BRAND} {t('proyecciones.bottom_disclaimer_suffix')}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-3xl text-foreground sm:text-4xl">
        {t('proyecciones.cta_title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('proyecciones.cta_subtitle')}
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/roi-calculator" class="shadow-lg">
          {t('proyecciones.cta_primary')}
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/demo"
          class="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t('proyecciones.cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
