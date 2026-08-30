<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { getLocale, t } from '$lib/i18n/index.svelte';
  import { CLAIMS, type Claim } from '$lib/data/claims';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    TrendingDown,
    Clock,
    Gavel,
    FileSearch,
    Scale,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Info,
  } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';

  $effect(() => {
    trackEvent('page_viewed', { page: 'proyecciones' });
  });

  // Claims render per-locale display values (single source of truth: claims.ts).
  const claimValue = (claim: Claim) => (getLocale() === 'en' ? (claim.valueEn ?? claim.value) : claim.value);

  // ── Expandable methodology state ──
  let expandedCards = $state<Record<number, boolean>>({});

  function toggleCard(i: number) {
    expandedCards[i] = !expandedCards[i];
  }

  // ── Projection cards (PIVOTE-PLAN L5: declared assumptions + claims figures) ──
  const projections = [
    {
      icon: Clock,
      stat: '180 h/año',
      label: 'proyecciones.card_hours_label' as const,
      context: 'proyecciones.card_hours_context' as const,
      methodology: 'proyecciones.card_hours_methodology' as const,
    },
    {
      icon: FileSearch,
      stat: '72 h/año',
      label: 'proyecciones.card_evidence_label' as const,
      context: 'proyecciones.card_evidence_context' as const,
      methodology: 'proyecciones.card_evidence_methodology' as const,
    },
    {
      icon: Gavel,
      stat: claimValue(CLAIMS.courtRuling),
      label: 'proyecciones.card_ruling_label' as const,
      context: 'proyecciones.card_ruling_context' as const,
      methodology: 'proyecciones.card_ruling_methodology' as const,
      source: CLAIMS.courtRuling.source,
    },
    {
      icon: Scale,
      stat: claimValue(CLAIMS.lawFinesCap),
      label: 'proyecciones.card_fines_label' as const,
      context: 'proyecciones.card_fines_context' as const,
      methodology: 'proyecciones.card_fines_methodology' as const,
      source: CLAIMS.lawFinesCap.source,
    },
  ];

  // ── Scenario table: reference school (30 h/mes paperwork, 12 complaints/year) ──
  const scenario = {
    rows: [
      { metric: 'proyecciones.row_paperwork_metric' as const, before: 'proyecciones.row_paperwork_before' as const, after: 'proyecciones.row_paperwork_after' as const, savings: 'proyecciones.row_paperwork_savings' as const },
      { metric: 'proyecciones.row_evidence_metric' as const, before: 'proyecciones.row_evidence_before' as const, after: 'proyecciones.row_evidence_after' as const, savings: 'proyecciones.row_evidence_savings' as const },
      { metric: 'proyecciones.row_cost_metric' as const, before: 'proyecciones.row_cost_before' as const, after: 'proyecciones.row_cost_after' as const, savings: 'proyecciones.row_cost_savings' as const },
      { metric: 'proyecciones.row_proof_metric' as const, before: 'proyecciones.row_proof_before' as const, after: 'proyecciones.row_proof_after' as const, savings: 'proyecciones.row_proof_savings' as const },
    ],
  };
</script>

<svelte:head>
  <title>{t('proyecciones.head_title_prefix')} {BRAND} {t('proyecciones.head_title_suffix')}</title>
  <meta name="description" content={t('proyecciones.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/proyecciones" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('proyecciones.og_title')} />
  <meta property="og:description" content={t('proyecciones.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('proyecciones.og_title')} />
  <meta name="twitter:description" content={t('proyecciones.og_description')} />
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
        <TrendingDown class="size-3.5" />
        {t('proyecciones.hero_eyebrow')}
      </div>
      <h1 class="page-title">
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
  <section class="py-10 sm:py-12 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('proyecciones.metrics_eyebrow')}</p>
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
              <p class="text-4xl font-heading text-foreground" data-numeric>{proj.stat}</p>
              <p class="mt-2 text-base font-semibold text-foreground">{t(proj.label)}</p>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(proj.context)}</p>
              {#if proj.source}
                <p class="mt-2 text-xs text-text-tertiary">{proj.source}</p>
              {/if}
            </div>
            <!-- Expandable methodology -->
            <div class="border-t border-border">
              <button
                onclick={() => toggleCard(i)}
                class="flex w-full items-center justify-between px-6 py-3 text-xs font-medium text-primary-active hover:bg-primary/5 transition-colors"
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
  <section class="py-10 sm:py-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('proyecciones.scenario_eyebrow')}</p>
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
              <th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-primary-active bg-primary/5">{t('proyecciones.table_head_with')} {BRAND}</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('proyecciones.table_head_diff')}</th>
            </tr>
          </thead>
          <tbody>
            {#each scenario.rows as row, i}
              <tr class="border-b border-border {i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}">
                <td class="px-4 py-3 text-sm font-medium text-foreground">{t(row.metric)}</td>
                <td class="px-4 py-3 text-center text-sm text-muted-foreground">{t(row.before)}</td>
                <td class="px-4 py-3 text-center text-sm font-medium text-primary-active bg-primary/5">{t(row.after)}</td>
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
  <section class="py-10 sm:py-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-3xl text-foreground sm:text-4xl">
        {t('proyecciones.cta_title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('proyecciones.cta_subtitle')}
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/auditoria">
          {t('proyecciones.cta_primary')}
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/calculadora-roi"
          class="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t('proyecciones.cta_secondary')}
        </a>
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>
