<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';

  const permLabels = {
    'Datos identificación': 'resRolesGuide.perm_id' as const,
    'Datos apoderados': 'resRolesGuide.perm_guardians' as const,
    'Notas y asistencia': 'resRolesGuide.perm_grades' as const,
    'Obs. convivencia': 'resRolesGuide.perm_conduct' as const,
    'Obs. pedagógicas': 'resRolesGuide.perm_pedagogical' as const,
    'Obs. emocionales': 'resRolesGuide.perm_emotional' as const,
    'Datos médicos sens.': 'resRolesGuide.perm_medical' as const,
    'Alertas judiciales': 'resRolesGuide.perm_judicial' as const,
    'Registros de retiro': 'resRolesGuide.perm_pickups' as const,
    'Logs de auditoría': 'resRolesGuide.perm_audit' as const,
  };

  const roles = [
    {
      role: 'resRolesGuide.role_director' as const,
      description: 'resRolesGuide.role_director_desc' as const,
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': true,
        'Obs. convivencia': true,
        'Obs. pedagógicas': true,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': true,
        'Registros de retiro': true,
        'Logs de auditoría': true,
      },
      recommendations: 'resRolesGuide.role_director_rec' as const
    },
    {
      role: 'resRolesGuide.role_inspector' as const,
      description: 'resRolesGuide.role_inspector_desc' as const,
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': true,
        'Obs. convivencia': true,
        'Obs. pedagógicas': false,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': true,
        'Registros de retiro': true,
        'Logs de auditoría': false,
      },
      recommendations: 'resRolesGuide.role_inspector_rec' as const
    },
    {
      role: 'resRolesGuide.role_utp' as const,
      description: 'resRolesGuide.role_utp_desc' as const,
      perms: {
        'Datos identificación': true,
        'Datos apoderados': false,
        'Notas y asistencia': true,
        'Obs. convivencia': false,
        'Obs. pedagógicas': true,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': false,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'resRolesGuide.role_utp_rec' as const
    },
    {
      role: 'resRolesGuide.role_counselor' as const,
      description: 'resRolesGuide.role_counselor_desc' as const,
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': true,
        'Obs. convivencia': true,
        'Obs. pedagógicas': true,
        'Obs. emocionales': true,
        'Datos médicos sens.': true,
        'Alertas judiciales': true,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'resRolesGuide.role_counselor_rec' as const
    },
    {
      role: 'resRolesGuide.role_teacher' as const,
      description: 'resRolesGuide.role_teacher_desc' as const,
      perms: {
        'Datos identificación': true,
        'Datos apoderados': false,
        'Notas y asistencia': true,
        'Obs. convivencia': false,
        'Obs. pedagógicas': true,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': false,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'resRolesGuide.role_teacher_rec' as const
    },
    {
      role: 'resRolesGuide.role_gatekeeper' as const,
      description: 'resRolesGuide.role_gatekeeper_desc' as const,
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': false,
        'Obs. convivencia': false,
        'Obs. pedagógicas': false,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': true,
        'Registros de retiro': true,
        'Logs de auditoría': false,
      },
      recommendations: 'resRolesGuide.role_gatekeeper_rec' as const
    },
    {
      role: 'resRolesGuide.role_aide' as const,
      description: 'resRolesGuide.role_aide_desc' as const,
      perms: {
        'Datos identificación': true,
        'Datos apoderados': false,
        'Notas y asistencia': false,
        'Obs. convivencia': false,
        'Obs. pedagógicas': false,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': false,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'resRolesGuide.role_aide_rec' as const
    }
  ];

  const permKeys = Object.keys(roles[0].perms) as (keyof typeof permLabels)[];
</script>

<svelte:head>
  <title>{t('resRolesGuide.meta_title')}</title>
  <meta name="description" content={t('resRolesGuide.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/resources/roles-permissions-guide" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('resRolesGuide.og_title')} />
  <meta property="og:description" content={t('resRolesGuide.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('resRolesGuide.og_title')} />
  <meta name="twitter:description" content={t('resRolesGuide.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/resources/roles-permissions-guide" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t('resRolesGuide.og_title'),
    "description": t('resRolesGuide.meta_description'),
    "url": "https://ethoz.cl/resources/roles-permissions-guide",
    "publisher": { "@type": "Organization", "name": BRAND, "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
>
  {t('nav.skip_to_content')}
</a>

<div class="print:hidden">
  <NavBar />
</div>

<main id="main-content" class="min-h-dvh bg-background pt-24">
  <div class="print:hidden sticky top-24 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Button href="/resources" variant="ghost" size="sm" class="gap-2 text-muted-foreground">
        <ArrowLeft class="size-4" />
        {t('resRolesGuide.back_to_resources')}
      </Button>
      <Button href="/downloads/guia-roles-permisos.pdf" download size="lg" class="gap-2">
        <Printer class="size-4" />
        {t('resRolesGuide.download_pdf')}
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <div class="mb-12 border-b border-border pb-10">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground print:hidden">
        <span class="text-primary">{t('resRolesGuide.eyebrow_category')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('resRolesGuide.eyebrow_law')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('resRolesGuide.eyebrow_roles')}</span>
      </p>
      <span class="mt-5 block h-px w-12 bg-foreground print:hidden" aria-hidden="true"></span>
      <h1 class="mt-5 font-heading leading-[1.15] text-foreground">{t('resRolesGuide.hero_title')}</h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">{t('resRolesGuide.hero_subtitle')}</p>
      <p class="mt-4 text-xs text-muted-foreground">{t('resRolesGuide.byline')}</p>
    </div>

    <!-- Principles -->
    <div class="mb-8 rounded-xl border border-border bg-muted/30 p-5">
      <h2 class="font-heading text-foreground mb-3 text-sm">{t('resRolesGuide.principles_title')}</h2>
      <div class="grid gap-2 sm:grid-cols-3 text-xs text-muted-foreground">
        <div><strong class="text-foreground">{t('resRolesGuide.principle_min_label')}</strong> {t('resRolesGuide.principle_min_text')}</div>
        <div><strong class="text-foreground">{t('resRolesGuide.principle_prop_label')}</strong> {t('resRolesGuide.principle_prop_text')}</div>
        <div><strong class="text-foreground">{t('resRolesGuide.principle_trace_label')}</strong> {t('resRolesGuide.principle_trace_text')}</div>
      </div>
    </div>

    <!-- Matrix table -->
    <div class="mb-10">
      <h2 class="font-heading text-foreground mb-4">{t('resRolesGuide.matrix_title')}</h2>
      <div class="overflow-x-auto rounded-xl border border-border">
        <table class="w-full min-w-[880px] text-xs">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="px-3 py-3 text-left font-semibold text-foreground min-w-[120px]">{t('resRolesGuide.col_role')}</th>
              {#each permKeys as key}
                <th class="px-2 py-3 text-center font-medium text-muted-foreground whitespace-nowrap">{t(permLabels[key])}</th>
              {/each}
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each roles as r}
              <tr class="hover:bg-muted/40 transition-colors">
                <td class="px-3 py-3 font-medium text-foreground">{t(r.role)}</td>
                {#each permKeys as key}
                  <td class="px-2 py-3 text-center">
                    {#if r.perms[key as keyof typeof r.perms]}
                      <span class="inline-flex size-5 items-center justify-center rounded-full bg-success/15 text-success font-bold text-mockup-sm">✓</span>
                    {:else}
                      <span class="inline-flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground text-mockup-sm">—</span>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <p class="mt-2 text-xs text-muted-foreground">✓ = {t('resRolesGuide.legend_enabled')} &nbsp;·&nbsp; — = {t('resRolesGuide.legend_disabled')}</p>
    </div>

    <!-- Role detail cards -->
    <div class="space-y-6">
      <h2 class="font-heading text-foreground">{t('resRolesGuide.detail_title')}</h2>
      {#each roles as r}
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="flex items-start justify-between gap-4 mb-2">
            <h3 class="font-heading text-foreground">{t(r.role)}</h3>
            <span class="shrink-0 text-xs text-muted-foreground">{Object.values(r.perms).filter(Boolean).length}/{permKeys.length} {t('resRolesGuide.permissions_suffix')}</span>
          </div>
          <p class="text-sm text-muted-foreground mb-3">{t(r.description)}</p>
          <div class="rounded-xl bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <span class="font-medium text-foreground">{t('resRolesGuide.recommendation_label')}</span>{' '}{t(r.recommendations)}
          </div>
        </div>
      {/each}
    </div>

    <!-- Implementation note -->
    <div class="mt-10 rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
      <p class="font-medium text-foreground mb-1">{t('resRolesGuide.impl_note_title')}</p>
      <p>{t('resRolesGuide.impl_note_text')}</p>
    </div>

    <div class="print:hidden mt-8 text-center">
      <p class="text-sm text-muted-foreground mb-4">{t('resRolesGuide.cta_text')}</p>
      <Button href="/demo">{t('resRolesGuide.cta_button')}</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    :global(body) { font-size: 10px; color: #000; background: #fff; }
    main { padding: 0; }
  }
</style>
