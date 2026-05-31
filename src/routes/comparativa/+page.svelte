<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import type { TranslationKey } from '$lib/i18n/index.svelte';
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
    Link,
    AlertTriangle,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('page_viewed', { page: 'comparativa' });
  });

  // ── Table data ──
  type CellValue = 'yes' | 'no' | 'varies' | 'unknown';

  interface Row {
    label: TranslationKey;
    ethoz: CellValue;
    napsis: CellValue;
    syscol: CellValue;
    lirmi: CellValue;
    schooltrack: CellValue;
  }

  interface Category {
    label: TranslationKey;
    rows: Row[];
  }

  const categories: Category[] = [
    {
      label: 'comparativa.cat_security',
      rows: [
        { label: 'comparativa.row_encryption_at_rest', ethoz: 'yes', napsis: 'no', syscol: 'unknown', lirmi: 'unknown', schooltrack: 'unknown' },
        { label: 'comparativa.row_rls_by_role', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'comparativa.row_native_audit_log', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'comparativa.row_law_21719', ethoz: 'yes', napsis: 'no', syscol: 'unknown', lirmi: 'varies', schooltrack: 'unknown' },
        { label: 'comparativa.row_circular_30', ethoz: 'yes', napsis: 'varies', syscol: 'no', lirmi: 'yes', schooltrack: 'varies' },
      ],
    },
    {
      label: 'comparativa.cat_operational_protection',
      rows: [
        { label: 'comparativa.row_verified_pickups', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'varies' },
        { label: 'comparativa.row_court_order_block', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'no' },
        { label: 'comparativa.row_realtime_role_alerts', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'varies' },
        { label: 'comparativa.row_digital_emergency_protocol', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'no' },
      ],
    },
    {
      label: 'comparativa.cat_student_data',
      rows: [
        { label: 'comparativa.row_unified_longitudinal_profile', ethoz: 'yes', napsis: 'varies', syscol: 'no', lirmi: 'varies', schooltrack: 'varies' },
        { label: 'comparativa.row_confidentiality_observations', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'comparativa.row_no_annual_reset_history', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
      ],
    },
    {
      label: 'comparativa.cat_integrations',
      rows: [
        { label: 'comparativa.row_connects_existing_classbook', ethoz: 'yes', napsis: 'varies', syscol: 'no', lirmi: 'no', schooltrack: 'varies' },
        { label: 'comparativa.row_open_api', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'comparativa.row_compliant_export', ethoz: 'yes', napsis: 'varies', syscol: 'varies', lirmi: 'varies', schooltrack: 'unknown' },
      ],
    },
  ];

  const columns = [BRAND, 'Napsis', 'Syscol', 'Lirmi', 'SchoolTrack'];
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

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-24 pb-10 sm:pt-28 sm:pb-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
        <Scale class="size-3.5" />
        {t('comparativa.hero_eyebrow')}
      </div>
      <h1 class="text-foreground">
        {t('comparativa.hero_title')}
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {t('comparativa.hero_lede_part1')} <strong class="text-foreground">{t('comparativa.hero_lede_emphasis')}</strong>{t('comparativa.hero_lede_part2')}
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
      <div class="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table class="w-full border-collapse text-sm">
          <caption class="sr-only">{t('comparativa.hero_title')}</caption>
          <!-- Header -->
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-56">
                {t('comparativa.table_col_feature')}
              </th>
              {#each columns as col, i}
                <th scope="col" class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide {i === 0 ? 'text-primary bg-primary/5 border-x border-primary/20' : 'text-muted-foreground'}">
                  {col}
                  {#if i === 0}
                    <span class="ml-1.5 inline-flex items-center rounded-full bg-primary px-1.5 py-0.5 text-mockup-2xs font-bold text-primary-foreground">★</span>
                  {/if}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each categories as cat, catIdx}
              <!-- Category header row -->
              <tr class="border-b border-border bg-secondary">
                <td colspan={columns.length + 1} class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t(cat.label)}
                </td>
              </tr>
              <!-- Data rows -->
              {#each cat.rows as row, rowIdx}
                <tr class="border-b border-border {rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/40 transition-colors">
                  <th scope="row" class="px-4 py-3 text-left text-sm text-foreground font-medium">
                    {t(row.label)}
                  </th>
                  <!-- Ethoz -->
                  <td class="px-4 py-3 text-center bg-primary/5 border-x border-primary/20">
                    {#if row.ethoz === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                      <span class="sr-only">{t('comparativa.legend_included')}</span>
                    {:else if row.ethoz === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                      <span class="sr-only">{t('comparativa.legend_not_included')}</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_varies')}</span>
                    {/if}
                  </td>
                  <!-- Napsis -->
                  <td class="px-4 py-3 text-center">
                    {#if row.napsis === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                      <span class="sr-only">{t('comparativa.legend_included')}</span>
                    {:else if row.napsis === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                      <span class="sr-only">{t('comparativa.legend_not_included')}</span>
                    {:else if row.napsis === 'varies'}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_varies')}</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_unknown')}</span>
                    {/if}
                  </td>
                  <!-- Syscol -->
                  <td class="px-4 py-3 text-center">
                    {#if row.syscol === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                      <span class="sr-only">{t('comparativa.legend_included')}</span>
                    {:else if row.syscol === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                      <span class="sr-only">{t('comparativa.legend_not_included')}</span>
                    {:else if row.syscol === 'varies'}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_varies')}</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_unknown')}</span>
                    {/if}
                  </td>
                  <!-- Lirmi -->
                  <td class="px-4 py-3 text-center">
                    {#if row.lirmi === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                      <span class="sr-only">{t('comparativa.legend_included')}</span>
                    {:else if row.lirmi === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                      <span class="sr-only">{t('comparativa.legend_not_included')}</span>
                    {:else if row.lirmi === 'varies'}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_varies')}</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_unknown')}</span>
                    {/if}
                  </td>
                  <!-- SchoolTrack -->
                  <td class="px-4 py-3 text-center">
                    {#if row.schooltrack === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                      <span class="sr-only">{t('comparativa.legend_included')}</span>
                    {:else if row.schooltrack === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                      <span class="sr-only">{t('comparativa.legend_not_included')}</span>
                    {:else if row.schooltrack === 'varies'}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_varies')}</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ {t('comparativa.cell_unknown')}</span>
                    {/if}
                  </td>
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
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.14em] text-primary">{t('comparativa.positioning_eyebrow')}</p>
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
            <Link class="size-5 shrink-0 text-primary" />
            <h3 class="text-base text-foreground">{t('comparativa.card_together_title')}</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            {t('comparativa.card_together_body')}
          </p>
          <p class="mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('comparativa.card_together_api_label')}</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('comparativa.card_together_api_body')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       RISK CALLOUT
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div class="grid gap-8 sm:grid-cols-3 text-center">
          <div>
            <p class="text-3xl font-bold text-foreground">20.000 UTM</p>
            <p class="mt-1 text-sm text-muted-foreground">{t('comparativa.risk_fine_label')}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">≈ $1.340M CLP</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-foreground">{t('comparativa.risk_date_value')}</p>
            <p class="mt-1 text-sm text-muted-foreground">{t('comparativa.risk_date_label')}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">{t('comparativa.risk_date_note')}</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-foreground">12.038</p>
            <p class="mt-1 text-sm text-muted-foreground">{t('comparativa.risk_schools_label')}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">{t('comparativa.risk_schools_note')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <Lock class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl text-foreground sm:text-4xl">
        {t('comparativa.cta_title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('comparativa.cta_lede')}
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/demo">
          {t('comparativa.cta_primary')}
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/compliance"
          class="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t('comparativa.cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
