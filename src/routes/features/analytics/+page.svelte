<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { trackEvent } from '$lib/utils/analytics';
  import { BarChart3, ArrowRight, ArrowLeft, TrendingUp, Users, ShieldAlert, ClipboardList, Filter } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'analytics' }); });
</script>

<svelte:head>
  <title>{BRAND} — {t('featurePage.analytics.meta_title_suffix')}</title>
  <meta name="description" content={t('featurePage.analytics.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/features/analytics" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.analytics.og_title')} />
  <meta property="og:description" content={t('featurePage.analytics.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.analytics.og_title')} />
  <meta name="twitter:description" content={t('featurePage.analytics.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/features/analytics" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Analytics y KPIs"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.analytics.back_to_products')}
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-3">
            <BarChart3 class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-foreground">
              {t('featurePage.analytics.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('featurePage.analytics.hero_subtitle')}
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{t('featurePage.analytics.hero_badge_compliance')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">{t('featurePage.analytics.hero_badge_realtime')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">{t('featurePage.analytics.hero_badge_multisite')}</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              {t('featurePage.analytics.hero_cta_demo')} <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/productos">
              {t('featurePage.analytics.hero_cta_modules')}
            </Button>
          </div>
        </div>

        <!-- KPI Cards mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{BRAND} — {t('featurePage.analytics.mockup_dashboard_title')}</span>
          </div>
          <!-- Filter bar mockup -->
          <div class="flex items-center gap-2 border-b border-border px-4 py-2 bg-muted/20">
            <Filter class="size-3 text-muted-foreground" />
            <span class="text-mockup-xs text-muted-foreground">{t('featurePage.analytics.mockup_filter_summary')}</span>
            <span class="ml-auto rounded bg-primary/10 px-2 py-0.5 text-mockup-2xs font-medium text-primary">{t('featurePage.analytics.mockup_filter_apply')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- KPI row -->
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div class="rounded-lg bg-muted/30 p-2.5 text-center">
                <p class="text-lg font-bold text-foreground">487</p>
                <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.analytics.mockup_kpi_students')}</p>
              </div>
              <div class="rounded-lg bg-destructive/5 p-2.5 text-center">
                <p class="text-lg font-bold text-destructive">7</p>
                <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.analytics.mockup_kpi_active_alerts')}</p>
              </div>
              <div class="rounded-lg bg-warning/5 p-2.5 text-center">
                <p class="text-lg font-bold text-warning-foreground">12</p>
                <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.analytics.mockup_kpi_pickups_today')}</p>
              </div>
              <div class="rounded-lg bg-success/5 p-2.5 text-center">
                <p class="text-lg font-bold text-success">98%</p>
                <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.analytics.mockup_kpi_compliance')}</p>
              </div>
            </div>
            <!-- Bar chart mockup -->
            <div class="mt-3">
              <p class="mb-2 text-mockup-2xs font-semibold uppercase tracking-wider text-muted-foreground">{t('featurePage.analytics.chart_observations_caption')}</p>
              <div class="flex items-end gap-1 h-16">
                {#each [
                  { labelKey: 'featurePage.analytics.month_mar' as const, h: 35, color: 'bg-primary/40' },
                  { labelKey: 'featurePage.analytics.month_apr' as const, h: 52, color: 'bg-primary/60' },
                  { labelKey: 'featurePage.analytics.month_may' as const, h: 41, color: 'bg-primary/40' },
                  { labelKey: 'featurePage.analytics.month_jun' as const, h: 68, color: 'bg-primary/80' },
                  { labelKey: 'featurePage.analytics.month_jul' as const, h: 29, color: 'bg-primary/30' },
                  { labelKey: 'featurePage.analytics.month_aug' as const, h: 55, color: 'bg-primary/60' },
                  { labelKey: 'featurePage.analytics.month_sep' as const, h: 72, color: 'bg-primary' },
                  { labelKey: 'featurePage.analytics.month_oct' as const, h: 63, color: 'bg-primary/70' },
                ] as bar}
                  <div class="flex flex-1 flex-col items-center gap-0.5">
                    <div class="w-full rounded-t {bar.color}" style="height: {bar.h}%"></div>
                    <span class="text-mockup-3xs text-muted-foreground">{t(bar.labelKey)}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — decisions over dashboards -->
  <EditorialSection
    id="analytics-editorial"
    eyebrow={t('featurePage.analytics.editorial.eyebrow')}
    statement={t('featurePage.analytics.editorial.statement')}
    body={t('featurePage.analytics.editorial.body')}
  />

  <!-- Charts section -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('featurePage.analytics.charts_eyebrow')}</p>
        <h2 class="mt-3 text-2xl text-foreground sm:text-3xl">{t('featurePage.analytics.charts_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.analytics.charts_subtitle')}</p>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2">

        <!-- Donut chart mockup -->
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-5">
            <ClipboardList class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.donut_title')}</h3>
          </div>
          <div class="flex items-center gap-6">
            <!-- Donut -->
            <div class="relative shrink-0 size-28">
              <svg viewBox="0 0 36 36" class="size-28 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--muted)" stroke-width="4" />
                <!-- Académico 32% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--primary)" stroke-width="4"
                  stroke-dasharray="28 88" stroke-dashoffset="0" />
                <!-- Conductual 24% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--destructive)" stroke-width="4"
                  stroke-dasharray="21 95" stroke-dashoffset="-28" />
                <!-- Emocional 20% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--warning)" stroke-width="4"
                  stroke-dasharray="18 98" stroke-dashoffset="-49" />
                <!-- Familiar 14% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--success)" stroke-width="4"
                  stroke-dasharray="12 104" stroke-dashoffset="-67" />
                <!-- Asistencia 10% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--muted-foreground)" stroke-width="4"
                  stroke-dasharray="9 107" stroke-dashoffset="-79" />
              </svg>
              <span class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-lg font-bold text-foreground">234</span>
                <span class="text-mockup-2xs text-muted-foreground">{t('featurePage.analytics.donut_total')}</span>
              </span>
            </div>
            <!-- Legend -->
            <div class="flex-1 space-y-2">
              {#each [
                { labelKey: 'featurePage.analytics.donut_cat_academic' as const, pct: '32%', color: 'bg-primary' },
                { labelKey: 'featurePage.analytics.donut_cat_behavioral' as const, pct: '24%', color: 'bg-destructive' },
                { labelKey: 'featurePage.analytics.donut_cat_emotional' as const, pct: '20%', color: 'bg-warning' },
                { labelKey: 'featurePage.analytics.donut_cat_family' as const, pct: '14%', color: 'bg-success' },
                { labelKey: 'featurePage.analytics.donut_cat_attendance' as const, pct: '10%', color: 'bg-muted-foreground' },
              ] as item}
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full shrink-0 {item.color}"></span>
                    <span class="text-xs text-muted-foreground">{t(item.labelKey)}</span>
                  </div>
                  <span class="text-xs font-semibold text-foreground">{item.pct}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Risk table mockup -->
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-5">
            <ShieldAlert class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.risk_table_title')}</h3>
          </div>
          <div class="space-y-2">
            <div class="grid grid-cols-[1fr_auto_auto] gap-2 text-mockup-2xs font-semibold uppercase tracking-wider text-muted-foreground px-1 pb-1 border-b border-border">
              <span>{t('featurePage.analytics.risk_table_col_student')}</span>
              <span class="text-center">{t('featurePage.analytics.risk_table_col_obs')}</span>
              <span class="text-center">{t('featurePage.analytics.risk_table_col_risk')}</span>
            </div>
            {#each [
              { name: 'Matías González H.', curso: '8°A', obs: 14, riskKey: 'featurePage.analytics.risk_level_high' as const, riskColor: 'bg-destructive/10 text-destructive' },
              { name: 'Sofía Carrasco M.', curso: '7°B', obs: 11, riskKey: 'featurePage.analytics.risk_level_high' as const, riskColor: 'bg-destructive/10 text-destructive' },
              { name: 'Diego Fuentes P.', curso: '6°A', obs: 8, riskKey: 'featurePage.analytics.risk_level_medium' as const, riskColor: 'bg-warning/10 text-warning-foreground' },
              { name: 'Catalina Vega R.', curso: '5°B', obs: 6, riskKey: 'featurePage.analytics.risk_level_medium' as const, riskColor: 'bg-warning/10 text-warning-foreground' },
              { name: 'Joaquín Soto N.', curso: '8°B', obs: 4, riskKey: 'featurePage.analytics.risk_level_low' as const, riskColor: 'bg-success/10 text-success' },
            ] as row}
              <div class="grid grid-cols-[1fr_auto_auto] gap-2 items-center rounded-lg px-1 py-1.5 hover:bg-muted transition-colors">
                <div>
                  <p class="text-xs font-medium text-foreground">{row.name}</p>
                  <p class="text-mockup-2xs text-muted-foreground">{row.curso}</p>
                </div>
                <span class="text-center text-sm font-bold text-foreground">{row.obs}</span>
                <span class="rounded-full px-2 py-0.5 text-mockup-2xs font-semibold {row.riskColor}">{t(row.riskKey)}</span>
              </div>
            {/each}
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Features grid -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.analytics.features_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.analytics.features_subtitle')}</p>
      </div>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <TrendingUp class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.feature_trends_title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('featurePage.analytics.feature_trends_body')}</p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <Users class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.feature_segmentation_title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('featurePage.analytics.feature_segmentation_body')}</p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <BarChart3 class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.feature_multisite_title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('featurePage.analytics.feature_multisite_body')}</p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <ShieldAlert class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.feature_compliance_title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('featurePage.analytics.feature_compliance_body')}</p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <ClipboardList class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.feature_export_title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('featurePage.analytics.feature_export_body')}</p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <Filter class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">{t('featurePage.analytics.feature_thresholds_title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('featurePage.analytics.feature_thresholds_body')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Por qué importa -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-3">
        <StatCard
          value="5.777"
          valueClass="text-primary"
          label={t('featurePage.analytics.stat_holders_label')}
          description={t('featurePage.analytics.stat_holders_body')}
        />
        <StatCard
          value="4%"
          valueClass="text-destructive"
          label={t('featurePage.analytics.stat_revenue_label')}
          description={t('featurePage.analytics.stat_revenue_body')}
        />
        <StatCard
          value="100%"
          valueClass="text-success"
          label={t('featurePage.analytics.stat_ownership_label')}
          description={t('featurePage.analytics.stat_ownership_body')}
        />
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="analytics-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-background/85">{t('featurePage.analytics.finalCta.eyebrow')}</p>
      <h2 id="analytics-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('featurePage.analytics.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.analytics.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.analytics.finalCta_btn_demo')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/productos"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.analytics.finalCta_btn_modules')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
