<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { slide } from 'svelte/transition';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    Check, Plus, Minus, ArrowRight,
    Users, Shield, Eye, Search, ClipboardList, BarChart3,
    Lock, FileText, MapPin, Bell,
    CalendarClock, FileSpreadsheet
  } from '@lucide/svelte';

  let openFaq = $state<number | null>(null);
  function toggleFaq(i: number) { openFaq = openFaq === i ? null : i; }

  $effect(() => { trackEvent('pricing_page_viewed'); });

  const modules = [
    { icon: Users, nameKey: 'getstarted.module.student_profile' as const },
    { icon: Shield, nameKey: 'getstarted.module.access_control' as const },
    { icon: MapPin, nameKey: 'getstarted.module.safe_pickups' as const },
    { icon: Search, nameKey: 'getstarted.module.smart_search' as const },
    { icon: Bell, nameKey: 'getstarted.module.alerts' as const },
    { icon: ClipboardList, nameKey: 'getstarted.module.convivencia' as const },
    { icon: BarChart3, nameKey: 'getstarted.module.dashboard' as const },
    { icon: FileText, nameKey: 'getstarted.module.audit' as const },
    { icon: Lock, nameKey: 'getstarted.module.compliance' as const },
    { icon: Eye, nameKey: 'getstarted.module.digital_book' as const },
  ];

  const faqItems = [
    { qKey: 'pricing.faq.q1' as const, aKey: 'pricing.faq.a1' as const },
    { qKey: 'pricing.faq.q2' as const, aKey: 'pricing.faq.a2' as const },
    { qKey: 'pricing.faq.q3' as const, aKey: 'pricing.faq.a3' as const },
    { qKey: 'pricing.faq.q4' as const, aKey: 'pricing.faq.a4' as const },
    { qKey: 'pricing.faq.q5' as const, aKey: 'pricing.faq.a5' as const },
    { qKey: 'pricing.faq.q6' as const, aKey: 'pricing.faq.a6' as const },
    { qKey: 'pricing.faq.q7' as const, aKey: 'pricing.faq.a7' as const },
    { qKey: 'pricing.faq.q8' as const, aKey: 'pricing.faq.a8' as const },
  ] as const;
</script>

<svelte:head>
  <title>{t('getstarted.meta.title')}</title>
  <meta name="description" content={t('getstarted.meta.description')} />
  <link rel="canonical" href="https://ethoz.cl/como-contratar" />
  <meta property="og:url" content="https://ethoz.cl/como-contratar" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('getstarted.meta.title')} />
  <meta property="og:description" content={t('getstarted.meta.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('getstarted.meta.title')} />
  <meta name="twitter:description" content={t('getstarted.meta.description')} />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": t(item.qKey),
      "acceptedAnswer": { "@type": "Answer", "text": t(item.aKey) }
    }))
  })}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Cómo contratar"}]})}</script>`}
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

  <!-- ═══ HERO — editorial ═══ -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
     <div class="max-w-3xl">
      <p class="page-eyebrow">
        <span class="text-primary">{t('getstarted.hero.eyebrow')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('getstarted.hero.eyebrow_meta')}</span>
      </p>
      <span class="page-title-rule" aria-hidden="true"></span>
      <h1 class="page-title">
        {t('getstarted.hero.title')}
      </h1>
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('getstarted.hero.subtitle')}
      </p>
      <p class="mt-6 inline-flex items-center gap-2 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">
        {t('getstarted.hero.badge')}
      </p>

      <!-- Timeline overview -->
      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('getstarted.timeline.step1_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('getstarted.timeline.step1_value')}</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('getstarted.timeline.step2_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('getstarted.timeline.step2_value')}</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('getstarted.timeline.step3_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('getstarted.timeline.step3_value')}</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('getstarted.timeline.step4_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('getstarted.timeline.step4_value')}</dd>
        </div>
      </dl>

      <div class="mt-10">
        <Button size="xl" href="/demo">
          {t('getstarted.hero.cta')}
          <ArrowRight class="size-4" />
        </Button>
      </div>
     </div>
    </div>
  </section>

  <!-- ═══ STEP 1: Conoce la plataforma ═══ -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('getstarted.step1.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl text-foreground sm:text-3xl">
            {t('getstarted.step1.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step1.desc')}
          </p>
          <Button size="lg" href="/demo" class="mt-6">
            {t('getstarted.step1.cta')}
            <ArrowRight class="size-4" />
          </Button>
        </div>
        <div class="flex justify-center">
          <!-- Product visualization: booking a demo slot (fictional data) -->
          <div class="w-full max-w-sm" role="img" aria-label={t('getstarted.step1.alt')}>
            <div class="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-mockup" aria-hidden="true">
              <div class="flex items-center justify-between gap-4 border-b border-foreground/10 px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-destructive"></span>
                  <span class="size-2 rounded-full bg-primary"></span>
                  <span class="size-2 rounded-full bg-success"></span>
                </div>
                <p class="truncate text-xs font-medium text-muted-foreground">{t('getstarted.viz1.chrome')}</p>
                <span class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">{t('home.demo_data_badge_short')}</span>
              </div>
              <div class="p-4">
                <p class="text-mockup-xs font-semibold uppercase tracking-wider text-primary">{t('getstarted.viz1.kicker')}</p>
                <p class="mt-0.5 font-heading text-base font-medium text-foreground">{t('getstarted.viz1.title')}</p>
                <div class="mt-3 space-y-1.5">
                  <div class="flex items-center justify-between rounded-lg border border-foreground/10 bg-background px-3 py-2">
                    <span class="text-xs font-medium text-foreground/80">{t('getstarted.viz1.slot1')}</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 px-3 py-2">
                    <span class="text-xs font-semibold text-foreground">{t('getstarted.viz1.slot2')}</span>
                    <span class="rounded-full bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">{t('getstarted.viz1.selected')}</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-foreground/10 bg-background px-3 py-2">
                    <span class="text-xs font-medium text-foreground/80">{t('getstarted.viz1.slot3')}</span>
                  </div>
                </div>
                <div class="mt-3 flex items-start gap-2.5 rounded-lg bg-foreground/[0.03] p-2.5">
                  <CalendarClock class="mt-0.5 size-4 shrink-0 text-primary" />
                  <div class="min-w-0">
                    <p class="text-xs font-medium text-foreground/80">{t('getstarted.viz1.confirm')}</p>
                    <p class="text-mockup-xs text-text-tertiary">{t('getstarted.viz1.confirm_meta')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ STEP 2: Elige tus módulos ═══ -->
  <section class="py-10 sm:py-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="order-2 flex justify-center lg:order-1">
          <!-- Product visualization: module configuration with toggles (fictional data) -->
          <div class="w-full max-w-sm" role="img" aria-label={t('getstarted.step2.alt')}>
            <div class="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-mockup" aria-hidden="true">
              <div class="flex items-center justify-between gap-4 border-b border-foreground/10 px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-destructive"></span>
                  <span class="size-2 rounded-full bg-primary"></span>
                  <span class="size-2 rounded-full bg-success"></span>
                </div>
                <p class="truncate text-xs font-medium text-muted-foreground">{t('getstarted.viz2.chrome')}</p>
                <span class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">{t('home.demo_data_badge_short')}</span>
              </div>
              <div class="p-4">
                <p class="text-mockup-xs font-semibold uppercase tracking-wider text-primary">{t('getstarted.viz2.kicker')}</p>
                <p class="mt-0.5 font-heading text-base font-medium text-foreground">{t('getstarted.viz2.title')}</p>
                <div class="mt-3 space-y-1.5">
                  {#each modules.slice(0, 5) as mod, i (mod.nameKey)}
                    {@const ModIcon = mod.icon}
                    {@const isOn = i < 3}
                    <div class="flex items-center gap-2.5 rounded-lg border border-foreground/10 bg-background px-3 py-2">
                      <ModIcon class="size-3.5 shrink-0 {isOn ? 'text-primary' : 'text-text-tertiary'}" />
                      <span class="min-w-0 flex-1 truncate text-xs font-medium {isOn ? 'text-foreground' : 'text-muted-foreground'}">{t(mod.nameKey)}</span>
                      <span class="sr-only">{isOn ? t('getstarted.viz2.state_on') : t('getstarted.viz2.state_off')}</span>
                      <span class="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full {isOn ? 'bg-primary' : 'bg-foreground/15'}">
                        <span class="absolute size-3 rounded-full bg-card {isOn ? 'left-3.5' : 'left-0.5'}"></span>
                      </span>
                    </div>
                  {/each}
                </div>
                <p class="mt-3 border-t border-foreground/10 pt-3 text-mockup-xs text-text-tertiary">{t('getstarted.viz2.footer')}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="order-1 lg:order-2">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('getstarted.step2.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl text-foreground sm:text-3xl">
            {t('getstarted.step2.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step2.desc')}
          </p>
          <div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {#each modules as mod}
              {@const Icon = mod.icon}
              <div class="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <Icon class="size-3.5 shrink-0 text-primary" />
                <span class="text-xs font-medium text-foreground">{t(mod.nameKey)}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ STEP 3: Migración ═══ -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('getstarted.step3.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl text-foreground sm:text-3xl">
            {t('getstarted.step3.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step3.desc')}
          </p>
          <ul class="mt-5 space-y-2">
            {#each ['getstarted.step3.item1', 'getstarted.step3.item2', 'getstarted.step3.item3', 'getstarted.step3.item4'] as itemKey}
              <li class="flex items-center gap-2.5">
                <Check class="size-4 shrink-0 text-primary" />
                <span class="text-sm text-muted-foreground">{t(itemKey as TranslationKey)}</span>
              </li>
            {/each}
          </ul>
        </div>
        <div class="flex justify-center">
          <!-- Product visualization: data migration progress (fictional data) -->
          <div class="w-full max-w-sm" role="img" aria-label={t('getstarted.step3.alt')}>
            <div class="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-mockup" aria-hidden="true">
              <div class="flex items-center justify-between gap-4 border-b border-foreground/10 px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-destructive"></span>
                  <span class="size-2 rounded-full bg-primary"></span>
                  <span class="size-2 rounded-full bg-success"></span>
                </div>
                <p class="truncate text-xs font-medium text-muted-foreground">{t('getstarted.viz3.chrome')}</p>
                <span class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">{t('home.demo_data_badge_short')}</span>
              </div>
              <div class="p-4">
                <p class="text-mockup-xs font-semibold uppercase tracking-wider text-primary">{t('getstarted.viz3.kicker')}</p>
                <p class="mt-0.5 font-heading text-base font-medium text-foreground">{t('getstarted.viz3.title')}</p>
                <div class="mt-3 space-y-1.5">
                  {#each [
                    { icon: FileSpreadsheet, name: 'getstarted.viz3.file1', meta: 'getstarted.viz3.file1_meta' },
                    { icon: FileSpreadsheet, name: 'getstarted.viz3.file2', meta: 'getstarted.viz3.file2_meta' },
                    { icon: FileText, name: 'getstarted.viz3.file3', meta: 'getstarted.viz3.file3_meta' },
                  ] as file (file.name)}
                    {@const FileIcon = file.icon}
                    <div class="flex items-center gap-2.5 rounded-lg border border-foreground/10 bg-background px-3 py-2">
                      <FileIcon class="size-4 shrink-0 text-primary" />
                      <div class="min-w-0 flex-1">
                        <p class="truncate font-mono text-mockup-xs font-medium text-foreground">{t(file.name as TranslationKey)}</p>
                        <p class="truncate text-mockup-xs text-text-tertiary">{t(file.meta as TranslationKey)}</p>
                      </div>
                      <Check class="size-3.5 shrink-0 text-success" />
                    </div>
                  {/each}
                </div>
                <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <div class="h-full w-full rounded-full bg-success"></div>
                </div>
                <p class="mt-2 flex items-center gap-1.5 text-mockup-xs font-medium text-foreground/80">
                  <Check class="size-3 text-success" />
                  {t('getstarted.viz3.done')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ STEP 4: En vivo ═══ -->
  <section class="py-10 sm:py-12 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="order-2 flex justify-center lg:order-1">
          <!-- Product visualization: school live on day one (fictional data) -->
          <div class="w-full max-w-sm" role="img" aria-label={t('getstarted.step4.alt')}>
            <div class="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-mockup" aria-hidden="true">
              <div class="flex items-center justify-between gap-4 border-b border-foreground/10 px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-destructive"></span>
                  <span class="size-2 rounded-full bg-primary"></span>
                  <span class="size-2 rounded-full bg-success"></span>
                </div>
                <p class="truncate text-xs font-medium text-muted-foreground">{t('getstarted.viz4.chrome')}</p>
                <span class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">{t('home.demo_data_badge_short')}</span>
              </div>
              <div class="p-4">
                <p class="text-mockup-xs font-semibold uppercase tracking-wider text-primary">{t('getstarted.viz4.kicker')}</p>
                <div class="mt-0.5 flex items-center gap-2">
                  <span class="relative flex size-2">
                    <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70"></span>
                    <span class="relative inline-flex size-2 rounded-full bg-success"></span>
                  </span>
                  <p class="font-heading text-base font-medium text-foreground">{t('getstarted.viz4.title')}</p>
                </div>
                <div class="mt-3 space-y-1.5">
                  {#each [
                    { icon: MapPin, text: 'getstarted.viz4.row1', meta: 'getstarted.viz4.row1_meta' },
                    { icon: ClipboardList, text: 'getstarted.viz4.row2', meta: 'getstarted.viz4.row2_meta' },
                    { icon: Lock, text: 'getstarted.viz4.row3', meta: 'getstarted.viz4.row3_meta' },
                  ] as row (row.text)}
                    {@const RowIcon = row.icon}
                    <div class="flex items-center gap-2.5 rounded-lg bg-foreground/[0.03] px-3 py-2.5">
                      <RowIcon class="size-4 shrink-0 text-primary" />
                      <p class="min-w-0 flex-1 truncate text-xs font-medium text-foreground/80">{t(row.text as TranslationKey)}</p>
                      <span class="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">{t(row.meta as TranslationKey)}</span>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="order-1 lg:order-2">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('getstarted.step4.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl text-foreground sm:text-3xl">
            {t('getstarted.step4.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step4.desc')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ FAQ ═══ -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-balance text-center text-2xl text-foreground sm:text-3xl">
        {t('pricing.faq.title')}
      </h2>

      <div class="mt-10 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
        {#each faqItems as item, i}
          <div>
            <button
              type="button"
              onclick={() => toggleFaq(i)}
              class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-muted/50"
              aria-expanded={openFaq === i}
            >
              <span class="text-sm font-semibold text-foreground">{t(item.qKey)}</span>
              {#if openFaq === i}
                <Minus class="size-4 shrink-0 text-muted-foreground" />
              {:else}
                <Plus class="size-4 shrink-0 text-muted-foreground" />
              {/if}
            </button>
            {#if openFaq === i}
              <div transition:slide={{ duration: 200 }} class="px-6 pb-5">
                <p class="text-sm leading-relaxed text-muted-foreground">{t(item.aKey)}</p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══ FINAL CTA — dark navy ═══ -->
  <section class="bg-secondary py-20 text-foreground sm:py-24" aria-labelledby="final-cta-getstarted">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('getstarted.final_cta.overline')}</p>
      <h2 id="final-cta-getstarted" class="mt-5 font-heading text-3xl leading-[1.15] text-foreground sm:text-4xl">
        {t('pricing.cta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-10 text-base font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('pricing.cta.primary')}
          <ArrowRight class="size-5" />
        </a>
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>
