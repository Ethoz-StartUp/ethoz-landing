<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    CalendarClock, ArrowRight, ArrowLeft, Check,
    Upload, ListChecks, UserCheck, BellRing, Clock
  } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'protocolos-plazos' }); });

  const howSteps = [
    { icon: Upload, title: 'featurePage.protocolos.step1_title', desc: 'featurePage.protocolos.step1_desc' },
    { icon: ListChecks, title: 'featurePage.protocolos.step2_title', desc: 'featurePage.protocolos.step2_desc' },
    { icon: UserCheck, title: 'featurePage.protocolos.step3_title', desc: 'featurePage.protocolos.step3_desc' },
    { icon: BellRing, title: 'featurePage.protocolos.step4_title', desc: 'featurePage.protocolos.step4_desc' },
  ] as const;

  const types = [
    'featurePage.protocolos.type1',
    'featurePage.protocolos.type2',
    'featurePage.protocolos.type3',
    'featurePage.protocolos.type4',
    'featurePage.protocolos.type5',
    'featurePage.protocolos.type6',
  ] as const;

  const mockupSteps = [
    { title: 'featurePage.protocolos.mockup_step1', meta: 'featurePage.protocolos.mockup_step1_meta', status: 'done' },
    { title: 'featurePage.protocolos.mockup_step2', meta: 'featurePage.protocolos.mockup_step2_meta', status: 'done' },
    { title: 'featurePage.protocolos.mockup_step3', meta: 'featurePage.protocolos.mockup_step3_meta', status: 'due' },
    { title: 'featurePage.protocolos.mockup_step4', meta: 'featurePage.protocolos.mockup_step4_meta', status: 'pending' },
  ] as const;

  const trustPoints = [
    'featurePage.protocolos.trust_point1',
    'featurePage.protocolos.trust_point2',
    'featurePage.protocolos.trust_point3',
  ] as const;
</script>

<svelte:head>
  <title>{t('featurePage.protocolos.meta_title')}</title>
  <meta name="description" content={t('featurePage.protocolos.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/funcionalidades/protocolos-y-plazos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.protocolos.meta_title')} />
  <meta property="og:description" content={t('featurePage.protocolos.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.protocolos.meta_title')} />
  <meta name="twitter:description" content={t('featurePage.protocolos.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/funcionalidades/protocolos-y-plazos" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Protocolos y plazos"}]})}</script>`}
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
  <main id="main-content" class="flex-1">

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-8 sm:pt-28 sm:pb-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="-mt-3 mb-5 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.protocolos.back_to_products')}
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-4">
            <CalendarClock class="size-10 lg:size-12 shrink-0 text-primary" />
            <h1 class="page-title">
              {t('featurePage.protocolos.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('featurePage.protocolos.hero_subtitle')}
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-active">{t('featurePage.protocolos.badge_days')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-foreground">{t('featurePage.protocolos.badge_alerts')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/80">{t('featurePage.protocolos.badge_reglamento')}</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/auditoria">
              {t('featurePage.protocolos.hero_cta_primary')} <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/demo">
              {t('featurePage.protocolos.cta_demo')}
            </Button>
          </div>
        </div>

        <!-- Protocol run mockup (fictional data) -->
        <div aria-hidden="true" class="rounded-xl border border-border bg-card shadow-mockup">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{BRAND} · {t('featurePage.protocolos.mockup_window_title')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- Protocol header -->
            <div class="rounded-lg border border-foreground/10 bg-background px-3 py-2.5">
              <p class="text-mockup-xs font-semibold uppercase tracking-wider text-text-tertiary">{t('featurePage.protocolos.mockup_protocol_label')}</p>
              <p class="mt-0.5 truncate text-mockup-sm font-medium text-foreground">{t('featurePage.protocolos.mockup_protocol_value')}</p>
            </div>

            <!-- Steps with status -->
            <div class="mt-3 space-y-1.5">
              {#each mockupSteps as step (step.title)}
                <div class="flex items-start gap-2.5 rounded-lg bg-foreground/[0.03] p-2.5">
                  {#if step.status === 'done'}
                    <Check class="mt-0.5 size-3.5 shrink-0 text-success" />
                  {:else}
                    <Clock class="mt-0.5 size-3.5 shrink-0 {step.status === 'due' ? 'text-warning' : 'text-text-tertiary'}" />
                  {/if}
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-mockup-sm font-medium text-foreground/80">{t(step.title)}</p>
                      {#if step.status === 'done'}
                        <span class="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-mockup-xs font-semibold text-success">{t('featurePage.protocolos.mockup_status_done')}</span>
                      {:else if step.status === 'due'}
                        <span class="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 text-mockup-xs font-semibold text-warning-foreground">{t('featurePage.protocolos.mockup_status_due')}</span>
                      {:else}
                        <span class="shrink-0 rounded-full bg-foreground/5 px-2 py-0.5 text-mockup-xs font-semibold text-foreground/70">{t('featurePage.protocolos.mockup_status_pending')}</span>
                      {/if}
                    </div>
                    <p class="mt-0.5 text-mockup-xs text-text-tertiary">{t(step.meta)}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How it works: 4 steps -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.protocolos.how_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.protocolos.how_subtitle')}</p>
      </div>
      <ol class="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-foreground/10">
        {#each howSteps as step, i (step.title)}
          {@const StepIcon = step.icon}
          <li class="px-0 lg:px-6">
            <div class="flex items-baseline gap-3">
              <span data-numeric class="text-3xl font-medium leading-none text-foreground/30">0{i + 1}</span>
              <StepIcon class="size-4 shrink-0 self-center text-primary" />
            </div>
            <h3 class="mt-4 font-heading text-lg leading-tight text-foreground">{t(step.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(step.desc)}</p>
          </li>
        {/each}
      </ol>

      <!-- Engine capabilities -->
      <div class="mx-auto mt-12 max-w-4xl text-center">
        <h3 class="font-heading text-lg text-foreground">{t('featurePage.protocolos.types_title')}</h3>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
          {#each types as type (type)}
            <span class="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-card px-3 py-1.5 text-xs font-medium text-foreground/80">
              <ListChecks class="size-3 text-primary" />
              {t(type)}
            </span>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Deadlines trust band -->
  <section class="bg-secondary py-10 sm:py-12" aria-labelledby="trust-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <div>
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('featurePage.protocolos.trust_eyebrow')}</p>
          <h2 id="trust-heading" class="mt-2 text-balance text-2xl text-foreground sm:text-3xl">{t('featurePage.protocolos.trust_title')}</h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">{t('featurePage.protocolos.trust_subtitle')}</p>
        </div>
        <ul class="grid gap-3">
          {#each trustPoints as point (point)}
            <li class="flex items-start gap-3 rounded-xl border border-foreground/10 bg-card p-4">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm leading-relaxed text-muted-foreground">{t(point)}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="py-20 sm:py-24" aria-labelledby="protocolos-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('featurePage.protocolos.finalCta.eyebrow')}</p>
      <h2 id="protocolos-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-foreground sm:text-4xl">
        {t('featurePage.protocolos.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('featurePage.protocolos.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/auditoria"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-8 text-sm font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.protocolos.final_cta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-foreground/20 bg-transparent px-8 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.protocolos.final_cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  </main>
  <Footer />
</div>
