<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { BRAND } from '$lib/brand';
  import { getLocale, t } from '$lib/i18n/index.svelte';
  import type { TranslationKey } from '$lib/i18n/index.svelte';
  import { CLAIMS, type Claim } from '$lib/data/claims';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    CheckCircle,
    XCircle,
    MinusCircle,
    ArrowRight,
    Scale,
    Lock,
    Database,
    Upload,
    AlertTriangle,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('page_viewed', { page: 'comparativa' });
  });

  // Claims render per-locale display values (single source of truth: claims.ts).
  const claimValue = (claim: Claim) => (getLocale() === 'en' ? (claim.valueEn ?? claim.value) : claim.value);
  const claimDetail = (claim: Claim) => (getLocale() === 'en' ? (claim.detailEn ?? claim.detail) : claim.detail);

  // ── Table data (PIVOTE-PLAN L3: Registrar vs Ejecutar) ──
  type CellValue = 'yes' | 'no' | 'varies' | 'unknown';

  interface Row {
    label: TranslationKey;
    /** One value per entry in `columns`, same order. */
    values: CellValue[];
  }

  interface Category {
    label: TranslationKey;
    rows: Row[];
  }

  // Column order: competitors first (they record, well), Ethoz last (its own column).
  const columns = ['Napsis', 'Lirmi', 'Colegium', BRAND];

  const categories: Category[] = [
    {
      label: 'comparativa.cat_register',
      rows: [
        { label: 'comparativa.row_academic_admin', values: ['yes', 'yes', 'yes', 'no'] },
        { label: 'comparativa.row_case_records', values: ['yes', 'yes', 'yes', 'yes'] },
      ],
    },
    {
      label: 'comparativa.cat_execute',
      rows: [
        { label: 'comparativa.row_protocol_execution', values: ['no', 'no', 'no', 'yes'] },
        { label: 'comparativa.row_case_file', values: ['no', 'no', 'no', 'yes'] },
        { label: 'comparativa.row_ai_drafts', values: ['no', 'no', 'no', 'yes'] },
        { label: 'comparativa.row_operator_panel', values: ['no', 'no', 'no', 'yes'] },
      ],
    },
  ];

  const riskStats = [
    { claim: CLAIMS.complaints2025, label: 'comparativa.risk_complaints_label' as const },
    { claim: CLAIMS.courtRuling, label: 'comparativa.risk_ruling_label' as const },
    { claim: CLAIMS.lawFinesCap, label: 'comparativa.risk_fine_label' as const },
  ];
</script>

<svelte:head>
  <title>{t('comparativa.meta_title')}</title>
  <meta name="description" content={t('comparativa.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/comparativa" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('comparativa.og_title')} />
  <meta property="og:description" content={t('comparativa.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('comparativa.og_title')} />
  <meta name="twitter:description" content={t('comparativa.twitter_description')} />
  <link rel="canonical" href="https://ethoz.cl/comparativa" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Comparativa" }
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
        <Scale class="size-3.5" />
        {t('comparativa.hero_eyebrow')}
      </div>
      <h1 class="page-title">
        {t('comparativa.hero_title')}
      </h1>
      <p class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {t('comparativa.hero_lede')}
      </p>
      <p class="mt-4 text-sm text-muted-foreground">
        {t('comparativa.hero_subnote')}
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       DISCLAIMER
       ══════════════════════════════════════ -->
  <section class="py-6 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <AlertTriangle class="size-4 shrink-0 text-muted-foreground mt-0.5" />
        <p class="text-xs leading-relaxed text-muted-foreground">
          <strong class="text-foreground">{t('comparativa.disclaimer_label')}</strong> {t('comparativa.disclaimer_body')}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       COMPARISON TABLE
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-16 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Legend -->
      <div class="mb-8 flex flex-wrap items-center gap-5">
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle class="size-4 text-primary" />
          <span>{t('comparativa.legend_included')}</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MinusCircle class="size-4 text-muted-foreground" />
          <span>{t('comparativa.legend_varies_or_unknown')}</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <XCircle class="size-4 text-destructive" />
          <span>{t('comparativa.legend_not_included')}</span>
        </div>
      </div>

      <!-- Scrollable table wrapper -->
      <div class="contain-inline-size overflow-x-auto rounded-xl border border-border shadow-sm">
        <table class="w-full min-w-[480px] border-collapse text-sm">
          <caption class="sr-only">{t('comparativa.hero_title')}</caption>
          <!-- Header -->
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th scope="col" class="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-36 sm:px-4 sm:w-56">
                {t('comparativa.table_col_feature')}
              </th>
              {#each columns as col, i}
                {@const isEthoz = i === columns.length - 1}
                <th scope="col" class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wide sm:px-4 {isEthoz ? 'text-primary-active bg-primary/5 border-x border-primary/20' : 'text-muted-foreground'}">
                  {col}
                  {#if isEthoz}
                    <span class="ml-1.5 inline-flex items-center rounded-full bg-primary px-1.5 py-0.5 text-mockup-2xs font-bold text-primary-foreground">★</span>
                  {/if}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each categories as cat}
              <!-- Category header row -->
              <tr class="border-b border-border bg-secondary">
                <td colspan={columns.length + 1} class="px-2 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:px-4">
                  {t(cat.label)}
                </td>
              </tr>
              <!-- Data rows -->
              {#each cat.rows as row, rowIdx}
                <tr class="border-b border-border {rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/40 transition-colors">
                  <th scope="row" class="px-2 py-3 text-left text-sm text-foreground font-medium sm:px-4">
                    {t(row.label)}
                  </th>
                  {#each row.values as cell, i}
                    {@const isEthoz = i === columns.length - 1}
                    <td class="px-2 py-3 text-center sm:px-4 {isEthoz ? 'bg-primary/5 border-x border-primary/20' : ''}">
                      {#if cell === 'yes'}
                        <CheckCircle class="mx-auto size-5 text-primary" role="img" aria-label={t('comparativa.legend_included')} />
                      {:else if cell === 'no'}
                        <XCircle class="mx-auto size-5 text-destructive" role="img" aria-label={t('comparativa.legend_not_included')} />
                      {:else if cell === 'varies'}
                        <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_varies')}</span>
                      {:else}
                        <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_unknown')}</span>
                      {/if}
                    </td>
                  {/each}
                </tr>
              {/each}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       POSITIONING CARDS
       ══════════════════════════════════════ -->
  <section class="py-10 sm:py-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('comparativa.positioning_eyebrow')}</p>
        <h2 class="mt-3 text-balance text-3xl text-foreground sm:text-4xl">
          {t('comparativa.positioning_title')}
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
          {t('comparativa.positioning_lede')}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="mb-3 flex items-center gap-2.5">
            <Database class="size-5 shrink-0 text-primary" />
            <h3 class="text-base text-foreground">{t('comparativa.card_erp_title')}</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            {t('comparativa.card_erp_body')}
          </p>
          <p class="mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('comparativa.card_erp_gap_label')}</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('comparativa.card_erp_gap_body')}</p>
        </div>

        <div class="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
          <div class="mb-3 flex items-center gap-2.5">
            <ShieldCheck class="size-5 shrink-0 text-primary" />
            <h3 class="text-base text-foreground">{t('comparativa.card_ethoz_title')}</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            {t('comparativa.card_ethoz_body')}
          </p>
          <p class="mt-3 text-xs font-semibold text-primary uppercase tracking-wide">{t('comparativa.card_ethoz_role_label')}</p>
          <p class="mt-1 text-sm text-foreground font-medium">{t('comparativa.card_ethoz_role_body')}</p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="mb-3 flex items-center gap-2.5">
            <Upload class="size-5 shrink-0 text-primary" />
            <h3 class="text-base text-foreground">{t('comparativa.card_together_title')}</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            {t('comparativa.card_together_body')}
          </p>
          <p class="mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('comparativa.card_together_import_label')}</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('comparativa.card_together_import_body')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       RISK CALLOUT — figures only from claims.ts
       ══════════════════════════════════════ -->
  <section class="py-10 sm:py-12 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div class="grid gap-8 sm:grid-cols-3 text-center">
          {#each riskStats as stat (stat.label)}
            <div>
              <p data-numeric class="text-3xl font-heading text-foreground">{claimValue(stat.claim)}</p>
              <p class="mt-1 text-sm text-muted-foreground">{t(stat.label)}</p>
              <p class="mt-0.5 text-xs text-muted-foreground">{claimDetail(stat.claim) ?? stat.claim.source}</p>
            </div>
          {/each}
        </div>
        <p class="mt-6 text-center text-xs text-text-tertiary">
          {CLAIMS.complaints2025.source} · {CLAIMS.courtRuling.source} · {CLAIMS.lawFinesCap.source}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-10 sm:py-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <Lock class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl text-foreground sm:text-4xl">
        {t('comparativa.cta_title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('comparativa.cta_lede')}
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/auditoria">
          {t('comparativa.cta_primary')}
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/cumplimiento"
          class="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t('comparativa.cta_secondary')}
        </a>
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>
