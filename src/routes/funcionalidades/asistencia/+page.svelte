<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { CalendarCheck, ArrowRight, ArrowLeft, BookOpen, BadgeCheck, AlertTriangle, Clock, CheckCircle2, FileText } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'attendance' }); });

  const students = [
    { name: 'Alumna de ejemplo', days: ['P', 'P', 'P', 'P', 'P'] },
    { name: 'Alumno de ejemplo', days: ['P', 'A', 'P', 'P', 'T'] },
    { name: 'Alumna de ejemplo', days: ['P', 'P', 'J', 'P', 'P'] },
    { name: 'Alumno de ejemplo', days: ['A', 'P', 'P', 'P', 'P'] },
    { name: 'Alumna de ejemplo', days: ['P', 'P', 'P', 'T', 'P'] },
    { name: 'Alumno de ejemplo', days: ['P', 'P', 'P', 'P', 'A'] },
    { name: 'Alumna de ejemplo', days: ['J', 'P', 'P', 'P', 'P'] },
    { name: 'Alumno de ejemplo', days: ['P', 'P', 'A', 'A', 'P'] },
    { name: 'Alumna de ejemplo', days: ['P', 'P', 'P', 'P', 'P'] },
    { name: 'Alumno de ejemplo', days: ['P', 'T', 'P', 'P', 'P'] },
    { name: 'Alumna de ejemplo', days: ['P', 'P', 'P', 'P', 'J'] },
    { name: 'Alumno de ejemplo', days: ['A', 'A', 'P', 'P', 'P'] },
    { name: 'Alumna de ejemplo', days: ['P', 'P', 'P', 'P', 'P'] },
  ];

  function dayColor(d: string) {
    if (d === 'P') return 'bg-success text-success-foreground';
    if (d === 'A') return 'bg-destructive text-destructive-foreground';
    if (d === 'T') return 'bg-warning text-warning-foreground';
    if (d === 'J') return 'bg-primary/20 text-primary-active';
    return 'bg-muted text-muted-foreground';
  }
</script>

<svelte:head>
  <title>{t('featurePage.attendance.meta_title')}</title>
  <meta name="description" content={t('featurePage.attendance.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/funcionalidades/asistencia" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.attendance.meta_title')} />
  <meta property="og:description" content={t('featurePage.attendance.meta_og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.attendance.meta_title')} />
  <meta name="twitter:description" content={t('featurePage.attendance.meta_og_description')} />
  <link rel="canonical" href="https://ethoz.cl/funcionalidades/asistencia" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Control de Asistencia"}]})}</script>`}
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
        {t('featurePage.attendance.back_to_products')}
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-4">
            <CalendarCheck class="size-10 lg:size-12 shrink-0 text-primary-active" />
            <h1 class="page-title">
              {t('featurePage.attendance.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('featurePage.attendance.hero_subtitle')}
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-active">{t('featurePage.attendance.hero_badge_circular')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">{t('featurePage.attendance.hero_badge_digital_book')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">{t('featurePage.attendance.hero_badge_law')}</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              {t('featurePage.attendance.hero_cta_demo')} <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/productos">
              {t('featurePage.attendance.hero_cta_modules')}
            </Button>
          </div>
        </div>

        <!-- Attendance grid mockup -->
        <div aria-hidden="true" class="w-full rounded-xl border border-border bg-card shadow-card-dark-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.attendance.mockup_grid_titlebar')}</span>
          </div>
          <div class="p-3 sm:p-4">
            <!-- KPI bar -->
            <div class="mb-3 flex items-center gap-3">
              <div class="flex-1 rounded-lg bg-success/10 px-2.5 py-1.5 text-center">
                <p class="text-base font-bold text-success">94,2%</p>
                <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.attendance.mockup_kpi_label')}</p>
              </div>
              <div class="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-mockup-2xs font-semibold text-primary-active">
                <BadgeCheck class="size-3 shrink-0" />
                {t('featurePage.attendance.mockup_circular_chip')}
              </div>
            </div>
            <!-- Day headers -->
            <div class="grid grid-cols-[1fr_repeat(5,_1.5rem)] gap-1 text-mockup-3xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1">
              <span>{t('featurePage.attendance.mockup_col_student')}</span>
              {#each ['L', 'M', 'X', 'J', 'V'] as d}
                <span class="text-center">{d}</span>
              {/each}
            </div>
            <!-- Student rows -->
            <div class="space-y-0.5 max-h-52 overflow-y-auto">
              {#each students as s}
                <div class="grid grid-cols-[1fr_repeat(5,_1.5rem)] gap-1 items-center rounded px-1 py-0.5 hover:bg-muted/40">
                  <span class="truncate text-mockup-xs text-foreground">{s.name}</span>
                  {#each s.days as d}
                    <span class="size-5 rounded text-mockup-3xs font-bold flex items-center justify-center {dayColor(d)}">{d}</span>
                  {/each}
                </div>
              {/each}
            </div>
            <!-- Legend -->
            <div class="mt-2 flex flex-wrap gap-2 border-t border-border pt-2">
              {#each ([['P','bg-success','featurePage.attendance.legend_present'],['A','bg-destructive','featurePage.attendance.legend_absent'],['T','bg-warning','featurePage.attendance.legend_late'],['J','bg-primary/20','featurePage.attendance.legend_justified']] as const) as [k,c,l]}
                <span class="flex items-center gap-1 text-mockup-2xs text-muted-foreground">
                  <span class="size-3 rounded {c}"></span>{t(l)}
                </span>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — libro digital thesis -->
  <EditorialSection
    id="attendance-editorial"
    eyebrow={t('featurePage.attendance.editorial.eyebrow')}
    statement={t('featurePage.attendance.editorial.statement')}
    body={t('featurePage.attendance.editorial.body')}
  />

  <!-- Features -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.attendance.compliance_title')}</h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('featurePage.attendance.compliance_body')}
          </p>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <BadgeCheck class="size-4 shrink-0 text-success" />
                <h3 class="text-sm font-semibold text-foreground">{t('featurePage.attendance.feature_signature_title')}</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">{t('featurePage.attendance.feature_signature_body')}</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <BookOpen class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">{t('featurePage.attendance.feature_backup_title')}</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">{t('featurePage.attendance.feature_backup_body')}</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <AlertTriangle class="size-4 shrink-0 text-warning-foreground" />
                <h3 class="text-sm font-semibold text-foreground">{t('featurePage.attendance.feature_alerts_title')}</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">{t('featurePage.attendance.feature_alerts_body')}</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <FileText class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">{t('featurePage.attendance.feature_reports_title')}</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">{t('featurePage.attendance.feature_reports_body')}</p>
            </div>
          </div>
        </div>

        <!-- Justification flow mockup -->
        <div aria-hidden="true" class="rounded-xl border border-border bg-card shadow-mockup">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.attendance.mockup_justify_titlebar')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <p class="text-mockup-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('featurePage.attendance.mockup_justify_heading')}</p>
            <!-- Student info -->
            <div class="flex items-center gap-3 rounded-lg bg-muted/30 p-3 mb-3">
              <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-mockup-sm font-bold text-primary-active">AE</div>
              <div>
                <p class="text-xs font-semibold text-foreground">Alumno de ejemplo</p>
                <p class="text-mockup-xs text-muted-foreground">7°B · Ausente: 9 y 10 abr 2026</p>
              </div>
            </div>
            <!-- Reason -->
            <div class="space-y-2 mb-3">
              <p class="text-mockup-xs font-medium text-foreground">{t('featurePage.attendance.mockup_reason_label')}</p>
              <div class="rounded-lg border-2 border-primary/30 bg-primary/5 px-3 py-2 flex items-center gap-2">
                <span class="size-1.5 rounded-full bg-primary"></span>
                <span class="text-xs text-foreground">{t('featurePage.attendance.mockup_reason_value')}</span>
              </div>
            </div>
            <!-- Document attached -->
            <div class="rounded-lg border border-border bg-muted/20 px-3 py-2 mb-3 flex items-center gap-2">
              <FileText class="size-4 shrink-0 text-muted-foreground" />
              <div class="flex-1 min-w-0">
                <p class="text-mockup-xs font-medium text-foreground truncate">certificado_medico_09abr.pdf</p>
                <p class="text-mockup-2xs text-muted-foreground">CESFAM de ejemplo · Médico de ejemplo · 247 KB</p>
              </div>
              <CheckCircle2 class="size-3.5 shrink-0 text-success" />
            </div>
            <!-- Status -->
            <div class="rounded-lg bg-success/10 border border-success/20 px-3 py-2 flex items-center gap-2">
              <CheckCircle2 class="size-3.5 shrink-0 text-success" />
              <div>
                <p class="text-mockup-sm font-semibold text-success">{t('featurePage.attendance.mockup_status_approved')}</p>
                <p class="text-mockup-2xs text-muted-foreground">Inspector de ejemplo · 10 abr 2026, 08:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Absence risk section -->
  <section class="bg-secondary py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.attendance.flow_section_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.attendance.flow_section_subtitle')}</p>
      </div>
      <div class="mt-10 grid gap-3 sm:grid-cols-4">
        {#each [
          { n: '1', label: 'featurePage.attendance.flow_step1_label' as const, desc: 'featurePage.attendance.flow_step1_desc' as const },
          { n: '2', label: 'featurePage.attendance.flow_step2_label' as const, desc: 'featurePage.attendance.flow_step2_desc' as const },
          { n: '3', label: 'featurePage.attendance.flow_step3_label' as const, desc: 'featurePage.attendance.flow_step3_desc' as const },
          { n: '4', label: 'featurePage.attendance.flow_step4_label' as const, desc: 'featurePage.attendance.flow_step4_desc' as const },
        ] as step}
          <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="flex items-center gap-2.5 mb-3">
              <span class="size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary-active">{step.n}</span>
              <h3 class="text-sm font-semibold text-foreground">{t(step.label)}</h3>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground">{t(step.desc)}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Por qué importa -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-3">
        <StatCard
          value="20.000"
          valueClass="text-destructive"
          label={t('featurePage.attendance.stat_fine_label')}
          description={t('featurePage.attendance.stat_fine_desc')}
        />
        <StatCard
          value="Circular N°30"
          valueClass="text-primary"
          label={t('featurePage.attendance.stat_circular_label')}
          description={t('featurePage.attendance.stat_circular_desc')}
        />
        <StatCard
          value="15%"
          valueClass="text-warning-foreground"
          label={t('featurePage.attendance.stat_threshold_label')}
          description={t('featurePage.attendance.stat_threshold_desc')}
        />
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-secondary py-20 text-foreground sm:py-24" aria-labelledby="attendance-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('featurePage.attendance.finalCta.eyebrow')}</p>
      <h2 id="attendance-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-foreground sm:text-4xl">
        {t('featurePage.attendance.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('featurePage.attendance.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-8 text-sm font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.attendance.finalCta_button_demo')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/productos"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-foreground/20 bg-transparent px-8 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.attendance.finalCta_button_modules')}
        </a>
      </div>
    </div>
  </section>

  </main>
  <Footer />
</div>
