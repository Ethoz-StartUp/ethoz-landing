<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import {
    Compass, ArrowRight, BadgeCheck, AlertTriangle, Clock,
    CheckCircle, Users, Activity, BarChart3, MessageSquare,
    TrendingUp, ShieldCheck, FileText, Bell, CalendarDays
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('audience_page_viewed', { audience: 'directores' }); });

  const convivenciaMeses: { mesKey: TranslationKey; valor: number; cursoKey: TranslationKey | ''; alerta?: boolean }[] = [
    { mesKey: 'audience.directores.chart_month_aug', valor: 4, cursoKey: '' },
    { mesKey: 'audience.directores.chart_month_sep', valor: 7, cursoKey: '' },
    { mesKey: 'audience.directores.chart_month_oct', valor: 12, cursoKey: '', alerta: true },
    { mesKey: 'audience.directores.chart_month_nov', valor: 9, cursoKey: '' },
    { mesKey: 'audience.directores.chart_month_dec', valor: 3, cursoKey: '' },
    { mesKey: 'audience.directores.chart_month_mar', valor: 5, cursoKey: '' },
    { mesKey: 'audience.directores.chart_month_apr', valor: 8, cursoKey: 'audience.directores.chart_today_marker' },
  ];
  const maxVal = Math.max(...convivenciaMeses.map(m => m.valor));

  let activeObs = $state(false);
</script>

<svelte:head>
  <title>{t('audience.directores.meta_title')}</title>
  <meta name="description" content={t('audience.directores.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/para-directores" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('audience.directores.meta_title')} />
  <meta property="og:description" content={t('audience.directores.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('audience.directores.meta_title')} />
  <meta name="twitter:description" content={t('audience.directores.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/para-directores" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Para Directores","item":"https://ethoz.cl/para-directores"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Compass class="size-3.5 text-primary" />
            {t('audience.directores.hero_badge')}
          </div>
          <div class="flex items-start gap-3">
            <Compass class="mt-1 size-7 shrink-0 text-primary" />
            <h1 class="text-balance text-foreground">
              {t('audience.directores.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('audience.directores.hero_subtitle')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.directores.hero_bullet1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.directores.hero_bullet2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.directores.hero_bullet3')}
            </li>
          </ul>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" href="/demo">
              {t('audience.directores.hero_cta')} <ArrowRight class="size-4" />
            </Button>
          </div>
        </div>

        <!-- Morning KPI panel mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">{t('audience.directores.kpi_panel_header')}</span>
          </div>
          <div class="p-4">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('audience.directores.kpi_greeting')}</p>
            <!-- KPI grid -->
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="rounded-lg border border-border bg-background p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <Users class="size-3.5 text-primary" />
                  <p class="text-[10px] font-semibold text-foreground">{t('audience.directores.kpi_attendance_label')}</p>
                </div>
                <p class="text-xl font-extrabold text-foreground">94,2%</p>
                <p class="text-[9px] text-muted-foreground">{t('audience.directores.kpi_attendance_detail')}</p>
              </div>
              <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <AlertTriangle class="size-3.5 text-destructive" />
                  <p class="text-[10px] font-semibold text-destructive">{t('audience.directores.kpi_alerts_label')}</p>
                </div>
                <p class="text-xl font-extrabold text-destructive">3</p>
                <p class="text-[9px] text-muted-foreground">{t('audience.directores.kpi_alerts_detail')}</p>
              </div>
              <div class="rounded-lg border border-border bg-background p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <Clock class="size-3.5 text-warning-foreground" />
                  <p class="text-[10px] font-semibold text-foreground">{t('audience.directores.kpi_pickups_label')}</p>
                </div>
                <p class="text-xl font-extrabold text-foreground">2</p>
                <p class="text-[9px] text-muted-foreground">{t('audience.directores.kpi_pickups_detail')}</p>
              </div>
              <div class="rounded-lg border border-border bg-background p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <Activity class="size-3.5 text-primary" />
                  <p class="text-[10px] font-semibold text-foreground">{t('audience.directores.kpi_convivencia_label')}</p>
                </div>
                <p class="text-xl font-extrabold text-foreground">5</p>
                <p class="text-[9px] text-muted-foreground">{t('audience.directores.kpi_convivencia_detail')}</p>
              </div>
            </div>
            <!-- Priority action -->
            <div class="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 flex items-start gap-2">
              <Bell class="mt-0.5 size-3.5 shrink-0 text-warning-foreground" />
              <div>
                <p class="text-[10px] font-semibold text-warning-foreground">{t('audience.directores.kpi_recommended_label')}</p>
                <p class="text-[9px] text-muted-foreground">{t('audience.directores.kpi_recommended_detail')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — director voice -->
  <section class="py-12 sm:py-14" aria-labelledby="director-editorial">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p id="director-editorial" class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('audience.directores.editorial.eyebrow')}</p>
      <blockquote class="mt-5 font-heading text-2xl leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
        {t('audience.directores.editorial.statement')}
      </blockquote>
      <p class="mt-6 text-sm text-muted-foreground">
        {t('audience.directores.editorial.body')}
      </p>
    </div>
  </section>

  <!-- Observaciones con contexto -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <MessageSquare class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl text-foreground sm:text-2xl">{t('audience.directores.obs_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.directores.obs_body1')}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.directores.obs_body2')}
          </p>
          <div class="mt-6 space-y-3">
            {#each [
              { icon: CheckCircle, textKey: 'audience.directores.obs_item1' as TranslationKey },
              { icon: CheckCircle, textKey: 'audience.directores.obs_item2' as TranslationKey },
              { icon: CheckCircle, textKey: 'audience.directores.obs_item3' as TranslationKey },
            ] as item}
              <div class="flex items-start gap-2.5 text-sm text-muted-foreground">
                <item.icon class="mt-0.5 size-4 shrink-0 text-primary" />
                {t(item.textKey)}
              </div>
            {/each}
          </div>
          <button
            type="button"
            onclick={() => activeObs = !activeObs}
            aria-pressed={activeObs}
            class="mt-6 text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            {activeObs ? t('audience.directores.obs_toggle_empty') : t('audience.directores.obs_toggle_filled')}
          </button>
        </div>

        <!-- Observation form mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <FileText class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">{t('audience.directores.form_title')}</span>
          </div>
          <div class="p-4 space-y-3">
            <div>
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('audience.directores.form_field_student')}</p>
              <div class="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                {#if activeObs}
                  <div class="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">MS</div>
                  <div>
                    <p class="text-[11px] font-semibold text-foreground">{t('audience.directores.form_student_name')}</p>
                    <p class="text-[9px] text-muted-foreground">{t('audience.directores.form_student_meta')}</p>
                  </div>
                {:else}
                  <p class="text-[11px] text-muted-foreground">{t('audience.directores.form_student_placeholder')}</p>
                {/if}
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('audience.directores.form_field_category')}</p>
                <div class="rounded-lg border border-border bg-background px-3 py-2">
                  <p class="text-[11px] {activeObs ? 'text-foreground font-medium' : 'text-muted-foreground'}">
                    {activeObs ? t('audience.directores.form_category_value') : t('audience.directores.form_select_placeholder')}
                  </p>
                </div>
              </div>
              <div>
                <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('audience.directores.form_field_confidentiality')}</p>
                <div class="rounded-lg border {activeObs ? 'border-warning/30 bg-warning/5' : 'border-border bg-background'} px-3 py-2">
                  <p class="text-[11px] {activeObs ? 'text-warning-foreground font-medium' : 'text-muted-foreground'}">
                    {activeObs ? t('audience.directores.form_confidentiality_value') : t('audience.directores.form_select_placeholder')}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('audience.directores.form_field_description')}</p>
              <div class="min-h-[60px] rounded-lg border border-border bg-background px-3 py-2">
                {#if activeObs}
                  <p class="text-[11px] text-foreground">{t('audience.directores.form_description_value')}</p>
                {:else}
                  <p class="text-[11px] text-muted-foreground">{t('audience.directores.form_description_placeholder')}</p>
                {/if}
              </div>
            </div>
            <div>
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('audience.directores.form_field_notification')}</p>
              <div class="flex items-center gap-2 rounded-lg border {activeObs ? 'border-success/20 bg-success/5' : 'border-border bg-background'} px-3 py-2">
                {#if activeObs}
                  <CheckCircle class="size-3.5 shrink-0 text-success" />
                  <p class="text-[11px] text-success">{t('audience.directores.form_notification_value')}</p>
                {:else}
                  <p class="text-[11px] text-muted-foreground">{t('audience.directores.form_notification_placeholder')}</p>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Datos y tendencias -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <!-- Trend chart mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <BarChart3 class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">{t('audience.directores.chart_header')}</span>
          </div>
          <div class="p-4">
            <!-- Chart bars -->
            <div class="flex items-end gap-1.5 h-28 mb-2">
              {#each convivenciaMeses as mes}
                <div class="flex-1 flex flex-col items-center gap-1">
                  <p class="text-[8px] text-foreground font-semibold">{mes.valor}</p>
                  <div class="w-full rounded-t-sm {mes.alerta ? 'bg-destructive/60' : 'bg-primary/40'}" style="height: {(mes.valor / maxVal) * 80}px"></div>
                  <p class="text-[8px] text-muted-foreground">{t(mes.mesKey)}</p>
                  {#if mes.cursoKey}
                    <p class="text-[7px] text-muted-foreground">{t(mes.cursoKey)}</p>
                  {/if}
                </div>
              {/each}
            </div>
            <div class="flex items-center gap-3 mt-1">
              <div class="flex items-center gap-1.5">
                <div class="size-2 rounded-full bg-destructive/60"></div>
                <p class="text-[9px] text-muted-foreground">{t('audience.directores.chart_legend_peak')}</p>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="size-2 rounded-full bg-primary/40"></div>
                <p class="text-[9px] text-muted-foreground">{t('audience.directores.chart_legend_normal')}</p>
              </div>
            </div>
            <!-- Insight card -->
            <div class="mt-3 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
              <div class="flex items-center gap-1.5 mb-1">
                <TrendingUp class="size-3 text-warning-foreground" />
                <p class="text-[9px] font-semibold text-warning-foreground">{t('audience.directores.chart_insight_label')}</p>
              </div>
              <p class="text-[9px] text-muted-foreground">{t('audience.directores.chart_insight_body')}</p>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-3 mb-2">
            <TrendingUp class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl text-foreground sm:text-2xl">{t('audience.directores.data_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.directores.data_body1')}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.directores.data_body2')}
          </p>
          <div class="mt-6 space-y-3">
            {#each [
              { icon: BarChart3, textKey: 'audience.directores.data_item1' as TranslationKey },
              { icon: CalendarDays, textKey: 'audience.directores.data_item2' as TranslationKey },
              { icon: ShieldCheck, textKey: 'audience.directores.data_item3' as TranslationKey },
            ] as item}
              <div class="flex items-start gap-2.5 text-sm text-muted-foreground">
                <item.icon class="mt-0.5 size-4 shrink-0 text-primary" />
                {t(item.textKey)}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sin reinicio de marzo -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <CalendarDays class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl text-foreground sm:text-2xl">{t('audience.directores.continuity_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.directores.continuity_body1')}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.directores.continuity_body2')}
          </p>
          <div class="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
            <p class="text-xs font-semibold text-foreground mb-3">{t('audience.directores.compare_title')}</p>
            <div class="space-y-2">
              {#each [
                { aspectoKey: 'audience.directores.compare_row1_aspect' as TranslationKey, tradKey: 'audience.directores.compare_row1_trad' as TranslationKey, ethozKey: 'audience.directores.compare_row1_ethoz' as TranslationKey },
                { aspectoKey: 'audience.directores.compare_row2_aspect' as TranslationKey, tradKey: 'audience.directores.compare_row2_trad' as TranslationKey, ethozKey: 'audience.directores.compare_row2_ethoz' as TranslationKey },
                { aspectoKey: 'audience.directores.compare_row3_aspect' as TranslationKey, tradKey: 'audience.directores.compare_row3_trad' as TranslationKey, ethozKey: 'audience.directores.compare_row3_ethoz' as TranslationKey },
                { aspectoKey: 'audience.directores.compare_row4_aspect' as TranslationKey, tradKey: 'audience.directores.compare_row4_trad' as TranslationKey, ethozKey: 'audience.directores.compare_row4_ethoz' as TranslationKey },
              ] as row}
                <div class="grid grid-cols-3 gap-2 text-[10px]">
                  <p class="text-muted-foreground font-medium">{t(row.aspectoKey)}</p>
                  <p class="text-destructive">{t(row.tradKey)}</p>
                  <p class="text-success font-medium">{t(row.ethozKey)}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Emergency protocol mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <ShieldCheck class="size-4 text-destructive" />
            <span class="text-sm font-semibold text-foreground">{t('audience.directores.emergency_header')}</span>
            <span class="ml-auto inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-semibold text-destructive">{t('audience.directores.emergency_status_badge')}</span>
          </div>
          <div class="p-4 space-y-3">
            <div class="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
              <p class="text-[10px] font-bold text-destructive">{t('audience.directores.emergency_title')}</p>
              <p class="text-[9px] text-muted-foreground">{t('audience.directores.emergency_meta')}</p>
            </div>
            <div class="space-y-2">
              {#each [
                { sectorKey: 'audience.directores.emergency_sector1' as TranslationKey, estadoKey: 'audience.directores.emergency_status_confirmed' as TranslationKey, alumnos: 234, responsableKey: 'audience.directores.emergency_resp1' as TranslationKey, ok: true },
                { sectorKey: 'audience.directores.emergency_sector2' as TranslationKey, estadoKey: 'audience.directores.emergency_status_confirmed' as TranslationKey, alumnos: 189, responsableKey: 'audience.directores.emergency_resp2' as TranslationKey, ok: true },
                { sectorKey: 'audience.directores.emergency_sector3' as TranslationKey, estadoKey: 'audience.directores.emergency_status_inprogress' as TranslationKey, alumnos: 145, responsableKey: 'audience.directores.emergency_resp3' as TranslationKey, ok: false },
                { sectorKey: 'audience.directores.emergency_sector4' as TranslationKey, estadoKey: 'audience.directores.emergency_status_pending' as TranslationKey, alumnos: 28, responsableKey: 'audience.directores.emergency_resp4' as TranslationKey, ok: false },
              ] as sector}
                <div class="flex items-center gap-3 rounded-lg {sector.ok ? 'bg-success/5 border border-success/20' : 'bg-warning/5 border border-warning/20'} px-3 py-2">
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-semibold text-foreground">{t(sector.sectorKey)}</p>
                    <p class="text-[9px] text-muted-foreground">{t(sector.responsableKey)} · {sector.alumnos} {t('audience.directores.emergency_students_suffix')}</p>
                  </div>
                  <span class="text-[9px] font-semibold {sector.ok ? 'text-success' : 'text-warning-foreground'}">{t(sector.estadoKey)}</span>
                </div>
              {/each}
            </div>
            <div class="flex items-center justify-between pt-1">
              <p class="text-[9px] text-muted-foreground">{t('audience.directores.emergency_counted')}</p>
              <div class="h-1.5 w-24 rounded-full bg-border overflow-hidden">
                <div class="h-full w-[75%] rounded-full bg-warning"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-3 text-center">
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">70,8%</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('audience.directores.stat1_caption')}</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">&lt;5 min</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('audience.directores.stat2_caption')}</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">100%</p>
          <p class="mt-1 text-sm text-muted-foreground">{t('audience.directores.stat3_caption')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="director-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-background/85">{t('audience.directores.finalCta.eyebrow')}</p>
      <h2 id="director-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('audience.directores.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('audience.directores.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('audience.directores.finalCta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/#features"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('audience.directores.finalCta_secondary')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
