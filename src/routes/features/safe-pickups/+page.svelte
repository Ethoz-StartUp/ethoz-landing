<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { Button } from '$lib/components/ui/button';
  import {
    Bell, ArrowRight, ArrowLeft, ShieldCheck, Ban, BellRing,
    UserCheck, AlertTriangle, Clock, CheckCircle, XCircle, MapPin, BadgeCheck
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'safe-pickups' }); });

  let showBlocked = $state(false);
</script>

<svelte:head>
  <title>{BRAND} — {t('features.pickup.title')}</title>
  <meta name="description" content={t('featurePage.safePickups.meta.description')} />
  <meta property="og:url" content="https://ethoz.cl/features/safe-pickups" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.safePickups.meta.og_title')} />
  <meta property="og:description" content={t('featurePage.safePickups.meta.description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.safePickups.meta.og_title')} />
  <meta name="twitter:description" content={t('featurePage.safePickups.meta.description')} />
  <link rel="canonical" href="https://ethoz.cl/features/safe-pickups" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Retiros Escolares Seguros"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/#features" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.safePickups.hero.back_link')}
      </a>
      <div class="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="flex items-center gap-3">
            <Bell class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-foreground">
              {t('features.pickup.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.pickup.desc')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.safePickups.hero.bullet1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.safePickups.hero.bullet2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.safePickups.hero.bullet3')}
            </li>
          </ul>

          <!-- Toggle demo states -->
          <div class="mt-6 flex items-center gap-3" role="group" aria-label={t('a11y.mockup.toggle_group')}>
            <button
              type="button"
              onclick={() => showBlocked = false}
              aria-pressed={!showBlocked}
              class="text-xs font-medium px-3 py-2 sm:py-1.5 rounded-full border transition-colors {!showBlocked ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}"
            >
              {t('featurePage.safePickups.hero.toggle_authorized')}
            </button>
            <button
              type="button"
              onclick={() => showBlocked = true}
              aria-pressed={showBlocked}
              class="text-xs font-medium px-3 py-2 sm:py-1.5 rounded-full border transition-colors {showBlocked ? 'bg-destructive text-destructive-foreground border-destructive' : 'border-border text-muted-foreground hover:text-foreground'}"
            >
              {t('featurePage.safePickups.hero.toggle_blocked')}
            </button>
          </div>
        </div>

        <!-- Mockup: verification screen -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.safePickups.mockup.window_title')}</span>
          </div>
          <div class="p-4 sm:p-5">
            {#if !showBlocked}
              <!-- Authorized state -->
              <div class="flex items-center gap-3 rounded-lg bg-success/5 border border-success/20 px-3 py-2.5 mb-4">
                <CheckCircle class="size-4 shrink-0 text-success" />
                <div>
                  <p class="text-xs font-bold text-success">{t('featurePage.safePickups.mockup.authorized_badge')}</p>
                  <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.safePickups.mockup.authorized_subtitle')}</p>
                </div>
              </div>
              <div class="flex gap-3">
                <img src="/images/people/apoderado-madre.webp" alt={t('featurePage.safePickups.mockup.authorized_photo_alt')} class="size-14 rounded-full object-cover ring-2 ring-success/30" loading="lazy" decoding="async" />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-foreground">María Sepúlveda Contreras</p>
                  <p class="text-mockup-sm text-muted-foreground">RUT 12.345.678-9 · {t('featurePage.safePickups.mockup.relation_mother')}</p>
                  <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.safePickups.mockup.label_student_f')}</span> Valentina Rojas</p>
                    <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.safePickups.mockup.label_grade')}</span> 7° Básico B</p>
                    <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.safePickups.mockup.label_pickups_6m')}</span> 12</p>
                    <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.safePickups.mockup.label_last')}</span> {t('featurePage.safePickups.mockup.value_yesterday_1530')}</p>
                  </div>
                </div>
              </div>
            {:else}
              <!-- Blocked state -->
              <div class="flex items-center gap-3 rounded-lg bg-destructive/5 border border-destructive/30 px-3 py-2.5 mb-4">
                <XCircle class="size-4 shrink-0 text-destructive" />
                <div>
                  <p class="text-xs font-bold text-destructive">{t('featurePage.safePickups.mockup.blocked_badge')}</p>
                  <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.safePickups.mockup.blocked_subtitle')}</p>
                </div>
              </div>
              <div class="flex gap-3">
                <div class="size-14 rounded-full bg-destructive/10 flex items-center justify-center ring-2 ring-destructive/20">
                  <Ban class="size-6 text-destructive" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-foreground">Ricardo González Vidal</p>
                  <p class="text-mockup-sm text-muted-foreground">RUT 9.876.543-2 · {t('featurePage.safePickups.mockup.relation_father')}</p>
                  <div class="mt-2 rounded-lg bg-destructive/5 border border-destructive/20 px-2 py-1.5">
                    <p class="text-mockup-xs font-semibold text-destructive">{t('featurePage.safePickups.mockup.blocked_reason')}</p>
                    <p class="text-mockup-2xs text-muted-foreground mt-0.5">{t('featurePage.safePickups.mockup.blocked_detail')}</p>
                  </div>
                </div>
              </div>
            {/if}

            <!-- History list -->
            <div class="mt-4 border-t border-border pt-3 space-y-1.5">
              <p class="text-mockup-2xs font-semibold uppercase tracking-wider text-muted-foreground">{t('featurePage.safePickups.mockup.history_title')}</p>
              <div class="flex items-center gap-2 text-mockup-xs">
                <span class="size-1.5 rounded-full bg-success"></span>
                <span class="flex-1 text-muted-foreground">{t('featurePage.safePickups.mockup.history_row1')}</span>
                <span class="text-mockup-2xs text-muted-foreground">{t('featurePage.safePickups.mockup.gate_north')}</span>
              </div>
              <div class="flex items-center gap-2 text-mockup-xs">
                <span class="size-1.5 rounded-full bg-success"></span>
                <span class="flex-1 text-muted-foreground">{t('featurePage.safePickups.mockup.history_row2')}</span>
                <span class="text-mockup-2xs text-muted-foreground">{t('featurePage.safePickups.mockup.gate_north')}</span>
              </div>
              <div class="flex items-center gap-2 text-mockup-xs">
                <span class="size-1.5 rounded-full bg-destructive"></span>
                <span class="flex-1 text-muted-foreground">{t('featurePage.safePickups.mockup.history_row3')}</span>
                <span class="text-mockup-2xs text-muted-foreground">{t('featurePage.safePickups.mockup.gate_main')}</span>
              </div>
              <div class="flex items-center gap-2 text-mockup-xs">
                <span class="size-1.5 rounded-full bg-success"></span>
                <span class="flex-1 text-muted-foreground">{t('featurePage.safePickups.mockup.history_row4')}</span>
                <span class="text-mockup-2xs text-muted-foreground">{t('featurePage.safePickups.mockup.gate_north')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — thesis on why pickup is the load-bearing moment -->
  <section class="py-12 sm:py-14" aria-labelledby="pickup-editorial">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p id="pickup-editorial" class="mt-6 text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('featurePage.safePickups.editorial.eyebrow')}</p>
      <blockquote class="mt-5 font-heading text-2xl leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
        {t('featurePage.safePickups.editorial.statement')}
      </blockquote>
      <p class="mt-6 text-sm text-muted-foreground">
        {t('featurePage.safePickups.editorial.body')}
      </p>
    </div>
  </section>

  <!-- How it works: 3 steps -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="mb-2 text-sm font-bold uppercase tracking-widest text-primary">{t('featurePage.safePickups.howItWorks.eyebrow')}</p>
      <h2 class="mb-2 text-xl text-foreground sm:text-2xl">{t('featurePage.safePickups.howItWorks.title')}</h2>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        {t('featurePage.safePickups.howItWorks.intro')}
      </p>
      <div class="grid gap-6 sm:grid-cols-3">
        <div class="group rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <span class="font-heading block text-4xl tabular-nums leading-none text-primary transition-colors group-hover:text-foreground">01</span>
          <p class="mt-3 text-sm font-semibold text-foreground">{t('featurePage.safePickups.howItWorks.step1_title')}</p>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.safePickups.howItWorks.step1_body')}</p>
        </div>
        <div class="group rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <span class="font-heading block text-4xl tabular-nums leading-none text-primary transition-colors group-hover:text-foreground">02</span>
          <p class="mt-3 text-sm font-semibold text-foreground">{t('featurePage.safePickups.howItWorks.step2_title')}</p>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.safePickups.howItWorks.step2_body')}</p>
        </div>
        <div class="group rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <span class="font-heading block text-4xl tabular-nums leading-none text-primary transition-colors group-hover:text-foreground">03</span>
          <p class="mt-3 text-sm font-semibold text-foreground">{t('featurePage.safePickups.howItWorks.step3_title')}</p>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.safePickups.howItWorks.step3_body')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="group rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <ShieldCheck class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.safePickups.detail.card1_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet1')}
          </p>
        </div>

        <div class="group rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <Ban class="size-5 shrink-0 text-destructive" />
            <h2 class="text-base text-foreground">{t('featurePage.safePickups.detail.card2_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet2')}
          </p>
        </div>

        <div class="group rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <BellRing class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.safePickups.detail.card3_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- Stats bar -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-3 text-center">
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">0</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('featurePage.safePickups.stats.stat1_label')}</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">&lt;3s</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('featurePage.safePickups.stats.stat2_label')}</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">100%</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('featurePage.safePickups.stats.stat3_label')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="pickup-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-background/85">{t('featurePage.safePickups.finalCta.eyebrow')}</p>
      <h2 id="pickup-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('featurePage.safePickups.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.safePickups.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.safePickups.finalCta.primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/#features"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.safePickups.finalCta.secondary')}
        </a>
      </div>
      <p class="mt-8 text-xs text-background/80">
        {t('featurePage.safePickups.finalCta.footnote')}
      </p>
    </div>
  </section>

  <Footer />
</main>
