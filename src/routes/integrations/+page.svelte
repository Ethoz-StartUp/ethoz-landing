<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ArrowRight, Upload, Database, Check, Zap, Building } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { t } from '$lib/i18n/index.svelte';

  $effect(() => { trackEvent('integrations_page_viewed'); });
</script>

<svelte:head>
  <title>{t('integrations.meta_title')}</title>
  <meta name="description" content={t('integrations.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/integrations" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('integrations.meta_title')} />
  <meta property="og:description" content={t('integrations.meta_og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('integrations.meta_title')} />
  <meta name="twitter:description" content={t('integrations.meta_twitter_description')} />
  <link rel="canonical" href="https://ethoz.cl/integrations" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Integraciones"}]})}</script>`}
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

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          <span class="text-primary">{t('integrations.eyebrow')}</span>
          <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
          <span>Napsis · Syscol · SchoolTrack · Lirmi</span>
        </p>
        <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
        <h1 class="mt-6 font-heading text-[2rem] leading-[1.15] text-foreground sm:text-[2.5rem] lg:text-[3rem]">
          {t('integrations.hero_title')}
        </h1>
        <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t('integrations.hero_subtitle')}
        </p>
      </div>
    </div>
  </section>

  <!-- Option 1: Integration -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary">01</span>
          <h2 class="mt-1.5 text-2xl text-foreground sm:text-3xl">
            {t('integrations.opt1_title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('integrations.opt1_body')}
          </p>
          <div class="mt-6 space-y-3">
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt1_bullet1')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt1_bullet2')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt1_bullet3')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt1_bullet4')}</span>
            </div>
          </div>
        </div>

        <!-- Visual: compatible systems -->
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p class="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('integrations.compatible_systems_label')}</p>
          <div class="space-y-3">
            {#each [
              { name: 'Napsis', descKey: 'integrations.system_napsis_desc' as const, status: 'available', statusLabelKey: 'integrations.status_available' as const },
              { name: 'Syscol', descKey: 'integrations.system_syscol_desc' as const, status: 'available', statusLabelKey: 'integrations.status_available' as const },
              { name: 'SchoolTrack', descKey: 'integrations.system_schooltrack_desc' as const, status: 'available', statusLabelKey: 'integrations.status_available' as const },
              { name: 'SIGE / MINEDUC', descKey: 'integrations.system_sige_desc' as const, status: 'in_dev', statusLabelKey: 'integrations.status_in_dev' as const },
              { name: 'Excel / CSV', descKey: 'integrations.system_excel_desc' as const, status: 'available', statusLabelKey: 'integrations.status_available' as const },
            ] as system}
              <div class="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-foreground">{system.name}</p>
                  <p class="text-xs text-muted-foreground">{t(system.descKey)}</p>
                </div>
                <span class="shrink-0 rounded-full px-2.5 py-0.5 text-mockup-xs font-medium {system.status === 'available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning-foreground'}">
                  {t(system.statusLabelKey)}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Option 2: All-in-one -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <!-- Visual: basic module -->
        <div class="order-2 lg:order-1">
          <div class="rounded-xl border border-border bg-card p-6 shadow-sm" aria-hidden="true">
            <div class="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <div class="size-2.5 rounded-full bg-destructive/60"></div>
              <div class="size-2.5 rounded-full bg-warning/60"></div>
              <div class="size-2.5 rounded-full bg-success/60"></div>
              <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('integrations.basic_module_card_label')}</span>
            </div>
            <div class="space-y-2.5">
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">{t('integrations.basic_feature_logbook')}</span>
                <Check class="size-3.5 text-success" />
              </div>
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">{t('integrations.basic_feature_attendance')}</span>
                <Check class="size-3.5 text-success" />
              </div>
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">{t('integrations.basic_feature_circular30')}</span>
                <Check class="size-3.5 text-success" />
              </div>
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">{t('integrations.basic_feature_sige_export')}</span>
                <Check class="size-3.5 text-success" />
              </div>
            </div>
            <p class="mt-4 text-center text-mockup-xs text-muted-foreground">{t('integrations.basic_module_included_note')}</p>
          </div>
        </div>

        <div class="order-1 lg:order-2">
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary">02</span>
          <h2 class="mt-1.5 text-2xl text-foreground sm:text-3xl">
            {t('integrations.opt2_title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('integrations.opt2_body')}
          </p>
          <div class="mt-6 space-y-3">
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt2_bullet1')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt2_bullet2')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt2_bullet3')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">{t('integrations.opt2_bullet4')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Migration -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <div class="flex items-center justify-center gap-3">
        <Upload class="size-5 text-primary" />
        <h2 class="text-2xl text-foreground sm:text-3xl">{t('integrations.migration_title')}</h2>
      </div>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        {t('integrations.migration_body')}
      </p>
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="flex items-center gap-2.5">
            <Database class="size-5 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">{t('integrations.migration_card1_title')}</p>
          </div>
          <p class="mt-2 text-xs text-muted-foreground">{t('integrations.migration_card1_desc')}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="flex items-center gap-2.5">
            <Zap class="size-5 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">{t('integrations.migration_card2_title')}</p>
          </div>
          <p class="mt-2 text-xs text-muted-foreground">{t('integrations.migration_card2_desc')}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="flex items-center gap-2.5">
            <Building class="size-5 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">{t('integrations.migration_card3_title')}</p>
          </div>
          <p class="mt-2 text-xs text-muted-foreground">{t('integrations.migration_card3_desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-2xl text-foreground sm:text-3xl">{t('integrations.cta_title')}</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        {t('integrations.cta_body')}
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" href="/demo">
          {t('integrations.cta_primary')} <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" href="/productos">
          {t('integrations.cta_secondary')}
        </Button>
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>
