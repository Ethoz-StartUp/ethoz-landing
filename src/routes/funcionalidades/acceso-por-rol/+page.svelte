<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { Button } from '$lib/components/ui/button';
  import {
    Fingerprint, ArrowRight, ArrowLeft, UserCog, GanttChartSquare, EyeOff,
    Check, X, ShieldCheck, BadgeCheck, Lock, Users
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'access-control' }); });

  // Roles and permissions matrix
  const roles = [
    { nameKey: 'featurePage.accessControl.role_director' as const, abbr: 'DIR', color: 'text-primary' },
    { nameKey: 'featurePage.accessControl.role_inspector' as const, abbr: 'INS', color: 'text-foreground' },
    { nameKey: 'featurePage.accessControl.role_counselor' as const, abbr: 'ORI', color: 'text-foreground' },
    { nameKey: 'featurePage.accessControl.role_teacher' as const, abbr: 'DOC', color: 'text-foreground' },
    { nameKey: 'featurePage.accessControl.role_utp' as const, abbr: 'UTP', color: 'text-foreground' },
    { nameKey: 'featurePage.accessControl.role_doorkeeper' as const, abbr: 'POR', color: 'text-muted-foreground' },
  ];

  const permissions = [
    { labelKey: 'featurePage.accessControl.perm_view_basic' as const,    values: [true,  true,  true,  true,  true,  false] },
    { labelKey: 'featurePage.accessControl.perm_view_medical' as const,  values: [true,  false, true,  false, false, false] },
    { labelKey: 'featurePage.accessControl.perm_view_judicial' as const, values: [true,  true,  true,  false, false, false] },
    { labelKey: 'featurePage.accessControl.perm_register_pickup' as const, values: [true,  true,  false, false, false, true]  },
    { labelKey: 'featurePage.accessControl.perm_add_note' as const,      values: [true,  true,  true,  true,  false, false] },
    { labelKey: 'featurePage.accessControl.perm_export_data' as const,   values: [true,  false, false, false, true,  false] },
    { labelKey: 'featurePage.accessControl.perm_manage_users' as const,  values: [true,  false, false, false, false, false] },
  ];

  let activeRole = $state<string | null>(null);
</script>

<svelte:head>
  <title>{BRAND} · {t('features.rbac.title')}</title>
  <meta name="description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <meta property="og:url" content="https://ethoz.cl/funcionalidades/acceso-por-rol" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${BRAND} · Control de Acceso Granular por Roles`} />
  <meta property="og:description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${BRAND} · Control de Acceso Granular por Roles`} />
  <meta name="twitter:description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <link rel="canonical" href="https://ethoz.cl/funcionalidades/acceso-por-rol" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Control de Acceso por Roles"}]})}</script>`}
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
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="-mt-3 mb-5 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.accessControl.back_link')}
      </a>
      <div class="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-4">
          <div class="flex items-center gap-3">
            <Fingerprint class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-foreground">
              {t('features.rbac.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.rbac.desc')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.accessControl.hero_bullet1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.accessControl.hero_bullet2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.accessControl.hero_bullet3')}
            </li>
          </ul>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              {t('featurePage.accessControl.hero_cta_primary')} <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/productos">
              {t('featurePage.accessControl.hero_cta_secondary')}
            </Button>
          </div>
        </div>

        <!-- Permission matrix mockup -->
        <div aria-hidden="true" class="w-full rounded-xl border border-border bg-card shadow-card-hover overflow-hidden">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.accessControl.matrix_titlebar')}</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-mockup-xs">
              <caption class="sr-only">{t('featurePage.accessControl.matrix_caption')}</caption>
              <thead>
                <tr class="border-b border-border bg-muted/30">
                  <th scope="col" class="px-3 py-2 text-left font-semibold text-muted-foreground">{t('featurePage.accessControl.matrix_col_permission')}</th>
                  {#each roles as role}
                    <th scope="col" class="px-2 py-2 text-center font-semibold {role.color}" title={t(role.nameKey)}>{role.abbr}</th>
                  {/each}
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                {#each permissions as perm}
                  <tr class="hover:bg-muted transition-colors">
                    <th scope="row" class="px-3 py-2 text-left font-normal text-muted-foreground whitespace-nowrap">{t(perm.labelKey)}</th>
                    {#each perm.values as val, vi}
                      <td class="px-2 py-2 text-center">
                        {#if val}
                          <span class="inline-flex items-center justify-center size-4 rounded-full bg-success/10 mx-auto" aria-label={`${t(roles[vi].nameKey)}: ${t('featurePage.accessControl.matrix_allowed')}`}>
                            <Check aria-hidden="true" class="size-2.5 text-success" />
                          </span>
                        {:else}
                          <span class="inline-flex items-center justify-center size-4 rounded-full bg-muted mx-auto" aria-label={`${t(roles[vi].nameKey)}: ${t('featurePage.accessControl.matrix_denied')}`}>
                            <X aria-hidden="true" class="size-2.5 text-muted-foreground" />
                          </span>
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <div class="px-4 py-2.5 border-t border-border bg-muted/20">
            <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.accessControl.matrix_footnote')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — privacy principle -->
  <EditorialSection
    id="rbac-editorial"
    eyebrow={t('featurePage.accessControl.editorial.eyebrow')}
    statement={t('featurePage.accessControl.editorial.statement')}
    body={t('featurePage.accessControl.editorial.body')}
  />

  <!-- Role cards section -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="mb-2 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('featurePage.accessControl.byrole_eyebrow')}</p>
      <h2 class="mb-2 text-xl text-foreground sm:text-2xl">{t('featurePage.accessControl.byrole_title')}</h2>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        {t('featurePage.accessControl.byrole_intro')}
      </p>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {#each [
          {
            roleKey: 'featurePage.accessControl.role_director' as const,
            icon: ShieldCheck,
            color: 'text-primary',
            descKey: 'featurePage.accessControl.card_director_desc' as const,
            can: [
              'featurePage.accessControl.card_director_can1',
              'featurePage.accessControl.card_director_can2',
              'featurePage.accessControl.card_director_can3',
            ] as const,
          },
          {
            roleKey: 'featurePage.accessControl.role_inspector' as const,
            icon: Users,
            color: 'text-foreground',
            descKey: 'featurePage.accessControl.card_inspector_desc' as const,
            can: [
              'featurePage.accessControl.card_inspector_can1',
              'featurePage.accessControl.card_inspector_can2',
              'featurePage.accessControl.card_inspector_can3',
            ] as const,
          },
          {
            roleKey: 'featurePage.accessControl.role_doorkeeper' as const,
            icon: Lock,
            color: 'text-foreground',
            descKey: 'featurePage.accessControl.card_doorkeeper_desc' as const,
            can: [
              'featurePage.accessControl.card_doorkeeper_can1',
              'featurePage.accessControl.card_doorkeeper_can2',
              'featurePage.accessControl.card_doorkeeper_can3',
            ] as const,
          },
        ] as card}
          <div class="group rounded-xl border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card hover:shadow-card-hover">
            <div class="flex items-center gap-2.5 mb-3">
              <card.icon class="size-5 shrink-0 {card.color}" />
              <h3 class="text-sm font-semibold text-foreground">{t(card.roleKey)}</h3>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground mb-3">{t(card.descKey)}</p>
            <ul class="space-y-1">
              {#each card.can as item}
                <li class="flex items-center gap-2 text-mockup-sm text-muted-foreground">
                  <Check class="size-3 shrink-0 text-success" />
                  {t(item)}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <UserCog class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">{t('featurePage.accessControl.detail_views_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet1')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <GanttChartSquare class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">{t('featurePage.accessControl.detail_gate_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet2')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card hover:shadow-card-hover">
          <div class="flex items-center gap-2.5">
            <EyeOff class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">{t('featurePage.accessControl.detail_confidential_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="rbac-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-background/85">{t('featurePage.accessControl.finalCta.eyebrow')}</p>
      <h2 id="rbac-cta" class="mt-5 font-heading text-balance text-3xl leading-[1.1] text-background sm:text-4xl">
        {t('featurePage.accessControl.finalCta.title').replace(' lo que ', ' lo\u00A0que ')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.accessControl.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.accessControl.cta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/productos"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('featurePage.accessControl.cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  </main>
  <Footer />
</div>
