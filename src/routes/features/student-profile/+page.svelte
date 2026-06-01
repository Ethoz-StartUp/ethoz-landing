<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { Button } from '$lib/components/ui/button';
  import {
    ClipboardList, ArrowRight, ArrowLeft, History, Lock, BadgeCheck,
    Eye, UserCheck, AlertTriangle, CalendarDays, HeartPulse, MessageSquare,
    GraduationCap, ChevronRight, FileText, Clock
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'student-profile' }); });

  const TAB_KEYS = ['historial', 'retiros', 'convivencia', 'medico'] as const;
  type TabKey = typeof TAB_KEYS[number];
  let activeTab = $state<TabKey>('historial');

  function handleTabKeydown(e: KeyboardEvent, idx: number) {
    // APG tab pattern: ArrowLeft/ArrowRight/Home/End move focus and activate
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % TAB_KEYS.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + TAB_KEYS.length) % TAB_KEYS.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = TAB_KEYS.length - 1;
    else return;
    e.preventDefault();
    activeTab = TAB_KEYS[nextIdx];
    requestAnimationFrame(() => {
      document.getElementById(`sp-tab-${TAB_KEYS[nextIdx]}`)?.focus();
    });
  }
</script>

<svelte:head>
  <title>{BRAND} — {t('features.record.title')}</title>
  <meta name="description" content={t('featurePage.studentProfile.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/features/student-profile" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.studentProfile.og_title')} />
  <meta property="og:description" content={t('featurePage.studentProfile.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.studentProfile.og_title')} />
  <meta name="twitter:description" content={t('featurePage.studentProfile.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/features/student-profile" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Perfil Integral del Alumno"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/#features" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.studentProfile.back_link')}
      </a>
      <div class="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="flex items-center gap-3">
            <ClipboardList class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-foreground">
              {t('features.record.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.record.desc')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.studentProfile.hero_bullet1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.studentProfile.hero_bullet2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.studentProfile.hero_bullet3')}
            </li>
          </ul>
        </div>

        <!-- Interactive mockup: Ficha 360° -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.studentProfile.mockup_window_title')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- Student header -->
            <div class="flex gap-4">
              <div class="flex flex-col items-center gap-2">
                <img src="/images/students/girl-12.webp" alt={t('featurePage.studentProfile.mockup_avatar_alt')} class="size-14 rounded-full object-cover ring-2 ring-primary/20" loading="lazy" decoding="async" />
                <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-mockup-xs font-medium text-success">{t('featurePage.studentProfile.mockup_no_alerts')}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-foreground">Valentina Rojas Sepúlveda</p>
                <p class="text-mockup-sm text-muted-foreground">{t('featurePage.studentProfile.mockup_grade')} · RUT 23.456.789-0</p>
                <p class="text-mockup-xs text-muted-foreground mt-0.5">{t('featurePage.studentProfile.mockup_school')} · Ñuñoa · RBD 9234</p>
                <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.studentProfile.mockup_guardian_label')}</span> María Sepúlveda</p>
                  <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.studentProfile.mockup_phone_label')}</span> +56 9 8765 4321</p>
                  <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.studentProfile.mockup_enrolled_label')}</span> {t('featurePage.studentProfile.mockup_enrolled_value')}</p>
                  <p class="text-mockup-xs text-muted-foreground"><span class="font-medium text-foreground">{t('featurePage.studentProfile.mockup_pie_label')}</span> {t('featurePage.studentProfile.mockup_pie_value')}</p>
                </div>
              </div>
            </div>

            <!-- Tabs — WAI-ARIA 1.2 tab pattern -->
            <div role="tablist" aria-label={t('featurePage.studentProfile.mockup_tablist_label')} class="mt-3 flex gap-0.5 border-b border-border overflow-x-auto">
              {#each [
                { key: 'historial' as TabKey, labelKey: 'featurePage.studentProfile.mockup_tab_historial' as const },
                { key: 'retiros' as TabKey, labelKey: 'featurePage.studentProfile.mockup_tab_retiros' as const },
                { key: 'convivencia' as TabKey, labelKey: 'featurePage.studentProfile.mockup_tab_convivencia' as const },
                { key: 'medico' as TabKey, labelKey: 'featurePage.studentProfile.mockup_tab_medico' as const }
              ] as tab, i}
                <button
                  type="button"
                  role="tab"
                  id={`sp-tab-${tab.key}`}
                  aria-controls={`sp-panel-${tab.key}`}
                  aria-selected={activeTab === tab.key}
                  tabindex={activeTab === tab.key ? 0 : -1}
                  onclick={() => activeTab = tab.key}
                  onkeydown={(e) => handleTabKeydown(e, i)}
                  class="shrink-0 px-2.5 py-1.5 text-mockup-xs font-medium transition-colors {activeTab === tab.key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
                >
                  {t(tab.labelKey)}
                </button>
              {/each}
            </div>

            <!-- Tab content -->
            {#if activeTab === 'historial'}
              <div id="sp-panel-historial" role="tabpanel" aria-labelledby="sp-tab-historial" tabindex="0" class="mt-2.5 space-y-2">
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.hist1_title')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.hist1_meta')}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-success/10 flex items-center justify-center">
                    <UserCheck class="size-2 text-success" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.hist2_title')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.hist2_meta')}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertTriangle class="size-2 text-warning-foreground" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.hist3_title')} (08:15)</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.hist3_meta')}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.hist4_title_prefix')} 6.2 {t('featurePage.studentProfile.hist4_title_suffix')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.hist4_meta')}</p>
                  </div>
                </div>
              </div>
            {:else if activeTab === 'retiros'}
              <div id="sp-panel-retiros" role="tabpanel" aria-labelledby="sp-tab-retiros" tabindex="0" class="mt-2.5 space-y-1.5">
                <div class="flex items-center gap-2 rounded-lg bg-success/5 px-2 py-1.5">
                  <UserCheck class="size-3 shrink-0 text-success" />
                  <div class="flex-1 min-w-0">
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.retiro1_name')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.retiro1_meta')}</p>
                  </div>
                  <span class="text-mockup-3xs font-semibold text-success">{t('featurePage.studentProfile.retiro_status_ok')}</span>
                </div>
                <div class="flex items-center gap-2 rounded-lg px-2 py-1.5">
                  <UserCheck class="size-3 shrink-0 text-success" />
                  <div class="flex-1 min-w-0">
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.retiro2_name')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.retiro2_meta')}</p>
                  </div>
                  <span class="text-mockup-3xs font-semibold text-success">{t('featurePage.studentProfile.retiro_status_ok')}</span>
                </div>
                <div class="flex items-center gap-2 rounded-lg bg-destructive/5 px-2 py-1.5">
                  <AlertTriangle class="size-3 shrink-0 text-destructive" />
                  <div class="flex-1 min-w-0">
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.retiro3_name')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.retiro3_meta')}</p>
                  </div>
                  <span class="text-mockup-3xs font-semibold text-destructive">{t('featurePage.studentProfile.retiro_status_blocked')}</span>
                </div>
              </div>
            {:else if activeTab === 'convivencia'}
              <div id="sp-panel-convivencia" role="tabpanel" aria-labelledby="sp-tab-convivencia" tabindex="0" class="mt-2.5 space-y-2">
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-warning/10 flex items-center justify-center">
                    <MessageSquare class="size-2 text-warning-foreground" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.conv1_title')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.conv1_meta')}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.conv2_title')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.conv2_meta')}</p>
                  </div>
                </div>
              </div>
            {:else if activeTab === 'medico'}
              <div id="sp-panel-medico" role="tabpanel" aria-labelledby="sp-tab-medico" tabindex="0" class="mt-2.5 space-y-2">
                <div class="flex items-center gap-2 rounded-lg bg-warning/5 border border-warning/20 px-2 py-1.5">
                  <Lock class="size-3 shrink-0 text-warning-foreground" />
                  <p class="text-mockup-xs text-warning-foreground font-medium">{t('featurePage.studentProfile.medico_visibility_note')}</p>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <HeartPulse class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.medico1_title')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.medico1_meta')}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <HeartPulse class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.studentProfile.medico2_title')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.studentProfile.medico2_meta')}</p>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — no-reinicio thesis -->
  <EditorialSection
    id="profile-editorial"
    eyebrow={t('featurePage.studentProfile.editorial.eyebrow')}
    statement={t('featurePage.studentProfile.editorial.statement')}
    body={t('featurePage.studentProfile.editorial.body')}
  />

  <!-- Timeline section -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="mb-2 text-mockup-sm font-semibold uppercase tracking-[0.18em] text-primary">{t('featurePage.studentProfile.timeline_eyebrow')}</p>
      <h2 class="mb-2 text-xl text-foreground sm:text-2xl">{t('featurePage.studentProfile.timeline_title')}</h2>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        {t('featurePage.studentProfile.timeline_subtitle')}
      </p>

      <!-- Timeline -->
      <div class="relative pl-6 border-l border-border space-y-8">
        {#each [
          { year: '2026', gradeKey: 'featurePage.studentProfile.timeline_grade_2026' as const, obs: 4, retiros: 12, color: 'bg-primary' },
          { year: '2025', gradeKey: 'featurePage.studentProfile.timeline_grade_2025' as const, obs: 7, retiros: 28, color: 'bg-primary/70' },
          { year: '2024', gradeKey: 'featurePage.studentProfile.timeline_grade_2024' as const, obs: 3, retiros: 31, color: 'bg-primary/50' },
          { year: '2023', gradeKey: 'featurePage.studentProfile.timeline_grade_2023' as const, obs: 5, retiros: 26, color: 'bg-primary/30' },
        ] as item}
          <div class="relative">
            <div class="absolute -left-[25px] top-1 size-3 rounded-full {item.color} border-2 border-background"></div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-2.5">
                  <CalendarDays class="size-4 shrink-0 text-primary" />
                  <div>
                    <p class="text-sm font-semibold text-foreground">{item.year} — {t(item.gradeKey)}</p>
                    <p class="text-mockup-sm text-muted-foreground">{t('featurePage.studentProfile.timeline_school')}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <p class="text-sm font-bold text-foreground">{item.obs}</p>
                    <p class="text-mockup-2xs uppercase tracking-wider text-muted-foreground">{t('featurePage.studentProfile.timeline_stat_observations')}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-bold text-foreground">{item.retiros}</p>
                    <p class="text-mockup-2xs uppercase tracking-wider text-muted-foreground">{t('featurePage.studentProfile.timeline_stat_pickups')}</p>
                  </div>
                  <ChevronRight class="size-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <History class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.studentProfile.card1_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet1')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <Lock class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.studentProfile.card2_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet2')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <BadgeCheck class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.studentProfile.card3_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- Alert mini list section -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <h2 class="text-xl text-foreground sm:text-2xl">{t('featurePage.studentProfile.alerts_title')}</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('featurePage.studentProfile.alerts_body1')}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('featurePage.studentProfile.alerts_body2')}
          </p>
        </div>

        <!-- Alert mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <AlertTriangle class="size-4 text-destructive" />
            <span class="text-sm font-semibold text-foreground">{t('featurePage.studentProfile.alerts_mockup_header')}</span>
          </div>
          <div class="divide-y divide-border">
            <div class="flex items-start gap-3 px-4 py-3">
              <span class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle class="size-3 text-destructive" />
              </span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-destructive">{t('featurePage.studentProfile.alert1_title')}</p>
                <p class="mt-0.5 text-xs text-muted-foreground">{t('featurePage.studentProfile.alert1_desc')}</p>
              </div>
            </div>
            <div class="flex items-start gap-3 px-4 py-3">
              <span class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/10">
                <HeartPulse class="size-3 text-warning-foreground" />
              </span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-warning-foreground">{t('featurePage.studentProfile.alert2_title')}</p>
                <p class="mt-0.5 text-xs text-muted-foreground">{t('featurePage.studentProfile.alert2_desc')}</p>
              </div>
            </div>
            <div class="flex items-start gap-3 px-4 py-3">
              <span class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Clock class="size-3 text-primary" />
              </span>
              <div class="flex-1">
                <p class="text-sm font-medium text-foreground">3 {t('featurePage.studentProfile.alert3_title_suffix')}</p>
                <p class="mt-0.5 text-xs text-muted-foreground">{t('featurePage.studentProfile.alert3_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="profile-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-background/85">{t('featurePage.studentProfile.finalCta.eyebrow')}</p>
      <h2 id="profile-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('featurePage.studentProfile.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.studentProfile.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.studentProfile.cta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/#features"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.studentProfile.cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
