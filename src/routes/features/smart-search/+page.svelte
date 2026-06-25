<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { Button } from '$lib/components/ui/button';
  import {
    Search, ArrowRight, ArrowLeft, Zap, LayoutDashboard, Filter,
    AlertTriangle, BadgeCheck, Users, GraduationCap, Clock
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'smart-search' }); });

  // Simulated search states
  const searchExamples = [
    {
      query: 'maria jose',
      labelKey: 'featurePage.smartSearch.example_compound_label' as const,
      noteKey: 'featurePage.smartSearch.example_compound_note' as const,
      results: [
        { name: 'María José Pérez Soto', grade: '2° Medio A', teacher: 'Prof. Vargas', alert: null },
        { name: 'María José Contreras', grade: '5° Básico B', teacher: 'Prof. Fuentes', alert: '1 alerta' },
      ]
    },
    {
      query: 'gonzales',
      labelKey: 'featurePage.smartSearch.example_typo_label' as const,
      noteKey: 'featurePage.smartSearch.example_typo_note' as const,
      results: [
        { name: 'Matías González Pérez', grade: '8° Básico A', teacher: 'Prof. Herrera', alert: '2 alertas' },
        { name: 'Fernanda González Rojas', grade: '1° Medio C', teacher: 'Prof. Díaz', alert: null },
        { name: 'Tomás González Vidal', grade: 'Pre-kinder', teacher: 'Tía Morales', alert: null },
      ]
    },
    {
      query: '7b',
      labelKey: 'featurePage.smartSearch.example_course_label' as const,
      noteKey: 'featurePage.smartSearch.example_course_note' as const,
      results: [
        { name: 'Valentina Rojas Sepúlveda', grade: '7° Básico B', teacher: 'Prof. González', alert: null },
        { name: 'Benjamín Torres Muñoz', grade: '7° Básico B', teacher: 'Prof. González', alert: null },
        { name: 'Isidora Castro Lagos', grade: '7° Básico B', teacher: 'Prof. González', alert: '1 alerta' },
      ]
    },
  ];

  let activeExample = $state(0);
  const current = $derived(searchExamples[activeExample]);
</script>

<svelte:head>
  <title>{BRAND} · {t('features.search.title')}</title>
  <meta name="description" content={t('featurePage.smartSearch.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/features/smart-search" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${BRAND} · Búsqueda Instantánea y Dashboard Inteligente`} />
  <meta property="og:description" content={t('featurePage.smartSearch.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${BRAND} · Búsqueda Instantánea y Dashboard Inteligente`} />
  <meta name="twitter:description" content={t('featurePage.smartSearch.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/features/smart-search" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Búsqueda Inteligente"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/#features" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.smartSearch.back_to_features')}
      </a>
      <div class="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-4">
          <div class="flex items-center gap-3">
            <Search class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-foreground">
              {t('features.search.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.search.desc')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.smartSearch.hero_bullet1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.smartSearch.hero_bullet2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.smartSearch.hero_bullet3')}
            </li>
          </ul>

          <!-- Example selector -->
          <div class="mt-6 space-y-2">
            <p id="search-example-label" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('featurePage.smartSearch.try_examples_label')}</p>
            <div class="flex flex-wrap gap-2" role="group" aria-labelledby="search-example-label">
              {#each searchExamples as ex, i}
                <button
                  type="button"
                  onclick={() => activeExample = i}
                  aria-pressed={activeExample === i}
                  aria-label={`${t('featurePage.smartSearch.example_aria_prefix')} ${t(ex.labelKey)}`}
                  class="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors {activeExample === i ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}"
                >
                  "{ex.query}"
                </button>
              {/each}
            </div>
          </div>
        </div>

        <!-- Search mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.smartSearch.mockup_titlebar')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- Search bar -->
            <div class="flex items-center gap-2 rounded-lg border border-primary/40 bg-background px-3 py-2 mb-1 shadow-sm">
              <Search class="size-3.5 shrink-0 text-muted-foreground" />
              <span class="text-xs text-foreground font-medium">{current.query}</span>
              <span class="animate-pulse text-xs text-primary ml-0.5">|</span>
            </div>
            <p class="mb-3 text-mockup-2xs text-muted-foreground pl-1">{t(current.noteKey)}</p>

            <!-- Results -->
            <div class="space-y-1">
              {#each current.results as result, i}
                <div class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 {i === 0 ? 'bg-primary/5' : 'hover:bg-muted/40'} transition-colors">
                  <div class="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <GraduationCap class="size-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-mockup-sm font-medium text-foreground">{result.name}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{result.grade} · {result.teacher}</p>
                  </div>
                  {#if result.alert}
                    <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-mockup-3xs font-semibold text-warning-foreground">
                      <AlertTriangle class="size-2.5" />
                      {result.alert}
                    </span>
                  {:else}
                    <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-mockup-3xs font-medium text-success">
                      {t('featurePage.smartSearch.no_alerts')}
                    </span>
                  {/if}
                </div>
              {/each}
            </div>
            <p class="mt-2.5 text-center text-mockup-2xs text-muted-foreground">{current.results.length} {current.results.length !== 1 ? t('featurePage.smartSearch.results_plural') : t('featurePage.smartSearch.results_singular')} · 0.03s · {t('featurePage.smartSearch.sample_school_concepcion')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — speed as safety -->
  <EditorialSection
    id="search-editorial"
    eyebrow={t('featurePage.smartSearch.editorial.eyebrow')}
    statement={t('featurePage.smartSearch.editorial.statement')}
    body={t('featurePage.smartSearch.editorial.body')}
  />

  <!-- Dashboard mockup section -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <h2 class="text-xl text-foreground sm:text-2xl">{t('featurePage.smartSearch.dashboard_title')}</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('featurePage.smartSearch.dashboard_body1')}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('featurePage.smartSearch.dashboard_body2')}
          </p>
          <ul class="mt-5 space-y-2">
            {#each [
              'featurePage.smartSearch.dashboard_list_filter',
              'featurePage.smartSearch.dashboard_list_sort',
              'featurePage.smartSearch.dashboard_list_export',
            ] as const as item}
              <li class="flex items-start gap-2 text-sm text-muted-foreground">
                <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
                {t(item)}
              </li>
            {/each}
          </ul>
        </div>

        <!-- Dashboard mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <LayoutDashboard class="size-4 text-primary" />
              <span class="text-sm font-semibold text-foreground">{t('featurePage.smartSearch.dashboard_mockup_title')}</span>
            </div>
            <span class="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-mockup-xs font-semibold text-warning-foreground">
              <AlertTriangle class="size-3" /> 4 {t('featurePage.smartSearch.alerts_word')}
            </span>
          </div>
          <div class="divide-y divide-border">
            {#each [
              { name: 'Matías González Pérez', grade: '8° Básico A', alerts: ['featurePage.smartSearch.alert_pickup_restriction', 'featurePage.smartSearch.alert_medical'] as const, urgent: true },
              { name: 'Isidora Castro Lagos', grade: '7° Básico B', alerts: ['featurePage.smartSearch.alert_tardies_month'] as const, urgent: false },
              { name: 'Sebastián Muñoz Vera', grade: '1° Medio C', alerts: ['featurePage.smartSearch.alert_conduct_pending'] as const, urgent: false },
              { name: 'Valentín Araya Torres', grade: '3° Medio A', alerts: ['featurePage.smartSearch.alert_observation_active'] as const, urgent: false },
            ] as row}
              <div class="flex items-center gap-3 px-4 py-2.5">
                <div class="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <GraduationCap class="size-3.5 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-foreground">{row.name}</p>
                  <p class="text-mockup-xs text-muted-foreground">{row.grade}</p>
                </div>
                <div class="flex flex-col items-end gap-1">
                  {#each row.alerts as alert}
                    <span class="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-mockup-3xs font-medium {row.urgent ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning-foreground'}">
                      {t(alert)}
                    </span>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
          <div class="px-4 py-2.5 border-t border-border bg-muted/20">
            <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.smartSearch.dashboard_mockup_footer')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <Zap class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.smartSearch.card_typo_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet1')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <LayoutDashboard class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.smartSearch.card_dashboard_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet2')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <Filter class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.smartSearch.card_filters_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="search-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-background/85">{t('featurePage.smartSearch.finalCta.eyebrow')}</p>
      <h2 id="search-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('featurePage.smartSearch.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.smartSearch.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.smartSearch.cta_demo')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/#features"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.smartSearch.cta_all_features')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
