<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { trackEvent } from '$lib/utils/analytics';
  import { ShieldAlert, ArrowRight, ArrowLeft, AlertTriangle, Bell, FileWarning, Clock, CheckCircle2, XCircle, Scale } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'alerts' }); });
</script>

<svelte:head>
  <title>{BRAND} — Sistema de Alertas Críticas</title>
  <meta name="description" content={`Órdenes de alejamiento, suspensiones, riesgo familiar e ideación suicida: ${BRAND} centraliza todas las alertas críticas del colegio con seguimiento y trazabilidad completa.`} />
  <meta property="og:url" content="https://ethoz.cl/features/alerts" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${BRAND} — Sistema de Alertas Críticas`} />
  <meta property="og:description" content="Gestiona alertas críticas con trazabilidad completa: órdenes judiciales, riesgo familiar, ideación suicida y más." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${BRAND} — Sistema de Alertas Críticas`} />
  <meta name="twitter:description" content="Gestiona alertas críticas con trazabilidad completa: órdenes judiciales, riesgo familiar, ideación suicida y más." />
  <link rel="canonical" href="https://ethoz.cl/features/alerts" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Sistema de Alertas Críticas"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.alerts.back_to_products')}
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-3">
            <ShieldAlert class="size-6 shrink-0 text-destructive" />
            <h1 class="text-balance text-foreground">
              {t('featurePage.alerts.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('featurePage.alerts.hero_subtitle')}
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">{t('featurePage.alerts.badge_aula_segura')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{t('featurePage.alerts.badge_ley_21719')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">{t('featurePage.alerts.badge_protocolos_mineduc')}</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              {t('featurePage.alerts.hero_cta_primary')} <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/productos">
              {t('featurePage.alerts.cta_all_modules')}
            </Button>
          </div>
        </div>

        <!-- Mockup: Alert detail card -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{BRAND} — {t('featurePage.alerts.mockup_window_title')}</span>
          </div>
          <div class="p-4 sm:p-5 space-y-3">
            <!-- Critical alert -->
            <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Scale class="size-3.5 shrink-0 text-destructive" />
                  <span class="text-mockup-sm font-bold uppercase tracking-wide text-destructive">{t('featurePage.alerts.mockup_critical_type')}</span>
                </div>
                <span class="rounded-full bg-destructive/15 px-2 py-0.5 text-mockup-2xs font-semibold text-destructive">{t('featurePage.alerts.mockup_level_critical')}</span>
              </div>
              <p class="mt-1.5 text-mockup-sm font-semibold text-foreground">{t('featurePage.alerts.mockup_critical_person')}</p>
              <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.mockup_critical_student')}</p>
              <div class="mt-2 grid grid-cols-2 gap-1.5 text-mockup-2xs text-muted-foreground">
                <span><span class="font-medium text-foreground">{t('featurePage.alerts.mockup_label_tribunal')}</span> {t('featurePage.alerts.mockup_critical_tribunal_value')}</span>
                <span><span class="font-medium text-foreground">{t('featurePage.alerts.mockup_label_rit')}</span> C-4821-2025</span>
                <span><span class="font-medium text-foreground">{t('featurePage.alerts.mockup_label_vigencia')}</span> {t('featurePage.alerts.mockup_critical_vigencia_value')}</span>
                <span><span class="font-medium text-foreground">{t('featurePage.alerts.mockup_label_registro')}</span> {t('featurePage.alerts.mockup_critical_registro_value')}</span>
              </div>
            </div>
            <!-- Warning alert -->
            <div class="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <AlertTriangle class="size-3.5 shrink-0 text-warning-foreground" />
                  <span class="text-mockup-sm font-bold uppercase tracking-wide text-warning-foreground">{t('featurePage.alerts.mockup_warning_type')}</span>
                </div>
                <span class="rounded-full bg-warning/20 px-2 py-0.5 text-mockup-2xs font-semibold text-warning-foreground">{t('featurePage.alerts.mockup_level_high')}</span>
              </div>
              <p class="mt-1.5 text-mockup-sm font-semibold text-foreground">{t('featurePage.alerts.mockup_warning_person')}</p>
              <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.mockup_warning_detail')}</p>
            </div>
            <!-- Info alert -->
            <div class="rounded-lg border border-border bg-muted/30 p-3">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Bell class="size-3.5 shrink-0 text-muted-foreground" />
                  <span class="text-mockup-sm font-bold uppercase tracking-wide text-muted-foreground">{t('featurePage.alerts.mockup_info_type')}</span>
                </div>
                <span class="rounded-full bg-muted px-2 py-0.5 text-mockup-2xs font-semibold text-muted-foreground">{t('featurePage.alerts.mockup_level_medium')}</span>
              </div>
              <p class="mt-1.5 text-mockup-sm font-semibold text-foreground">{t('featurePage.alerts.mockup_info_person')}</p>
              <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.mockup_info_detail')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — alert architecture -->
  <EditorialSection
    id="alerts-editorial"
    eyebrow={t('featurePage.alerts.editorial.eyebrow')}
    statement={t('featurePage.alerts.editorial.statement')}
    body={t('featurePage.alerts.editorial.body')}
  />

  <!-- Alert types section -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.14em] text-primary">{t('featurePage.alerts.types_eyebrow')}</p>
        <h2 class="mt-3 text-2xl text-foreground sm:text-3xl">{t('featurePage.alerts.types_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.alerts.types_subtitle')}</p>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Scale class="size-5 shrink-0 text-destructive" />
            <h3 class="text-sm font-semibold text-foreground">{t('featurePage.alerts.type_restraining_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.alerts.type_restraining_body')}</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-destructive"></span>
            <span class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.type_restraining_visibility')}</span>
          </div>
        </div>

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <FileWarning class="size-5 shrink-0 text-destructive" />
            <h3 class="text-sm font-semibold text-foreground">{t('featurePage.alerts.type_suicidal_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.alerts.type_suicidal_body')}</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-destructive"></span>
            <span class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.type_suicidal_visibility')}</span>
          </div>
        </div>

        <div class="rounded-xl border border-warning/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <AlertTriangle class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-sm font-semibold text-foreground">{t('featurePage.alerts.type_family_risk_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.alerts.type_family_risk_body')}</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-warning"></span>
            <span class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.type_family_risk_visibility')}</span>
          </div>
        </div>

        <div class="rounded-xl border border-warning/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Clock class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-sm font-semibold text-foreground">{t('featurePage.alerts.type_suspension_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.alerts.type_suspension_body')}</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-warning"></span>
            <span class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.type_suspension_visibility')}</span>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <XCircle class="size-5 shrink-0 text-muted-foreground" />
            <h3 class="text-sm font-semibold text-foreground">{t('featurePage.alerts.type_pickup_restriction_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.alerts.type_pickup_restriction_body')}</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-muted-foreground"></span>
            <span class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.type_pickup_restriction_visibility')}</span>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <CheckCircle2 class="size-5 shrink-0 text-primary" />
            <h3 class="text-sm font-semibold text-foreground">{t('featurePage.alerts.type_custom_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.alerts.type_custom_body')}</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-primary"></span>
            <span class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.type_custom_visibility')}</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Timeline mockup section -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.alerts.traceability_title')}</h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('featurePage.alerts.traceability_body')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">{t('featurePage.alerts.traceability_point_1')}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">{t('featurePage.alerts.traceability_point_2')}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">{t('featurePage.alerts.traceability_point_3')}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">{t('featurePage.alerts.traceability_point_4')}</span>
            </li>
          </ul>
        </div>
        <!-- Timeline mockup -->
        <div class="rounded-xl border border-border bg-card shadow-mockup">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{BRAND} — {t('featurePage.alerts.timeline_window_title')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <p class="mb-3 text-mockup-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('featurePage.alerts.timeline_subject')}</p>
            <div class="relative space-y-3 pl-4 before:absolute before:left-1.5 before:top-1 before:h-full before:w-px before:bg-border">
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-destructive ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-mockup-sm font-semibold text-foreground">{t('featurePage.alerts.timeline_step1_title')}</p>
                  <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.timeline_step1_meta')}</p>
                  <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.timeline_step1_detail')}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-warning ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-mockup-sm font-semibold text-foreground">{t('featurePage.alerts.timeline_step2_title')}</p>
                  <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.timeline_step2_meta')}</p>
                  <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.timeline_step2_detail')}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-destructive ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-mockup-sm font-semibold text-foreground">{t('featurePage.alerts.timeline_step3_title')}</p>
                  <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.timeline_step3_meta')}</p>
                  <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.timeline_step3_detail')}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-muted-foreground ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-mockup-sm font-semibold text-foreground">{t('featurePage.alerts.timeline_step4_title')}</p>
                  <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.timeline_step4_detail')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Por qué importa -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.alerts.why_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.alerts.why_subtitle')}</p>
      </div>
      <div class="mt-10 grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-destructive">20.000</p>
          <p class="mt-1 text-sm font-semibold text-foreground">{t('featurePage.alerts.stat_fine_label')}</p>
          <p class="mt-2 text-xs text-muted-foreground">{t('featurePage.alerts.stat_fine_desc')}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-primary">12.038</p>
          <p class="mt-1 text-sm font-semibold text-foreground">{t('featurePage.alerts.stat_schools_label')}</p>
          <p class="mt-2 text-xs text-muted-foreground">{t('featurePage.alerts.stat_schools_desc')}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-warning-foreground">dic 2026</p>
          <p class="mt-1 text-sm font-semibold text-foreground">{t('featurePage.alerts.stat_deadline_label')}</p>
          <p class="mt-2 text-xs text-muted-foreground">{t('featurePage.alerts.stat_deadline_desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="alerts-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-background/85">{t('featurePage.alerts.finalCta.eyebrow')}</p>
      <h2 id="alerts-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('featurePage.alerts.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.alerts.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.alerts.final_cta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/productos"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.alerts.cta_all_modules')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
