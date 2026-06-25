<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    Lock,
    Database,
    ArrowRight,
    CheckCircle,
    Eye,
    Server,
    Clock,
    Key,
    FileText,
    AlertTriangle,
    RefreshCw,
    Globe,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'seguridad-datos' });
  });

  const toc = [
    { href: '#cifrado', label: 'seguridadDatos.toc_cifrado' as const, n: '01' },
    { href: '#rls', label: 'seguridadDatos.toc_rls' as const, n: '02' },
    { href: '#autenticacion', label: 'seguridadDatos.toc_autenticacion' as const, n: '03' },
    { href: '#audit-log', label: 'seguridadDatos.toc_audit_log' as const, n: '04' },
    { href: '#aislamiento', label: 'seguridadDatos.toc_aislamiento' as const, n: '05' },
    { href: '#respaldo', label: 'seguridadDatos.toc_respaldo' as const, n: '06' },
    { href: '#infraestructura', label: 'seguridadDatos.toc_infraestructura' as const, n: '07' },
    { href: '#cumplimiento', label: 'seguridadDatos.toc_cumplimiento' as const, n: '08' },
    { href: '#divulgacion', label: 'seguridadDatos.toc_divulgacion' as const, n: '09' },
  ];

  const infraItems = [
    { name: 'Supabase (Postgres)', location: 'seguridadDatos.infra_supabase_location' as const, role: 'seguridadDatos.infra_supabase_role' as const },
    { name: 'Firebase Hosting', location: 'seguridadDatos.infra_firebase_location' as const, role: 'seguridadDatos.infra_firebase_role' as const },
    { name: 'Cloudflare', location: 'seguridadDatos.infra_cloudflare_location' as const, role: 'seguridadDatos.infra_cloudflare_role' as const },
  ];

  const complianceItems = [
    { label: 'Ley 21.719 by design', desc: 'seguridadDatos.compliance_ley_desc' as const },
    { label: 'GDPR-compatible', desc: 'seguridadDatos.compliance_gdpr_desc' as const },
    { label: 'Circular N°30', desc: 'seguridadDatos.compliance_circular_desc' as const },
    { label: 'SOC 2 roadmap', desc: 'seguridadDatos.compliance_soc2_desc' as const },
  ];
</script>

<svelte:head>
  <title>{t('seguridadDatos.meta_title')}</title>
  <meta name="description" content={t('seguridadDatos.meta_description')} />
  <meta property="og:title" content={t('seguridadDatos.og_title')} />
  <meta property="og:description" content={t('seguridadDatos.og_description')} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/seguridad-datos" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/seguridad-datos" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Seguridad de datos en ${BRAND} · por diseño, no por parche`,
      "description": `Cómo ${BRAND} protege los datos de su colegio: TLS 1.3, cifrado at-rest, Row-Level Security, audit log, backups diarios y Ley 21.719.`,
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": BRAND },
      "publisher": { "@type": "Organization", "name": BRAND, "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/seguridad-datos",
      "mainEntityOfPage": "https://ethoz.cl/seguridad-datos",
      "keywords": "seguridad datos ethoz, como protege ethoz datos, cifrado datos colegio, row level security educacion"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Seguridad de datos", "item": "https://ethoz.cl/seguridad-datos" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- HERO -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span class="text-primary">{t('seguridadDatos.hero_eyebrow_doc')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('seguridadDatos.hero_eyebrow_topic')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('seguridadDatos.hero_eyebrow_reading_time')}</span>
      </p>

      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>

      <h1 class="mt-6 font-heading leading-[1.15] text-foreground">
        {t('seguridadDatos.hero_title')}
      </h1>

      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('seguridadDatos.hero_body')}
      </p>

      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.hero_stat_transit_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">TLS 1.3</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.hero_stat_atrest_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">AES-256</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.hero_stat_isolation_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">RLS Postgres</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.hero_stat_region_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">São Paulo</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- BODY with sticky TOC -->
  <div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <div class="grid gap-12 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">

      <aside class="lg:sticky lg:top-24 lg:self-start">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.toc_heading')}</p>
        <nav class="mt-4 border-l border-border" aria-label={t('seguridadDatos.toc_aria_label')}>
          <ol class="space-y-1">
            {#each toc as item}
              <li>
                <a href={item.href} class="group flex items-baseline gap-3 -ml-px border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                  <span class="font-heading text-xs text-primary tabular-nums group-hover:text-primary" data-numeric>{item.n}</span>
                  <span>{t(item.label)}</span>
                </a>
              </li>
            {/each}
          </ol>
        </nav>
      </aside>

      <article class="mx-auto max-w-[68ch] space-y-20">

        <!-- CIFRADO -->
        <section id="cifrado">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>01 · {t('seguridadDatos.cifrado_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.cifrado_title')}</h2>
          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            <div class="border border-border bg-card p-5 rounded-xl">
              <div class="flex items-center gap-2.5">
                <Globe class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">{t('seguridadDatos.cifrado_card_transit_title')}</h3>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t('seguridadDatos.cifrado_card_transit_body_pre')} <strong class="text-foreground">TLS 1.3</strong>{t('seguridadDatos.cifrado_card_transit_body_post')}
              </p>
            </div>
            <div class="border border-border bg-card p-5 rounded-xl">
              <div class="flex items-center gap-2.5">
                <Database class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">{t('seguridadDatos.cifrado_card_atrest_title')}</h3>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t('seguridadDatos.cifrado_card_atrest_body_pre')} <strong class="text-foreground">AES-256</strong>{t('seguridadDatos.cifrado_card_atrest_body_post')}
              </p>
            </div>
          </div>
        </section>

        <!-- RLS -->
        <section id="rls">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>02 · {t('seguridadDatos.rls_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.rls_title')}</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            {t('seguridadDatos.rls_body')}
          </p>

          <blockquote class="mt-10 border-l-2 border-primary pl-6 font-heading text-[1.5rem] leading-[1.4] text-foreground">
            {t('seguridadDatos.rls_quote')}
          </blockquote>

          <h3 class="mt-10 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.rls_how_heading')}</h3>
          <ul class="mt-4 space-y-3 border-l border-border pl-6">
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">{t('seguridadDatos.rls_li1_strong')}</strong> {t('seguridadDatos.rls_li1_rest')}</li>
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">{t('seguridadDatos.rls_li2_strong')}</strong> {t('seguridadDatos.rls_li2_rest')}</li>
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">{t('seguridadDatos.rls_li3_strong')}</strong> {t('seguridadDatos.rls_li3_rest')}</li>
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">{t('seguridadDatos.rls_li4_strong')}</strong> {t('seguridadDatos.rls_li4_rest')}</li>
          </ul>

          <p class="mt-6 text-sm leading-relaxed text-muted-foreground">
            {t('seguridadDatos.rls_principle_pre')} <strong class="text-foreground">{t('seguridadDatos.rls_principle_strong')}</strong> {t('seguridadDatos.rls_principle_post')}
          </p>
        </section>

        <!-- AUTENTICACIÓN -->
        <section id="autenticacion">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>03 · {t('seguridadDatos.auth_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.auth_title')}</h2>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each [
              { title: 'seguridadDatos.auth_jwt_title' as const, body: 'seguridadDatos.auth_jwt_body' as const, icon: Key },
              { title: 'seguridadDatos.auth_expiry_title' as const, body: 'seguridadDatos.auth_expiry_body' as const, icon: Clock },
              { title: 'seguridadDatos.auth_rotation_title' as const, body: 'seguridadDatos.auth_rotation_body' as const, icon: RefreshCw },
              { title: 'seguridadDatos.auth_mfa_title' as const, body: 'seguridadDatos.auth_mfa_body' as const, icon: ShieldCheck },
            ] as item}
              {@const Icon = item.icon}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="flex items-center gap-2.5">
                  <Icon class="size-4 shrink-0 text-primary" />
                  <span class="font-semibold text-foreground">{t(item.title)}</span>
                </dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{t(item.body)}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- AUDIT LOG -->
        <section id="audit-log">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>04 · {t('seguridadDatos.audit_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.audit_title')}</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            {t('seguridadDatos.audit_body')}
          </p>

          <div class="mt-8 border border-border bg-card rounded-xl overflow-hidden">
            <div class="border-b border-border bg-muted/50 px-5 py-3">
              <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.audit_entry_structure_label')}</p>
            </div>
            <div class="p-5">
              <pre class="text-xs leading-relaxed text-muted-foreground overflow-x-auto"><code>{`{
  "id":         "uuid",
  "timestamp":  "2026-04-07T14:32:11.000Z",
  "user_id":    "uuid-del-usuario",
  "user_role":  "docente",
  "action":     "UPDATE",
  "resource":   "libro_clases.asistencia",
  "record_id":  "uuid-del-registro",
  "old_value":  { "presente": true },
  "new_value":  { "presente": false },
  "ip_address": "192.168.1.xxx",
  "user_agent": "Mozilla/5.0 ..."
}`}</code></pre>
            </div>
          </div>

          <dl class="mt-10 divide-y divide-border border-y border-border">
            {#each [
              { label: 'seguridadDatos.audit_actions_label' as const, items: ['seguridadDatos.audit_actions_i1', 'seguridadDatos.audit_actions_i2', 'seguridadDatos.audit_actions_i3', 'seguridadDatos.audit_actions_i4', 'seguridadDatos.audit_actions_i5'] as const },
              { label: 'seguridadDatos.audit_who_label' as const, items: ['seguridadDatos.audit_who_i1', 'seguridadDatos.audit_who_i2', 'seguridadDatos.audit_who_i3', 'seguridadDatos.audit_who_i4'] as const },
              { label: 'seguridadDatos.audit_retention_label' as const, items: ['seguridadDatos.audit_retention_i1', 'seguridadDatos.audit_retention_i2', 'seguridadDatos.audit_retention_i3', 'seguridadDatos.audit_retention_i4'] as const },
            ] as auditItem}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="text-sm font-semibold text-foreground">{t(auditItem.label)}</dt>
                <dd>
                  <ul class="space-y-1.5">
                    {#each auditItem.items as item}
                      <li class="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />
                        <span>{t(item)}</span>
                      </li>
                    {/each}
                  </ul>
                </dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- AISLAMIENTO -->
        <section id="aislamiento">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>05 · {t('seguridadDatos.aislamiento_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.aislamiento_title')}</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            {t('seguridadDatos.aislamiento_body')}
          </p>
          <h3 class="mt-8 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.aislamiento_hierarchy_heading')}</h3>
          <dl class="mt-4 divide-y divide-border border-y border-border">
            {#each [
              { level: 'seguridadDatos.aislamiento_sostenedor_level' as const, desc: 'seguridadDatos.aislamiento_sostenedor_desc' as const },
              { level: 'seguridadDatos.aislamiento_colegio_level' as const, desc: 'seguridadDatos.aislamiento_colegio_desc' as const },
              { level: 'seguridadDatos.aislamiento_sede_level' as const, desc: 'seguridadDatos.aislamiento_sede_desc' as const },
              { level: 'seguridadDatos.aislamiento_rol_level' as const, desc: 'seguridadDatos.aislamiento_rol_desc' as const },
            ] as item}
              <div class="grid gap-3 py-4 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t(item.level)}</dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- RESPALDO -->
        <section id="respaldo">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>06 · {t('seguridadDatos.respaldo_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.respaldo_title')}</h2>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            {#each [
              { title: 'seguridadDatos.respaldo_backups_title' as const, desc: 'seguridadDatos.respaldo_backups_desc' as const },
              { title: 'seguridadDatos.respaldo_pitr_title' as const, desc: 'seguridadDatos.respaldo_pitr_desc' as const },
              { title: 'seguridadDatos.respaldo_rto_title' as const, desc: 'seguridadDatos.respaldo_rto_desc' as const },
              { title: 'seguridadDatos.respaldo_continuity_title' as const, desc: 'seguridadDatos.respaldo_continuity_desc' as const },
            ] as rtoItem}
              <div class="border border-border bg-card p-5 rounded-xl">
                <h3 class="text-sm font-semibold text-foreground">{t(rtoItem.title)}</h3>
                <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(rtoItem.desc)}</p>
              </div>
            {/each}
          </div>
        </section>

        <!-- INFRAESTRUCTURA -->
        <section id="infraestructura">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>07 · {t('seguridadDatos.infra_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.infra_title')}</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            {t('seguridadDatos.infra_body')}
          </p>
          <div class="mt-8 border-y border-border">
            <div class="grid grid-cols-3 gap-4 py-3 border-b border-border">
              <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.infra_col_componente')}</p>
              <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.infra_col_ubicacion')}</p>
              <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('seguridadDatos.infra_col_funcion')}</p>
            </div>
            {#each infraItems as item, i}
              <div class="grid grid-cols-3 gap-4 py-4 {i !== infraItems.length - 1 ? 'border-b border-border' : ''}">
                <p class="text-sm font-semibold text-foreground">{item.name}</p>
                <p class="text-sm text-muted-foreground">{t(item.location)}</p>
                <p class="text-sm text-muted-foreground">{t(item.role)}</p>
              </div>
            {/each}
          </div>
          <p class="mt-6 text-sm leading-relaxed text-muted-foreground">
            {t('seguridadDatos.infra_region_pre')} <strong class="text-foreground">AWS São Paulo</strong>{t('seguridadDatos.infra_region_post')}
          </p>
        </section>

        <!-- CUMPLIMIENTO -->
        <section id="cumplimiento">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>08 · {t('seguridadDatos.cumplimiento_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.cumplimiento_title')}</h2>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each complianceItems as item}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="flex items-start gap-2.5">
                  <CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />
                  <span class="font-semibold text-foreground">{item.label}</span>
                </dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- DIVULGACIÓN -->
        <section id="divulgacion">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>09 · {t('seguridadDatos.divulgacion_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('seguridadDatos.divulgacion_title')}</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            {t('seguridadDatos.divulgacion_body')}
          </p>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
              <dt class="font-semibold text-foreground">{t('seguridadDatos.divulgacion_how_label')}</dt>
              <dd class="text-sm leading-relaxed text-muted-foreground">
                {t('seguridadDatos.divulgacion_how_pre')} <strong class="text-foreground">security@ethoz.cl</strong> {t('seguridadDatos.divulgacion_how_post')}
              </dd>
            </div>
            <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
              <dt class="font-semibold text-foreground">{t('seguridadDatos.divulgacion_commitment_label')}</dt>
              <dd>
                <ul class="space-y-1.5">
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>{t('seguridadDatos.divulgacion_commitment_i1')}</span></li>
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>{t('seguridadDatos.divulgacion_commitment_i2')}</span></li>
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>{t('seguridadDatos.divulgacion_commitment_i3')}</span></li>
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>{t('seguridadDatos.divulgacion_commitment_i4')}</span></li>
                </ul>
              </dd>
            </div>
          </dl>
        </section>

      </article>
    </div>
  </div>

  <!-- FINAL CTA -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-sec">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-background/85">{t('seguridadDatos.cta_eyebrow')}</p>
      <h2 id="final-cta-sec" class="mt-5 font-heading text-3xl leading-[1.15] text-background sm:text-4xl">
        {t('seguridadDatos.cta_title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('seguridadDatos.cta_body')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('seguridadDatos.cta_primary')}
          <ArrowRight class="size-5" />
        </a>
        <a href="/ley-21719" class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background">
          {t('seguridadDatos.cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">{t('seguridadDatos.related_heading')}</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/ley-21719', label: 'seguridadDatos.related_ley' as const },
          { href: '/circular-30', label: 'seguridadDatos.related_circular' as const },
          { href: '/glosario', label: 'seguridadDatos.related_glosario' as const },
          { href: '/comparativa', label: 'seguridadDatos.related_comparativa' as const },
        ] as item}
          <a href={item.href} class="border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:border-foreground hover:text-foreground rounded-md">
            {t(item.label)}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <Footer />
</main>
