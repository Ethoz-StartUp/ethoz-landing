<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { trackEvent } from '$lib/utils/analytics';
  import { Siren, ArrowRight, ArrowLeft, Flame, Activity, UserX, AlertTriangle, CheckCircle2, Bell, MapPin, Clock } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'emergency' }); });
</script>

<svelte:head>
  <title>{BRAND} — {t('featurePage.emergency.meta_title_suffix')}</title>
  <meta name="description" content={t('featurePage.emergency.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/features/emergency" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.emergency.og_title')} />
  <meta property="og:description" content={t('featurePage.emergency.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.emergency.og_title')} />
  <meta name="twitter:description" content={t('featurePage.emergency.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/features/emergency" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Protocolos de Emergencia"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.emergency.back_to_products')}
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-3">
            <Siren class="size-6 shrink-0 text-destructive" />
            <h1 class="text-balance text-foreground">
              {t('featurePage.emergency.hero_title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('featurePage.emergency.hero_subtitle')}
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">{t('featurePage.emergency.hero_badge_onemi')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{t('featurePage.emergency.hero_badge_senapred')}</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">{t('featurePage.emergency.hero_badge_pse')}</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              {t('featurePage.emergency.hero_cta_demo')} <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/productos">
              {t('featurePage.emergency.hero_cta_modules')}
            </Button>
          </div>
        </div>

        <!-- Emergency activation mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.emergency.mockup_window_label')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- Active emergency banner -->
            <div class="rounded-lg border border-destructive/40 bg-destructive/10 p-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-destructive animate-pulse"></span>
                <span class="text-mockup-sm font-bold uppercase tracking-wide text-destructive">{t('featurePage.emergency.mockup_banner_status')}</span>
                <span class="ml-auto text-mockup-xs text-muted-foreground">14:23:07</span>
              </div>
              <p class="mt-1 text-mockup-xs text-muted-foreground">{t('featurePage.emergency.mockup_banner_activated_by')}</p>
            </div>
            <!-- Phase flow -->
            <div class="flex items-center gap-1 mb-3">
              {#each [
                { labelKey: 'featurePage.emergency.mockup_phase_alerta' as const },
                { labelKey: 'featurePage.emergency.mockup_phase_evacuacion' as const },
                { labelKey: 'featurePage.emergency.mockup_phase_punto_encuentro' as const },
                { labelKey: 'featurePage.emergency.mockup_phase_conteo' as const },
                { labelKey: 'featurePage.emergency.mockup_phase_finalizado' as const },
              ] as phase, i}
                <div class="flex items-center gap-1 flex-1">
                  <div class="flex-1 flex flex-col items-center gap-0.5">
                    <span class="size-4 rounded-full flex items-center justify-center text-mockup-3xs font-bold
                      {i === 0 ? 'bg-success text-success-foreground' :
                       i === 1 ? 'bg-destructive text-destructive-foreground animate-pulse' :
                       'bg-muted text-muted-foreground'}">{i + 1}</span>
                    <span class="text-mockup-3xs text-center text-muted-foreground leading-tight">{t(phase.labelKey)}</span>
                  </div>
                  {#if i < 4}
                    <div class="h-px flex-1 {i < 1 ? 'bg-success' : 'bg-muted'} mb-3"></div>
                  {/if}
                </div>
              {/each}
            </div>
            <!-- Rollcall progress -->
            <div>
              <p class="mb-1.5 text-mockup-2xs font-semibold uppercase tracking-wider text-muted-foreground">{t('featurePage.emergency.mockup_rollcall_title')}</p>
              <div class="space-y-1.5">
                {#each [
                  { curso: '7°A', total: 32, present: 31, teacher: 'Prof. Soto' },
                  { curso: '7°B', total: 30, present: 30, teacher: 'Prof. García' },
                  { curso: '8°A', total: 28, present: 25, teacher: 'Prof. Martínez' },
                ] as row}
                  <div class="flex items-center gap-2 text-mockup-xs">
                    <span class="w-7 font-medium text-foreground">{row.curso}</span>
                    <div class="flex-1 rounded-full bg-muted h-1.5">
                      <div class="h-1.5 rounded-full {row.present === row.total ? 'bg-success' : 'bg-warning'}"
                        style="width: {Math.round(row.present/row.total*100)}%"></div>
                    </div>
                    <span class="{row.present === row.total ? 'text-success' : 'text-warning-foreground'} font-semibold">{row.present}/{row.total}</span>
                    <span class="text-muted-foreground">{row.teacher}</span>
                  </div>
                {/each}
              </div>
              <div class="mt-2 rounded-lg bg-warning/10 px-2 py-1.5 text-mockup-xs text-warning-foreground">
                {t('featurePage.emergency.mockup_rollcall_warning')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — seconds matter thesis -->
  <EditorialSection
    id="emergency-editorial"
    eyebrow={t('featurePage.emergency.editorial.eyebrow')}
    statement={t('featurePage.emergency.editorial.statement')}
    body={t('featurePage.emergency.editorial.body')}
  />

  <!-- Protocol cards -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('featurePage.emergency.protocols_eyebrow')}</p>
        <h2 class="mt-3 text-2xl text-foreground sm:text-3xl">{t('featurePage.emergency.protocols_title')}</h2>
        <p class="mt-3 text-base text-muted-foreground">{t('featurePage.emergency.protocols_subtitle')}</p>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div class="rounded-xl border border-warning/30 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <AlertTriangle class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-base text-foreground">{t('featurePage.emergency.protocol_sismo_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.emergency.protocol_sismo_desc')}</p>
          <ul class="mt-3 space-y-1">
            {#each [
              { labelKey: 'featurePage.emergency.protocol_sismo_feat_1' as const },
              { labelKey: 'featurePage.emergency.protocol_sismo_feat_2' as const },
              { labelKey: 'featurePage.emergency.protocol_sismo_feat_3' as const },
              { labelKey: 'featurePage.emergency.protocol_sismo_feat_4' as const },
            ] as f}
              <li class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {t(f.labelKey)}
              </li>
            {/each}
          </ul>
        </div>

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Flame class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base text-foreground">{t('featurePage.emergency.protocol_incendio_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.emergency.protocol_incendio_desc')}</p>
          <ul class="mt-3 space-y-1">
            {#each [
              { labelKey: 'featurePage.emergency.protocol_incendio_feat_1' as const },
              { labelKey: 'featurePage.emergency.protocol_incendio_feat_2' as const },
              { labelKey: 'featurePage.emergency.protocol_incendio_feat_3' as const },
              { labelKey: 'featurePage.emergency.protocol_incendio_feat_4' as const },
            ] as f}
              <li class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {t(f.labelKey)}
              </li>
            {/each}
          </ul>
        </div>

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <UserX class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base text-foreground">{t('featurePage.emergency.protocol_intruso_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.emergency.protocol_intruso_desc')}</p>
          <ul class="mt-3 space-y-1">
            {#each [
              { labelKey: 'featurePage.emergency.protocol_intruso_feat_1' as const },
              { labelKey: 'featurePage.emergency.protocol_intruso_feat_2' as const },
              { labelKey: 'featurePage.emergency.protocol_intruso_feat_3' as const },
              { labelKey: 'featurePage.emergency.protocol_intruso_feat_4' as const },
            ] as f}
              <li class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {t(f.labelKey)}
              </li>
            {/each}
          </ul>
        </div>

        <div class="rounded-xl border border-primary/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Activity class="size-5 shrink-0 text-primary" />
            <h3 class="text-base text-foreground">{t('featurePage.emergency.protocol_medica_title')}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{t('featurePage.emergency.protocol_medica_desc')}</p>
          <ul class="mt-3 space-y-1">
            {#each [
              { labelKey: 'featurePage.emergency.protocol_medica_feat_1' as const },
              { labelKey: 'featurePage.emergency.protocol_medica_feat_2' as const },
              { labelKey: 'featurePage.emergency.protocol_medica_feat_3' as const },
              { labelKey: 'featurePage.emergency.protocol_medica_feat_4' as const },
            ] as f}
              <li class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {t(f.labelKey)}
              </li>
            {/each}
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- Guardian notification mockup -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 class="text-2xl text-foreground sm:text-3xl">{t('featurePage.emergency.guardian_title')}</h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('featurePage.emergency.guardian_body')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5">
              <Bell class="size-4 shrink-0 text-primary mt-0.5" />
              <span class="text-sm text-muted-foreground">{t('featurePage.emergency.guardian_item_push')}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <CheckCircle2 class="size-4 shrink-0 text-success mt-0.5" />
              <span class="text-sm text-muted-foreground">{t('featurePage.emergency.guardian_item_safe')}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <MapPin class="size-4 shrink-0 text-primary mt-0.5" />
              <span class="text-sm text-muted-foreground">{t('featurePage.emergency.guardian_item_pickup')}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <Clock class="size-4 shrink-0 text-primary mt-0.5" />
              <span class="text-sm text-muted-foreground">{t('featurePage.emergency.guardian_item_updates')}</span>
            </li>
          </ul>
        </div>
        <!-- Notification mockup -->
        <div class="mx-auto max-w-xs w-full">
          <div class="rounded-xl border border-border bg-card shadow-card-hover overflow-hidden">
            <!-- Phone top bar -->
            <div class="bg-muted/50 px-4 py-2 flex items-center justify-between">
              <span class="text-mockup-xs font-medium text-muted-foreground">14:24</span>
              <span class="text-mockup-xs text-muted-foreground">{BRAND}</span>
            </div>
            <!-- Notification cards -->
            <div class="p-3 space-y-2">
              <div class="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Siren class="size-3.5 shrink-0 text-destructive" />
                  <span class="text-mockup-sm font-bold text-destructive">{t('featurePage.emergency.notif_alert_title')}</span>
                </div>
                <p class="text-mockup-xs text-foreground font-medium">Colegio Alemán de Concepción</p>
                <p class="text-mockup-xs text-muted-foreground">{t('featurePage.emergency.notif_alert_body')}</p>
                <p class="text-mockup-2xs text-muted-foreground mt-1">{t('featurePage.emergency.notif_alert_time')}</p>
              </div>
              <div class="rounded-xl bg-success/10 border border-success/20 p-3">
                <div class="flex items-center gap-2 mb-1">
                  <CheckCircle2 class="size-3.5 shrink-0 text-success" />
                  <span class="text-mockup-sm font-bold text-success">{t('featurePage.emergency.notif_safe_title')}</span>
                </div>
                <p class="text-mockup-xs text-muted-foreground">{t('featurePage.emergency.notif_safe_body')}</p>
                <p class="text-mockup-2xs text-muted-foreground mt-1">{t('featurePage.emergency.notif_safe_time')}</p>
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
      <div class="grid gap-4 sm:grid-cols-3">
        <StatCard
          value="9.4"
          valueClass="text-destructive"
          label={t('featurePage.emergency.stat_1_label')}
          description={t('featurePage.emergency.stat_1_desc')}
        />
        <StatCard
          value="12.038"
          valueClass="text-primary"
          label={t('featurePage.emergency.stat_2_label')}
          description={t('featurePage.emergency.stat_2_desc')}
        />
        <StatCard
          value="20.000"
          valueClass="text-warning-foreground"
          label={t('featurePage.emergency.stat_3_label')}
          description={t('featurePage.emergency.stat_3_desc')}
        />
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="emergency-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-background/85">{t('featurePage.emergency.finalCta.eyebrow')}</p>
      <h2 id="emergency-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('featurePage.emergency.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.emergency.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.emergency.finalCta_btn_demo')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/productos"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.emergency.hero_cta_modules')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
