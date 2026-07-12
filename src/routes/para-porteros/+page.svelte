<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import {
    DoorOpen, ArrowRight, BadgeCheck, CheckCircle, XCircle,
    Ban, AlertTriangle, Eye, EyeOff, Wifi, WifiOff, Clock, UserCheck
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('audience_page_viewed', { audience: 'porteros' }); });

  let retiroState = $state<'normal' | 'bloqueado'>('normal');
</script>

<svelte:head>
  <title>{t('audience.porteros.meta_title')}</title>
  <meta name="description" content={t('audience.porteros.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/para-porteros" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('audience.porteros.meta_og_title')} />
  <meta property="og:description" content={t('audience.porteros.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('audience.porteros.meta_og_title')} />
  <meta name="twitter:description" content={t('audience.porteros.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/para-porteros" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Para Porteros","item":"https://ethoz.cl/para-porteros"}]})}</script>`}
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
  <section class="bg-secondary pt-24 pb-8 sm:pt-28 sm:pb-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <DoorOpen class="size-3.5 text-primary" />
            {t('audience.porteros.hero_badge')}
          </div>
          <div class="flex items-start gap-3">
            <DoorOpen class="mt-1 size-7 shrink-0 text-primary" />
            <h1 class="page-title">
              {t('audience.porteros.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('audience.porteros.hero_subtitle')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.porteros.hero_bullet1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.porteros.hero_bullet2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.porteros.hero_bullet3')}
            </li>
          </ul>
          <div class="mt-6 flex items-center gap-3" role="group" aria-label={t('audience.porteros.hero_toggle_aria')}>
            <button
              type="button"
              onclick={() => retiroState = 'normal'}
              aria-pressed={retiroState === 'normal'}
              class="inline-flex items-center gap-1.5 text-xs font-medium min-h-11 px-4 py-2.5 rounded-full border transition-colors {retiroState === 'normal' ? 'bg-success/15 text-foreground border-success/40' : 'border-border text-muted-foreground hover:text-foreground'}"
            >
              <CheckCircle class="size-3.5 shrink-0 text-success" />
              {t('audience.porteros.hero_toggle_authorized')}
            </button>
            <button
              type="button"
              onclick={() => retiroState = 'bloqueado'}
              aria-pressed={retiroState === 'bloqueado'}
              class="inline-flex items-center gap-1.5 text-xs font-medium min-h-11 px-4 py-2.5 rounded-full border transition-colors {retiroState === 'bloqueado' ? 'bg-destructive/15 text-foreground border-destructive/40' : 'border-border text-muted-foreground hover:text-foreground'}"
            >
              <Ban class="size-3.5 shrink-0 text-destructive" />
              {t('audience.porteros.hero_toggle_blocked')}
            </button>
          </div>
          <div class="mt-8">
            <Button size="lg" href="/demo">
              {t('audience.porteros.hero_cta')} <ArrowRight class="size-4" />
            </Button>
          </div>
        </div>

        <!-- Portería screen mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-dark-hover" aria-hidden="true">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('audience.porteros.mock_header')}</span>
          </div>
          <div class="p-4">
            <!-- Search bar -->
            <div class="mb-3 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2.5">
              <svg class="size-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <p class="text-mockup-sm font-medium text-foreground">{t('audience.porteros.mock_search_query')}</p>
            </div>

            {#if retiroState === 'normal'}
              <!-- Authorized state -->
              <div class="flex items-center gap-3 rounded-lg bg-success/10 border border-success/30 px-3 py-2.5 mb-4">
                <CheckCircle class="size-5 shrink-0 text-success" />
                <div>
                  <p class="text-sm font-bold text-foreground">{t('audience.porteros.mock_status_authorized')}</p>
                  <p class="text-mockup-2xs text-muted-foreground">{t('audience.porteros.mock_status_authorized_detail')}</p>
                </div>
              </div>
              <!-- Student card -->
              <div class="flex gap-3 mb-4">
                <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-extrabold text-primary-active shrink-0">M</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-foreground">{t('audience.porteros.mock_student_name')}</p>
                  <p class="text-mockup-sm text-muted-foreground">{t('audience.porteros.mock_student_meta')}</p>
                  <p class="text-mockup-xs text-muted-foreground mt-0.5">{t('audience.porteros.mock_student_no_alerts')}</p>
                </div>
              </div>
              <!-- Authorized guardians -->
              <p class="text-mockup-2xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('audience.porteros.mock_guardians_label')}</p>
              <div class="space-y-2">
                {#each [
                  { nombreKey: 'audience.porteros.mock_guardian1_name' as TranslationKey, relKey: 'audience.porteros.mock_guardian1_rel' as TranslationKey, foto: 'C', ok: true },
                  { nombreKey: 'audience.porteros.mock_guardian2_name' as TranslationKey, relKey: 'audience.porteros.mock_guardian2_rel' as TranslationKey, foto: 'P', ok: true },
                  { nombreKey: 'audience.porteros.mock_guardian3_name' as TranslationKey, relKey: 'audience.porteros.mock_guardian3_rel' as TranslationKey, foto: 'R', ok: true },
                ] as g}
                  <div class="flex items-center gap-2 rounded-lg bg-success/5 border border-success/15 px-3 py-2 cursor-pointer hover:bg-success/10 transition-colors">
                    <div class="size-7 rounded-full bg-success/20 flex items-center justify-center text-mockup-xs font-bold text-foreground shrink-0">{g.foto}</div>
                    <div class="flex-1 min-w-0">
                      <p class="text-mockup-sm font-semibold text-foreground">{t(g.nombreKey)}</p>
                      <p class="text-mockup-2xs text-muted-foreground">{t(g.relKey)}</p>
                    </div>
                    <CheckCircle class="size-4 shrink-0 text-success" />
                  </div>
                {/each}
              </div>
            {:else}
              <!-- Blocked state -->
              <div class="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5 mb-4">
                <XCircle class="size-5 shrink-0 text-destructive" />
                <div>
                  <p class="text-sm font-bold text-destructive">{t('audience.porteros.mock_status_blocked')}</p>
                  <p class="text-mockup-2xs text-muted-foreground">{t('audience.porteros.mock_status_blocked_detail')}</p>
                </div>
              </div>
              <!-- Student card -->
              <div class="flex gap-3 mb-4">
                <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-extrabold text-primary-active shrink-0">M</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-foreground">{t('audience.porteros.mock_student_name')}</p>
                  <p class="text-mockup-sm text-muted-foreground">{t('audience.porteros.mock_student_meta')}</p>
                </div>
              </div>
              <!-- Judicial block -->
              <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-3 mb-3">
                <div class="flex items-center gap-2 mb-1.5">
                  <Ban class="size-4 shrink-0 text-destructive" />
                  <p class="text-mockup-sm font-bold text-destructive">{t('audience.porteros.mock_judicial_title')}</p>
                </div>
                <div class="space-y-1">
                  <div class="flex gap-2 text-mockup-xs">
                    <span class="text-muted-foreground w-16 shrink-0">{t('audience.porteros.mock_judicial_person_label')}</span>
                    <span class="font-semibold text-foreground">{t('audience.porteros.mock_judicial_person_value')}</span>
                  </div>
                  <div class="flex gap-2 text-mockup-xs">
                    <span class="text-muted-foreground w-16 shrink-0">{t('audience.porteros.mock_judicial_rit_label')}</span>
                    <span class="font-semibold text-foreground">{t('audience.porteros.mock_judicial_rit_value')}</span>
                  </div>
                  <div class="flex gap-2 text-mockup-xs">
                    <span class="text-muted-foreground w-16 shrink-0">{t('audience.porteros.mock_judicial_valid_label')}</span>
                    <span class="font-semibold text-foreground">{t('audience.porteros.mock_judicial_valid_value')}</span>
                  </div>
                </div>
              </div>
              <p class="text-mockup-2xs text-muted-foreground text-center">{t('audience.porteros.mock_judicial_warning')}</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — portero voice -->
  <section class="py-10 sm:py-12" aria-labelledby="portero-editorial">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p id="portero-editorial" class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('audience.porteros.editorial.eyebrow')}</p>
      <blockquote class="mt-5 font-heading text-2xl leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
        {t('audience.porteros.editorial.statement')}
      </blockquote>
      <p class="mt-6 text-sm text-muted-foreground">
        {t('audience.porteros.editorial.body')}
      </p>
    </div>
  </section>

  <!-- El retiro de las 14:30 — escenario real -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-2">
        <Clock class="size-5 shrink-0 text-primary" />
        <h2 class="font-heading text-xl text-foreground sm:text-2xl">{t('audience.porteros.scenario_title')}</h2>
      </div>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        {t('audience.porteros.scenario_intro')}
      </p>
      <div class="grid gap-6 sm:grid-cols-3">
        {#each [
          {
            num: '1',
            tituloKey: 'audience.porteros.scenario_step1_title' as TranslationKey,
            descKey: 'audience.porteros.scenario_step1_desc' as TranslationKey,
            tiempo: '3 seg'
          },
          {
            num: '2',
            tituloKey: 'audience.porteros.scenario_step2_title' as TranslationKey,
            descKey: 'audience.porteros.scenario_step2_desc' as TranslationKey,
            tiempo: '8 seg'
          },
          {
            num: '3',
            tituloKey: 'audience.porteros.scenario_step3_title' as TranslationKey,
            descKey: 'audience.porteros.scenario_step3_desc' as TranslationKey,
            tiempo: '4 seg'
          },
        ] as step}
          <div class="group rounded-xl border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
            <div class="mb-3 flex items-center gap-3">
              <span class="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-active">{step.num}</span>
              <p class="text-sm font-semibold text-foreground">{t(step.tituloKey)}</p>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground mb-3">{t(step.descKey)}</p>
            <div class="flex items-center gap-1.5">
              <Clock class="size-3.5 text-muted-foreground" />
              <p class="text-mockup-xs font-semibold text-muted-foreground">{step.tiempo}</p>
            </div>
          </div>
        {/each}
      </div>
      <p class="mt-6 text-center text-sm font-semibold text-foreground">{t('audience.porteros.scenario_total')}</p>
    </div>
  </section>

  <!-- Solo lo que el portero necesita -->
  <section class="bg-secondary py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <Eye class="size-5 shrink-0 text-primary" />
            <h2 class="font-heading text-xl text-foreground sm:text-2xl">{t('audience.porteros.privacy_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.porteros.privacy_body1')}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.porteros.privacy_body2')}
          </p>
        </div>
        <!-- Visibility comparison -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="grid grid-cols-2 divide-x divide-border">
            <div class="p-4">
              <div class="flex items-center gap-2 mb-3">
                <Eye class="size-4 text-success" />
                <p class="text-mockup-sm font-bold text-foreground">{t('audience.porteros.sees_title')}</p>
              </div>
              <div class="space-y-2">
                {#each [
                  'audience.porteros.sees_item1' as TranslationKey,
                  'audience.porteros.sees_item2' as TranslationKey,
                  'audience.porteros.sees_item3' as TranslationKey,
                  'audience.porteros.sees_item4' as TranslationKey,
                  'audience.porteros.sees_item5' as TranslationKey,
                  'audience.porteros.sees_item6' as TranslationKey,
                ] as item}
                  <div class="flex items-start gap-2">
                    <CheckCircle class="mt-0.5 size-3.5 shrink-0 text-success" />
                    <p class="text-mockup-xs text-foreground">{t(item)}</p>
                  </div>
                {/each}
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-3">
                <EyeOff class="size-4 text-muted-foreground" />
                <p class="text-mockup-sm font-bold text-muted-foreground">{t('audience.porteros.hidden_title')}</p>
              </div>
              <div class="space-y-2">
                {#each [
                  'audience.porteros.hidden_item1' as TranslationKey,
                  'audience.porteros.hidden_item2' as TranslationKey,
                  'audience.porteros.hidden_item3' as TranslationKey,
                  'audience.porteros.hidden_item4' as TranslationKey,
                  'audience.porteros.hidden_item5' as TranslationKey,
                  'audience.porteros.hidden_item6' as TranslationKey,
                ] as item}
                  <div class="flex items-start gap-2">
                    <XCircle class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <p class="text-mockup-xs text-muted-foreground">{t(item)}</p>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Entrenamiento + offline -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <UserCheck class="size-5 shrink-0 text-primary" />
            <h3 class="font-heading text-base text-foreground">{t('audience.porteros.training_title')}</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground mb-4">
            {t('audience.porteros.training_body')}
          </p>
          <div class="space-y-2">
            {#each [
              { paso: '1', textoKey: 'audience.porteros.training_step1' as TranslationKey },
              { paso: '2', textoKey: 'audience.porteros.training_step2' as TranslationKey },
              { paso: '3', textoKey: 'audience.porteros.training_step3' as TranslationKey },
            ] as p}
              <div class="flex items-center gap-3">
                <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-mockup-xs font-bold text-primary-active">{p.paso}</span>
                <p class="text-xs text-muted-foreground">{t(p.textoKey)}</p>
              </div>
            {/each}
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <WifiOff class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="font-heading text-base text-foreground">{t('audience.porteros.offline_title')}</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground mb-4">
            {t('audience.porteros.offline_body')}
          </p>
          <div class="space-y-2">
            {#each [
              { icon: Wifi, textoKey: 'audience.porteros.offline_mode_online' as TranslationKey, activo: true },
              { icon: WifiOff, textoKey: 'audience.porteros.offline_mode_offline' as TranslationKey, activo: false },
              { icon: AlertTriangle, textoKey: 'audience.porteros.offline_mode_paper' as TranslationKey, activo: false },
            ] as modo}
              <div class="flex items-center gap-3 rounded-lg {modo.activo ? 'bg-success/5 border border-success/20' : 'bg-background border border-border'} px-3 py-2">
                <modo.icon class="size-3.5 shrink-0 {modo.activo ? 'text-success' : 'text-muted-foreground'}" />
                <p class="text-mockup-xs {modo.activo ? 'text-foreground font-medium' : 'text-muted-foreground'}">{t(modo.textoKey)}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="bg-secondary py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-3 text-center">
        <div>
          <p class="text-4xl font-heading text-foreground">&lt;3s</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('audience.porteros.stat1_caption')}</p>
        </div>
        <div>
          <p class="text-4xl font-heading text-foreground">0</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('audience.porteros.stat2_caption')}</p>
        </div>
        <div>
          <p class="text-4xl font-heading text-foreground">15 min</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('audience.porteros.stat3_caption')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-secondary py-20 text-foreground sm:py-24" aria-labelledby="portero-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('audience.porteros.finalCta.eyebrow')}</p>
      <h2 id="portero-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-foreground sm:text-4xl">
        {t('audience.porteros.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('audience.porteros.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-8 text-sm font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('audience.porteros.finalCta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/#features"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-foreground/20 bg-transparent px-8 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('audience.porteros.finalCta_secondary')}
        </a>
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>
