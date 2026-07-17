<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { AUDIT_PRICE_DISPLAY, AUDIT_PRICE_DISPLAY_EN, AUDIT_PRICE_IS_PLACEHOLDER } from '$lib/data/claims';
  import { getLocale, t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ArrowRight,
    Scale,
    FileSearch,
    ClipboardCheck,
    BadgeCheck,
    AlertTriangle,
    Building2
  } from '@lucide/svelte';

  $effect(() => { trackEvent('audit_page_viewed', {}); });

  const priceDisplay = $derived(getLocale() === 'en' ? AUDIT_PRICE_DISPLAY_EN : AUDIT_PRICE_DISPLAY);

  const includes = [
    { icon: Scale, title: 'auditoria.item1_title', desc: 'auditoria.item1_desc' },
    { icon: FileSearch, title: 'auditoria.item2_title', desc: 'auditoria.item2_desc' },
    { icon: ClipboardCheck, title: 'auditoria.item3_title', desc: 'auditoria.item3_desc' },
    { icon: BadgeCheck, title: 'auditoria.item4_title', desc: 'auditoria.item4_desc' },
  ] as const;

  const mockRows = [
    { text: 'auditoria.mock_item1', tag: 'auditoria.mock_item1_tag', high: true },
    { text: 'auditoria.mock_item2', tag: 'auditoria.mock_item2_tag', high: false },
    { text: 'auditoria.mock_item3', tag: 'auditoria.mock_item3_tag', high: false },
    { text: 'auditoria.mock_item4', tag: 'auditoria.mock_item4_tag', high: true },
  ] as const;

  const steps = [
    { label: 'auditoria.step1_label', title: 'auditoria.step1_title', desc: 'auditoria.step1_desc' },
    { label: 'auditoria.step2_label', title: 'auditoria.step2_title', desc: 'auditoria.step2_desc' },
    { label: 'auditoria.step3_label', title: 'auditoria.step3_title', desc: 'auditoria.step3_desc' },
  ] as const;
</script>

<svelte:head>
  <title>{t('auditoria.meta.title')}</title>
  <meta name="description" content={t('auditoria.meta.description')} />
  {#if AUDIT_PRICE_IS_PLACEHOLDER}
    <!-- Gate de publicación (PIVOTE-PLAN L1): sin precio fijado, la página no se indexa. -->
    <meta name="robots" content="noindex" />
  {/if}
  <meta property="og:url" content="https://ethoz.cl/auditoria" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('auditoria.meta.title')} />
  <meta property="og:description" content={t('auditoria.meta.description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('auditoria.meta.title')} />
  <meta name="twitter:description" content={t('auditoria.meta.description')} />
  <link rel="canonical" href="https://ethoz.cl/auditoria" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content" class="flex flex-1 flex-col">

  <!-- ═══ Hero — the offer, its price frame, and one action ═══ -->
  <section class="relative isolate overflow-hidden bg-background pt-24 sm:pt-28 lg:pt-32">
    <div class="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/10 blur-[90px]" aria-hidden="true"></div>

    <div class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <p class="eyebrow">{t('auditoria.eyebrow')}</p>
        <h1 class="page-title mt-4 text-balance">{t('auditoria.title')}</h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t('auditoria.subtitle')}
        </p>

        {#if AUDIT_PRICE_IS_PLACEHOLDER}
          <p class="mx-auto mt-8 max-w-md text-sm text-muted-foreground">{t('auditoria.price_tbd')}</p>
        {:else}
          <div class="mx-auto mt-8 inline-flex flex-col items-center gap-2 rounded-2xl border border-foreground/10 bg-card px-8 py-5 shadow-card-dark">
            <p class="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t('auditoria.price_label')}</p>
            <p data-numeric class="font-heading text-2xl font-medium text-foreground sm:text-3xl">{priceDisplay}</p>
            <p class="text-xs text-text-tertiary">{t('auditoria.price_note')}</p>
          </div>
        {/if}

        <p class="mt-5 text-sm font-semibold text-primary-active">{t('auditoria.slots_badge')}</p>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="xl"
            href="/agendar"
            onclick={() => trackEvent('audit_cta_clicked', { location: 'hero' })}
            class="w-full justify-center sm:w-auto"
          >
            {t('auditoria.cta_primary')}
            <ArrowRight class="size-5" />
          </Button>
          <Button variant="outline" size="xl" href="/contacto" class="w-full justify-center sm:w-auto">
            {t('auditoria.cta_secondary')}
          </Button>
        </div>

        <p class="mt-3 text-xs font-medium text-muted-foreground">{t('auditoria.cta_microcopy')}</p>
      </div>
    </div>
  </section>

  <!-- ═══ What it includes — 4 deliverables ═══ -->
  <section class="section-editorial bg-card" aria-labelledby="includes-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow mb-4">{t('auditoria.includes_eyebrow')}</p>
        <h2 id="includes-heading" class="text-balance text-foreground">{t('auditoria.includes_title')}</h2>
        <p class="mt-4 text-lg text-muted-foreground">{t('auditoria.includes_subtitle')}</p>
      </div>

      <div class="mx-auto mt-6 sm:mt-8 grid max-w-5xl gap-3 sm:grid-cols-2">
        {#each includes as item (item.title)}
          {@const ItemIcon = item.icon}
          <div class="rounded-2xl border border-foreground/10 bg-background p-5 shadow-card-dark">
            <div class="flex items-center gap-3">
              <ItemIcon class="size-5 shrink-0 text-primary" />
              <h3 class="font-heading text-lg leading-tight text-foreground">{t(item.title)}</h3>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══ Sample deliverable — mock report, fictional data ═══ -->
  <section class="section-editorial bg-background" aria-labelledby="sample-heading">
    <div class="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
      <div>
        <p class="eyebrow mb-4">{t('auditoria.sample_eyebrow')}</p>
        <h2 id="sample-heading" class="text-balance text-foreground">{t('auditoria.sample_title')}</h2>
        <p class="mt-4 text-lg leading-relaxed text-muted-foreground">{t('auditoria.sample_desc')}</p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-mockup" aria-label={t('auditoria.mock_title')}>
        <div class="flex items-center justify-between gap-4 border-b border-foreground/10 bg-surface-soft px-4 py-3">
          <p class="truncate text-sm font-semibold text-foreground">{t('auditoria.mock_title')}</p>
          <span class="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-active">
            {t('auditoria.mock_badge')}
          </span>
        </div>
        <div class="divide-y divide-foreground/10">
          {#each mockRows as row (row.text)}
            <div class="flex items-start justify-between gap-4 px-4 py-3.5">
              <div class="flex items-start gap-3">
                <AlertTriangle class="mt-0.5 size-4 shrink-0 {row.high ? 'text-destructive' : 'text-warning'}" />
                <p class="text-sm font-medium leading-snug text-foreground">{t(row.text)}</p>
              </div>
              <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold {row.high ? 'bg-destructive/10 text-foreground' : 'bg-warning/10 text-foreground'}">
                {t(row.tag)}
              </span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ How it runs — 2 weeks, 3 milestones ═══ -->
  <section class="section-editorial bg-background" aria-labelledby="timeline-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow mb-4">{t('auditoria.timeline_eyebrow')}</p>
        <h2 id="timeline-heading" class="text-balance text-foreground">{t('auditoria.timeline_title')}</h2>
      </div>

      <ol class="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-foreground/10">
        {#each steps as step, i (step.title)}
          <li class="px-0 sm:px-6">
            <div class="flex items-baseline gap-3">
              <span data-numeric class="text-3xl font-medium leading-none text-foreground/30">0{i + 1}</span>
              <span class="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{t(step.label)}</span>
            </div>
            <h3 class="mt-4 font-heading text-lg leading-tight text-foreground">{t(step.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(step.desc)}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- ═══ Who it is for ═══ -->
  <section class="border-y border-foreground/5 bg-card py-8 sm:py-10" aria-labelledby="who-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
        <div class="flex items-center gap-3">
          <Building2 class="size-6 shrink-0 text-primary" />
          <p class="eyebrow">{t('auditoria.who_eyebrow')}</p>
        </div>
        <div>
          <h2 id="who-heading" class="font-heading text-2xl font-medium leading-tight text-foreground sm:text-3xl">{t('auditoria.who_title')}</h2>
          <p class="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{t('auditoria.who_desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ Closing CTA ═══ -->
  <section class="relative isolate overflow-hidden bg-background py-10 md:py-12" id="cta" aria-labelledby="audit-cta-heading">
    <div class="pointer-events-none absolute inset-0 bg-primary/5 blur-[80px]" aria-hidden="true"></div>
    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl text-center">
        <h2 id="audit-cta-heading" class="text-balance text-foreground">{t('auditoria.final_title')}</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t('auditoria.final_desc')}</p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="xl"
            href="/agendar"
            onclick={() => trackEvent('audit_cta_clicked', { location: 'final_cta' })}
          >
            {t('auditoria.cta_primary')}
            <ArrowRight class="size-5" />
          </Button>
        </div>
        <p class="mt-4 text-xs font-medium text-muted-foreground">{t('auditoria.cta_microcopy')}</p>
      </div>
    </div>
  </section>

  </main>

  <Footer />
</div>
