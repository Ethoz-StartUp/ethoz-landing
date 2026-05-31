<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import {
    Building2, ArrowRight, ShieldAlert, BarChart3, BadgeCheck,
    AlertTriangle, FileSearch, TrendingDown, Scale, CheckCircle, XCircle,
    Users, DollarSign, Activity, ClipboardCheck
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('audience_page_viewed', { audience: 'sostenedores' }); });

  const colegios = [
    { nombre: 'Colegio San Patricio', rbd: '9234', alumnos: 842, alertas: 2, incidentes: 3, cumplimiento: 94 },
    { nombre: 'Liceo Santa María', rbd: '11045', alumnos: 1204, alertas: 0, incidentes: 1, cumplimiento: 98 },
    { nombre: 'Escuela La Esperanza', rbd: '7821', alumnos: 468, alertas: 5, incidentes: 7, cumplimiento: 71 },
    { nombre: 'Colegio Los Andes', rbd: '14302', alumnos: 931, alertas: 1, incidentes: 2, cumplimiento: 96 },
    { nombre: 'Instituto Bicentenario', rbd: '8890', alumnos: 1573, alertas: 3, incidentes: 4, cumplimiento: 88 },
  ];

  const auditLog = [
    { hora: '09:14', colegio: 'Esc. La Esperanza', accion: 'audience.sostenedores.auditlog_accion1' as const, usuario: 'audience.sostenedores.auditlog_usuario1' as const, nivel: 'critical' },
    { hora: '08:52', colegio: 'Col. San Patricio', accion: 'audience.sostenedores.auditlog_accion2' as const, usuario: 'audience.sostenedores.auditlog_usuario2' as const, nivel: 'info' },
    { hora: '08:31', colegio: 'Lic. Santa María', accion: 'audience.sostenedores.auditlog_accion3' as const, usuario: 'audience.sostenedores.auditlog_usuario3' as const, nivel: 'info' },
    { hora: '07:58', colegio: 'Inst. Bicentenario', accion: 'audience.sostenedores.auditlog_accion4' as const, usuario: 'audience.sostenedores.auditlog_usuario4' as const, nivel: 'warning' },
    { hora: '07:44', colegio: 'Col. Los Andes', accion: 'audience.sostenedores.auditlog_accion5' as const, usuario: 'audience.sostenedores.auditlog_usuario5' as const, nivel: 'info' },
  ];
</script>

<svelte:head>
  <title>{t('audience.sostenedores.meta_title')}</title>
  <meta name="description" content={t('audience.sostenedores.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/para-sostenedores" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('audience.sostenedores.meta_og_title')} />
  <meta property="og:description" content={t('audience.sostenedores.meta_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('audience.sostenedores.meta_og_title')} />
  <meta name="twitter:description" content={t('audience.sostenedores.meta_description')} />
  <link rel="canonical" href="https://ethoz.cl/para-sostenedores" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Para Sostenedores","item":"https://ethoz.cl/para-sostenedores"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Building2 class="size-3.5 text-primary" />
            {t('audience.sostenedores.hero_badge')}
          </div>
          <div class="flex items-start gap-3">
            <Building2 class="mt-1 size-7 shrink-0 text-primary" />
            <h1 class="text-balance text-foreground">
              {t('audience.sostenedores.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.hero_subtitle')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.sostenedores.hero_bullet1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.sostenedores.hero_bullet2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('audience.sostenedores.hero_bullet3')}
            </li>
          </ul>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" href="/demo">
              {t('audience.sostenedores.hero_cta')} <ArrowRight class="size-4" />
            </Button>
          </div>
        </div>

        <!-- Dashboard multi-colegio mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('audience.sostenedores.mockup_panel_title')}</span>
          </div>
          <div class="p-4">
            <!-- Summary KPIs -->
            <div class="mb-3 grid grid-cols-4 gap-2">
              {#each [
                { label: 'audience.sostenedores.kpi_alumnos' as const, value: '5.018', icon: Users },
                { label: 'audience.sostenedores.kpi_alertas' as const, value: '11', icon: AlertTriangle, danger: true },
                { label: 'audience.sostenedores.kpi_incidentes' as const, value: '17', icon: Activity },
                { label: 'audience.sostenedores.kpi_cumplimiento' as const, value: '89%', icon: CheckCircle },
              ] as kpi}
                <div class="rounded-lg border border-border bg-background px-2 py-2 text-center">
                  <kpi.icon class="mx-auto mb-1 size-3.5 {kpi.danger ? 'text-destructive' : 'text-primary'}" />
                  <p class="text-sm font-bold {kpi.danger ? 'text-destructive' : 'text-foreground'}">{kpi.value}</p>
                  <p class="text-mockup-2xs text-muted-foreground">{t(kpi.label)}</p>
                </div>
              {/each}
            </div>
            <!-- School cards grid -->
            <div class="space-y-1.5">
              {#each colegios as col}
                <div class="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
                  <div class="flex-1 min-w-0">
                    <p class="text-mockup-sm font-semibold text-foreground truncate">{col.nombre}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('audience.sostenedores.mockup_rbd_label')} {col.rbd} · {col.alumnos.toLocaleString('es-CL')} {t('audience.sostenedores.mockup_alumnos_suffix')}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-center">
                      <p class="text-mockup-xs font-bold {col.alertas > 3 ? 'text-destructive' : col.alertas > 0 ? 'text-warning-foreground' : 'text-success'}">{col.alertas}</p>
                      <p class="text-mockup-3xs text-muted-foreground">{t('audience.sostenedores.mockup_alertas_label')}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-mockup-xs font-bold text-foreground">{col.incidentes}</p>
                      <p class="text-mockup-3xs text-muted-foreground">{t('audience.sostenedores.mockup_incidentes_label')}</p>
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="h-1.5 w-12 rounded-full bg-border overflow-hidden">
                        <div
                          class="h-full rounded-full {col.cumplimiento >= 90 ? 'bg-success' : col.cumplimiento >= 80 ? 'bg-warning' : 'bg-destructive'}"
                          style="width: {col.cumplimiento}%"
                        ></div>
                      </div>
                      <p class="text-mockup-2xs font-semibold {col.cumplimiento >= 90 ? 'text-success' : col.cumplimiento >= 80 ? 'text-warning-foreground' : 'text-destructive'}">{col.cumplimiento}%</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — sostenedor voice -->
  <section class="py-12 sm:py-14" aria-labelledby="sostenedor-editorial">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p id="sostenedor-editorial" class="mt-6 text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('audience.sostenedores.editorial.eyebrow')}</p>
      <blockquote class="mt-5 font-heading text-2xl leading-[1.35] text-foreground sm:text-3xl lg:text-4xl lg:leading-[1.3]">
        {t('audience.sostenedores.editorial.statement')}
      </blockquote>
      <p class="mt-6 text-sm text-muted-foreground">
        {t('audience.sostenedores.editorial.body')}
      </p>
    </div>
  </section>

  <!-- El problema del sostenedor en 2026 -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-2">
        <AlertTriangle class="size-5 shrink-0 text-destructive" />
        <h2 class="font-heading text-xl text-foreground sm:text-2xl">{t('audience.sostenedores.problem_title')}</h2>
      </div>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        {t('audience.sostenedores.problem_intro')}
      </p>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5 mb-3">
            <Scale class="size-5 shrink-0 text-destructive" />
            <h3 class="font-heading text-base text-foreground">{t('audience.sostenedores.problem_card1_title')}</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.problem_card1_body_p1')} <strong class="text-foreground">{t('audience.sostenedores.problem_card1_body_strong1')}</strong>{t('audience.sostenedores.problem_card1_body_p2')} <strong class="text-foreground">{t('audience.sostenedores.problem_card1_body_strong2')}</strong>{t('audience.sostenedores.problem_card1_body_p3')}
          </p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5 mb-3">
            <TrendingDown class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="font-heading text-base text-foreground">{t('audience.sostenedores.problem_card2_title')}</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.problem_card2_body')}
          </p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5 mb-3">
            <BarChart3 class="size-5 shrink-0 text-primary" />
            <h3 class="font-heading text-base text-foreground">{t('audience.sostenedores.problem_card3_title')}</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.problem_card3_body')}
          </p>
        </div>
        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
          <div class="flex items-center gap-2.5 mb-3">
            <FileSearch class="size-5 shrink-0 text-primary" />
            <h3 class="font-heading text-base text-foreground">{t('audience.sostenedores.problem_card4_title')}</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.problem_card4_body')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Exposición legal por N colegios -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <Scale class="size-5 shrink-0 text-destructive" />
            <h2 class="font-heading text-xl text-foreground sm:text-2xl">{t('audience.sostenedores.exposure_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.exposure_body1_p1')} <strong class="text-foreground">{t('audience.sostenedores.exposure_body1_strong')}</strong>{t('audience.sostenedores.exposure_body1_p2')}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.exposure_body2')}
          </p>
          <div class="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p class="text-xs font-semibold text-destructive mb-3">{t('audience.sostenedores.exposure_sim_title')}</p>
            {#each [
              { sedes: 1, monto: '20.000 UTM' },
              { sedes: 3, monto: '60.000 UTM' },
              { sedes: 5, monto: '100.000 UTM' },
            ] as row}
              <div class="flex items-center justify-between py-1.5 border-b border-destructive/10 last:border-0">
                <p class="text-xs text-muted-foreground">{row.sedes} {row.sedes > 1 ? t('audience.sostenedores.exposure_sim_row_establecimientos') : t('audience.sostenedores.exposure_sim_row_establecimiento')} {t('audience.sostenedores.exposure_sim_row_suffix')}</p>
                <p class="text-xs font-bold text-destructive">{t('audience.sostenedores.exposure_sim_row_hasta')} {row.monto}</p>
              </div>
            {/each}
            <p class="mt-2 text-mockup-xs text-muted-foreground">{t('audience.sostenedores.exposure_sim_footnote')}</p>
          </div>
        </div>

        <!-- Consolidación financiera -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <DollarSign class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">{t('audience.sostenedores.finance_title')}</span>
          </div>
          <div class="p-4 space-y-3">
            <div class="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p class="flex items-center gap-1.5 text-mockup-xs font-semibold text-foreground mb-2"><XCircle class="size-3.5 shrink-0 text-destructive" />{t('audience.sostenedores.finance_without_title')}</p>
              <div class="space-y-1.5">
                {#each [
                  { item: 'audience.sostenedores.finance_without_item1' as const, valor: 'audience.sostenedores.finance_without_valor1' as const },
                  { item: 'audience.sostenedores.finance_without_item2' as const, valor: 'audience.sostenedores.finance_without_valor2' as const },
                  { item: 'audience.sostenedores.finance_without_item3' as const, valor: 'audience.sostenedores.finance_without_valor3' as const },
                ] as row}
                  <div class="flex justify-between text-mockup-xs">
                    <span class="text-muted-foreground">{t(row.item)}</span>
                    <span class="font-semibold text-foreground">{t(row.valor)}</span>
                  </div>
                {/each}
              </div>
            </div>
            <div class="rounded-lg border border-success/20 bg-success/5 p-3">
              <p class="flex items-center gap-1.5 text-mockup-xs font-semibold text-foreground mb-2"><CheckCircle class="size-3.5 shrink-0 text-success" />{t('audience.sostenedores.finance_with_title')}</p>
              <div class="space-y-1.5">
                {#each [
                  { item: 'audience.sostenedores.finance_with_item1' as const, valor: 'audience.sostenedores.finance_with_valor1' as const },
                  { item: 'audience.sostenedores.finance_with_item2' as const, valor: 'audience.sostenedores.finance_with_valor2' as const },
                  { item: 'audience.sostenedores.finance_with_item3' as const, valor: 'audience.sostenedores.finance_with_valor3' as const },
                ] as row}
                  <div class="flex justify-between text-mockup-xs">
                    <span class="text-muted-foreground">{t(row.item)}</span>
                    <span class="font-semibold text-foreground">{t(row.valor)}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Auditoría centralizada -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <ClipboardCheck class="size-5 shrink-0 text-primary" />
            <h2 class="font-heading text-xl text-foreground sm:text-2xl">{t('audience.sostenedores.audit_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.audit_body1')}
          </p>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t('audience.sostenedores.audit_body2')}
          </p>
          <div class="mt-6 space-y-3">
            {#each [
              { icon: CheckCircle, text: 'audience.sostenedores.audit_feature1' as const },
              { icon: CheckCircle, text: 'audience.sostenedores.audit_feature2' as const },
              { icon: CheckCircle, text: 'audience.sostenedores.audit_feature3' as const },
            ] as item}
              <div class="flex items-start gap-2.5 text-sm text-muted-foreground">
                <item.icon class="mt-0.5 size-4 shrink-0 text-primary" />
                {t(item.text)}
              </div>
            {/each}
          </div>
        </div>

        <!-- Audit log mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <FileSearch class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">{t('audience.sostenedores.auditlog_header')}</span>
          </div>
          <div class="divide-y divide-border">
            {#each auditLog as entry}
              <div class="flex items-start gap-3 px-4 py-2.5">
                <span class="mt-0.5 shrink-0 text-mockup-2xs font-mono text-muted-foreground w-8">{entry.hora}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-mockup-sm font-medium {entry.nivel === 'critical' ? 'text-destructive' : entry.nivel === 'warning' ? 'text-warning-foreground' : 'text-foreground'} truncate">{t(entry.accion)}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-mockup-2xs font-medium text-primary">{entry.colegio}</span>
                    <span class="text-mockup-2xs text-muted-foreground">{t(entry.usuario)}</span>
                  </div>
                </div>
                {#if entry.nivel === 'critical'}
                  <AlertTriangle class="mt-0.5 size-3.5 shrink-0 text-destructive" />
                {:else if entry.nivel === 'warning'}
                  <AlertTriangle class="mt-0.5 size-3.5 shrink-0 text-warning-foreground" />
                {:else}
                  <CheckCircle class="mt-0.5 size-3.5 shrink-0 text-success" />
                {/if}
              </div>
            {/each}
          </div>
          <div class="border-t border-border px-4 py-2 flex items-center justify-between">
            <p class="text-mockup-2xs text-muted-foreground">{t('audience.sostenedores.auditlog_footer')}</p>
            <button class="text-mockup-2xs font-medium text-primary hover:underline">{t('audience.sostenedores.auditlog_view_full')}</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TAM callout + stats -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t('audience.sostenedores.tam_eyebrow')}</p>
        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <p data-numeric class="font-heading text-4xl text-foreground">402</p>
            <p class="mt-1 text-sm text-muted-foreground">{t('audience.sostenedores.tam_stat1_label')}</p>
          </div>
          <div>
            <p data-numeric class="font-heading text-4xl text-foreground">12.038</p>
            <p class="mt-1 text-sm text-muted-foreground">{t('audience.sostenedores.tam_stat2_label')}</p>
          </div>
          <div>
            <p data-numeric class="font-heading text-4xl text-foreground">5.777</p>
            <p class="mt-1 text-sm text-muted-foreground">{t('audience.sostenedores.tam_stat3_label')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="sostenedor-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-background/85">{t('audience.sostenedores.finalCta.eyebrow')}</p>
      <h2 id="sostenedor-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('audience.sostenedores.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('audience.sostenedores.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('audience.sostenedores.finalCta_button_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/#features"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('audience.sostenedores.finalCta_button_secondary')}
        </a>
      </div>
      <p class="mt-8 text-xs text-background/80">
        {t('audience.sostenedores.finalCta.footnote')}
      </p>
    </div>
  </section>

  <Footer />
</main>
