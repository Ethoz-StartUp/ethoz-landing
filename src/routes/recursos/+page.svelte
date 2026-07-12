<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ResourceGate from '$lib/components/ResourceGate.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import {
    ClipboardCheck,
    UserCheck,
    ShieldAlert,
    Users,
    Database,
    FileWarning,
    Download,
    ArrowRight
  } from '@lucide/svelte';

  let gateOpen = $state(false);
  let gateSlug = $state('');
  let gatePdf = $state('');
  let gateTitle = $state('');

  function openGate(slug: string, pdf: string, title: string, e: MouseEvent) {
    e.preventDefault();
    gateSlug = slug;
    gatePdf = pdf;
    gateTitle = title;
    gateOpen = true;
  }

  // trackingId is a stable API/analytics contract; it must not follow public URL renames.
  const resources = [
    {
      icon: ClipboardCheck,
      titleKey: 'resources.item_checklist_title' as const,
      descriptionKey: 'resources.item_checklist_description' as const,
      href: '/recursos/checklist-cumplimiento',
      pdf: '/downloads/checklist-cumplimiento-ley-21719.pdf',
      trackingId: 'compliance-checklist',
      tagKey: 'resources.item_checklist_tag' as const,
      metaKey: 'resources.item_checklist_meta' as const,
      articleKey: 'resources.item_checklist_article' as const
    },
    {
      icon: UserCheck,
      titleKey: 'resources.item_pickup_title' as const,
      descriptionKey: 'resources.item_pickup_description' as const,
      href: '/recursos/protocolo-retiros',
      pdf: '/downloads/protocolo-retiros-seguros.pdf',
      trackingId: 'pickup-protocol',
      tagKey: 'resources.item_pickup_tag' as const,
      metaKey: 'resources.item_pickup_meta' as const,
      articleKey: 'resources.item_pickup_article' as const
    },
    {
      icon: ShieldAlert,
      titleKey: 'resources.item_privacy_title' as const,
      descriptionKey: 'resources.item_privacy_description' as const,
      href: '/recursos/aviso-privacidad',
      pdf: '/downloads/aviso-privacidad-escolar.pdf',
      trackingId: 'privacy-notice',
      tagKey: 'resources.item_privacy_tag' as const,
      metaKey: 'resources.item_privacy_meta' as const,
      articleKey: 'resources.item_privacy_article' as const
    },
    {
      icon: Users,
      titleKey: 'resources.item_roles_title' as const,
      descriptionKey: 'resources.item_roles_description' as const,
      href: '/recursos/guia-roles-permisos',
      pdf: '/downloads/guia-roles-permisos.pdf',
      trackingId: 'roles-permissions-guide',
      tagKey: 'resources.item_roles_tag' as const,
      metaKey: 'resources.item_roles_meta' as const,
      articleKey: 'resources.item_roles_article' as const
    },
    {
      icon: Database,
      titleKey: 'resources.item_inventory_title' as const,
      descriptionKey: 'resources.item_inventory_description' as const,
      href: '/recursos/inventario-datos',
      pdf: '/downloads/inventario-datos-personales.pdf',
      trackingId: 'data-inventory',
      tagKey: 'resources.item_inventory_tag' as const,
      metaKey: 'resources.item_inventory_meta' as const,
      articleKey: 'resources.item_inventory_article' as const
    },
    {
      icon: FileWarning,
      titleKey: 'resources.item_breach_title' as const,
      descriptionKey: 'resources.item_breach_description' as const,
      href: '/recursos/plan-respuesta-brechas',
      pdf: '/downloads/plan-respuesta-brechas.pdf',
      trackingId: 'breach-response-plan',
      tagKey: 'resources.item_breach_tag' as const,
      metaKey: 'resources.item_breach_meta' as const,
      articleKey: 'resources.item_breach_article' as const
    }
  ];
</script>

<svelte:head>
  <title>Recursos gratuitos · Ley 21.719 para colegios | {BRAND}</title>
  <meta name="description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta property="og:url" content="https://ethoz.cl/recursos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`Recursos gratuitos · Ley 21.719 para colegios | ${BRAND}`} />
  <meta property="og:description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Recursos gratuitos Ley 21.719 | ${BRAND}`} />
  <meta name="twitter:description" content="Plantillas y checklists gratuitos para protección de datos en colegios chilenos." />
  <link rel="canonical" href="https://ethoz.cl/recursos" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Recursos gratuitos Ley 21.719",
    "description": "Plantillas, checklists y guías para cumplir con la Ley 21.719 en colegios chilenos.",
    "url": "https://ethoz.cl/recursos",
    "publisher": { "@type": "Organization", "name": BRAND, "url": "https://ethoz.cl" }
  })}</script>`}
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

  <main id="main-content">

  <!-- HERO — editorial -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span class="text-primary">{t('resources.free_badge')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{resources.length} {t('resources.hero_count_suffix')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('resources.hero_format')}</span>
      </p>
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <h1 class="page-title">
        {t('resources.hero.title')}
      </h1>
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('resources.hero.subtitle')}
      </p>
    </div>
  </section>

  <!-- RESOURCES GRID -->
  <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 sm:pb-24">
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each resources as resource, i}
        <div class="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
          <div class="flex items-center justify-between">
            <span class="font-heading text-2xl leading-none text-primary tabular-nums group-hover:text-foreground" data-numeric>{(i + 1).toString().padStart(2, '0')}</span>
            <resource.icon class="size-4 shrink-0 text-primary" />
          </div>
          <h2 class="mt-5 font-heading text-lg leading-tight text-foreground">{t(resource.titleKey)}</h2>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t(resource.descriptionKey)}</p>

          <!-- Metadata strip -->
          <dl class="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-mockup-sm">
            <div>
              <dt class="font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('resources.meta_label_area')}</dt>
              <dd class="mt-0.5 font-medium text-foreground">{t(resource.tagKey)}</dd>
            </div>
            <div>
              <dt class="font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('resources.meta_label_scope')}</dt>
              <dd class="mt-0.5 font-medium text-foreground">{t(resource.metaKey)}</dd>
            </div>
            <div class="col-span-2">
              <dt class="font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('resources.meta_label_norm')}</dt>
              <dd class="mt-0.5 font-medium text-primary">{t(resource.articleKey)}</dd>
            </div>
          </dl>

          <!-- Actions -->
          <div class="mt-5 flex gap-2">
            <a
              href={resource.pdf}
              download
              onclick={(e) => openGate(resource.trackingId, resource.pdf, t(resource.titleKey), e)}
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-pressed"
            >
              <Download class="size-4" />
              {t('resources.download_pdf')}
            </a>
            <a
              href={resource.href}
              class="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 hover:border-foreground"
            >
              {t('resources.view_online')}
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- FINAL CTA — dark navy -->
  <section class="bg-secondary py-20 text-foreground sm:py-24" aria-labelledby="final-cta-resources">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('resources.cta_eyebrow')}</p>
      <h2 id="final-cta-resources" class="mt-5 font-heading text-3xl leading-[1.15] text-foreground sm:text-4xl">
        {t('resources.cta_title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('resources.cta_desc')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-10 text-base font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('resources.request_demo')}
          <ArrowRight class="size-5" />
        </a>
      </div>
    </div>
  </section>
  </main>

  <Footer />

  <ResourceGate
    bind:open={gateOpen}
    slug={gateSlug}
    pdfUrl={gatePdf}
    title={gateTitle}
    onclose={() => {}}
  />
</div>
