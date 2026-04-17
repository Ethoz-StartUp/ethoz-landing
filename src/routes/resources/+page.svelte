<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ResourceGate from '$lib/components/ResourceGate.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import {
    ClipboardCheck,
    UserCheck,
    ShieldAlert,
    Users,
    Database,
    FileWarning,
    Download
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

  const resources = [
    {
      icon: ClipboardCheck,
      title: 'Checklist de Cumplimiento Ley 21.719',
      description: '20 ítems en 4 secciones para verificar tu estado de cumplimiento: gobernanza, consentimiento, seguridad técnica y derechos de los titulares.',
      href: '/resources/compliance-checklist',
      pdf: '/downloads/checklist-cumplimiento-ley-21719.pdf',
      slug: 'compliance-checklist',
      tag: 'Cumplimiento'
    },
    {
      icon: UserCheck,
      title: 'Protocolo de Retiros Seguros',
      description: 'Procedimiento completo de 8 pasos para gestionar retiros de alumnos, incluyendo casos especiales y trazabilidad.',
      href: '/resources/pickup-protocol',
      pdf: '/downloads/protocolo-retiros-seguros.pdf',
      slug: 'pickup-protocol',
      tag: 'Operaciones'
    },
    {
      icon: ShieldAlert,
      title: 'Modelo de Aviso de Privacidad Escolar',
      description: 'Plantilla conforme al Art. 14 de la Ley 21.719 lista para adaptar con los datos de tu establecimiento.',
      href: '/resources/privacy-notice',
      pdf: '/downloads/aviso-privacidad-escolar.pdf',
      slug: 'privacy-notice',
      tag: 'Legal'
    },
    {
      icon: Users,
      title: 'Guía de Roles y Permisos',
      description: 'Matriz de permisos recomendada para Director, Inspector, UTP, Orientador, Docente, Portero y Auxiliar.',
      href: '/resources/roles-permissions-guide',
      pdf: '/downloads/guia-roles-permisos.pdf',
      slug: 'roles-permissions-guide',
      tag: 'Gobernanza'
    },
    {
      icon: Database,
      title: 'Plantilla de Inventario de Datos Personales',
      description: 'Inventario estructurado de todas las categorías de datos tratados por el colegio, con base legal y plazos de retención.',
      href: '/resources/data-inventory',
      pdf: '/downloads/inventario-datos-personales.pdf',
      slug: 'data-inventory',
      tag: 'Cumplimiento'
    },
    {
      icon: FileWarning,
      title: 'Plan de Respuesta a Brechas de Datos',
      description: 'Plantilla completa con equipo de respuesta, clasificación de brechas y procedimiento de notificación en 72 horas (Art. 30).',
      href: '/resources/breach-response-plan',
      pdf: '/downloads/plan-respuesta-brechas.pdf',
      slug: 'breach-response-plan',
      tag: 'Incidentes'
    }
  ];
</script>

<svelte:head>
  <title>Recursos gratuitos — Ley 21.719 para colegios | Ethoz</title>
  <meta name="description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta property="og:url" content="https://ethoz.cl/resources" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Recursos gratuitos — Ley 21.719 para colegios | Ethoz" />
  <meta property="og:description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Recursos gratuitos Ley 21.719 | Ethoz" />
  <meta name="twitter:description" content="Plantillas y checklists gratuitos para protección de datos en colegios chilenos." />
  <link rel="canonical" href="https://ethoz.cl/resources" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Recursos gratuitos Ley 21.719",
    "description": "Plantillas, checklists y guías para cumplir con la Ley 21.719 en colegios chilenos.",
    "url": "https://ethoz.cl/resources",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:pt-36 sm:pb-16 text-center">
    <div class="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
      <Download class="size-3.5" />
      {t('resources.free_badge')}
    </div>
    <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
      {t('resources.hero.title')}
    </h1>
    <p class="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
      {t('resources.hero.subtitle')}
    </p>
  </section>

  <!-- Resources grid -->
  <section class="mx-auto max-w-7xl px-4 pb-20 sm:pb-28">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each resources as resource}
        <div class="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
          <div class="mb-4 flex items-center gap-3">
            <resource.icon class="size-5 text-primary shrink-0" />
            <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{resource.tag}</span>
          </div>
          <h2 class="text-base font-semibold text-foreground leading-snug mb-2">{resource.title}</h2>
          <p class="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{resource.description}</p>
          <div class="flex gap-2">
            <a
              href={resource.pdf}
              download
              onclick={(e) => openGate(resource.slug, resource.pdf, resource.title, e)}
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download class="size-4" />
              {t('resources.download_pdf')}
            </a>
            <a href={resource.href} class="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
              {t('resources.view_online')}
            </a>
          </div>
        </div>
      {/each}
    </div>

    <!-- CTA bottom -->
    <div class="mt-16 rounded-xl border border-border bg-muted/30 p-8 text-center">
      <h3 class="text-xl font-semibold text-foreground mb-2">{t('resources.cta_title')}</h3>
      <p class="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
        {t('resources.cta_desc')}
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href="/demo" class="gap-2">{t('resources.request_demo')}</Button>
        <Button href="/resources" variant="outline" class="gap-2">{t('resources.view_all')}</Button>
      </div>
    </div>
  </section>

  <Footer />

  <ResourceGate
    bind:open={gateOpen}
    slug={gateSlug}
    pdfUrl={gatePdf}
    title={gateTitle}
    onclose={() => {}}
  />
</main>
