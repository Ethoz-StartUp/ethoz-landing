<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t, getLocale } from '$lib/i18n/index.svelte';
  import { CLAIMS, type Claim } from '$lib/data/claims';
  import { BRAND } from '$lib/brand';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    Building2, ArrowRight, ArrowLeft, Check,
    ClipboardList, CalendarClock, FileCheck, Play
  } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'panel-sostenedor' }); });

  // Claims render per-locale display values (single source of truth: claims.ts).
  const claimValue = (claim: Claim) => (getLocale() === 'en' ? (claim.valueEn ?? claim.value) : claim.value);
  const claimDetail = (claim: Claim) => (getLocale() === 'en' ? (claim.detailEn ?? claim.detail) : claim.detail);

  const howSteps = [
    { icon: Play, title: 'featurePage.panel.step1_title', desc: 'featurePage.panel.step1_desc' },
    { icon: Building2, title: 'featurePage.panel.step2_title', desc: 'featurePage.panel.step2_desc' },
    { icon: CalendarClock, title: 'featurePage.panel.step3_title', desc: 'featurePage.panel.step3_desc' },
  ] as const;

  const schools = [
    { name: 'featurePage.panel.mockup_school1', status: 'featurePage.panel.mockup_school1_status', meta: 'featurePage.panel.mockup_school1_meta', tone: 'ok' },
    { name: 'featurePage.panel.mockup_school2', status: 'featurePage.panel.mockup_school2_status', meta: 'featurePage.panel.mockup_school2_meta', tone: 'risk' },
    { name: 'featurePage.panel.mockup_school3', status: 'featurePage.panel.mockup_school3_status', meta: 'featurePage.panel.mockup_school3_meta', tone: 'gap' },
  ] as const;

  const blocks = [
    { icon: ClipboardList, title: 'featurePage.panel.block1_title', desc: 'featurePage.panel.block1_desc' },
    { icon: CalendarClock, title: 'featurePage.panel.block2_title', desc: 'featurePage.panel.block2_desc' },
    { icon: FileCheck, title: 'featurePage.panel.block3_title', desc: 'featurePage.panel.block3_desc' },
  ] as const;
</script>

<svelte:head>
  <title>{t('featurePage.panel.meta_title')}</title>
  <meta name="description" content={t('featurePage.panel.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/funcionalidades/panel-sostenedor" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.panel.meta_title')} />
  <meta property="og:description" content={t('featurePage.panel.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.panel.meta_title')} />
  <meta name="twitter:description" content={t('featurePage.panel.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/funcionalidades/panel-sostenedor" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Panel del sostenedor"}]})}</script>`}
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
        {t('featurePage.panel.back_to_products')}
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-4">
            <Building2 class="size-10 lg:size-12 shrink-0 text-primary" />
            <h1 class="page-title">
              {t('featurePage.panel.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('featurePage.panel.hero_subtitle')}
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-active">{t('featurePage.panel.badge_network')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-foreground">{t('featurePage.panel.badge_risk')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/80">{t('featurePage.panel.badge_privacy')}</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/auditoria">
              {t('featurePage.panel.hero_cta_primary')} <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/demo">
              {t('featurePage.panel.cta_demo')}
            </Button>
          </div>
        </div>

        <!-- Network panel mockup (fictional data) -->
        <div aria-hidden="true" class="rounded-xl border border-border bg-card shadow-mockup">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{BRAND} · {t('featurePage.panel.mockup_window_title')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <div class="space-y-1.5">
              {#each schools as school (school.name)}
                <div class="rounded-lg bg-foreground/[0.03] p-3">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-mockup-sm font-medium text-foreground/80">{t(school.name)}</p>
                    {#if school.tone === 'ok'}
                      <span class="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-mockup-xs font-semibold text-success">{t(school.status)}</span>
                    {:else if school.tone === 'risk'}
                      <span class="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 text-mockup-xs font-semibold text-warning-foreground">{t(school.status)}</span>
                    {:else}
                      <span class="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-mockup-xs font-semibold text-destructive">{t(school.status)}</span>
                    {/if}
                  </div>
                  <p class="mt-0.5 text-mockup-xs text-text-tertiary">{t(school.meta)}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How it works: 3 steps -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.panel.how_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.panel.how_subtitle')}</p>
      </div>
      <ol class="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-foreground/10">
        {#each howSteps as step, i (step.title)}
          {@const StepIcon = step.icon}
          <li class="px-0 sm:px-6">
            <div class="flex items-baseline gap-3">
              <span data-numeric class="text-3xl font-medium leading-none text-foreground/30">0{i + 1}</span>
              <StepIcon class="size-4 shrink-0 self-center text-primary" />
            </div>
            <h3 class="mt-4 font-heading text-lg leading-tight text-foreground">{t(step.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(step.desc)}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- Court ruling band: patrimonial argument, figure from claims.ts -->
  <section class="bg-secondary py-10 sm:py-12" aria-labelledby="ruling-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-destructive/20 bg-card shadow-card-dark">
        <div class="flex items-center justify-between gap-3 border-b border-destructive/15 bg-destructive/5 px-5 py-2.5">
          <p class="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('featurePage.panel.ruling_eyebrow')}</p>
          <span class="shrink-0 rounded-full bg-destructive/10 px-2.5 py-0.5 text-mockup-xs font-semibold text-destructive">{CLAIMS.courtRuling.source}</span>
        </div>
        <div class="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center">
          <div>
            <p data-numeric class="font-heading text-4xl font-medium leading-none text-destructive sm:text-5xl">{claimValue(CLAIMS.courtRuling)}</p>
            <p class="mt-2 text-xs text-text-tertiary">{claimDetail(CLAIMS.courtRuling)}</p>
          </div>
          <div>
            <h2 id="ruling-heading" class="font-heading text-2xl font-medium leading-tight text-foreground">{t('featurePage.panel.ruling_title')}</h2>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t('featurePage.panel.ruling_body')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- What the operator sees -->
  <section class="py-10 sm:py-12" aria-labelledby="blocks-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 id="blocks-heading" class="text-2xl text-foreground sm:text-3xl">{t('featurePage.panel.blocks_title')}</h2>
      </div>
      <div class="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
        {#each blocks as block (block.title)}
          {@const BlockIcon = block.icon}
          <div class="rounded-xl border border-foreground/10 bg-card p-5 shadow-card-dark">
            <div class="flex items-center gap-3">
              <BlockIcon class="size-5 shrink-0 text-primary" />
              <h3 class="font-heading text-lg leading-tight text-foreground">{t(block.title)}</h3>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(block.desc)}</p>
          </div>
        {/each}
      </div>
      <p class="mx-auto mt-6 flex max-w-3xl items-start justify-center gap-2 text-center text-xs text-text-tertiary">
        <Check class="mt-0.5 size-3.5 shrink-0 text-primary" />
        {t('featurePage.panel.privacy_note')}
      </p>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="py-20 sm:py-24" aria-labelledby="panel-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('featurePage.panel.finalCta.eyebrow')}</p>
      <h2 id="panel-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-foreground sm:text-4xl">
        {t('featurePage.panel.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('featurePage.panel.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/auditoria"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-8 text-sm font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.panel.final_cta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-foreground/20 bg-transparent px-8 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.panel.final_cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  </main>
  <Footer />
</div>
