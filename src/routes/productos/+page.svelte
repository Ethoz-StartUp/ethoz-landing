<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import { Users, Shield, MapPin, Search, ClipboardList, Eye, ArrowRight, ShieldAlert, BarChart3, Siren, CalendarCheck } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('products_page_viewed'); });

  const products = [
    {
      id: 'student-profile',
      icon: Users,
      nameKey: 'productos.product_student_profile_name' as const,
      descKey: 'productos.product_student_profile_desc' as const,
      href: '/funcionalidades/ficha-alumno',
      color: 'bg-primary/10 text-primary-active',
      highlightKeys: ['productos.product_student_profile_h1', 'productos.product_student_profile_h2', 'productos.product_student_profile_h3', 'productos.product_student_profile_h4'] as const,
    },
    {
      id: 'safe-pickups',
      icon: MapPin,
      nameKey: 'productos.product_safe_pickups_name' as const,
      descKey: 'productos.product_safe_pickups_desc' as const,
      href: '/funcionalidades/retiros-seguros',
      color: 'bg-destructive/10 text-destructive',
      highlightKeys: ['productos.product_safe_pickups_h1', 'productos.product_safe_pickups_h2', 'productos.product_safe_pickups_h3', 'productos.product_safe_pickups_h4'] as const,
    },
    {
      id: 'access-control',
      icon: Shield,
      nameKey: 'productos.product_access_control_name' as const,
      descKey: 'productos.product_access_control_desc' as const,
      href: '/funcionalidades/acceso-por-rol',
      color: 'bg-warning/15 text-warning-foreground',
      highlightKeys: ['productos.product_access_control_h1', 'productos.product_access_control_h2', 'productos.product_access_control_h3', 'productos.product_access_control_h4'] as const,
    },
    {
      id: 'smart-search',
      icon: Search,
      nameKey: 'productos.product_smart_search_name' as const,
      descKey: 'productos.product_smart_search_desc' as const,
      href: '/funcionalidades/busqueda-contextual',
      color: 'bg-primary/10 text-primary-active',
      highlightKeys: ['productos.product_smart_search_h1', 'productos.product_smart_search_h2', 'productos.product_smart_search_h3', 'productos.product_smart_search_h4'] as const,
    },
    {
      id: 'coexistence',
      icon: ClipboardList,
      nameKey: 'productos.product_coexistence_name' as const,
      descKey: 'productos.product_coexistence_desc' as const,
      href: '/funcionalidades/ficha-alumno',
      color: 'bg-success/10 text-success',
      highlightKeys: ['productos.product_coexistence_h1', 'productos.product_coexistence_h2', 'productos.product_coexistence_h3', 'productos.product_coexistence_h4'] as const,
    },
    {
      id: 'digital-logbook',
      icon: Eye,
      nameKey: 'productos.product_digital_logbook_name' as const,
      descKey: 'productos.product_digital_logbook_desc' as const,
      href: '/integraciones',
      color: 'bg-primary/10 text-primary-active',
      highlightKeys: ['productos.product_digital_logbook_h1', 'productos.product_digital_logbook_h2', 'productos.product_digital_logbook_h3', 'productos.product_digital_logbook_h4'] as const,
    },
    {
      id: 'critical-alerts',
      icon: ShieldAlert,
      nameKey: 'productos.product_critical_alerts_name' as const,
      descKey: 'productos.product_critical_alerts_desc' as const,
      href: '/funcionalidades/alertas',
      color: 'bg-destructive/10 text-destructive',
      highlightKeys: ['productos.product_critical_alerts_h1', 'productos.product_critical_alerts_h2', 'productos.product_critical_alerts_h3', 'productos.product_critical_alerts_h4'] as const,
    },
    {
      id: 'analytics',
      icon: BarChart3,
      nameKey: 'productos.product_analytics_name' as const,
      descKey: 'productos.product_analytics_desc' as const,
      href: '/funcionalidades/indicadores',
      color: 'bg-primary/10 text-primary-active',
      highlightKeys: ['productos.product_analytics_h1', 'productos.product_analytics_h2', 'productos.product_analytics_h3', 'productos.product_analytics_h4'] as const,
    },
    {
      id: 'emergency',
      icon: Siren,
      nameKey: 'productos.product_emergency_name' as const,
      descKey: 'productos.product_emergency_desc' as const,
      href: '/funcionalidades/emergencias',
      color: 'bg-destructive/10 text-destructive',
      highlightKeys: ['productos.product_emergency_h1', 'productos.product_emergency_h2', 'productos.product_emergency_h3', 'productos.product_emergency_h4'] as const,
    },
    {
      id: 'attendance',
      icon: CalendarCheck,
      nameKey: 'productos.product_attendance_name' as const,
      descKey: 'productos.product_attendance_desc' as const,
      href: '/funcionalidades/asistencia',
      color: 'bg-success/10 text-success',
      highlightKeys: ['productos.product_attendance_h1', 'productos.product_attendance_h2', 'productos.product_attendance_h3', 'productos.product_attendance_h4'] as const,
    },
  ];
</script>

<svelte:head>
  <title>{t('productos.meta_title')} · {BRAND}</title>
  <meta name="description" content={t('productos.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/productos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${t('productos.meta_title')} · ${BRAND}`} />
  <meta property="og:description" content={t('productos.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${t('productos.meta_title')} · ${BRAND}`} />
  <meta name="twitter:description" content={t('productos.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/productos" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos"}]})}</script>`}
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
  <section class="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <!-- Editorial eyebrow — Cal-flavored, mirrors the /como-contratar pattern -->
      <p class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span class="text-primary">{t('productos.hero_eyebrow_catalog')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span class="hidden sm:inline">{t('productos.hero_eyebrow_count')}</span>
      </p>
      <h1 class="mt-4 text-balance text-foreground">
        {t('productos.hero_title')}
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
        {t('productos.hero_subtitle')}
      </p>
      <span class="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary-active">
        {t('productos.hero_compliance_badge')}
      </span>
    </div>
  </section>

  <!-- Products -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="space-y-16 sm:space-y-20">
        {#each products as product, i}
          {@const Icon = product.icon}
          <div class="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12 {i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}">
            <!-- Info -->
            <div>
              <div class="flex items-center gap-2.5">
                <Icon class="size-5 shrink-0 {product.color.split(' ')[1]}" />
                <h2 class="text-xl text-foreground">{t(product.nameKey)}</h2>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t(product.descKey)}</p>
              <ul class="mt-4 space-y-2">
                {#each product.highlightKeys as h}
                  <li class="flex items-start gap-2">
                    <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
                    <span class="text-xs text-muted-foreground">{t(h)}</span>
                  </li>
                {/each}
              </ul>
              <Button variant="outline" size="lg" href={product.href} class="mt-5">
                {t('productos.product_view_detail')}
                <ArrowRight class="size-4" />
              </Button>
            </div>

            <!-- Mockup preview -->
            <a href={product.href} class="group block rounded-xl border border-border bg-card shadow-card transition-all duration-[160ms] hover:shadow-card-hover hover:border-foreground hover:-translate-y-[1px] min-h-[180px] sm:min-h-[200px]">
              <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <div class="size-2.5 rounded-full bg-destructive/60"></div>
                <div class="size-2.5 rounded-full bg-warning/60"></div>
                <div class="size-2.5 rounded-full bg-success/60"></div>
                <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{BRAND} · {t(product.nameKey)}</span>
              </div>
              {#if product.id === 'student-profile'}
                <div aria-hidden="true" class="p-5">
                  <div class="flex gap-3">
                    <img src="/images/students/girl-12.webp" alt={t('productos.mock_alt_student_girl')} class="size-12 rounded-full object-cover" loading="lazy" decoding="async" />
                    <div>
                      <p class="text-sm font-semibold text-foreground">Valentina Rojas Sepúlveda</p>
                      <p class="text-xs text-muted-foreground">7° Básico B · {t('productos.mock_guardian_label')}: María Sepúlveda</p>
                    </div>
                  </div>
                  <div class="mt-3 flex gap-1 border-t border-border pt-3">
                    <span class="border-b-2 border-primary px-2.5 py-1.5 text-mockup-xs font-semibold text-primary">{t('productos.mock_tab_history')}</span>
                    <span class="px-2.5 py-1.5 text-mockup-xs text-muted-foreground">{t('productos.mock_tab_pickups')}</span>
                    <span class="px-2.5 py-1.5 text-mockup-xs text-muted-foreground">{t('productos.mock_tab_coexistence')}</span>
                    <span class="px-2.5 py-1.5 text-mockup-xs text-muted-foreground">{t('productos.mock_tab_alerts')}</span>
                  </div>
                  <div class="mt-3 space-y-1.5 text-mockup-xs text-muted-foreground">
                    <div class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-primary"></span>{t('productos.mock_profile_updated')}</div>
                    <div class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-success"></span>{t('productos.mock_pickup_authorized')} · 14:32</div>
                  </div>
                </div>
              {:else if product.id === 'safe-pickups'}
                <div aria-hidden="true" class="p-5">
                  <div class="flex items-center gap-2 rounded-lg bg-success/5 px-3 py-2 mb-3">
                    <div class="size-2 rounded-full bg-success"></div>
                    <span class="text-xs font-semibold text-success">{t('productos.mock_status_authorized')}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <img src="/images/people/apoderado-madre.webp" alt={t('productos.mock_alt_guardian_mother')} class="size-10 rounded-full object-cover" loading="lazy" decoding="async" />
                    <div>
                      <p class="text-xs font-medium text-foreground">María Sepúlveda · {t('productos.mock_role_mother')}</p>
                      <p class="text-mockup-xs text-muted-foreground">Valentina Rojas · 7° Básico B · 14:32</p>
                    </div>
                  </div>
                  <div class="mt-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-3 py-2">
                    <p class="text-mockup-xs font-medium text-destructive">Juan Rojas · {t('productos.mock_role_father')} · {t('productos.mock_status_blocked')}</p>
                    <p class="text-mockup-2xs text-muted-foreground">{t('productos.mock_restraining_order')}</p>
                  </div>
                </div>
              {:else if product.id === 'access-control'}
                <div aria-hidden="true" class="p-5">
                  <p class="mb-2 label-mono text-muted-foreground">{t('productos.mock_access_matrix')}</p>
                  <div class="space-y-2">
                    {#each [{nameKey:'productos.mock_role_principal' as const,img:'/images/people/director-mujer.webp',dots:[true,true,true,true]},{nameKey:'productos.mock_role_teacher' as const,img:'/images/people/docente-mujer.webp',dots:[true,false,true,false]},{nameKey:'productos.mock_role_doorman' as const,img:'/images/people/portero-hombre.webp',dots:[false,true,false,false]}] as role}
                      <div class="flex items-center gap-2">
                        <img src={role.img} alt={t(role.nameKey)} class="size-5 rounded-full object-cover" loading="lazy" decoding="async" />
                        <span class="w-16 text-mockup-xs font-medium text-foreground">{t(role.nameKey)}</span>
                        {#each role.dots as d}
                          <span class="size-2.5 rounded-full {d ? 'bg-success' : 'bg-muted'} mx-auto"></span>
                        {/each}
                      </div>
                    {/each}
                  </div>
                </div>
              {:else if product.id === 'smart-search'}
                <div aria-hidden="true" class="p-5">
                  <div class="rounded-lg border border-border px-3 py-2 text-xs text-foreground mb-3">val<span class="animate-pulse text-primary">|</span></div>
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2.5 rounded-lg bg-primary/5 px-3 py-2">
                      <img src="/images/students/girl-12.webp" alt={t('productos.mock_alt_student_girl')} class="size-7 rounded-full object-cover" loading="lazy" decoding="async" />
                      <div>
                        <span class="text-xs text-foreground"><mark class="bg-primary/20 font-semibold">Val</mark>entina Rojas</span>
                        <p class="text-mockup-xs text-muted-foreground">7° Básico B</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-muted/50">
                      <img src="/images/students/kid-14.webp" alt={t('productos.mock_alt_student_boy')} class="size-7 rounded-full object-cover" loading="lazy" decoding="async" />
                      <div>
                        <span class="text-xs text-foreground"><mark class="bg-primary/20 font-semibold">Val</mark>dés, Tomás</span>
                        <p class="text-mockup-xs text-muted-foreground">8° Básico A</p>
                      </div>
                    </div>
                  </div>
                </div>
              {:else if product.id === 'coexistence'}
                <div aria-hidden="true" class="p-5">
                  <p class="mb-2 text-mockup-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('productos.mock_latest_observations')}</p>
                  <div class="space-y-2.5">
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-warning"></span>
                      <div>
                        <span class="font-medium text-foreground">{t('productos.mock_incident_minor')} · 8°A</span>
                        <p class="text-mockup-xs text-muted-foreground">Hace 2h · Prof. A. Martínez</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-destructive"></span>
                      <div>
                        <span class="font-medium text-foreground">{t('productos.mock_incident_serious')} · 7°B</span>
                        <p class="text-mockup-xs text-muted-foreground">Ayer · Inspector J. Muñoz</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-success"></span>
                      <div>
                        <span class="font-medium text-foreground">{t('productos.mock_intervention_closed')} · 6°A</span>
                        <p class="text-mockup-xs text-muted-foreground">Hace 3 días · Orientadora</p>
                      </div>
                    </div>
                  </div>
                </div>
              {:else if product.id === 'digital-logbook'}
                <div aria-hidden="true" class="p-5">
                  <p class="mb-2 label-mono text-muted-foreground">{t('integrations.compatible_systems_label')}</p>
                  <div class="space-y-2">
                    {#each ['Napsis', 'Syscol', 'SchoolTrack'] as system}
                      <div class="flex items-center justify-between text-xs">
                        <span class="flex items-center gap-2"><span class="size-2 rounded-full bg-success"></span><span class="font-medium text-foreground">{system}</span></span>
                        <span class="text-mockup-xs font-medium text-success">{t('integrations.status_available')}</span>
                      </div>
                    {/each}
                  </div>
                  <div class="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-center">
                    <p class="text-xs font-medium text-primary-active">{t('integrations.basic_feature_circular30')}</p>
                  </div>
                </div>
              {:else if product.id === 'critical-alerts'}
                <div aria-hidden="true" class="p-5">
                  <div class="space-y-2.5">
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-destructive"></span>
                      <div>
                        <div class="flex flex-wrap items-center gap-1.5">
                          <span class="font-medium text-foreground">{t('featurePage.alerts.mockup_critical_type')}</span>
                          <span class="rounded-full bg-destructive/10 px-1.5 py-0.5 text-mockup-2xs font-semibold text-destructive">{t('featurePage.alerts.mockup_level_critical')}</span>
                        </div>
                        <p class="text-mockup-xs text-muted-foreground">Valentina Rojas · 7° Básico B · 14:32</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-warning"></span>
                      <div>
                        <div class="flex flex-wrap items-center gap-1.5">
                          <span class="font-medium text-foreground">{t('featurePage.alerts.mockup_warning_type')}</span>
                          <span class="rounded-full bg-warning/15 px-1.5 py-0.5 text-mockup-2xs font-semibold text-warning-foreground">{t('featurePage.alerts.mockup_level_high')}</span>
                        </div>
                        <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.mockup_warning_person')}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-primary"></span>
                      <div>
                        <div class="flex flex-wrap items-center gap-1.5">
                          <span class="font-medium text-foreground">{t('featurePage.alerts.mockup_info_type')}</span>
                          <span class="rounded-full bg-primary/10 px-1.5 py-0.5 text-mockup-2xs font-semibold text-primary-active">{t('featurePage.alerts.mockup_level_medium')}</span>
                        </div>
                        <p class="text-mockup-xs text-muted-foreground">{t('featurePage.alerts.mockup_info_person')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              {:else if product.id === 'analytics'}
                <div aria-hidden="true" class="p-5">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="rounded-lg bg-primary/5 px-3 py-2.5 text-center">
                      <p class="text-lg font-bold text-primary-active">412</p>
                      <p class="text-mockup-xs text-muted-foreground">{t('featurePage.analytics.mockup_kpi_students')}</p>
                    </div>
                    <div class="rounded-lg bg-destructive/5 px-3 py-2.5 text-center">
                      <p class="text-lg font-bold text-destructive">3</p>
                      <p class="text-mockup-xs text-muted-foreground">{t('featurePage.analytics.mockup_kpi_active_alerts')}</p>
                    </div>
                  </div>
                  <div class="mt-3">
                    <p class="mb-2 text-mockup-2xs font-semibold uppercase tracking-wider text-muted-foreground">{t('featurePage.analytics.chart_observations_caption')}</p>
                    <div class="flex h-12 gap-1">
                      {#each [
                        { labelKey: 'featurePage.analytics.month_mar' as const, h: 35, color: 'bg-primary/40' },
                        { labelKey: 'featurePage.analytics.month_apr' as const, h: 52, color: 'bg-primary/60' },
                        { labelKey: 'featurePage.analytics.month_may' as const, h: 41, color: 'bg-primary/40' },
                        { labelKey: 'featurePage.analytics.month_jun' as const, h: 68, color: 'bg-primary/80' },
                        { labelKey: 'featurePage.analytics.month_jul' as const, h: 29, color: 'bg-primary/30' },
                        { labelKey: 'featurePage.analytics.month_aug' as const, h: 72, color: 'bg-primary' },
                      ] as bar}
                        <div class="flex flex-1 flex-col items-center justify-end gap-0.5">
                          <div class="w-full rounded-t {bar.color}" style="height: {bar.h}%"></div>
                          <span class="text-mockup-3xs text-muted-foreground">{t(bar.labelKey)}</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
              {:else if product.id === 'emergency'}
                <div aria-hidden="true" class="p-5">
                  <div class="mb-3 flex items-center gap-2 rounded-lg bg-destructive/5 px-3 py-2">
                    <div class="size-2 rounded-full bg-destructive"></div>
                    <span class="text-xs font-semibold text-destructive">{t('featurePage.emergency.mockup_banner_status')}</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span class="rounded-full bg-success/10 px-2 py-0.5 text-mockup-xs font-medium text-success">{t('featurePage.emergency.mockup_phase_alerta')}</span>
                    <span class="rounded-full bg-success/10 px-2 py-0.5 text-mockup-xs font-medium text-success">{t('featurePage.emergency.mockup_phase_evacuacion')}</span>
                    <span class="rounded-full bg-warning/15 px-2 py-0.5 text-mockup-xs font-medium text-warning-foreground">{t('featurePage.emergency.mockup_phase_conteo')}</span>
                    <span class="rounded-full bg-muted px-2 py-0.5 text-mockup-xs font-medium text-muted-foreground">{t('featurePage.emergency.mockup_phase_finalizado')}</span>
                  </div>
                  <div class="mt-3 rounded-lg border border-dashed border-warning/40 bg-warning/10 px-3 py-2">
                    <p class="text-mockup-xs font-medium text-warning-foreground">{t('featurePage.emergency.mockup_rollcall_warning')}</p>
                  </div>
                </div>
              {:else}
                <div aria-hidden="true" class="p-5">
                  <p class="mb-2 text-mockup-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('featurePage.attendance.mockup_kpi_label')}</p>
                  <div class="space-y-2">
                    {#each [
                      { cls: '7° Básico B', count: '28/30', pct: '93%', ok: true },
                      { cls: '8° Básico A', count: '25/30', pct: '83%', ok: false },
                      { cls: '6° Básico A', count: '30/30', pct: '100%', ok: true },
                    ] as row}
                      <div class="flex items-center justify-between text-xs">
                        <span class="flex items-center gap-2"><span class="size-2 rounded-full {row.ok ? 'bg-success' : 'bg-warning'}"></span><span class="font-medium text-foreground">{row.cls}</span></span>
                        <span class="text-mockup-xs text-muted-foreground">{row.count} · {row.pct}</span>
                      </div>
                    {/each}
                  </div>
                  <div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-3">
                    <span class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground"><span class="size-1.5 rounded-full bg-success"></span>{t('featurePage.attendance.legend_present')}</span>
                    <span class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground"><span class="size-1.5 rounded-full bg-destructive"></span>{t('featurePage.attendance.legend_absent')}</span>
                    <span class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground"><span class="size-1.5 rounded-full bg-warning"></span>{t('featurePage.attendance.legend_late')}</span>
                    <span class="flex items-center gap-1.5 text-mockup-xs text-muted-foreground"><span class="size-1.5 rounded-full bg-primary"></span>{t('featurePage.attendance.legend_justified')}</span>
                  </div>
                </div>
              {/if}
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-balance text-2xl text-foreground sm:text-3xl">
        {t('pricing.cta.title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-8">
        <Button size="xl" href="/demo">
          {t('pricing.cta.primary')}
          <ArrowRight class="size-4" />
        </Button>
      </div>
    </div>
  </section>

  </main>
  <Footer />
</div>
